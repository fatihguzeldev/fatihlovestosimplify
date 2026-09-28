import { defineConfig } from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';
import customExport from './rendering/custom-export.mjs';

export default defineConfig({
  plugins: [motionCanvas({ project: ['./ddia/*/*/project.ts'] }), ffmpeg(), customExport()],
  server: {
    host: '127.0.0.1',
    port: 9000,
    strictPort: true,
  },
});
