import {Layout, Line, Rect} from '@motion-canvas/2d';
import {theme} from '../../theme';
import {accent, muted, paper, text} from './drawing';
import {sales} from './records';

export const januaryTotals = ['A', 'B'].map(store => sales.filter(row => row.store === store && row.date >= '2026-01-01' && row.date < '2026-02-01').reduce((sum, row) => sum + row.amount, 0));

export function monthlyChart() {
  const surface = paper(650, 340, '#101315');
  surface.root.add(text('ocak 2026', 26, {y: -130, fill: muted}));
  const bars = januaryTotals.map((amount, i) => {
    const x = -140 + i * 280;
    const bar = new Rect({position: [x, 110], offset: [0, 1], width: 112, height: amount * 0.43, fill: accent});
    const value = text(`${amount} ₺`, 31, {position: [x, 110 - amount * 0.43 - 28], fontFamily: theme.fontFamily.mono});
    surface.root.add([bar, value, text(`mağaza ${i ? 'b' : 'a'}`, 27, {position: [x, 141]})]);
    return {bar, value, amount};
  });
  surface.root.add(new Line({points: [[-266, 111], [266, 111]], stroke: muted, lineWidth: 1.5}));
  return {...surface, bars};
}

export function workloadExamples() {
  const root = new Layout({});
  const order = paper(650, 340, '#101315');
  order.root.position([-460, 65]);
  order.root.add([
    text('sipariş #1042', 42, {position: [-268, -104], offset: [-1, 0]}),
    text('preparing', 47, {position: [-268, -6], offset: [-1, 0], fill: accent, fontFamily: theme.fontFamily.mono}),
    text('185 ₺', 30, {position: [-268, 112], offset: [-1, 0], fontFamily: theme.fontFamily.mono}),
  ]);
  const chart = monthlyChart();
  chart.root.position([460, 65]);
  const labels = [
    text('point query', 31, {position: [-460, 306], fill: accent, fontStyle: 'italic'}),
    text('aggregate', 31, {position: [460, 306], fill: accent, fontStyle: 'italic'}),
  ];
  root.add([order.root, chart.root, ...labels]);
  return {root, order, chart, labels};
}
