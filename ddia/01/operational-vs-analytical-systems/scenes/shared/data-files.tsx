import {Layout, Path} from '@motion-canvas/2d';
import {theme} from '../../theme';
import {accent, banana, foreground, muted, paper, text} from './drawing';

export function dataFile(name: string, kind: 'records' | 'review' | 'image' | 'sensor') {
  const surface = paper(440, 300, '#101315');
  surface.root.add([
    text(name, 27, {position: [-174, -106], offset: [-1, 0], fill: accent, fontFamily: theme.fontFamily.mono}),
    new Path({data: 'M -175 -64 L 174 -64', stroke: foreground, lineWidth: 1.5, opacity: 0.4}),
  ]);
  if (kind === 'records') {
    [['id', 'store', 'amount'], ['1042', 'A', '185'], ['1043', 'B', '260']].forEach((row, i) => {
      row.forEach((value, j) => surface.root.add(text(value, 22, {position: [[-174, -32, 174][j], -15 + i * 48], offset: [j === 2 ? 1 : -1, 0], fill: i === 0 ? muted : foreground, fontFamily: theme.fontFamily.mono})));
    });
  } else if (kind === 'review') {
    surface.root.add([
      text('“muzlar ezilmiş geldi.”', 28, {y: 23}),
      text('ürün yorumu', 23, {y: 96, fill: muted}),
    ]);
  } else if (kind === 'image') {
    const fruit = banana();
    fruit.position([0, 30]);
    fruit.scale(2.5);
    surface.root.add(fruit);
  } else {
    [['time', 'temp'], ['14:32', '22°C'], ['14:33', '23°C']].forEach((row, i) => {
      row.forEach((value, j) => surface.root.add(text(value, 23, {position: [-150 + j * 226, -5 + i * 50], offset: [-1, 0], fill: i === 0 ? muted : foreground, fontFamily: theme.fontFamily.mono})));
    });
  }
  return surface;
}

export function analysisInputs() {
  const root = new Layout({});
  const files = [dataFile('sales.parquet', 'records'), dataFile('reviews.json', 'review'), dataFile('product.jpg', 'image')];
  files.forEach((file, i) => {
    file.root.position([-570 + 570 * i, 90]);
    root.add(file.root);
  });
  return {root, files};
}
