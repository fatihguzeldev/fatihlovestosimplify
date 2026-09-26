import { Layout, Line } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, muted, paper, text } from './drawing';
import { sales } from './records';

export function storedTotals() {
  const root = new Layout({});
  const boundary = paper(1660, 530);
  boundary.root.position([0, 65]);
  boundary.face.stroke(muted);
  boundary.root.add(text('sales database', 29, { position: [-778, -228], offset: [-1, 0] }));
  const rows = paper(680, 338, '#101315');
  rows.root.position([-420, 75]);
  rows.root.add(text('sales · ocak satırları', 26, { y: -199, fill: muted }));
  const cols = [-269, -90, 163];
  ['id', 'store', 'amount'].forEach((name, i) =>
    rows.root.add(
      text(name, 23, {
        position: [cols[i], -130],
        offset: [-1, 0],
        fill: muted,
        fontFamily: theme.fontFamily.mono,
      }),
    ),
  );
  rows.root.add(
    new Line({
      points: [
        [-302, -104],
        [302, -104],
      ],
      stroke: muted,
      lineWidth: 1,
    }),
  );
  const values = sales
    .filter((row) => row.date < '2026-02-01')
    .map((row, i) => {
      const amount = text(String(row.amount), 27, {
        position: [cols[2], -70 + 48 * i],
        offset: [-1, 0],
        fontFamily: theme.fontFamily.mono,
      });
      rows.root.add([
        text(String(row.id), 27, {
          position: [cols[0], -70 + 48 * i],
          offset: [-1, 0],
          fontFamily: theme.fontFamily.mono,
        }),
        text(row.store, 27, {
          position: [cols[1], -70 + 48 * i],
          offset: [-1, 0],
          fontFamily: theme.fontFamily.mono,
        }),
        amount,
      ]);
      return amount;
    });
  const stored = paper(450, 250, '#17232f');
  stored.root.position([470, 75]);
  const totals = [400, 300].map((amount, i) =>
    text(String(amount), 43, {
      position: [75, -4 + i * 78],
      fill: accent,
      fontFamily: theme.fontFamily.mono,
    }),
  );
  stored.root.add([
    text('monthly_totals', 29, { y: -79, fontFamily: theme.fontFamily.mono }),
    ...totals,
    ...['A', 'B'].map((name, i) =>
      text(name, 35, { position: [-114, -4 + i * 78], fontFamily: theme.fontFamily.mono }),
    ),
  ]);
  const calculate = cartoonArrow('stored-monthly-aggregation', [-34, 75], [199, 75], accent);
  const operation = text('SUM(amount)', 25, {
    position: [82, -30],
    fontFamily: theme.fontFamily.mono,
  });
  const note = text('PostgreSQL · materialized view', 29, { position: [0, 414], fill: accent });
  root.add([boundary.root, rows.root, stored.root, calculate.root, operation, note]);
  return { root, rows, stored, values, totals, calculate, operation, note, boundary };
}
