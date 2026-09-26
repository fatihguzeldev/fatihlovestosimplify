import {Circle, Layout, Line, Path, Rect} from '@motion-canvas/2d';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {theme} from '../../theme';
import {accent, background, banana, foreground, ink, muted, paper, text} from '../shared/drawing';

export function role(name: string, detail: string, style: number) {
  const root = new Layout({opacity: 0});
  const person = new Layout({position: [-145, -2]});
  person.add([
    new Circle({position: [0, -15], size: [43, 48], stroke: foreground, lineWidth: 2.4, fill: background}),
    new Path({...ink, stroke: accent, lineWidth: 2.6, data: 'M -37 38 Q -32 10 -4 13 Q 27 8 37 37 M -20 17 L -7 31 L 8 15'}),
    new Path({...ink, lineWidth: 1.8, data: 'M -10 -13 L -9 -10 M 9 -13 L 10 -10 M -4 1 Q 1 5 6 0'}),
    new Path({...ink, fill: '#182638', data: [
      'M -22 -21 L -22 -35 L -11 -42 L -6 -37 L 3 -44 L 17 -36 L 22 -20 L 13 -27 L 5 -22 L -3 -29 L -14 -22 Z',
      'M -22 -7 Q -34 -41 -5 -44 Q 29 -46 26 -11 L 18 -27 Q 0 -25 -11 -33 L -16 -9 Z',
      'M -23 -20 Q -34 -34 -19 -37 Q -20 -50 -8 -43 Q 2 -54 10 -42 Q 24 -47 24 -32 Q 34 -24 21 -16 L 14 -28 L 4 -23 L -6 -29 Z',
    ][style]}),
  ]);
  root.add([
    person,
    text(name, 25, {position: [-87, -17], offset: [-1, 0]}),
    text(detail, 21, {position: [-87, 20], offset: [-1, 0], fill: muted}),
  ]);
  return root;
}

export function salesReport() {
  const report = paper(410, 300, '#101315');
  const chart = new Layout({});
  const period = text('ocak 2026', 25, {y: -115, fill: muted});
  const bars = [400, 300].map((amount, i) => {
    const x = -84 + i * 168;
    const bar = new Rect({position: [x, 88], offset: [0, 1], width: 73, height: 0, fill: accent});
    const value = text(`${amount} ₺`, 25, {position: [x, 88 - amount * 0.37 - 24], fontFamily: theme.fontFamily.mono, opacity: 0});
    chart.add([bar, value, text(`mağaza ${i ? 'b' : 'a'}`, 22, {position: [x, 119]})]);
    return {bar, value, amount};
  });
  chart.add(new Line({points: [[-169, 89], [169, 89]], lineWidth: 1.5, stroke: muted}));
  const suggestions = new Layout({opacity: 0});
  const fruit = banana();
  fruit.position([-117, -10]);
  fruit.scale(1.25);
  const basket = new Path({...ink, data: 'M -174 22 L -161 83 Q -119 89 -75 82 L -64 22 Z M -176 22 Q -118 18 -62 22 M -149 30 L -140 76 M -119 29 L -116 78 M -89 30 L -92 76'});
  const candidate = paper(86, 122, '#17232f');
  candidate.root.position([129, 20]);
  candidate.root.add(text('?', 78, {fill: accent, fontFamily: theme.fontFamily.serif, fontStyle: 'italic'}));
  const suggest = cartoonArrow('s04-recommend-product', [0, 0], [175, 0], accent);
  suggest.root.position([-38, 18]);
  suggest.root.scale(0.55);
  suggestions.add([fruit, basket, suggest.root, candidate.root]);
  report.root.add([period, chart, suggestions]);
  return {...report, period, chart, bars, suggestions, suggest};
}
