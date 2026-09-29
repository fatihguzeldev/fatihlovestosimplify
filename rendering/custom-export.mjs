import { spawn } from 'node:child_process';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { PLUGIN_OPTIONS } from '@motion-canvas/vite-plugin';
import { outputPaths, root, selectProject } from './projects.mjs';

const require = createRequire(import.meta.url);
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const ffprobe = require('@ffprobe-installer/ffprobe').path;
const event = 'custom-export-segment';

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

class ExportSession {
  constructor(outputDirectory, name, fps, expectedFrames) {
    this.name = name;
    this.fps = fps;
    this.expectedFrames = expectedFrames;
    this.frames = 0;
    this.finalPath = path.join(outputDirectory, `${name}.mp4`);
    this.tempPath = path.join(outputDirectory, `${name}.${crypto.randomUUID()}.partial.mp4`);
    this.closed = false;
    this.process = spawn(
      ffmpeg,
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-y',
        '-f',
        'image2pipe',
        '-framerate',
        String(fps),
        '-vcodec',
        'png',
        '-i',
        'pipe:0',
        '-an',
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        '-r',
        String(fps),
        '-movflags',
        '+faststart',
        this.tempPath,
      ],
      { stdio: ['pipe', 'ignore', 'pipe'] },
    );
    this.stderr = '';
    this.process.stderr.on('data', (data) => (this.stderr += data));
    this.process.stdin.on('error', () => {});
    this.killOnExit = () => this.process.kill('SIGKILL');
    process.once('exit', this.killOnExit);
    this.process.once('close', () => process.off('exit', this.killOnExit));
    this.exit = new Promise((resolve, reject) => {
      this.process.on('error', reject);
      this.process.on('close', (code) =>
        code === 0
          ? resolve()
          : reject(new Error(`FFmpeg exited ${code}: ${this.stderr.slice(-2000)}`)),
      );
    });
    // A crash or disconnect may happen before the final frame.
    this.exit.catch(() => {});
  }

  async frame(base64, index) {
    if (this.closed) throw new Error('Export session is closed.');
    if (index !== this.frames) throw new Error(`Expected frame ${this.frames}, got ${index}.`);
    const png = Buffer.from(base64, 'base64');
    if (png.length < 8 || png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
      throw new Error('Invalid PNG frame.');
    }
    // The callback fires when Node has flushed this frame into the FFmpeg pipe.
    // Awaiting it bounds the queue to the browser's four worker results.
    await Promise.race([
      new Promise((resolve, reject) =>
        this.process.stdin.write(png, (error) => (error ? reject(error) : resolve())),
      ),
      this.exit.then(() => {
        throw new Error('FFmpeg exited before all frames arrived.');
      }),
    ]);
    this.frames++;
  }

  async finish(success) {
    if (this.closed) return;
    this.closed = true;
    if (!success || this.frames !== this.expectedFrames) {
      this.process.kill('SIGKILL');
      await this.exit.catch(() => {});
      await rm(this.tempPath, { force: true });
      if (success)
        throw new Error(`Incomplete segment: ${this.frames}/${this.expectedFrames} frames.`);
      return;
    }
    this.process.stdin.end();
    try {
      await this.exit;
      const actual = Number(
        await run(ffprobe, [
          '-v',
          'error',
          '-select_streams',
          'v:0',
          '-count_frames',
          '-show_entries',
          'stream=nb_read_frames',
          '-of',
          'default=noprint_wrappers=1:nokey=1',
          this.tempPath,
        ]),
      );
      if (actual !== this.expectedFrames)
        throw new Error(`Video contains ${actual}/${this.expectedFrames} frames.`);
      await rename(this.tempPath, this.finalPath);
      return { path: this.finalPath, frames: actual, bytes: (await stat(this.finalPath)).size };
    } catch (error) {
      await rm(this.tempPath, { force: true });
      throw error;
    }
  }
}

export default function customExport() {
  return {
    name: event,
    [PLUGIN_OPTIONS]: { entryPoint: path.join(root, 'rendering/client.ts') },
    configureServer(server) {
      const sessions = new Map();
      let renderJob;
      server.httpServer?.once('close', () => {
        if (renderJob?.state === 'running') renderJob.process.kill('SIGINT');
      });
      server.ws.on(event, async (request, client) => {
        const { id, method, data } = request;
        const reply = (payload) => {
          try {
            if (client.socket.readyState === 1) client.send(`${event}-ack`, payload);
          } catch {
            // The browser can close between the ready-state check and send.
          }
        };
        try {
          let session = sessions.get(client);
          let result;
          if (method === 'render-start') {
            const project = selectProject(data?.project);
            if (renderJob && ['running', 'stopping'].includes(renderJob.state)) {
              throw new Error('A full render is already running.');
            }
            const address = server.httpServer?.address();
            if (!address || typeof address === 'string') {
              throw new Error('Vite server is not listening.');
            }
            const child = spawn(
              process.execPath,
              [
                path.join(root, 'rendering/render.mjs'),
                '--project',
                project,
                '--base',
                `http://127.0.0.1:${address.port}`,
              ],
              { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
            );
            const job = {
              id: crypto.randomUUID(),
              state: 'running',
              detail: '',
              output: '',
              total: 0,
              completedFrames: 0,
              process: child,
            };
            renderJob = job;
            const append = (data) => {
              job.output = (job.output + data.toString()).slice(-10000);
              job.detail = job.output.slice(-3000);
              const measured = [...job.output.matchAll(/Measured (\d+) frames/g)].at(-1);
              if (measured) job.total = Number(measured[1]);
              for (const match of job.output.matchAll(
                /(?:Rendered |Already valid: )segment-\d{6}-(\d{6})\.mp4/g,
              )) {
                job.completedFrames = Math.max(job.completedFrames, Number(match[1]) + 1);
              }
            };
            child.stdout.on('data', (data) => {
              append(data);
              process.stdout.write(data);
            });
            child.stderr.on('data', (data) => {
              append(data);
              process.stderr.write(data);
            });
            child.once('error', (error) => {
              job.state = 'failed';
              append(String(error));
            });
            child.once('close', (code) => {
              job.state =
                job.state === 'stopping' ? 'cancelled' : code === 0 ? 'complete' : 'failed';
              if (code !== 0) append(`\nRender process exited with code ${code}.`);
            });
            result = { jobId: job.id };
          } else if (method === 'render-status') {
            if (!renderJob || data?.jobId !== renderJob.id) throw new Error('Unknown render job.');
            result = {
              state: renderJob.state,
              detail: renderJob.detail,
              total: renderJob.total,
              completedFrames: renderJob.completedFrames,
            };
          } else if (method === 'render-cancel') {
            if (!renderJob || data?.jobId !== renderJob.id) throw new Error('Unknown render job.');
            if (renderJob.state === 'running') {
              renderJob.state = 'stopping';
              renderJob.process.kill('SIGINT');
            }
          } else if (method === 'start') {
            if (session) throw new Error('This tab is already exporting.');
            const { directory: outputDirectory } = outputPaths(selectProject(data?.project));
            if (!/^[a-zA-Z0-9_-]{1,120}$/.test(data?.name)) throw new Error('Invalid export name.');
            if (!Number.isInteger(data?.fps) || data.fps < 1 || data.fps > 120)
              throw new Error('Invalid FPS.');
            if (
              !Number.isInteger(data?.expectedFrames) ||
              data.expectedFrames < 1 ||
              data.expectedFrames > 18000
            )
              throw new Error('Segment must contain 1–18000 frames.');
            await mkdir(outputDirectory, { recursive: true });
            session = new ExportSession(outputDirectory, data.name, data.fps, data.expectedFrames);
            sessions.set(client, session);
            client.socket.once('close', () => {
              if (sessions.get(client) === session) {
                sessions.delete(client);
                void session.finish(false).catch((error) => console.error(error));
              }
            });
          } else if (method === 'frame') {
            if (!session) throw new Error('No active export session.');
            await session.frame(data.png, data.index);
          } else if (method === 'finish') {
            if (!session) throw new Error('No active export session.');
            result = await session.finish(data.success);
            sessions.delete(client);
          } else {
            throw new Error(`Unknown method: ${method}`);
          }
          reply({ id, ok: true, result });
        } catch (error) {
          reply({ id, ok: false, error: String(error) });
        }
      });
      server.middlewares.use('/api/custom-export/status', async (request, response) => {
        try {
          const params = new URL(request.url, 'http://localhost').searchParams;
          const { directory } = outputPaths(selectProject(params.get('project')));
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ directory }));
        } catch (error) {
          response.writeHead(400).end(String(error));
        }
      });
    },
  };
}
