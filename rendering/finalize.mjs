import { spawn } from 'node:child_process';
import { access, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const ffprobe = require('@ffprobe-installer/ffprobe').path;
const root = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(root, '../ddia/01/operational-vs-analytical-systems');
const directory = process.env.RENDER_OUTPUT_DIR || path.resolve(root, '../output/custom-export');
const fps = 60;
const finalFile = path.join(directory, 'ddia-chapter1-final.mp4');

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
  return `ddia-ch1-${String(start).padStart(6, '0')}-${String(end - 1).padStart(6, '0')}.mp4`;
}

const manifest = JSON.parse(await readFile(path.join(directory, 'segments.json'), 'utf8'));
if (
  manifest.version !== 1 ||
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

const tempDirectory = await mkdtemp(path.join(os.tmpdir(), 'ddia-finalize-'));
const concatFile = path.join(tempDirectory, 'segments.txt');
const tempOutput = path.join(directory, 'ddia-chapter1-final.partial.mp4');
try {
  await writeFile(
    concatFile,
    segments.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join('\n') + '\n',
  );
  const audioFile = path.join(project, 'audio/narration.mp3');
  await access(audioFile);
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
    '-i',
    audioFile,
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
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
