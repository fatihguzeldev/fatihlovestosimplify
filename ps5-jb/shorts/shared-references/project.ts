import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'birini değiştirdim, ikisi de değişti.',
  audio: narration,
  scenes: [main],
});
