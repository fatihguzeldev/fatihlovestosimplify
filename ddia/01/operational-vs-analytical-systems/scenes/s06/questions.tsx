import { Layout, Path } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { accent, background, banana, foreground, ink, muted, paper, text } from '../shared/drawing';

export function promotion() {
  const root = new Layout({ opacity: 0 });
  const fruit = banana();
  fruit.position([-540, 35]);
  fruit.scale(3.5);
  const cards = ['normalde', 'promosyonda'].map((label, i) => {
    const card = paper(340, 300, '#101315');
    card.root.position([-45 + i * 495, 50]);
    card.root.add([
      text(label, 30, { y: -95, fill: i ? accent : muted, fontStyle: i ? 'italic' : 'normal' }),
      text('? kg', 76, { y: 17, fill: i ? accent : foreground }),
    ]);
    return card;
  });
  root.add([fruit, ...cards.map((card) => card.root)]);
  const comparison = new Path({
    ...ink,
    stroke: accent,
    lineWidth: 2.5,
    data: 'M -192 260 Q -190 284 -163 284 L 130 286 Q 150 285 158 309 Q 167 286 190 286 L 584 284 Q 610 284 608 259',
  });
  root.add([
    comparison,
    text('ne kadar fazla?', 36, { position: [160, 360], fill: accent, fontStyle: 'italic' }),
  ]);
  return root;
}

export function together() {
  const root = new Layout({ opacity: 0 });
  const diapers = paper(290, 300, '#17232f');
  diapers.root.position([-340, 55]);
  diapers.root.add([
    text('marka x', 29, { y: -98, fill: accent }),
    new Path({
      ...ink,
      lineWidth: 4,
      data: 'M -82 -30 L 82 -28 Q 77 16 53 65 Q 24 45 0 45 Q -29 46 -53 66 Q -77 14 -82 -30 Z M -79 -17 Q 0 3 79 -17 M -62 -4 Q -62 26 -30 49 M 62 -3 Q 62 23 32 49',
      fill: background,
    }),
    text('bebek bezi', 29, { y: 119 }),
  ]);
  const jar = new Layout({ position: [375, 40] });
  jar.add([
    new Path({
      ...ink,
      lineWidth: 4,
      fill: '#17232f',
      data: 'M -110 -85 L -110 -122 Q 0 -132 112 -121 L 112 -84 Z M -103 -84 Q -128 -69 -128 -46 L -125 128 Q -123 151 -96 153 L 100 152 Q 126 150 127 127 L 128 -42 Q 125 -69 101 -84 Z M -125 -31 L 127 -29 M -125 97 L 127 96',
    }),
    text('?', 102, { y: 25, fill: accent, fontStyle: 'italic' }),
    text('mama markası', 30, { y: 205 }),
  ]);
  const arrow = cartoonArrow('s06-bought-together', [-130, 55], [176, 55], accent);
  root.add([
    diapers.root,
    jar,
    arrow.root,
    text('birlikte alınan ürünler', 30, { position: [0, 355], fill: muted }),
  ]);
  return { root, arrow };
}
