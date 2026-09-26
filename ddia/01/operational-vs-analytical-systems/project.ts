import { makeProject } from '@motion-canvas/core';
import intro from './scenes/s00/intro?scene';
import dataIntensive from './scenes/s01/data-intensive?scene';
import buildingBlocks from './scenes/s02/building-blocks?scene';
import frontendBackend from './scenes/s03/frontend-backend?scene';
import differentJobs from './scenes/s04/different-jobs?scene';
import transactions from './scenes/s05/transactions?scene';
import analytics from './scenes/s06/analytics?scene';
import workloadPatterns from './scenes/s07/workload-patterns?scene';
import productAnalytics from './scenes/s08/product-analytics?scene';
import dataWarehousing from './scenes/s09/data-warehousing?scene';
import etl from './scenes/s10/etl?scene';
import eltAndConnectors from './scenes/s11/elt-and-connectors?scene';
import htap from './scenes/s12/htap?scene';
import dataScience from './scenes/s13/data-science?scene';
import dataLake from './scenes/s14/data-lake?scene';
import dataOperations from './scenes/s15/data-operations?scene';
import analyticalOutputs from './scenes/s16/analytical-outputs?scene';
import systemOfRecord from './scenes/s17/system-of-record?scene';
import derivedData from './scenes/s18/derived-data?scene';
import maintainingDerived from './scenes/s19/maintaining-derived?scene';

export default makeProject({
  name: 'ddia_chapter1_operational_vs_analytical_systems',
  scenes: [
    intro,
    dataIntensive,
    buildingBlocks,
    frontendBackend,
    differentJobs,
    transactions,
    analytics,
    workloadPatterns,
    productAnalytics,
    dataWarehousing,
    etl,
    eltAndConnectors,
    htap,
    dataScience,
    dataLake,
    dataOperations,
    analyticalOutputs,
    systemOfRecord,
    derivedData,
    maintainingDerived,
  ],
});
