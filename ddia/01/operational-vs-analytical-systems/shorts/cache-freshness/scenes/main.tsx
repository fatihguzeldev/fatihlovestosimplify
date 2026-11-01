import { Layout, makeScene2D, Path } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  heading,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';
import { deliveryMap } from '../../../scenes/s02/delivery';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(background);
  const title = heading('bir daha sorulursa,\n', 'cevabımız hazır olsun.');
  const map = deliveryMap();
  map.root.position([0, -220]);
  map.root.scale(1.65);
  const calculated = text('18 dk', 78, { position: [0, 160], fill: accent, opacity: 0 });
  const calculationLabel = text('hesaplanan tahmin', 34, {
    position: [0, 85],
    fill: muted,
  });
  const cache = paper(720, 190, '#101519');
  cache.root.position([0, 480]);
  const cached = text('…', 76, { position: [0, 20], fill: accent });
  cache.root.add([text('cache', 32, { y: -55 }), cached]);
  const save = cartoonArrow('short-cache-save', [0, 230], [0, 350], accent, 0);
  const saveLabel = text('sakla', 28, { position: [115, 290], opacity: 0 });
  const stale = text('18 dk  ≠  24 dk', 54, { position: [0, 650], opacity: 0 });
  const responsibility = new Layout({ opacity: 0, y: 685 });
  responsibility.add([
    new Path({
      data: 'M -335 -60 Q 0 -51 335 -58',
      stroke: accent,
      lineWidth: 4,
      lineCap: 'round',
    }),
    text('ne zaman yenilemeliyiz?', 42, { y: 0 }),
  ]);
  view.add([
    title,
    map.root,
    calculationLabel,
    calculated,
    cache.root,
    save.root,
    saveLabel,
    stale,
    responsibility,
  ]);
  yield* waitUntil('calculate');
  yield* map.route.end(1, 1.25);
  yield* calculated.opacity(1, 0.25);
  yield* waitUntil('cache');
  yield* all(save.reveal(1, 0.3), saveLabel.opacity(1, 0.3));
  yield* save.travel(0.45);
  cached.text('18 dk');
  yield* save.arrive();
  yield* waitUntil('reuse');
  yield* all(save.root.opacity(0.2, 0.25), saveLabel.opacity(0.3, 0.25));
  yield* cached.scale(1.08, 0.15).to(1, 0.25);
  yield* waitUntil('traffic');
  title.children(heading('yolda trafik\n', 'sıkıştı.').children());
  yield* map.traffic.opacity(1, 0.5);
  yield* waitUntil('recalculate');
  calculated.text('24 dk');
  yield* calculated.scale(1.12, 0.16).to(1, 0.24);
  yield* waitUntil('stale');
  title.children(heading('cache’teki cevap\n', 'artık güncel değil.').children());
  cache.face.stroke(accent);
  yield* stale.opacity(1, 0.3);
  yield* waitUntil('refresh');
  yield* all(stale.opacity(0, 0.25), responsibility.opacity(1, 0.4));
  yield* waitUntil('end');
});
