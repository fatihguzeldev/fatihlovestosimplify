import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'aynı satış, iki farklı tutar.',
  audio: narration,
  scenes: [main],
});
