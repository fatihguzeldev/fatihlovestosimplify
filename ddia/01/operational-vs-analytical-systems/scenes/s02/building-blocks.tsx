import { Layout, makeScene2D, Path, Txt } from '@motion-canvas/2d';
import { all, easeOutCubic, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, heading, text } from '../shared/drawing';
import { createMarket } from '../shared/market';
import { showCache } from './cache';
import { showSearch } from './search';
import { showProcessing } from './processing';

export default makeScene2D(function* (view) {
  view.fill(background);
  const bridge = new Layout({ position: [-806.4, -60] });
  bridge.add([
    new Txt({
      offset: [-1, 0],
      fontFamily: theme.fontFamily.sans,
      fontSize: 86,
      fill: foreground,
      textWrap: false,
      children: [new Txt({ text: 'data', fill: accent }), new Txt({ text: '’yı yönetmek.' })],
    }),
    text('peki, nasıl?', 48, {
      position: [0, 130],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.serif,
      fontStyle: 'italic',
    }),
  ]);
  view.add(bridge);
  yield loadFonts();
  yield* waitFor(0.4);
  yield* bridge.opacity(0, 0.45);
  bridge.remove();
  const stage = new Layout({ opacity: 0 });
  const title = heading('bu siparişi ', 'kaydedelim.');
  const market = createMarket();
  market.root.position([-470, 100]);
  const {
    root: database,
    top,
    caption: databaseCaption,
  } = cartoonDatabase('sales database', accent);
  database.position([550, 110]);
  database.scale(1.4);
  databaseCaption.fontSize(28 / 1.4);
  database.opacity(0);
  const saved = new Layout({ position: [638, -172], rotation: -7, scale: 0.76, opacity: 0 });
  const outline =
    'M -149 -58 C -99 -70 79 -73 148 -61 Q 171 -56 173 -26 L 167 44 Q 164 67 136 69 L -45 72 L -108 114 L -89 70 Q -141 73 -159 50 C -166 20 -164 -32 -149 -58 Z';
  const ink = {
    stroke: foreground,
    lineWidth: 3,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
  };
  saved.add(new Path({ ...ink, data: outline, fill: background }));
  for (const [x, y] of [
    [143, -22],
    [145, -4],
    [143, 15],
    [139, 34],
  ]) {
    saved.add(
      new Path({
        data: `M ${x - 5} ${y + 10} Q ${x + 1} ${y + 4} ${x + 10} ${y - 4}`,
        stroke: accent,
        lineWidth: 2.1,
        lineCap: 'round',
      }),
    );
  }
  const tick = new Path({
    data: 'M -127 1 Q -115 8 -108 22 Q -92 -5 -72 -25',
    stroke: accent,
    lineWidth: 7,
    lineCap: 'round',
    lineJoin: 'round',
    end: 0,
  });
  tick.opacity(() => (tick.end() > 0 ? 1 : 0));
  const burst = new Layout({ opacity: 0 });
  burst.add([
    new Path({ ...ink, stroke: accent, data: 'M 184 -42 Q 195 -48 205 -54' }),
    new Path({ ...ink, stroke: accent, data: 'M 190 -14 L 214 -17' }),
    new Path({ ...ink, stroke: accent, data: 'M 68 -83 Q 70 -94 74 -103' }),
  ]);
  saved.add([
    tick,
    text('#1042', 38, { position: [-38, -21], offset: [-1, 0], fontFamily: theme.fontFamily.mono }),
    text('created', 24, {
      position: [-36, 24],
      offset: [-1, 0],
      fill: accent,
      fontFamily: theme.fontFamily.mono,
    }),
    burst,
  ]);
  const write = cartoonArrow('s02-save-order', [-108, 80], [354, 80], accent, 0);
  const read = cartoonArrow('s02-load-order', [354, 215], [-108, 215], accent, 0);
  const writeLabel = text('saveOrder()', 25, {
    position: write.pointAt(0.5).addY(-60),
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const readLabel = text('#1042', 25, {
    position: read.pointAt(0.5).addY(65),
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  stage.add([title, market.root, database, saved, write.root, read.root, writeLabel, readLabel]);
  view.add(stage);
  yield* stage.opacity(1, 0.65);
  yield* waitUntil('store');
  yield* market.button.scale(0.96, 0.12).to(1, 0.18);
  yield* database.opacity(1, 0.45);
  yield* all(write.reveal(1, 0.45), writeLabel.opacity(1, 0.3));
  yield* write.travel(0.65);
  yield* all(
    write.arrive(),
    top.stroke(accent, 0.1).to(foreground, 0.3),
    saved.opacity(1, 0.1),
    saved.scale(1.045, 0.22, easeOutCubic).to(1, 0.18),
    saved.rotation(2.4, 0.22, easeOutCubic).to(-1.3, 0.18),
    saved.y(-185, 0.3, easeOutCubic),
    burst.opacity(1, 0.12),
  );
  yield* tick.end(1, 0.26, easeOutCubic);
  yield* burst.opacity(0, 0.2);
  yield* market.cart.opacity(0, 0.25);
  market.cart.remove();
  yield* market.receipt.opacity(1, 0.35);
  yield* waitFor(2.1);
  yield* all(saved.opacity(0, 0.18), saved.scale(0.96, 0.18), saved.y(-178, 0.18));
  saved.remove();
  yield* waitUntil('retrieve');
  yield* all(title.opacity(0, 0.2), writeLabel.opacity(0, 0.2), market.receipt.opacity(0, 0.3));
  title.children(heading('siparişi ', 'tekrar açalım.').children());
  writeLabel.text('getOrder(1042)');
  yield* all(title.opacity(1, 0.3), writeLabel.opacity(1, 0.3));
  yield* write.travel(0.6);
  yield* all(write.arrive(), top.stroke(accent, 0.1).to(foreground, 0.3));
  yield* all(read.reveal(1, 0.4), readLabel.opacity(1, 0.3));
  yield* read.travel(0.65);
  yield* all(
    read.arrive(),
    market.receipt.opacity(1, 0.35),
    market.shell.stroke(accent, 0.12).to(foreground, 0.3),
  );
  yield* waitUntil('cache');
  yield* stage.opacity(0, 0.4);
  const cache = yield* showCache(view);
  yield* waitUntil('search');
  yield* cache.root.opacity(0, 0.4);
  cache.root.remove();
  const search = yield* showSearch(view);
  yield* waitUntil('stream');
  yield* search.opacity(0, 0.4);
  search.remove();
  const processing = yield* showProcessing(view);
  yield* waitUntil('tradeoffs');
  yield* processing.opacity(0, 0.4);
  processing.remove();
  cache.market.root.opacity(0);
  cache.lookup.root.opacity(0);
  cache.hit.root.opacity(0);
  cache.lookupLabel.opacity(0);
  cache.title.children(heading('teslimat süresine ', 'geri dönelim.').children());
  cache.calculation.position([-470, 85]);
  cache.calculation.scale(1.25);
  cache.calculation.opacity(1);
  cache.calculationResult.text('18 dk');
  cache.calculationResult.opacity(1);
  cache.route.end(1);
  cache.traffic.opacity(0);
  const refresh = heading('cache’teki tahmini ne zaman ', 'yenilemeliyiz?');
  refresh.position([-806, 410]);
  refresh.fontSize(48);
  refresh.opacity(0);
  cache.root.add(refresh);
  view.add(cache.root);
  yield* cache.root.opacity(1, 0.5);
  yield* waitFor(1.6);
  yield* cache.title.opacity(0, 0.15);
  cache.title.children(heading('yolda trafik ', 'sıkıştı.').children());
  yield* cache.title.opacity(1, 0.25);
  yield* cache.traffic.opacity(1, 0.65);
  yield* waitFor(0.35);
  yield* cache.calculationResult.opacity(0, 0.15);
  cache.calculationResult.text('24 dk');
  yield* cache.calculationResult.opacity(1, 0.35);
  yield* waitUntil('cache-stale');
  yield* cache.title.opacity(0, 0.15);
  cache.title.children(heading('cache’teki tahmin ', 'güncel değil.').children());
  yield* all(cache.title.opacity(1, 0.3), cache.cache.face.stroke(accent, 0.4));
  yield* waitFor(0.8);
  yield* refresh.opacity(1, 0.4);
  yield* waitUntil('next');
  yield* cache.root.opacity(0, 0.4);
  cache.root.remove();
  title.children(heading('hangi işe ', 'hangi araç?').children());
  write.root.opacity(1);
  read.root.opacity(0);
  writeLabel.opacity(0);
  readLabel.opacity(0);
  const responsibility = text('neyi yönetmek gerekiyor?', 44, {
    position: [-806, 420],
    offset: [-1, 0],
    fontFamily: theme.fontFamily.serif,
    fontStyle: 'italic',
    opacity: 0,
  });
  stage.add(responsibility);
  yield* stage.opacity(1, 0.5);
  yield* responsibility.opacity(1, 0.5);
  yield* waitUntil('end');
});
