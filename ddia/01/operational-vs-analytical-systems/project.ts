import {makeProject} from '@motion-canvas/core';
import intro from './scenes/s00/intro?scene';
import dataIntensive from './scenes/s01/data-intensive?scene';

export default makeProject({
  name: 'ddia_chapter1_operational_vs_analytical_systems',
  scenes: [intro, dataIntensive],
});
