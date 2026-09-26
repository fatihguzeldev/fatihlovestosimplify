import { Layout, Line, Path, Rect } from '@motion-canvas/2d';
import { theme } from '../../theme';
import { accent, background, banana, foreground, ink, muted, text } from './drawing';

export function createMarket() {
  const root = new Layout({});
  const body = new Layout({ y: 32 });
  const label = text('application', 24, {
    position: [-325, -275],
    offset: [-1, 0],
    fontFamily: theme.fontFamily.mono,
    fill: muted,
  });
  const shell = new Path({
    ...ink,
    fill: '#101315',
    data: 'M -303 -235 Q -326 -233 -325 -211 L -323 208 Q -325 233 -300 235 L 300 232 Q 324 233 325 208 L 323 -210 Q 324 -233 300 -234 Z',
  });
  root.add([
    shell,
    new Line({
      points: [
        [-323, -168],
        [322, -170],
      ],
      ...ink,
      lineWidth: 1.5,
      opacity: 0.35,
    }),
    new Path({
      ...ink,
      position: [-275, -204],
      stroke: accent,
      lineWidth: 2.5,
      data: 'M -14 -8 L 13 -9 L 16 15 Q 0 18 -16 15 Z M -7 -5 L -7 -13 Q 0 -25 7 -13 L 7 -5',
    }),
    text('market', 31, { position: [-239, -204], offset: [-1, 0], fontWeight: 500 }),
    new Path({
      ...ink,
      position: [273, -203],
      lineWidth: 2.5,
      data: 'M -14 -6 Q 0 -8 14 -6 M -7 6 L 14 5',
    }),
    label,
    body,
  ]);
  const fruit = banana();
  fruit.position([-230, -83]);
  fruit.scale(0.83);
  const milk = new Path({
    ...ink,
    position: [-230, 21],
    scale: 0.75,
    data: 'M -23 -23 L -9 -37 L 19 -36 L 27 -21 L 27 30 L -23 31 Z M -23 -23 L 27 -21 M -9 -37 L -8 -22 L -8 30',
    fill: '#182638',
  });
  const button = new Path({
    position: [154, 138],
    fill: accent,
    data: 'M -112 -28 Q 0 -31 110 -27 Q 120 -27 119 -17 L 117 20 Q 116 30 106 29 L -108 31 Q -121 31 -120 19 L -119 -18 Q -120 -28 -112 -28 Z',
  });
  button.add([
    text('siparişi ver', 24, { x: -13, fill: background, fontWeight: 500 }),
    new Path({
      ...ink,
      position: [88, 0],
      stroke: background,
      lineWidth: 2.5,
      data: 'M -8 0 L 8 0 M 1 -7 L 9 0 L 1 7',
    }),
  ]);
  const cart = new Layout({});
  cart.add([
    text('sepetim', 29, { position: [-273, -155], offset: [-1, 0], fontWeight: 500 }),
    text('2 ürün', 21, { position: [273, -155], offset: [1, 0], fill: muted }),
    ...[-83, 17].map(
      (y) =>
        new Rect({
          position: [-230, y],
          size: [84, 78],
          radius: 13,
          fill: '#19232d',
          stroke: '#2c3946',
          lineWidth: 1.3,
        }),
    ),
    fruit,
    milk,
    text('muz', 29, { position: [-164, -97], offset: [-1, 0] }),
    text('2 kg', 21, { position: [-164, -62], offset: [-1, 0], fill: muted }),
    text('120 ₺', 27, { position: [273, -83], offset: [1, 0], fontFamily: theme.fontFamily.mono }),
    text('süt', 29, { position: [-164, 3], offset: [-1, 0] }),
    text('1 litre', 21, { position: [-164, 38], offset: [-1, 0], fill: muted }),
    text('65 ₺', 27, { position: [273, 17], offset: [1, 0], fontFamily: theme.fontFamily.mono }),
    new Line({
      points: [
        [-273, 81],
        [273, 81],
      ],
      stroke: foreground,
      opacity: 0.16,
      lineWidth: 1.5,
    }),
    text('toplam', 21, { position: [-273, 116], offset: [-1, 0], fill: muted }),
    text('185 ₺', 32, {
      position: [-273, 152],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
      fontWeight: 500,
    }),
    button,
  ]);
  body.add(cart);
  const receipt = new Layout({ opacity: 0 });
  const status = text('created', 26, {
    position: [-249, -34],
    offset: [-1, 0],
    fontFamily: theme.fontFamily.mono,
    fill: accent,
  });
  const receiptTotal = text('185 ₺', 32, {
    position: [269, 91],
    offset: [1, 0],
    fontFamily: theme.fontFamily.mono,
  });
  receipt.add([
    text('sipariş', 21, { position: [-269, -146], offset: [-1, 0], fill: muted }),
    text('#1042', 43, {
      position: [-269, -103],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
      fontWeight: 500,
    }),
    new Path({
      ...ink,
      position: [240, -119],
      stroke: accent,
      lineWidth: 2.5,
      data: 'M -21 -18 L 3 -26 L 23 -15 L 22 19 L -1 28 L -22 16 Z M -21 -18 L -1 -7 L 23 -15 M -1 -7 L -1 28 M -10 -22 L 11 -11 L 11 0',
    }),
    new Rect({ position: [0, -34], size: [550, 62], radius: 9, fill: '#182638' }),
    new Path({ stroke: accent, lineWidth: 3, lineCap: 'round', data: 'M -272 -49 L -272 -19' }),
    status,
    text('muz · süt', 27, { position: [-269, 57], offset: [-1, 0] }),
    text('2 kg · 1 litre', 20, { position: [-269, 93], offset: [-1, 0], fill: muted }),
    text('toplam', 20, { position: [269, 53], offset: [1, 0], fill: muted }),
    receiptTotal,
  ]);
  body.add(receipt);
  return { root, body, cart, receipt, receiptTotal, button, shell, label, status };
}
