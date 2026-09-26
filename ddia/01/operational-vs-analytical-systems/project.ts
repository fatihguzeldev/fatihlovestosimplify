import {makeProject} from '@motion-canvas/core';
import intro from './scenes/s00/intro?scene';
import dataIntensive from './scenes/s01/data-intensive?scene';
import buildingBlocks from './scenes/s02/building-blocks?scene';
import frontendBackend from './scenes/s03/frontend-backend?scene';
import differentJobs from './scenes/s04/different-jobs?scene';

export default makeProject({
  name: 'ddia_chapter1_operational_vs_analytical_systems',
  scenes: [intro, dataIntensive, buildingBlocks, frontendBackend, differentJobs],
});
