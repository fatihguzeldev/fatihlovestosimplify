import { makeProject } from '@motion-canvas/core';
import audio from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'toplamı tuttuk. ayrıntılar nereye gitti?',
  audio,
  scenes: [main],
});
