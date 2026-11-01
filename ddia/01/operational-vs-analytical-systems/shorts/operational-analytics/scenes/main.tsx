import { Layout, makeScene2D, Path, Rect } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  cartoonDatabase,
  foreground,
  heading,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(background);
  const title = heading('aynı data,\n', 'iki farklı soru.');
  const order = paper(760, 180, '#101519');
  order.root.y(-370);
  const orderStatus = text('…', 49, { y: 36, fill: accent });
  order.root.add([text('siparişim ne durumda?', 35, { y: -37 }), orderStatus]);
  const operational = text('operational work', 29, {
    position: [0, -245],
    fill: muted,
    opacity: 0,
  });
  const database = cartoonDatabase('sales database', accent);
  database.root.position([0, 50]);
  database.root.scale(1.25);
  const stored = text('#1042', 29, { y: 24, fill: accent });
  database.root.add(stored);
  const request = cartoonArrow('short-two-questions-read', [0, -220], [0, -105], accent, 0);
  const response = cartoonArrow('short-two-questions-order', [-220, -75], [-220, -230], accent, 0);
  const chart = new Layout({ opacity: 0 });
  const resultLabel = text('ocak satışları', 36, { position: [0, 355] });
  const analytical = text('analytical work', 29, {
    position: [0, 748],
    fill: muted,
    opacity: 0,
  });
  chart.add([
    resultLabel,
    new Path({
      data: 'M -330 640 Q 0 645 330 640',
      stroke: foreground,
      lineWidth: 2.5,
    }),
  ]);
  const bars = [400, 300].map((amount, i) => {
    const x = -170 + i * 340;
    const bar = new Rect({
      position: [x, 640],
      offset: [0, 1],
      width: 140,
      height: 0,
      fill: accent,
    });
    const value = text(`${amount}₺`, 43, {
      x,
      y: () => 603 - bar.height(),
      opacity: 0,
    });
    chart.add([bar, value, text(`mağaza ${i ? 'b' : 'a'}`, 30, { position: [x, 686] })]);
    return { bar, value, amount };
  });
  const query = cartoonArrow('short-two-questions-report', [215, 325], [215, 215], accent, 0);
  const result = cartoonArrow('short-two-questions-result', [-215, 215], [-215, 325], accent, 0);
  view.add([
    title,
    order.root,
    operational,
    database.root,
    request.root,
    response.root,
    chart,
    query.root,
    result.root,
    analytical,
  ]);
  yield* waitUntil('read');
  yield* request.reveal(1, 0.3);
  yield* request.travel(0.55);
  yield* request.arrive();
  yield* waitUntil('order-result');
  yield* response.reveal(1, 0.25);
  yield* response.travel(0.55);
  orderStatus.text('#1042 · created');
  yield* response.arrive();
  yield* waitUntil('operational');
  yield* operational.opacity(1, 0.35);
  yield* waitUntil('analytical-question');
  title.children(heading('ocakta hangi mağaza\n', 'ne kadar sattı?').children());
  stored.text('orders · sales');
  stored.fontSize(23);
  yield* all(chart.opacity(1, 0.4), order.root.opacity(0.55, 0.3));
  yield* waitUntil('report');
  yield* query.reveal(1, 0.3);
  yield* query.travel(0.55);
  yield* query.arrive();
  yield* waitUntil('report-result');
  yield* result.reveal(1, 0.25);
  yield* result.travel(0.55);
  yield* result.arrive();
  for (const [i, { bar, value, amount }] of bars.entries()) {
    yield* waitUntil(i ? 'store-b' : 'store-a');
    yield* all(bar.height(amount * 0.5, 0.65), value.opacity(1, 0.3));
  }
  yield* waitUntil('analytical');
  yield* analytical.opacity(1, 0.35);
  yield* waitUntil('compare');
  title.children(heading('aynı data,\n', 'iki farklı soru.').children());
  yield* all(order.root.opacity(1, 0.35), database.top.stroke(accent, 0.3));
  yield* waitUntil('end');
});
