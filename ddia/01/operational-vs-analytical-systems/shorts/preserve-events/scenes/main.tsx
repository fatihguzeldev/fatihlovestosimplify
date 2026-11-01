import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  foreground,
  heading,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('bir oturumda\n', 'üç hareket.');
  const source = paper(850, 400);
  source.root.position([0, -270]);
  const sourceName = text('uygulamadaki hareketler', 34, { y: -142, fill: muted });
  const values = [
    ['14:00:00', 'view', 'muz'],
    ['14:00:12', 'view', 'süt'],
    ['14:00:30', 'add_to_cart', 'muz'],
  ];
  const rows = values.map(([time, event, product], i) => {
    const root = new Layout({ y: -63 + i * 90, opacity: 0 });
    const stamp = text(time, 31, { x: -255 });
    const action = text(event, 32, { x: 12 });
    root.add([stamp, action, text(product, 36, { x: 285 })]);
    return { root, stamp, action };
  });
  source.root.add([sourceName, ...rows.map((row) => row.root)]);
  const report = paper(760, 210);
  report.root.position([0, 365]);
  report.root.opacity(0);
  const bananaCount = text('muz: 1', 42, { position: [-180, 33], fill: accent, opacity: 0 });
  const milkCount = text('süt: 1', 42, { position: [180, 33], fill: accent, opacity: 0 });
  report.root.add([text('görüntülenme raporu', 34, { y: -58 }), bananaCount, milkCount]);
  const count = cartoonArrow('preserve-events-count', [0, -30], [0, 230], accent, 0);
  const features = paper(760, 235);
  features.root.position([0, 470]);
  features.root.opacity(0);
  const featureValues = [
    text('2 görüntülenme', 37, { y: -35, opacity: 0 }),
    text('1 sepete ekleme', 37, { y: 20, opacity: 0 }),
    text('30 saniye', 37, { y: 75, fill: accent, opacity: 0 }),
  ];
  features.root.add([
    text('model input’u · aynı kaynaktan', 30, { y: -87, fill: muted }),
    ...featureValues,
  ]);
  const again = cartoonArrow('preserve-events-again', [438, -150], [438, 320], accent, 0);
  view.add([title, source.root, count.root, report.root, again.root, features.root]);
  yield loadFonts();
  for (const [index, cue] of ['view-banana', 'view-milk', 'add-cart'].entries()) {
    yield* waitUntil(cue);
    yield* rows[index].root.opacity(1, 0.25);
  }
  yield* waitUntil('events');
  sourceName.text('events.jsonl');
  yield* all(...rows.map((row) => row.action.fill(accent, 0.3)));
  yield* waitUntil('fields');
  yield* all(...rows.map((row) => row.stamp.fill(accent, 0.3)));
  yield* waitUntil('clickstream');
  sourceName.text('clickstream.jsonl');
  yield* waitUntil('report');
  title.children(heading('hangi ürün\n', 'kaç kez görüntülendi?').children());
  yield* report.root.opacity(1, 0.35);
  yield* waitUntil('count');
  yield* count.reveal(1, 0.3);
  yield* count.travel(0.8);
  yield* count.arrive();
  yield* waitUntil('banana-count');
  yield* bananaCount.opacity(1, 0.3);
  yield* waitUntil('milk-count');
  yield* milkCount.opacity(1, 0.3);
  yield* waitUntil('detail');
  title.children(heading('toplam burada.\n', 'diğer ayrıntılar kaynakta.').children());
  yield* all(rows[2].action.fill(accent, 0.3), ...rows.map((row) => row.stamp.fill(accent, 0.3)));
  yield* waitUntil('features');
  title.children(heading('aynı oturum,\n', 'başka bir ihtiyaç.').children());
  yield* all(
    source.root.y(-320, 0.7, easeInOutCubic),
    report.root.y(70, 0.7, easeInOutCubic),
    count.root.opacity(0, 0.3),
    features.root.opacity(1, 0.4),
  );
  yield* again.reveal(1, 0.3);
  yield* waitUntil('feature-views');
  yield* all(again.travel(0.5), featureValues[0].opacity(1, 0.3));
  yield* again.arrive();
  yield* waitUntil('feature-cart');
  yield* all(rows[2].action.fill(accent, 0.3), featureValues[1].opacity(1, 0.3));
  yield* waitUntil('feature-time');
  yield* all(...rows.map((row) => row.stamp.fill(accent, 0.3)), featureValues[2].opacity(1, 0.3));
  yield* waitUntil('representations');
  title.children(heading('aynı kaynaktan\n', 'iki farklı temsil.').children());
  yield* all(report.face.stroke(accent, 0.3), features.face.stroke(accent, 0.3));
  yield* waitUntil('lost');
  title.children(heading('yalnızca toplam kalsaydı,\n', 'bu ayrıntılar yoktu.').children());
  yield* all(
    report.face.stroke(foreground, 0.3),
    ...rows.map((row) => row.stamp.fill(accent, 0.3)),
    rows[2].action.fill(accent, 0.3),
  );
  yield* waitUntil('reprocess');
  title.children(heading('kaynak duruyorsa,\n', 'yeniden işleyebiliriz.').children());
  yield* source.face.stroke(accent, 0.3);
  yield* again.travel(1);
  yield* again.arrive();
  yield* waitUntil('warehouse');
  yield* sourceName.text('ayrıntılı kayıtlar warehouse’ta da tutulabilir', 0.35);
  sourceName.fontSize(28);
  yield* waitUntil('end');
});
