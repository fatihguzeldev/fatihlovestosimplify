import {Layout, Line, Rect} from '@motion-canvas/2d';
import {theme} from '../../theme';
import {accent, foreground, muted, paper, text} from './drawing';

export const sales = [
  {id: 1041, store: 'A', date: '2026-01-03', amount: 60},
  {id: 1042, store: 'A', date: '2026-01-12', amount: 185},
  {id: 1043, store: 'B', date: '2026-01-12', amount: 260},
  {id: 1044, store: 'A', date: '2026-01-12', amount: 155},
  {id: 1045, store: 'B', date: '2026-01-26', amount: 40},
  {id: 1046, store: 'A', date: '2026-02-02', amount: 50},
];

export function recordTable(name: string, columns: {name: string; x: number}[], data: string[][], width = 780) {
  const height = 100 + data.length * 62;
  const surface = paper(width, height, '#101315');
  const label = text(`sales database / ${name}`, 27, {position: [-width / 2, -height / 2 - 35], offset: [-1, 0], fontFamily: theme.fontFamily.mono});
  const headerY = -height / 2 + 37;
  surface.root.add([
    label,
    ...columns.map(column => text(column.name, 23, {position: [column.x, headerY], offset: [-1, 0], fill: muted, fontFamily: theme.fontFamily.mono})),
    new Line({points: [[-width / 2 + 24, headerY + 32], [width / 2 - 24, headerY + 32]], stroke: foreground, opacity: 0.25, lineWidth: 1.5}),
  ]);
  const rows = data.map((values, i) => {
    const root = new Layout({y: headerY + 69 + i * 62});
    const highlight = new Rect({width: width - 28, height: 52, radius: 7, stroke: accent, lineWidth: 2.5, fill: '#17232f', opacity: 0});
    const cells = values.map((value, j) => text(value, 25, {position: [columns[j].x, 0], offset: [-1, 0], fontFamily: theme.fontFamily.mono}));
    root.add([highlight, ...cells]);
    surface.root.add(root);
    return {root, highlight, cells};
  });
  return {...surface, label, rows};
}

export function orderTable() {
  return recordTable('orders', [{name: 'id', x: -350}, {name: 'status', x: -80}], [
    ['1041', 'shipped'], ['1042', 'created'], ['1043', 'created'], ['1044', 'created'],
  ]);
}

export function salesTable() {
  return recordTable('sales', [{name: 'id', x: -346}, {name: 'store_id', x: -218}, {name: 'sold_at', x: -56}, {name: 'amount', x: 202}], sales.map(row => [String(row.id), row.store, row.date, String(row.amount)]));
}
