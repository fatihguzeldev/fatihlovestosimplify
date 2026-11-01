import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'modeli eğittik. müşteriye nasıl ulaşacak?',
  audio: narration,
  scenes: [main],
});
