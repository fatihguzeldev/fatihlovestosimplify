import { makePlugin, ObjectMetaField } from '@motion-canvas/core';
import type {
  Exporter,
  Project,
  Renderer,
  RendererResult,
  RendererSettings,
} from '@motion-canvas/core';

type Reply = { id: number; ok: boolean; result?: unknown; error?: string };
type WorkerReply = { id: number; png?: string; error?: string };
let editorRenderer: Renderer | undefined;

class SegmentExporter implements Exporter {
  static readonly id = 'custom-export-segment';
  static readonly displayName = 'custom export segment';
  static meta() {
    return new ObjectMetaField(this.displayName, {});
  }
  static async create(_project: Project, settings: RendererSettings) {
    return new SegmentExporter(settings);
  }

  private static sequence = 0;
  static replies = new Map<number, { resolve(value: unknown): void; reject(error: Error): void }>();
  private readonly workers: Worker[] = [];
  private readonly pending: Promise<string>[] = [];
  private nextFrame = 0;
  private nextWorker = 0;
  private failed = false;
  private started = false;

  constructor(private readonly settings: RendererSettings) {}

  static invoke(method: string, data: unknown): Promise<unknown> {
    if (!import.meta.hot) throw new Error('Local Vite server required.');
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.replies.delete(id);
        reject(new Error(`Exporter timed out while waiting for ${method}.`));
      }, 90_000);
      this.replies.set(id, {
        resolve(value) {
          clearTimeout(timeout);
          resolve(value);
        },
        reject(error) {
          clearTimeout(timeout);
          reject(error);
        },
      });
      import.meta.hot!.send('custom-export-segment', { id, method, data });
    });
  }

  async start() {
    const expectedFrames =
      Math.ceil(this.settings.range[1] * this.settings.fps) -
      Math.ceil(this.settings.range[0] * this.settings.fps) +
      1;
    await SegmentExporter.invoke('start', {
      name: this.settings.name,
      fps: this.settings.fps,
      expectedFrames,
    });
    this.started = true;
    for (let i = 0; i < 4; i++)
      this.workers.push(
        new Worker(new URL('./png-worker.js', import.meta.url), { type: 'module' }),
      );
  }

  private async encode(canvas: HTMLCanvasElement): Promise<string> {
    const worker = this.workers[this.nextWorker++ % this.workers.length];
    const bitmap = await createImageBitmap(canvas);
    const id = this.nextWorker;
    return new Promise((resolve, reject) => {
      const onMessage = ({ data }: MessageEvent<WorkerReply>) => {
        if (data.id !== id) return;
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);
        if (data.error) reject(new Error(data.error));
        else resolve(data.png!);
      };
      const onError = (error: ErrorEvent) => {
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);
        reject(new Error(error.message));
      };
      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', onError);
      worker.postMessage({ id, bitmap }, [bitmap]);
    });
  }

  private async flushOldest() {
    const png = await this.pending.shift()!;
    await SegmentExporter.invoke('frame', { index: this.nextFrame++, png });
  }

  async handleFrame(canvas: HTMLCanvasElement) {
    if (this.pending.length >= 4) await this.flushOldest();
    const encoded = this.encode(canvas);
    encoded.catch(() => {});
    this.pending.push(encoded);
  }

  async stop(result: RendererResult) {
    try {
      if (result === 0 && !this.failed) {
        while (this.pending.length) await this.flushOldest();
      }
    } catch (error) {
      this.failed = true;
      throw error;
    } finally {
      this.workers.forEach((worker) => worker.terminate());
      if (this.started)
        await SegmentExporter.invoke('finish', { success: result === 0 && !this.failed });
    }
  }
}

class CustomExporter implements Exporter {
  static readonly id = 'custom-export';
  static readonly displayName = 'custom export';
  static meta() {
    return new ObjectMetaField(this.displayName, {});
  }
  static async create(_project: Project, settings: RendererSettings) {
    return new CustomExporter(settings);
  }

  private jobId: string | undefined;
  private progressReady = false;

  constructor(private readonly settings: RendererSettings) {}

  async configuration(): Promise<RendererSettings> {
    if (
      this.settings.fps !== 60 ||
      this.settings.size.x !== 1920 ||
      this.settings.size.y !== 1080 ||
      this.settings.resolutionScale !== 1 ||
      this.settings.range[0] !== 0 ||
      this.settings.range[1] !== Infinity
    ) {
      throw new Error('custom export currently requires the full 1920×1080, 60 FPS range.');
    }
    // The editor renders just two placeholder frames. The full timeline is
    // processed by fresh browser processes started by the Vite plugin.
    return { ...this.settings, range: [0, 1 / 60] };
  }

  async start() {
    const result = (await SegmentExporter.invoke('render-start', {
      name: this.settings.name,
    })) as { jobId: string };
    this.jobId = result.jobId;
  }

  async handleFrame(
    _canvas: HTMLCanvasElement,
    _frame: number,
    _sceneFrame: number,
    _sceneName: string,
    signal: AbortSignal,
  ) {
    if (!this.jobId) throw new Error('Render job did not start.');
    while (true) {
      if (signal.aborted) {
        await SegmentExporter.invoke('render-cancel', { jobId: this.jobId });
        return;
      }
      const status = (await SegmentExporter.invoke('render-status', {
        jobId: this.jobId,
      })) as { state: string; detail?: string; total?: number; completedFrames?: number };
      if (editorRenderer && status.total) {
        if (!this.progressReady) {
          editorRenderer.estimator.reset(Math.min(1, 9000 / status.total));
          this.progressReady = true;
        }
        editorRenderer.estimator.update(
          Math.min(0.99, (status.completedFrames ?? 0) / status.total),
        );
      }
      if (status.state === 'complete') return;
      if (status.state === 'failed' || status.state === 'cancelled') {
        throw new Error(status.detail || `Render ${status.state}.`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async stop(result: RendererResult) {
    if (result !== 0 && this.jobId)
      await SegmentExporter.invoke('render-cancel', { jobId: this.jobId });
  }
}

if (import.meta.hot) {
  import.meta.hot.on('custom-export-segment-ack', (reply: Reply) => {
    const waiter = SegmentExporter.replies.get(reply.id);
    SegmentExporter.replies.delete(reply.id);
    if (reply.ok) waiter?.resolve(reply.result);
    else waiter?.reject(new Error(reply.error));
  });
  import.meta.hot.dispose(() => {
    for (const reply of SegmentExporter.replies.values())
      reply.reject(new Error('Exporter connection was reloaded.'));
    SegmentExporter.replies.clear();
  });
}

export default makePlugin({
  name: 'custom-export-segment',
  renderer: (renderer) => {
    editorRenderer = renderer;
  },
  exporters: (project) =>
    project.name === 'ddia_chapter1_operational_vs_analytical_systems'
      ? window.location.pathname.endsWith('/rendering/segment.html')
        ? [SegmentExporter]
        : [CustomExporter]
      : [],
});
