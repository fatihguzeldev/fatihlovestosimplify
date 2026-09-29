import { spawn } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { outputPaths, projectArgument } from './projects.mjs';

const require = createRequire(import.meta.url);
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const ffprobe = require('@ffprobe-installer/ffprobe').path;
const project = projectArgument();
const { directory, finalFile } = outputPaths(project);
const fps = 60;

function execute(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => (stdout += data));
    child.stderr.on('data', (data) => (stderr += data));
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve(stdout.trim()) : reject(new Error(stderr.slice(-3000))),
    );
  });
}

function name(start, end) {
  return `segment-${String(start).padStart(6, '0')}-${String(end - 1).padStart(6, '0')}.mp4`;
}

const manifest = JSON.parse(await readFile(path.join(directory, 'segments.json'), 'utf8'));
if (
  manifest.version !== 1 ||
  manifest.project !== project ||
  typeof manifest.audio !== 'boolean' ||
  !Number.isFinite(manifest.audioOffset) ||
  !Number.isSafeInteger(manifest.total) ||
  manifest.total < 1 ||
  manifest.total > 1_000_000 ||
  !Array.isArray(manifest.segments)
) {
  throw new Error('Invalid segment manifest.');
}
const { total, segments: ranges } = manifest;

const files = new Set(await readdir(directory));
const segments = [];
let cursor = 0;
for (const { start, end } of ranges) {
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start !== cursor ||
    end <= start ||
    end > total
  ) {
    throw new Error(`Noncontiguous segment manifest at frame ${cursor}.`);
  }
  const filename = name(start, end);
  if (!files.has(filename)) throw new Error(`Missing segment ${filename}`);
  const fullPath = path.join(directory, filename);
  const info = JSON.parse(
    await execute(ffprobe, [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-count_frames',
      '-show_entries',
      'stream=width,height,r_frame_rate,nb_read_frames',
      '-of',
      'json',
      fullPath,
    ]),
  );
  const video = info.streams?.[0];
  if (
    video?.width !== 1920 ||
    video?.height !== 1080 ||
    video?.r_frame_rate !== '60/1' ||
    Number(video?.nb_read_frames) !== end - start
  ) {
    throw new Error(`Invalid segment ${filename}: ${JSON.stringify(video)}`);
  }
  segments.push(fullPath);
  cursor = end;
}
if (cursor !== total) throw new Error(`Missing frames ${cursor}–${total - 1}.`);

await mkdir(path.dirname(finalFile), { recursive: true });
const tempDirectory = await mkdtemp(path.join(os.tmpdir(), 'video-finalize-'));
const concatFile = path.join(tempDirectory, 'segments.txt');
const tempOutput = `${finalFile.slice(0, -4)}.partial.mp4`;
try {
  await writeFile(
    concatFile,
    segments.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join('\n') + '\n',
  );
  const audioFile = path.join(directory, 'audio-track');
  if (manifest.audio) await access(audioFile);
  await execute(ffmpeg, [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    concatFile,
    ...(manifest.audio ? ['-itsoffset', String(manifest.audioOffset), '-i', audioFile] : []),
    '-map',
    '0:v:0',
    ...(manifest.audio ? ['-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k'] : ['-an']),
    '-c:v',
    'copy',
    '-t',
    String(total / fps),
    '-movflags',
    '+faststart',
    tempOutput,
  ]);
  const actual = Number(
    await execute(ffprobe, [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-count_frames',
      '-show_entries',
      'stream=nb_read_frames',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      tempOutput,
    ]),
  );
  if (actual !== total) throw new Error(`Final video has ${actual}/${total} frames.`);
  await rename(tempOutput, finalFile);
  console.log(`Completed ${finalFile} (${actual} frames, ${total / fps} seconds).`);
} finally {
  await rm(tempDirectory, { recursive: true, force: true });
  await rm(tempOutput, { force: true });
}
