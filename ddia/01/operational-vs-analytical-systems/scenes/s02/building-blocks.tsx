import {Layout, makeScene2D, Txt} from '@motion-canvas/2d';
import {all, waitFor, waitUntil} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {cartoonDatabase} from '../../../../../common/cartoon-system';
import {theme} from '../../theme';
import {accent, background, foreground, heading, text} from './drawing';
import {createMarket} from './market';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(background);
  const bridge = new Layout({position: [-806.4, -60]});
  bridge.add([
    new Txt({offset: [-1, 0], fontFamily: theme.fontFamily.sans, fontSize: 86, fill: foreground, textWrap: false, children: [new Txt({text: 'data', fill: accent}), new Txt({text: '’yı yönetmek.'})]}),
    text('peki, nasıl?', 48, {position: [0, 130], offset: [-1, 0], fontFamily: theme.fontFamily.serif, fontStyle: 'italic'}),
  ]);
  view.add(bridge);
  yield* waitFor(0.4);
  yield* bridge.opacity(0, 0.45);
  bridge.remove();
  const stage = new Layout({opacity: 0});
  const title = heading('bu siparişi ', 'saklayalım.');
  const market = createMarket();
  market.root.position([-470, 100]);
  const {root: database, top} = cartoonDatabase('database', accent);
  database.position([550, 110]);
  database.scale(1.4);
  database.opacity(0);
  database.add(text('sales db', 22, {y: 8, fontFamily: theme.fontFamily.mono}));
  const saved = text('#1042 · created', 27, {position: [550, 395], fill: accent, fontFamily: theme.fontFamily.mono, opacity: 0});
  const write = cartoonArrow('s02-save-order', [-108, 80], [354, 80], accent, 0);
  const read = cartoonArrow('s02-load-order', [354, 215], [-108, 215], accent, 0);
  const writeLabel = text('saveOrder()', 25, {position: write.pointAt(0.5).addY(-60), fontFamily: theme.fontFamily.mono, opacity: 0});
  const readLabel = text('getOrder(1042)', 25, {position: read.pointAt(0.5).addY(65), fontFamily: theme.fontFamily.mono, opacity: 0});
  stage.add([title, market.root, database, saved, write.root, read.root, writeLabel, readLabel]);
  view.add(stage);
  yield* stage.opacity(1, 0.65);
  yield* waitUntil('store');
  yield* market.button.scale(0.96, 0.12).to(1, 0.18);
  yield* market.cart.opacity(0, 0.25);
  market.cart.remove();
  yield* all(market.receipt.opacity(1, 0.35), database.opacity(1, 0.45));
  yield* all(write.reveal(1, 0.45), writeLabel.opacity(1, 0.3));
  yield* write.travel(0.65);
  yield* all(write.arrive(), top.stroke(accent, 0.1).to(foreground, 0.3), saved.opacity(1, 0.3));
  yield* waitUntil('retrieve');
  yield* all(title.opacity(0, 0.2), write.root.opacity(0.2, 0.3), writeLabel.opacity(0.2, 0.3), market.receipt.opacity(0, 0.3));
  title.children(heading('sonra ', 'tekrar bulalım.').children());
  yield* title.opacity(1, 0.3);
  yield* all(read.reveal(1, 0.4), readLabel.opacity(1, 0.3));
  yield* read.travel(0.65);
  yield* all(read.arrive(), market.receipt.opacity(1, 0.35), market.shell.stroke(accent, 0.12).to(foreground, 0.3));
  yield* waitUntil('end');
});
