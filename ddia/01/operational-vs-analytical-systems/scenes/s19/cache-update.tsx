import { Layout, Rect, type Txt } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase, cartoonService } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, foreground, heading, muted, paper, text } from '../shared/drawing';
import { createMarket } from '../shared/market';

export function* updateCache(root: Layout, title: Txt) {
  title.children(heading('sipariş ', 'yola çıktı.').children());
  const market = createMarket();
  market.cart.remove();
  market.receipt.opacity(1);
  market.receiptTotal.text('165₺');
  market.receipt.add(text('tutar düzeltmesi · −20₺', 24, { y: 157, fill: accent }));
  market.root.position([-545, 90]);
  market.root.scale(0.95);
  market.label.opacity(0);
  const shown = market.status;
  shown.text('preparing');
  const service = cartoonService('order service', accent);
  service.root.position([-545, 95]);
  service.root.scale(1.65);
  const result = new Rect({ position: [4, -64], size: [184, 38], fill: '#101315' });
  const responseStatus = text('—', 25, { fill: accent, fontFamily: theme.fontFamily.mono });
  result.add(responseStatus);
  service.root.add(result);
  const cache = paper(500, 200, '#17232f');
  cache.root.position([530, -75]);
  const cached = text('preparing', 39, { y: 37, fill: accent, fontFamily: theme.fontFamily.mono });
  cache.root.add([
    text('cache · order:1042', 28, { y: -46, fontFamily: theme.fontFamily.mono }),
    cached,
  ]);
  const db = cartoonDatabase('sales database / orders', accent);
  db.root.position([530, 290]);
  db.root.scale(1.1);
  db.caption.fontSize(25);
  const status = text('preparing', 26, { y: 55, fill: accent, fontFamily: theme.fontFamily.mono });
  db.root.add([text('#1042', 30, { y: -3, fontFamily: theme.fontFamily.mono }), status]);
  const get = cartoonArrow('s19-order-cache-read', [-252, -75], [238, -75], accent, 0);
  const miss = cartoonArrow('s19-cache-miss-reply', [238, -75], [-252, -75], accent, 0);
  const read = cartoonArrow('s19-read-canonical-status', [-252, 178], [365, 220], accent, 0);
  const reply = cartoonArrow('s19-canonical-status-reply', [365, 315], [-252, 276], accent, 0);
  const cacheLabel = text('get("order:1042")', 26, {
    position: [-7, -177],
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const readLabel = text('read #1042', 27, {
    position: [56, 87],
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const replyLabel = text('shipped', 29, {
    position: [56, 399],
    fontFamily: theme.fontFamily.mono,
    fill: accent,
    opacity: 0,
  });
  root.add([
    service.root,
    cache.root,
    db.root,
    get.root,
    miss.root,
    read.root,
    reply.root,
    cacheLabel,
    readLabel,
    replyLabel,
  ]);
  yield* all(title.opacity(1, 0.3), root.opacity(1, 0.5));
  yield* waitFor(0.8);
  status.text('shipped');
  yield* db.top.stroke(accent, 0.15).to(foreground, 0.35);
  yield* waitUntil('invalidate');
  yield* title.opacity(0, 0.2);
  title.children(heading('eski cache kaydını ', 'kaldıralım.').children());
  cacheLabel.text('invalidate("order:1042")');
  yield* all(title.opacity(1, 0.3), cacheLabel.opacity(1, 0.3), get.reveal(1, 0.3));
  yield* get.travel(0.8);
  yield* all(get.arrive(), cache.face.stroke(accent, 0.3));
  yield* cached.opacity(0, 0.2);
  cached.text('—');
  cached.fill(muted);
  yield* cached.opacity(1, 0.2);
  yield* all(get.root.opacity(0, 0.25), cacheLabel.opacity(0, 0.25));
  get.reveal(0);
  get.root.opacity(1);
  yield* waitUntil('miss');
  yield* title.opacity(0, 0.2);
  title.children(heading('sonraki istekte ', 'cache miss.').children());
  cacheLabel.text('get("order:1042")');
  shown.text('…');
  yield* all(title.opacity(1, 0.3), cacheLabel.opacity(1, 0.3), get.reveal(1, 0.3));
  yield* get.travel(0.8);
  yield* get.arrive();
  get.root.opacity(0);
  cacheLabel.text('miss');
  cacheLabel.fill(accent);
  yield* miss.reveal(1, 0.25);
  yield* miss.travel(0.8);
  yield* miss.arrive();
  yield* waitUntil('read');
  yield* all(title.opacity(0, 0.2), miss.root.opacity(0, 0.25), cacheLabel.opacity(0, 0.25));
  title.children(heading('kaynağı okuyup ', 'yanıtlayalım.').children());
  yield* all(title.opacity(1, 0.3), read.reveal(1, 0.3), readLabel.opacity(1, 0.3));
  yield* read.travel(0.8);
  yield* read.arrive();
  yield* all(reply.reveal(1, 0.3), replyLabel.opacity(1, 0.3));
  yield* reply.travel(0.8);
  shown.text('shipped');
  responseStatus.text('shipped');
  yield* reply.arrive();
  yield* waitUntil('refill');
  yield* title.opacity(0, 0.2);
  title.children(heading('yeni değeri ', 'cache’e de yazalım.').children());
  get.root.opacity(1);
  cacheLabel.text('set("order:1042", "shipped")');
  cacheLabel.fontSize(23);
  cacheLabel.fill(foreground);
  yield* all(title.opacity(1, 0.3), cacheLabel.opacity(1, 0.3));
  yield* get.travel(0.8);
  cached.text('shipped');
  cached.fill(accent);
  yield* get.arrive();
  return { market, shown };
}
