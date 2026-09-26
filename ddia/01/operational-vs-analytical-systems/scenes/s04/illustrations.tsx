import { Layout, Line, Path, Rect } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, banana, ink, muted, paper, text } from '../shared/drawing';
import { januaryTotals } from '../shared/workloads';

export function salesReport() {
  const report = paper(410, 300, '#101315');
  const chart = new Layout({});
  const period = text('ocak 2026', 25, { y: -115, fill: muted });
  const bars = januaryTotals.map((amount, i) => {
    const x = -84 + i * 168;
    const bar = new Rect({ position: [x, 88], offset: [0, 1], width: 73, height: 0, fill: accent });
    const value = text(`${amount} ₺`, 25, {
      position: [x, 88 - amount * 0.37 - 24],
      fontFamily: theme.fontFamily.mono,
      opacity: 0,
    });
    chart.add([bar, value, text(`mağaza ${i ? 'b' : 'a'}`, 22, { position: [x, 119] })]);
    return { bar, value, amount };
  });
  chart.add(
    new Line({
      points: [
        [-169, 89],
        [169, 89],
      ],
      lineWidth: 1.5,
      stroke: muted,
    }),
  );
  const suggestions = new Layout({ opacity: 0 });
  const fruit = banana();
  fruit.position([-117, -10]);
  fruit.scale(1.25);
  const basket = new Path({
    ...ink,
    data: 'M -174 22 L -161 83 Q -119 89 -75 82 L -64 22 Z M -176 22 Q -118 18 -62 22 M -149 30 L -140 76 M -119 29 L -116 78 M -89 30 L -92 76',
  });
  const candidate = paper(86, 122, '#17232f');
  candidate.root.position([129, 20]);
  candidate.root.add(
    text('?', 78, { fill: accent, fontFamily: theme.fontFamily.serif, fontStyle: 'italic' }),
  );
  const suggest = cartoonArrow('s04-recommend-product', [0, 0], [175, 0], accent);
  suggest.root.position([-38, 18]);
  suggest.root.scale(0.55);
  suggestions.add([fruit, basket, suggest.root, candidate.root]);
  report.root.add([period, chart, suggestions]);
  return { ...report, period, chart, bars, suggestions, suggest };
}
