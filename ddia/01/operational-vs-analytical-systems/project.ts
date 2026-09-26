import {makeProject} from '@motion-canvas/core';
import intro from './scenes/s00/intro?scene';
import dataIntensive from './scenes/s01/data-intensive?scene';
import buildingBlocks from './scenes/s02/building-blocks?scene';
import frontendBackend from './scenes/s03/frontend-backend?scene';
import differentJobs from './scenes/s04/different-jobs?scene';
import transactions from './scenes/s05/transactions?scene';
import analytics from './scenes/s06/analytics?scene';
import workloadPatterns from './scenes/s07/workload-patterns?scene';
import productAnalytics from './scenes/s08/product-analytics?scene';

export default makeProject({
  name: 'ddia_chapter1_operational_vs_analytical_systems',
  scenes: [intro, dataIntensive, buildingBlocks, frontendBackend, differentJobs, transactions, analytics, workloadPatterns, productAnalytics],
});
