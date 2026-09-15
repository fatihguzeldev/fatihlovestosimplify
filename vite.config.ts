import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [
    motionCanvas({project: []}),
    ffmpeg(),
  ],
  server: {
    host: '127.0.0.1',
    port: 9000,
    strictPort: true,
  },
});
