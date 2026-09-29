import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { outputPaths, projectArgument, root } from './projects.mjs';

const require = createRequire(import.meta.url);
const ffprobe = require('@ffprobe-installer/ffprobe').path;
const project = projectArgument();
const { directory } = outputPaths(project);
const projectQuery = `project=${encodeURIComponent(project)}`;
const browserPath =
  process.env.RENDER_BROWSER || '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
const defaultChunk = 9000;
const minimumChunk = 600;
const baseIndex = process.argv.indexOf('--base');
const base = baseIndex === -1 ? 'http://127.0.0.1:9001' : process.argv[baseIndex + 1];
const baseUrl = new URL(base);
if (
  baseUrl.protocol !== 'http:' ||
  !['127.0.0.1', 'localhost'].includes(baseUrl.hostname) ||
  !baseUrl.port ||
  baseUrl.pathname !== '/'
) {
  throw new Error('Render server must be a local HTTP origin.');
}
let activeBrowser;
let activePage;
let interrupted = false;
let cancelActive;

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    interrupted = true;
    process.exitCode = signal === 'SIGINT' ? 130 : 143;
    cancelActive = (async () => {
      try {
        if (activePage)
          await Promise.race([activePage.evaluate(() => window.cancelSegment?.()), delay(5000)]);
      } catch {
        // The browser may already have crashed.
      }
      await activeBrowser?.close().catch(() => {});
    })();
  });
}

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : Number(process.argv[index + 1]);
}

let total;

async function sourceFingerprint() {
  const hash = createHash('sha256');
  const files = [];
  async function collect(relative) {
    for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
      const child = path.join(relative, entry.name);
      if (entry.isDirectory() && !['node_modules', '.git', 'output', 'dist'].includes(entry.name))
        await collect(child);
      else if (
        entry.isFile() &&
        /\.(tsx?|jsx?|mjs|meta|html|css|png|jpe?g|svg|webp|woff2?|mp3|wav|flac|m4a|aac|ogg|mp4|webm)$/.test(
          child,
        )
      ) {
        files.push(child);
      }
    }
  }
  await collect(path.dirname(project));
  await collect('common');
  await collect('rendering');
  files.push('vite.config.ts', 'package-lock.json');
  for (const file of files.sort()) {
    hash.update(file);
    hash.update('\0');
    hash.update(await readFile(path.join(root, file)));
  }
  return hash.digest('hex');
}

async function prepareOutput(fingerprint) {
  await mkdir(directory, { recursive: true });
  const sourceFile = path.join(directory, 'source.json');
  let previous;
  try {
    previous = JSON.parse(await readFile(sourceFile, 'utf8'));
  } catch {
    // Existing output without a source fingerprint cannot be safely reused.
  }
  if (previous?.fingerprint === fingerprint) return;
  for (const file of await readdir(directory)) {
    if (/^segment-\d{6}-\d{6}\.mp4$/.test(file) || file === 'segments.json') {
      await rm(path.join(directory, file), { force: true });
    }
  }
  const temp = `${sourceFile}.partial`;
  await writeFile(temp, JSON.stringify({ version: 1, fingerprint }, null, 2));
  await rename(temp, sourceFile);
  console.log('Source changed; previous segments were invalidated.');
}

function name(start, end) {
  return `segment-${String(start).padStart(6, '0')}-${String(end - 1).padStart(6, '0')}.mp4`;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => (stdout += data));
    child.stderr.on('data', (data) => (stderr += data));
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve(stdout.trim()) : reject(new Error(stderr.slice(-2000))),
    );
  });
}

async function validSegment(start, end) {
  const filename = path.join(directory, name(start, end));
  try {
    await access(filename);
    const info = JSON.parse(
      await run(ffprobe, [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-count_frames',
        '-show_entries',
        'stream=width,height,r_frame_rate,nb_read_frames',
        '-of',
        'json',
        filename,
      ]),
    );
    const video = info.streams?.[0];
    return (
      video?.width === 1920 &&
      video?.height === 1080 &&
      video?.r_frame_rate === '60/1' &&
      Number(video?.nb_read_frames) === end - start
    );
  } catch {
    return false;
  }
}

async function renderRange(start, end) {
  if (await validSegment(start, end)) {
    console.log(`Already valid: ${name(start, end)}`);
    return [{ start, end }];
  }
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (interrupted) throw new Error('Render interrupted.');
    const began = performance.now();
    try {
      // A new browser process for every segment releases the entire V8 heap.
      activeBrowser = await chromium.launch({ executablePath: browserPath, headless: true });
      if (interrupted) throw new Error('Render interrupted.');
      activePage = await activeBrowser.newPage();
      activePage.on('crash', () => console.error(`Browser crashed on ${name(start, end)}.`));
      activePage.on('pageerror', (error) => console.error(`Page error: ${error}`));
      await activePage.goto(
        `${base}/rendering/segment.html?${projectQuery}&start=${start}&end=${end}`,
        {
          waitUntil: 'domcontentloaded',
        },
      );
      await activePage.waitForFunction(() => window.segmentResult, undefined, {
        timeout: 20 * 60 * 1000,
      });
      const result = await activePage.evaluate(() => window.segmentResult);
      if (result.state !== 'complete') throw new Error(JSON.stringify(result));
      if (!(await validSegment(start, end)))
        throw new Error('Exported file failed frame verification.');
      console.log(
        `Rendered ${name(start, end)} in ${((performance.now() - began) / 1000).toFixed(1)}s.`,
      );
      return [{ start, end }];
    } catch (error) {
      lastError = error;
      if (!interrupted) console.error(`Attempt ${attempt}/3 failed: ${error}`);
    } finally {
      if (cancelActive) await cancelActive;
      await activeBrowser?.close().catch(() => {});
      activePage = undefined;
      activeBrowser = undefined;
    }
  }
  if (interrupted || end - start <= minimumChunk) throw lastError;
  const middle = start + Math.floor((end - start) / 2);
  console.log(`Splitting failed segment ${start}–${end - 1} at frame ${middle}.`);
  return [...(await renderRange(start, middle)), ...(await renderRange(middle, end))];
}

let vite;
try {
  const response = await fetch(`${base}/api/custom-export/status?${projectQuery}`);
  if (!response.ok) throw new Error('Wrong server on port 9001.');
  const status = await response.json();
  if (path.resolve(status.directory) !== path.resolve(directory)) {
    throw new Error('Render server uses a different output directory.');
  }
  console.log(`Using existing render server at ${base}.`);
} catch (error) {
  if (
    baseIndex !== -1 ||
    error.message === 'Wrong server on port 9001.' ||
    error.message === 'Render server uses a different output directory.'
  )
    throw error;
  vite = await createServer({
    configFile: path.join(root, 'vite.config.ts'),
    server: { host: '127.0.0.1', port: 9001, strictPort: true },
  });
  await vite.listen();
  console.log('Started render server on port 9001.');
}

try {
  activeBrowser = await chromium.launch({ executablePath: browserPath, headless: true });
  activePage = await activeBrowser.newPage();
  await activePage.goto(`${base}/rendering/probe.html?${projectQuery}`, {
    waitUntil: 'domcontentloaded',
  });
  await activePage.waitForFunction(() => window.renderInfo, undefined, { timeout: 70_000 });
  const probe = await activePage.evaluate(() => window.renderInfo);
  await activeBrowser.close();
  activePage = undefined;
  activeBrowser = undefined;
  if (probe.error || !Number.isSafeInteger(probe.total) || probe.total < 1) {
    throw new Error(`Could not measure video duration: ${JSON.stringify(probe)}`);
  }
  total = probe.total;
  const from = option('--from', 0);
  const to = option('--to', total);
  const chunk = option('--chunk', defaultChunk);
  if (
    ![from, to, chunk].every(Number.isSafeInteger) ||
    from < 0 ||
    to > total ||
    to <= from ||
    chunk < 1 ||
    chunk > 18000
  ) {
    throw new Error('Invalid frame range or chunk size.');
  }
  console.log(`Measured ${total} frames at 60 FPS.`);
  const fingerprint = await sourceFingerprint();
  await prepareOutput(fingerprint);
  if (probe.audio) {
    const response = await fetch(probe.audio);
    if (!response.ok) throw new Error(`Could not load project audio: ${response.status}`);
    await writeFile(path.join(directory, 'audio-track'), Buffer.from(await response.arrayBuffer()));
  }
  const segments = [];
  for (let start = from; start < to; start += chunk) {
    segments.push(...(await renderRange(start, Math.min(start + chunk, to))));
    if (interrupted) throw new Error('Render interrupted.');
  }
  if (from === 0 && to === total) {
    if ((await sourceFingerprint()) !== fingerprint) {
      throw new Error('Project sources changed during the render; rerun to refresh segments.');
    }
    const manifest = path.join(directory, 'segments.json');
    const temp = `${manifest}.partial`;
    await writeFile(
      temp,
      JSON.stringify(
        {
          version: 1,
          project,
          total,
          fingerprint,
          segments,
          audio: Boolean(probe.audio),
          audioOffset: probe.audioOffset,
        },
        null,
        2,
      ),
    );
    await rename(temp, manifest);
    await import('./finalize.mjs');
  }
} catch (error) {
  if (interrupted) console.log('Render stopped; completed segments are preserved.');
  else throw error;
} finally {
  await activeBrowser?.close().catch(() => {});
  await vite?.close();
}
