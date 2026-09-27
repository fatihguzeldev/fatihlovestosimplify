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
  const service = code.root;
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
  const zone = new Path({
    ...ink,
    data: 'M -105 369 Q -111 398 -86 398 L 309 402 Q 337 401 354 412 Q 371 401 398 403 L 814 398 Q 835 401 831 372',
    stroke: muted,
    lineWidth: 2.5,
    opacity: 0,
  });
  const backendLabel = text('backend', 30, { position: [363, 453], opacity: 0 });
  const frontendLabel = text('frontend', 30, { position: [-580, -126], opacity: 0 });
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
    zone,
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
  yield* all(frontendLabel.opacity(1, 0.35), frontendNote.opacity(1, 0.35));
  yield* waitFor(0.45);
  yield* all(zone.opacity(0.5, 0.4), backendLabel.opacity(1, 0.35));

  yield* waitUntil('stateless');
  yield* title.opacity(0, 0.2);
  title.children(heading('request biter, ', 'kayıt kalır.').children());
  const stateless = text('often stateless', 25, {
    position: [100, 309],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  stage.add(stateless);
  yield* all(
    title.opacity(1, 0.3),
    packet.root.opacity(0, 0.35),
    activeLine.opacity(0, 0.35),
    ...[request, query, row, response].map((arrow) => arrow.root.opacity(0, 0.35)),
    ...labels.map((label) => label.opacity(0, 0.25)),
  );
  packet.root.remove();
  yield* all(stateless.opacity(1, 0.35), top.stroke(accent, 0.15).to(foreground, 0.35));
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
    record.root.opacity(0.3, 0.3),
    stateless.opacity(0, 0.2),
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
    record.root.opacity(1, 0.3),
    zone.stroke(accent, 0.3),
    zone.opacity(1, 0.3),
    backendLabel.fill(accent, 0.3),
  );
  yield* waitUntil('next');
  yield* title.opacity(0, 0.2);
  title.children(heading('aynı veriyi ', 'başka kim', ' kullanıyor?').children());
  yield* all(
    title.opacity(1, 0.3),
    market.root.opacity(1, 0.3),
    zone.stroke(muted, 0.3),
    zone.opacity(0.5, 0.3),
    backendLabel.fill(foreground, 0.3),
  );
  yield* waitUntil('end');
});
