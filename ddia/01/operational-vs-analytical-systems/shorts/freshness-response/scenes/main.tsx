import { Layout, makeScene2D, Path, Rect } from '@motion-canvas/2d';
import { all, createSignal, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  foreground,
  heading,
  loadFonts,
  muted,
  text,
} from '../../shared/drawing';
import { money, newSale } from '../../../scenes/s08/seller-panel';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(background);
  const title = heading('satıcı panelinde\n', 'satışları takip ediyoruz.');
  const panel = new Layout({ y: -60 });
  const period = text('ocak', 32, { position: [270, -225], fill: muted });
  panel.add([
    new Path({
      data: 'M -368 -360 Q -390 -358 -388 -330 L -387 325 Q -386 359 -355 360 L 357 357 Q 390 358 389 327 L 391 -328 Q 391 -361 360 -358 Z',
      fill: '#101315',
      stroke: foreground,
      lineWidth: 3,
    }),
    text('satıcı paneli', 35, { position: [0, -315] }),
    new Path({
      data: 'M -385 -275 Q 0 -269 388 -274',
      stroke: foreground,
      lineWidth: 1.5,
      opacity: 0.3,
    }),
    period,
    text('toplam satış', 29, { position: [-175, -225], fill: muted }),
  ]);
  const details = new Layout({});
  const amounts = [createSignal(400), createSignal(300)];
  const total = text('', 70, {
    y: -143,
    text: () => money(amounts[0]() + amounts[1]()),
  });
  details.add(total);
  amounts.forEach((amount, i) => {
    const x = -170 + i * 340;
    details.add([
      new Rect({
        position: [x, 180],
        offset: [0, 1],
        width: 118,
        height: () => amount() * 0.13,
        fill: accent,
      }),
      text('', 37, {
        x,
        y: () => 142 - amount() * 0.13,
        text: () => money(amount()),
      }),
      text(`mağaza ${i ? 'b' : 'a'}`, 30, { position: [x, 225] }),
    ]);
  });
  const loading = text('hesaplanıyor…', 43, { y: 35, fill: muted, opacity: 0 });
  panel.add([details, loading]);
  const sale = newSale();
  sale.position([0, 520]);
  const update = cartoonArrow('short-fresh-sale', [0, 370], [0, 275], accent, 0);
  const freshness = new Layout({ y: 440, opacity: 0 });
  const freshLabel = text('verinin güncelliği', 40, { fill: accent });
  const freshNote = text('yeni satış sonuca ne zaman yansıyor?', 29, { y: 58 });
  freshness.add([freshLabel, freshNote]);
  const response = new Layout({ y: 650, opacity: 0 });
  const responseLabel = text('yanıt süresi', 40, { fill: accent });
  const responseNote = text('paneli açınca ne kadar bekliyoruz?', 29, { y: 58 });
  response.add([responseLabel, responseNote]);
  view.add([title, panel, sale, update.root, freshness, response]);
  yield* waitUntil('today');
  period.text('bugün');
  title.children(heading('bugünkü satışları\n', 'takip edelim.').children());
  yield* all(period.fill(accent, 0.3), amounts[0](1200, 0.4), amounts[1](900, 0.4));
  yield* waitUntil('sale');
  yield* sale.opacity(1, 0.35);
  yield* waitUntil('total');
  yield* update.reveal(1, 0.3);
  yield* update.travel(0.5);
  yield* all(update.arrive(), amounts[0](1385, 0.7));
  yield* waitUntil('freshness');
  yield* all(sale.opacity(0, 0.3), update.root.opacity(0, 0.3), freshness.opacity(1, 0.4));
  yield* waitUntil('response-time');
  title.children(heading('paneli açınca\n', 'ne kadar bekliyoruz?').children());
  yield* response.opacity(1, 0.4);
  yield* waitUntil('open');
  yield* all(details.opacity(0, 0.3), loading.opacity(1, 0.3));
  yield* waitUntil('response');
  yield* all(details.opacity(1, 0.3), loading.opacity(0, 0.3));
  yield* waitUntil('stale');
  title.children(heading('hızlı geldi ama\n', 'güncel mi?').children());
  amounts[0](1200);
  freshLabel.fill(muted);
  freshNote.text('son satış hesapta yok');
  responseNote.text('panel hemen açıldı');
  yield* waitUntil('slow');
  title.children(heading('güncel olabilir.\n', 'ama çok bekleyebiliriz.').children());
  freshLabel.fill(accent);
  freshNote.text('en güncel kayıtlar kullanılıyor');
  responseLabel.fill(muted);
  responseNote.text('sonuç hâlâ hesaplanıyor…');
  yield* all(details.opacity(0, 0.3), loading.opacity(1, 0.3));
  yield* waitUntil('balanced');
  title.children(heading('hem güncel veri,\n', 'hem hızlı yanıt.').children());
  amounts[0](1385);
  responseLabel.fill(accent);
  freshNote.text('yeni satış da hesaba katıldı');
  responseNote.text('panel açılınca sonuç geldi');
  yield* all(details.opacity(1, 0.3), loading.opacity(0, 0.3));
  yield* waitUntil('end');
});
