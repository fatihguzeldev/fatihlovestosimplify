import {Layout} from '@motion-canvas/2d';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {cartoonDatabase} from '../../../../../common/cartoon-system';
import {theme} from '../../theme';
import {accent, foreground, muted, paper, text} from './drawing';

export function etlPipeline() {
  const root = new Layout({});
  const source = cartoonDatabase('sales db', accent);
  source.root.position([-645, 100]);
  source.root.scale(1.15);
  source.root.add([
    text('#1042', 28, {y: -10, fontFamily: theme.fontFamily.mono}),
    text('store A', 24, {y: 40, fill: accent, fontFamily: theme.fontFamily.mono}),
    text('185 ₺', 22, {y: 78, fontFamily: theme.fontFamily.mono}),
  ]);
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([645, 100]);
  warehouse.root.scale(1.15);
  warehouse.caption.fontSize(26);
  const stored = new Layout({opacity: 0});
  stored.add([
    text('#1042', 28, {y: -10, fontFamily: theme.fontFamily.mono}),
    text('Marmara', 24, {y: 40, fill: accent, fontFamily: theme.fontFamily.mono}),
    text('185 ₺', 22, {y: 78, fontFamily: theme.fontFamily.mono}),
  ]);
  warehouse.root.add(stored);
  const transform = paper(470, 280, '#101315');
  transform.root.position([0, 100]);
  const fields = new Layout({opacity: 0});
  const region = new Layout({opacity: 0});
  ['id', 'store_id', 'amount', 'region'].forEach((key, i) => {
    const row = i === 3 ? region : fields;
    row.add([
      text(key, 25, {position: [-181, -79 + i * 52], offset: [-1, 0], fill: muted, fontFamily: theme.fontFamily.mono}),
      text(['1042', 'A', '185', 'Marmara'][i], 27, {position: [43, -79 + i * 52], offset: [-1, 0], fill: i === 3 ? accent : foreground, fontFamily: theme.fontFamily.mono}),
    ]);
  });
  transform.root.add([fields, region]);
  const extract = cartoonArrow('etl-sales-extract', [-482, 100], [-282, 100], accent);
  const load = cartoonArrow('etl-sales-load', [282, 100], [482, 100], accent);
  const labels = new Layout({});
  labels.add([
    text('extract', 28, {position: [-382, 20]}),
    text('transform', 28, {position: [0, -88], fill: accent}),
    text('load', 28, {position: [382, 20]}),
  ]);
  root.add([source.root, warehouse.root, transform.root, extract.root, load.root, labels]);
  return {root, source, warehouse, stored, transform, fields, region, extract, load, labels};
}
