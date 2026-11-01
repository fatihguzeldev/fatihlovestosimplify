import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'biri adresi seçiyor, diğeri data’yı taşıyor.',
  audio: narration,
  scenes: [main],
});
