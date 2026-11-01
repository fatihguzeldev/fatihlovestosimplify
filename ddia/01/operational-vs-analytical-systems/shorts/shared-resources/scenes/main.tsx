import { Layout, makeScene2D, Path, Rect } from '@motion-canvas/2d';
import { all, cancel, linear, loop, waitUntil } from '@motion-canvas/core';
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
  const title = heading('bu iki işi\n', 'aynı database’e yaptırırsak?');
  const order = paper(760, 155, '#101519');
  order.root.y(-420);
  const state = text('…', 43, { y: 31, fill: accent });
  order.root.add([text('sipariş #1042', 33, { y: -34 }), state]);
  const database = cartoonDatabase('sales database', accent);
  database.root.scale(1.35);
  const request = cartoonArrow('short-resources-read', [0, -310], [0, -165], accent, 0);
  const response = cartoonArrow('short-resources-response', [-220, -145], [-220, -310], accent, 0);
  const report = paper(760, 180, '#101519');
  report.root.y(600);
  const reportStatus = text('henüz çalışmıyor', 37, { y: 37, fill: muted });
  report.root.add([text('ocak satış raporu', 35, { y: -38 }), reportStatus]);
  const query = cartoonArrow('short-resources-report', [0, 475], [0, 255], accent, 0);
  const work = new Layout({ y: 35, opacity: 0 });
  const surface = paper(780, 640, '#101315');
  const record = paper(660, 72, '#17232f');
  record.root.y(-105);
  record.root.add(text('#1042 · preparing', 34, { fill: accent }));
  const scan = new Rect({
    position: [0, 75],
    width: 670,
    height: 32,
    fill: '#21364b',
    stroke: accent,
    lineWidth: 2,
  });
  const rows = new Layout({});
  for (let i = 0; i < 4; i++) {
    const y = 75 + i * 36;
    rows.add(
      new Path({
        data: `M -300 ${y} L -190 ${y + 1} M -130 ${y} L -24 ${y - 1} M 36 ${y} L 300 ${y + 1}`,
        stroke: muted,
        lineWidth: 2,
      }),
    );
  }
  const resources = new Layout({ opacity: 0 });
  resources.add([
    new Path({
      data: 'M -340 235 Q 0 242 340 235',
      stroke: foreground,
      lineWidth: 2.5,
    }),
    text('aynı CPU · bellek · disk', 37, { y: 277, fill: accent }),
  ]);
  work.add([
    surface.root,
    text('sales database', 33, { y: -268 }),
    text('getOrder(1042)', 36, { y: -180, fill: accent }),
    record.root,
    text('SUM(amount)', 36, { y: 5, fill: accent }),
    scan,
    rows,
    resources,
  ]);
  view.add([
    title,
    order.root,
    database.root,
    request.root,
    response.root,
    report.root,
    query.root,
    work,
  ]);
  yield* waitUntil('read');
  state.text('yanıt bekleniyor…');
  yield* request.reveal(1, 0.3);
  yield* request.travel(0.55);
  yield* request.arrive();
  yield* waitUntil('first-response');
  yield* response.reveal(1, 0.25);
  yield* response.travel(0.55);
  state.text('preparing');
  yield* response.arrive();
  yield* waitUntil('scan');
  reportStatus.text('yanıt bekleniyor…');
  yield* query.reveal(1, 0.3);
  yield* query.travel(0.55);
  yield* query.arrive();
  yield* waitUntil('detail');
  yield* all(
    database.root.opacity(0, 0.3),
    request.root.opacity(0, 0.3),
    response.root.opacity(0, 0.3),
    query.root.opacity(0, 0.3),
    work.opacity(1, 0.4),
  );
  reportStatus.text('tarama sürüyor…');
  const scanning = yield loop(function* () {
    scan.y(75);
    yield* scan.y(183, 2.6, linear);
    yield* scan.opacity(0, 0.15);
    scan.y(75);
    yield* scan.opacity(1, 0.15);
  });
  yield* waitUntil('resources');
  yield* resources.opacity(1, 0.4);
  yield* waitUntil('contention');
  title.children(heading('rapor çalışırken\n', 'sipariş de geliyor.').children());
  state.text('yanıt bekleniyor…');
  const reading = yield loop(() => record.face.stroke(accent, 0.6).to(foreground, 0.6));
  yield* waitUntil('order-response');
  cancel(reading);
  record.face.stroke(foreground);
  state.text('preparing');
  title.children(heading('siparişin yanıtı geldi.\n', 'rapor hâlâ çalışıyor.').children());
  yield* waitUntil('conclusion');
  title.children(heading('tamamlanma sürelerini\n', 'paylaşılan yük etkiliyor.').children());
  yield* resources.scale(1.025, 0.16).to(1, 0.24);
  yield* waitUntil('end');
  cancel(scanning);
});
