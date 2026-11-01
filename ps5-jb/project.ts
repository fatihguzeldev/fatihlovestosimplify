import { makeProject } from '@motion-canvas/core';
import narration from './audio/narration.mp3';
import opening from './scenes/00-opening/00-opening?scene';
import cartJavaScript from './scenes/01-cart-javascript/01-cart-javascript?scene';
import history from './scenes/02-history/02-history?scene';
import reference from './scenes/03-reference/03-reference?scene';
import addressNeed from './scenes/04-address-need/04-address-need?scene';
import address from './scenes/05-address-leak/05-address-leak?scene';
import memory from './scenes/06-memory/06-memory?scene';
import execution from './scenes/07-execution/07-execution?scene';
import lifetime from './scenes/08-lifetime/08-lifetime?scene';
import interfaces from './scenes/09-interfaces/09-interfaces?scene';
import authority from './scenes/10-authority/10-authority?scene';
import native from './scenes/11-native/11-native?scene';
import returning from './scenes/12-return/12-return?scene';

export default makeProject({
  name: 'ps5’i bir internet sitesiyle kırdılar.',
  audio: narration,
  scenes: [
    opening,
    cartJavaScript,
    history,
    reference,
    addressNeed,
    address,
    memory,
    execution,
    lifetime,
    interfaces,
    authority,
    native,
    returning,
  ],
});
