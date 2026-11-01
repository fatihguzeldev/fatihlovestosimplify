import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'tarayıcıyı kırınca bütün ps5 senin olmuyor.',
  audio: narration,
  scenes: [main],
});
