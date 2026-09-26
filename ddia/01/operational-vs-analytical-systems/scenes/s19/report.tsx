import {Layout} from '@motion-canvas/2d';
import {theme} from '../../theme';
import {accent, muted, paper, text} from '../shared/drawing';
import {monthlyChart} from '../shared/workloads';

export function report() {
  const root = new Layout({});
  const cards = ['sales database / sales', 'warehouse / sales'].map((label, i) => {
    const card = paper(570, 230, '#101315');
    card.root.position([-435 + 870 * i, -38]);
    const amount = text('185', 48, {position: [90, 51], fill: accent, fontFamily: theme.fontFamily.mono});
    card.root.add([text(label, 30, {y: -76}), text('#1042', 32, {y: -12, fontFamily: theme.fontFamily.mono}), text('amount', 29, {position: [-94, 51], fontFamily: theme.fontFamily.mono}), amount]);
    root.add(card.root);
    return {...card, amount};
  });
  const transfer = text('son aktarım: t0', 25, {position: [435, 132], fill: muted});
  const sql = text('SUM(amount) · ocak 2026', 26, {position: [435, 192], fontFamily: theme.fontFamily.mono});
  const chart = monthlyChart();
  chart.root.position([435, 341]);
  chart.root.scale(0.7);
  const pending = new Layout({position: [-435, 269], opacity: 0});
  pending.add([text('185 → 165', 58, {y: -46, fill: accent, fontFamily: theme.fontFamily.mono}), text('aktarım bekliyor', 31, {y: 39, fill: muted})]);
  root.add([transfer, sql, chart.root, pending]);
  return {root, cards, transfer, sql, chart, pending};
}
