import { makeProject } from '@motion-canvas/core';
import audio from './audio/narration.mp3';
import main from './scenes/main?scene';

export default makeProject({
  name: 'uyarıyı ürettik. ekip nereden görecek?',
  audio,
  scenes: [main],
});
