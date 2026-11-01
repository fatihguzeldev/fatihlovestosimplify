import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'programı ram’e koymak yetmiyor.',
  audio: narration,
  scenes: [main],
});
