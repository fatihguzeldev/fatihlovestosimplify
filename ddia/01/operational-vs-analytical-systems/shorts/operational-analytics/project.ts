import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'aynı data, iki farklı soru.',
  audio: narration,
  scenes: [main],
});
