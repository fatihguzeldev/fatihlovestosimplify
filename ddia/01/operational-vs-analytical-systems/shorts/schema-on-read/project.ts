import { makeProject } from '@motion-canvas/core';
import audio from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'data lake’e attık. schema’dan kurtulduk mu?',
  audio,
  scenes: [main],
});
