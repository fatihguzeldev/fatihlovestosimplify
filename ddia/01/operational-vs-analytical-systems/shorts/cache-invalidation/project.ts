import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'sipariş yola çıktı. cache’in haberi yok.',
  audio: narration,
  scenes: [main],
});
