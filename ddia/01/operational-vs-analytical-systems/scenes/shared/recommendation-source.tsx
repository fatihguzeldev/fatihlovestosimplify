import {Layout, Path} from '@motion-canvas/2d';
import {cartoonDatabase} from '../../../../../common/cartoon-system';
import {theme} from '../../theme';
import {accent, banana, foreground, muted, paper, text} from './drawing';

export function recommendationSource() {
  const root = new Layout({});
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([-540, 75]);
  warehouse.root.scale(1.55);
  warehouse.caption.fontSize(24);
  warehouse.root.add([
    text('sales', 31, {y: -2, fill: accent, fontFamily: theme.fontFamily.mono}),
    text('#1042 · 185 ₺', 20, {y: 60, fontFamily: theme.fontFamily.mono}),
  ]);
  const receipt = paper(540, 360, '#101315');
  receipt.root.position([450, 75]);
  const fruit = banana();
  fruit.position([165, -25]);
  fruit.scale(1.5);
  receipt.root.add([
    text('sipariş #1042', 38, {position: [-215, -117], offset: [-1, 0]}),
    text('muz × 2', 33, {position: [-215, -28], offset: [-1, 0]}),
    text('süt × 1', 33, {position: [-215, 32], offset: [-1, 0]}),
    new Path({data: 'M -216 76 L 217 76', stroke: foreground, lineWidth: 1.4, opacity: 0.4}),
    text('185 ₺', 34, {position: [211, 125], offset: [1, 0], fill: accent, fontFamily: theme.fontFamily.mono}),
    fruit,
  ]);
  root.add([warehouse.root, receipt.root, text('neleri birlikte almış?', 32, {position: [450, 335], fill: muted})]);
  return {root, warehouse, receipt};
}
