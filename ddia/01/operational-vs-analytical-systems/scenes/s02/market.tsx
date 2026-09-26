import {Circle, Layout, Line, Path, Rect} from '@motion-canvas/2d';
import {theme} from '../../theme';
import {accent, background, banana, foreground, ink, muted, text} from './drawing';

export function createMarket() {
  const root = new Layout({});
  const body = new Layout({y: 32});
  const shell = new Path({
    ...ink, fill: '#101315',
    data: 'M -303 -235 Q -326 -233 -325 -211 L -323 208 Q -325 233 -300 235 L 300 232 Q 324 233 325 208 L 323 -210 Q 324 -233 300 -234 Z',
  });
  root.add([
    shell,
    new Line({points: [[-323, -168], [322, -170]], ...ink, lineWidth: 2}),
    text('market', 30, {position: [-276, -203], offset: [-1, 0], fontStyle: 'italic'}),
    text('application', 24, {position: [-325, -275], offset: [-1, 0], fontFamily: theme.fontFamily.mono, fill: muted}),
    ...[232, 258, 284].map(x => new Circle({position: [x, -202], size: 9, fill: muted, opacity: 0.6})),
    body,
  ]);
  const fruit = banana();
  fruit.position([-245, -93]);
  const milk = new Path({...ink, position: [-245, 5], data: 'M -23 -23 L -9 -37 L 19 -36 L 27 -21 L 27 30 L -23 31 Z M -23 -23 L 27 -21 M -9 -37 L -8 -22 L -8 30', fill: '#182638'});
  const button = new Rect({position: [0, 145], size: [558, 61], radius: 9, fill: accent});
  button.add(text('siparişi ver', 28, {fill: background, fontWeight: 500}));
  const cart = new Layout({});
  cart.add([
    fruit, milk,
    text('muz', 32, {position: [-188, -106], offset: [-1, 0]}),
    text('2 kg', 22, {position: [-188, -66], offset: [-1, 0], fill: muted}),
    text('120 ₺', 28, {position: [278, -90], offset: [1, 0], fontFamily: theme.fontFamily.mono}),
    text('süt', 32, {position: [-188, -8], offset: [-1, 0]}),
    text('1 litre', 22, {position: [-188, 30], offset: [-1, 0], fill: muted}),
    text('65 ₺', 28, {position: [278, 8], offset: [1, 0], fontFamily: theme.fontFamily.mono}),
    new Line({points: [[-278, 70], [278, 70]], stroke: foreground, opacity: 0.2}),
    text('toplam', 24, {position: [-278, 100], offset: [-1, 0], fill: muted}),
    text('185 ₺', 28, {position: [278, 100], offset: [1, 0], fontFamily: theme.fontFamily.mono}),
    button,
  ]);
  body.add(cart);
  const receipt = new Layout({opacity: 0});
  receipt.add([
    text('sipariş #1042', 45, {position: [-269, -86], offset: [-1, 0], fontWeight: 500}),
    text('created', 26, {position: [-269, -20], offset: [-1, 0], fontFamily: theme.fontFamily.mono, fill: accent}),
    new Line({points: [[-270, 31], [270, 31]], stroke: foreground, opacity: 0.2}),
    text('muz · süt', 30, {position: [-269, 80], offset: [-1, 0]}),
    text('185 ₺', 32, {position: [269, 80], offset: [1, 0], fontFamily: theme.fontFamily.mono}),
  ]);
  body.add(receipt);
  return {root, body, cart, receipt, button, shell};
}
