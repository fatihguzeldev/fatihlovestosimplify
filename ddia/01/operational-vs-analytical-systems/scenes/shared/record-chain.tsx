import {Layout} from '@motion-canvas/2d';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {cartoonDatabase} from '../../../../../common/cartoon-system';
import {theme} from '../../theme';
import {accent, muted, paper, text} from './drawing';

export function recordChain(seed: string, showDerived = false) {
  const root = new Layout({});
  const source = cartoonDatabase('sales database', accent);
  source.root.position([-650, -45]);
  source.root.scale(0.87);
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([650, -45]);
  warehouse.root.scale(0.87);
  const lake = paper(330, 204, '#101315');
  lake.root.position([0, -45]);
  lake.root.add([text('data lake', 36, {y: -26}), text('sales.parquet', 24, {y: 47, fill: accent, fontFamily: theme.fontFamily.mono})]);
  const copy = cartoonArrow(`${seed}-source-copy`, [-499, -45], [-207, -45], accent);
  const transform = cartoonArrow(`${seed}-transform-load`, [207, -45], [499, -45], accent);
  const records = [-650, 0, 650].map((x, i) => {
    const card = paper(350, 140, '#101315');
    card.root.position([x, 239]);
    const amount = text('185', 38, {position: [63, 26], fill: accent, fontFamily: theme.fontFamily.mono});
    const role = text(i === 0 ? 'system of record' : 'derived', 26, {position: [x, 356], fill: i === 0 ? accent : muted, opacity: i === 0 || showDerived ? 1 : 0});
    card.root.add([text('#1042', 27, {y: -36, fontFamily: theme.fontFamily.mono}), text('amount', 25, {position: [-70, 26], fontFamily: theme.fontFamily.mono}), amount]);
    root.add([card.root, role]);
    return {...card, amount, role};
  });
  root.add([source.root, lake.root, warehouse.root, copy.root, transform.root,
    text('copy', 28, {position: [-352, -144]}), text('transform + load', 26, {position: [352, -144]}),
  ]);
  return {root, source, lake, warehouse, copy, transform, records};
}
