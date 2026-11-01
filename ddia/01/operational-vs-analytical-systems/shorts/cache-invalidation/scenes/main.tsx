import { makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  cartoonDatabase,
  cartoonService,
  foreground,
  heading,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('sipariş ', 'yola çıktı.');
  const database = cartoonDatabase('asıl kayıt · #1042', accent);
  database.root.position([-245, -190]);
  database.root.scale(1.25);
  database.caption.fontSize(26);
  const canonical = text('preparing', 27, { y: 24, fontFamily: 'IBM Plex Mono' });
  database.root.add(canonical);

  const cache = paper(370, 220, '#17232f');
  cache.root.position([225, 180]);
  cache.root.add(text('cache · order:1042', 26, { y: -65, fontFamily: 'IBM Plex Mono' }));
  const cached = text('preparing', 39, { y: 17, fill: accent, fontFamily: 'IBM Plex Mono' });
  cache.root.add(cached);
  const service = cartoonService('order service', accent);
  service.root.position([-245, 425]);
  service.root.scale(0.95);

  const request = cartoonArrow('short-cache-request', [-83, 376], [60, 264], accent, 0);
  const miss = cartoonArrow('short-cache-miss', [75, 300], [-65, 452], accent, 0);
  const read = cartoonArrow('short-cache-read-source', [-300, 290], [-300, 50], accent, 0);
  const response = cartoonArrow('short-cache-source-reply', [-125, 50], [-125, 290], accent, 0);
  const operation = text('', 27, {
    position: [135, 405],
    fontFamily: 'IBM Plex Mono',
    fill: accent,
  });
  const readLabel = text('read #1042', 27, { position: [-355, 168], rotation: -90, opacity: 0 });
  const replyLabel = text('shipped', 29, {
    position: [-65, 172],
    rotation: 90,
    fill: accent,
    opacity: 0,
  });
  const result = text('', 50, { position: [0, 725], fill: accent });
  view.add([
    title,
    database.root,
    cache.root,
    service.root,
    request.root,
    miss.root,
    read.root,
    response.root,
    operation,
    readLabel,
    replyLabel,
    result,
  ]);
  yield loadFonts();

  yield* waitUntil('shipped');
  canonical.text('shipped');
  yield* all(canonical.fill(accent, 0.25), database.top.stroke(accent, 0.25));
  yield* waitUntil('stale');
  title.children(heading('cache’in ', 'haberi yok.').children());
  yield* cache.face.stroke(accent, 0.25);

  yield* waitUntil('invalidate');
  title.children(heading('eski cache kaydını ', 'geçersiz kılalım.').children());
  operation.text('invalidate()');
  yield* request.reveal(1, 0.25);
  yield* request.travel(0.7);
  yield* request.arrive();
  yield* waitUntil('invalidated');
  yield* cached.opacity(0, 0.2);
  cached.text('—');
  cached.fill(muted);
  yield* all(cached.opacity(1, 0.2), request.root.opacity(0, 0.2), operation.opacity(0, 0.2));
  request.reveal(0);
  request.root.opacity(1);

  yield* waitUntil('get');
  operation.text('get()');
  operation.opacity(1);
  yield* request.reveal(1, 0.25);
  yield* request.travel(0.7);
  yield* request.arrive();
  yield* waitUntil('miss');
  title.children(heading('cache miss. ', 'kaynağa dönüyoruz.').children());
  request.root.opacity(0);
  operation.text('miss');
  yield* miss.reveal(1, 0.2);
  yield* miss.travel(0.65);
  yield* miss.arrive();
  yield* waitUntil('read');
  yield* all(
    miss.root.opacity(0, 0.2),
    operation.opacity(0, 0.2),
    read.reveal(1, 0.25),
    readLabel.opacity(1, 0.25),
  );
  yield* read.travel(0.7);
  yield* read.arrive();
  yield* waitUntil('response');
  yield* all(response.reveal(1, 0.25), replyLabel.opacity(1, 0.25));
  yield* response.travel(0.7);
  yield* response.arrive();
  yield* waitUntil('result');
  result.text('yanıt: shipped');

  yield* waitUntil('refill');
  request.reveal(0);
  request.root.opacity(1);
  operation.text('set(shipped)');
  operation.opacity(1);
  yield* all(
    read.root.opacity(0.25, 0.2),
    response.root.opacity(0.25, 0.2),
    readLabel.opacity(0.25, 0.2),
    replyLabel.opacity(0.25, 0.2),
    request.reveal(1, 0.25),
  );
  yield* request.travel(0.7);
  yield* request.arrive();
  yield* waitUntil('refilled');
  cached.text('shipped');
  yield* cached.fill(accent, 0.25);
  title.children(heading('sonraki okuma da ', 'güncel.').children());
  yield* all(operation.fill(foreground, 0.25), service.root.opacity(0.8, 0.25));
  yield* waitUntil('end');
});
