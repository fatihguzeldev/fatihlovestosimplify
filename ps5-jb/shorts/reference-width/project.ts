import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: '2 byte yazdılar, 4 byte okudular.',
  audio: narration,
  scenes: [main],
});
