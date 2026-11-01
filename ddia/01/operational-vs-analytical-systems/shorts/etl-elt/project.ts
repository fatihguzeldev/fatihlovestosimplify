import { makeProject } from '@motion-canvas/core';
import audio from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'harflerin yeri değişti. işlem nerede yapılıyor?',
  audio,
  scenes: [main],
});
