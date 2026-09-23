import {makeProject} from '@motion-canvas/core';
import intro from './scenes/s00/intro?scene';
import dataIntensive from './scenes/s01/data-intensive?scene';

export default makeProject({
  name: 'DDIA · chapter 1 · operational vs. analytical systems',
  scenes: [intro, dataIntensive],
});
