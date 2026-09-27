import { Layout, makeScene2D, Path, Rect } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import {
  accent,
  background,
  foreground,
  heading,
  ink,
  muted,
  paper,
  text,
} from '../shared/drawing';
import { createOrderEntry } from '../shared/market';

function groupBrace(x: number, width: number) {
  const half = width / 2;
  const root = new Layout({ position: [x, 386], opacity: 0 });
  const data = `M ${-half} -17 C ${-half - 7} 4 ${-half + 5} 14 ${-half + 28} 11
    L -82 7 C -46 4 -20 5 -4 17 L 2 22 L 10 14
    C 28 3 63 7 96 8 L ${half - 24} 12 C ${half + 1} 15 ${half + 12} 0 ${half + 6} -18
    L ${half - 4} -17 C ${half + 1} -3 ${half - 16} -3 ${half - 29} -3
    L 90 -7 C 48 -10 27 -7 2 3 C -20 -10 -53 -9 -83 -7
    L ${-half + 27} -2 C ${-half + 13} -1 ${-half + 10} -8 ${-half + 11} -17 Z`;
  const outline = new Path({ ...ink, lineWidth: 2.4, fill: background, data });
  const hatch = new Path({ data, clip: true });
  for (let i = 0, left = -half + 10; left < half; i++, left += 23) {
    hatch.add(
      new Path({
        ...ink,
        stroke: accent,
        lineWidth: 1.7,
        data: `M ${left} ${11 + (i % 3)} Q ${left + 5} 2 ${left + 9 + (i % 2) * 3} -7`,
      }),
    );
  }
  root.add([outline, hatch]);
  return { root, outline };
}

export default makeScene2D(function* (view) {
  view.fill(background);
  const stage = new Layout({});
  const title = heading('siparişim ', 'ne durumda?');
  const market = createOrderEntry();
  const statusFontSize = market.status.fontSize();
  market.status.fontSize(() => statusFontSize / market.root.scale.x());
  const cursor = new Path({
    ...ink,
    fill: background,
    position: [300, 330],
    opacity: 0,
    data: 'M 0 0 L 4 37 L 15 27 L 25 43 L 34 37 L 24 22 L 40 20 Z',
  });
  stage.add([title, market.root, cursor]);
  view.add(stage);
  yield loadFonts();
  yield* waitFor(0.6);
  yield* all(cursor.opacity(1, 0.2), cursor.position([195, 229], 0.65));
  yield* waitUntil('request');
  yield* market.open.fill(foreground, 0.1).to(accent, 0.15);
  yield* all(cursor.opacity(0, 0.18), market.entry.opacity(0, 0.18));
  cursor.remove();
  market.entry.remove();
  market.status.text('yükleniyor…');
  market.status.fontFamily(theme.fontFamily.sans);
  yield* market.receipt.opacity(1, 0.25);
  yield* all(market.root.position([-580, 80], 0.8), market.root.scale(0.72, 0.8));

  const code = paper(340, 270, '#10171d');
  let service = code.root;
  service.position([100, 80]);
  service.opacity(0);
  const activeLine = new Rect({
    position: [0, -9],
    size: [306, 77],
    radius: 6,
    fill: '#1c3045',
    opacity: 0,
  });
  service.add([
    activeLine,
    text('getOrder(id)', 25, {
      position: [-146, -94],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
      fill: accent,
    }),
    new Path({ ...ink, opacity: 0.2, lineWidth: 1.5, data: 'M -148 -57 Q 0 -55 148 -58' }),
    text('const order =', 22, {
      position: [-144, -26],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
    }),
    text('  await readOrder(id);', 22, {
      position: [-144, 7],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
    }),
    text('return order;', 22, {
      position: [-144, 57],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
    }),
    text('application code', 28, { y: 185 }),
  ]);
  const {
    root: database,
    top,
    caption: databaseCaption,
  } = cartoonDatabase('sales database', accent);
  database.position([680, 80]);
  database.scale(1.08);
  databaseCaption.fontSize(28 / 1.08);
  database.opacity(0);
  const record = paper(278, 72, '#15212d');
  record.root.position([680, 316]);
  record.root.add(text('#1042 · created', 23, { fontFamily: theme.fontFamily.mono, fill: accent }));
  record.root.opacity(0);
  const packet = paper(312, 66, '#17232f');
  packet.root.position([100, -165]);
  packet.root.opacity(0);
  packet.root.add(
    text('GET /orders/1042', 24, { fontFamily: theme.fontFamily.mono, fill: accent }),
  );
  const request = cartoonArrow('s03-http-request', [-307, 45], [-105, 45], accent, 0);
  const query = cartoonArrow('s03-read-order', [310, 45], [520, 45], accent, 0);
  const row = cartoonArrow('s03-order-row', [520, 175], [310, 175], accent, 0);
  const response = cartoonArrow('s03-http-response', [-105, 175], [-307, 175], accent, 0);
  const labels = [
    text('HTTP request', 23, { position: request.pointAt(0.5).addY(-75), opacity: 0 }),
    text('query', 24, { position: query.pointAt(0.5).addY(-75), opacity: 0 }),
    text('created', 24, {
      position: row.pointAt(0.5).addY(77),
      fontFamily: theme.fontFamily.mono,
      fill: accent,
      opacity: 0,
    }),
    text('HTTP response', 22, { position: response.pointAt(0.5).addY(77), opacity: 0 }),
  ];
  const frontendBrace = groupBrace(-580, 476);
  const backendBrace = groupBrace(310, 810);
  const backendLabel = text('backend', 30, { position: [310, 450], opacity: 0 });
  const frontendLabel = text('frontend', 30, { position: [-580, 450], opacity: 0 });
  const frontendNote = text('tarayıcıda çalışan kod', 25, {
    position: [-580, 308],
    fill: muted,
    opacity: 0,
  });
  stage.add([
    service,
    database,
    record.root,
    packet.root,
    request.root,
    query.root,
    row.root,
    response.root,
    ...labels,
    frontendBrace.root,
    backendBrace.root,
    backendLabel,
    frontendLabel,
    frontendNote,
  ]);
  yield* service.opacity(1, 0.4);
  yield* all(request.reveal(1, 0.4), labels[0].opacity(1, 0.3));
  yield* request.travel(0.65);
  yield* all(request.arrive(), packet.root.opacity(1, 0.3));

  yield* waitUntil('query');
  yield* all(activeLine.opacity(1, 0.25), database.opacity(1, 0.4), record.root.opacity(1, 0.4));
  yield* all(query.reveal(1, 0.4), labels[1].opacity(1, 0.3));
  yield* query.travel(0.65);
  yield* all(query.arrive(), top.stroke(accent, 0.12).to(foreground, 0.35));
  yield* all(row.reveal(1, 0.4), labels[2].opacity(1, 0.3));
  yield* row.travel(0.65);
  yield* all(row.arrive(), activeLine.y(57, 0.25), activeLine.height(48, 0.25));
  yield* waitUntil('response');
  yield* all(response.reveal(1, 0.4), labels[3].opacity(1, 0.3));
  yield* response.travel(0.65);
  market.status.fontFamily(theme.fontFamily.mono);
  market.status.text('created');
  market.receiptDetails.opacity(1);
  yield* all(response.arrive(), market.shell.stroke(accent, 0.12).to(foreground, 0.3));

  yield* waitUntil('roles');
  const flow = [
    packet.root,
    record.root,
    activeLine,
    ...[request, query, row, response].map((arrow) => arrow.root),
    ...labels,
  ];
  yield* all(...flow.map((node) => node.opacity(0, 0.35)));
  flow.forEach((node) => node.remove());
  yield* database.x(560, 0.55);
  yield* all(
    frontendBrace.root.opacity(1, 0.35),
    frontendLabel.opacity(1, 0.35),
    frontendNote.opacity(1, 0.35),
  );
  yield* waitFor(0.2);
  yield* all(backendBrace.root.opacity(1, 0.35), backendLabel.opacity(1, 0.35));

  yield* waitUntil('stateless');
  yield* title.opacity(0, 0.2);
  title.children(heading('aynı sunucuya ', 'dönmek zorunda mıyız?').children());
  const serverLabel = text('sunucu 1', 25, {
    position: [100, -100],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const refresh = new Path({
    ...ink,
    position: [240, -34],
    stroke: accent,
    lineWidth: 2.8,
    opacity: 0,
    data: 'M 13 -8 C 3 -25 -23 -15 -17 5 C -13 20 8 23 17 8 M 13 -20 L 15 -6 L 1 -8',
  });
  market.receipt.add(refresh);
  stage.add(serverLabel);
  yield* all(title.opacity(1, 0.3), serverLabel.opacity(1, 0.3), refresh.opacity(1, 0.3));
  yield* waitFor(0.8);
  const previousService = service;
  service = previousService.snapshotClone({ opacity: 0 });
  stage.add(service);
  yield* all(previousService.opacity(0, 0.25), serverLabel.opacity(0, 0.25));
  previousService.remove();
  serverLabel.text('sunucu 2');
  yield* all(service.opacity(1, 0.35), serverLabel.opacity(1, 0.35));
  yield* waitFor(0.55);
  cursor.position([-330, 160]);
  stage.add(cursor);
  yield* all(cursor.opacity(1, 0.2), cursor.position([-407, 79], 0.35));
  yield* refresh.stroke(foreground, 0.12).to(accent, 0.12);
  yield* cursor.opacity(0, 0.15);
  cursor.remove();
  market.status.fontFamily(theme.fontFamily.sans);
  market.status.text('yükleniyor…');
  const repeatRequest = cartoonArrow(
    's03-second-server-request',
    [-307, 45],
    [-105, 45],
    accent,
    0,
  );
  const repeatQuery = cartoonArrow('s03-second-server-query', [295, 10], [418, 55], accent, 0);
  const repeatRow = cartoonArrow('s03-second-server-row', [418, 155], [295, 115], accent, 0);
  const repeatResponse = cartoonArrow(
    's03-second-server-response',
    [-105, 175],
    [-307, 175],
    accent,
    0,
  );
  const repeatLabel = text('GET /orders/1042', 21, {
    position: repeatRequest.pointAt(0.5).addY(-78),
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const repeatFlow = [repeatRequest, repeatQuery, repeatRow, repeatResponse];
  stage.add([...repeatFlow.map((arrow) => arrow.root), repeatLabel]);
  for (const [index, arrow] of repeatFlow.entries()) {
    if (index === 0) yield* repeatLabel.opacity(1, 0.2);
    yield* arrow.reveal(1, 0.25);
    yield* arrow.travel(0.5);
    if (index === 3) {
      market.status.fontFamily(theme.fontFamily.mono);
      market.status.text('created');
    }
    yield* arrow.arrive(0.18);
    if (index === 1) yield* top.stroke(accent, 0.12).to(foreground, 0.25);
    yield* arrow.root.opacity(0, 0.15);
    arrow.root.remove();
    if (index === 0) {
      yield* repeatLabel.opacity(0, 0.15);
      repeatLabel.remove();
    }
  }
  yield* title.opacity(0, 0.2);
  title.children(heading('önceki isteği ', 'hatırlaması gerekmiyor.').children());
  const stateless = text('stateless', 27, { position: [100, 309], fill: accent, opacity: 0 });
  stage.add(stateless);
  yield* all(title.opacity(1, 0.3), stateless.opacity(1, 0.3));
  const local = paper(535, 215, '#17232f');
  local.root.y(10);
  local.root.opacity(0);
  local.root.add([
    text('localStorage', 32, { y: -49, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('lastOrderId: "1042"', 30, { y: 35, fontFamily: theme.fontFamily.mono }),
  ]);
  market.body.add(local.root);
  yield* waitUntil('client-data');
  yield* title.opacity(0, 0.2);
  title.children(heading('tarayıcı da ', 'data saklayabilir.').children());
  yield* all(
    title.opacity(1, 0.3),
    market.receipt.opacity(0, 0.25),
    service.opacity(0.3, 0.3),
    database.opacity(0.3, 0.3),
    stateless.opacity(0, 0.2),
    serverLabel.opacity(0, 0.3),
    refresh.opacity(0, 0.3),
    backendBrace.root.opacity(0.3, 0.3),
    backendLabel.opacity(0.3, 0.3),
  );
  yield* local.root.opacity(1, 0.4);
  yield* waitUntil('backend-focus');
  yield* all(title.opacity(0, 0.2), local.root.opacity(0, 0.25));
  title.children(heading('kitabın odağında ', 'backend', ' var.').children());
  yield* all(
    title.opacity(1, 0.3),
    market.receipt.opacity(1, 0.3),
    market.root.opacity(0.45, 0.3),
    service.opacity(1, 0.3),
    database.opacity(1, 0.3),
    backendBrace.outline.stroke(accent, 0.3),
    backendBrace.root.opacity(1, 0.3),
    backendLabel.opacity(1, 0.3),
    frontendBrace.root.opacity(0.45, 0.3),
    frontendLabel.opacity(0.45, 0.3),
    frontendNote.opacity(0.45, 0.3),
    backendLabel.fill(accent, 0.3),
  );
  yield* waitUntil('next');
  yield* title.opacity(0, 0.2);
  title.children(heading('aynı veriyi ', 'başka kim', ' kullanıyor?').children());
  yield* all(
    title.opacity(1, 0.3),
    market.root.opacity(1, 0.3),
    backendBrace.outline.stroke(foreground, 0.3),
    frontendBrace.root.opacity(1, 0.3),
    frontendLabel.opacity(1, 0.3),
    frontendNote.opacity(1, 0.3),
    backendLabel.fill(foreground, 0.3),
  );
  yield* waitUntil('end');
});
