import { makeProject } from '@motion-canvas/core';
import audio from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'iki farklı iş. tek sistemde olur mu?',
  audio,
  scenes: [main],
});
