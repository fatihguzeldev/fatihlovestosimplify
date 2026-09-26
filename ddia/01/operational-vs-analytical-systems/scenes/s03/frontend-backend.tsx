import { Layout, makeScene2D, Path } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase, cartoonService } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, paper, text } from '../shared/drawing';
import { createMarket } from '../shared/market';

export default makeScene2D(function* (view) {
  view.fill(background);
  const stage = new Layout({});
  const title = heading('hangi işe, ', 'hangi araç?');
  const market = createMarket();
  market.root.position([-470, 100]);
  market.cart.remove();
  market.receipt.opacity(1);
  const {
    root: database,
    top,
    caption: databaseCaption,
  } = cartoonDatabase('sales database', accent);
  database.position([550, 110]);
  database.scale(1.4);
  databaseCaption.fontSize(28 / 1.4);
  const bridgeArrow = cartoonArrow('s02-save-order', [-108, 80], [354, 80], accent);
  const bridgeCaption = text('neyi yönetmek gerekiyor?', 44, {
    position: [-806, 420],
    offset: [-1, 0],
    fontFamily: theme.fontFamily.serif,
    fontStyle: 'italic',
  });
  stage.add([title, market.root, database, bridgeArrow.root, bridgeCaption]);
  view.add(stage);
  yield loadFonts();
  yield* waitFor(0.6);
  yield* all(
    title.opacity(0, 0.25),
    bridgeArrow.root.opacity(0, 0.25),
    bridgeCaption.opacity(0, 0.25),
  );
  bridgeArrow.root.remove();
  bridgeCaption.remove();
  yield* market.label.opacity(0, 0.15);
  yield* all(
    market.root.position([-580, 110], 0.75),
    market.root.scale(0.72, 0.75),
    database.position([650, 110], 0.75),
    database.scale(1.08, 0.75),
  );
  market.label.text('frontend');
  market.label.fontSize(38);
  market.label.fill(foreground);
  market.status.fontSize(34);
  databaseCaption.fontSize(28 / 1.08);
  const zone = new Path({
    data: 'M -168 -50 L -167 -85 Q -170 -123 -130 -123 L 785 -120 Q 825 -121 822 -79 L 820 351 Q 821 386 782 385 L -131 387 Q -169 388 -168 353 L -168 310',
    stroke: muted,
    opacity: 0,
    lineWidth: 1.6,
    lineDash: [9, 10],
  });
  const backendLabel = text('backend', 30, { position: [325, -165], opacity: 0 });
  const {
    root: service,
    lights,
    caption: serviceCaption,
  } = cartoonService('application code', accent);
  service.position([100, 110]);
  service.scale(0.88);
  service.opacity(0);
  serviceCaption.fontSize(28 / 0.88);
  serviceCaption.y(188);
  const frontendNote = text('tarayıcıda çalışan kod', 26, {
    position: [-580, 321],
    fill: muted,
    opacity: 0,
  });
  stage.add([zone, backendLabel, service, frontendNote]);
  zone.moveToBottom();
  yield* all(
    service.opacity(1, 0.45),
    zone.opacity(0.35, 0.45),
    backendLabel.opacity(1, 0.3),
    market.label.opacity(1, 0.3),
  );
  yield* waitUntil('frontend');
  title.children(heading('bu ekranın ', 'arkasında', ' ne var?').children());
  yield* all(
    title.opacity(1, 0.35),
    frontendNote.opacity(1, 0.35),
    market.shell.stroke(accent, 0.2).to(foreground, 0.35),
  );

  const request = cartoonArrow('s03-http-request', [-307, 75], [-63, 75], accent, 0);
  const query = cartoonArrow('s03-read-order', [262, 75], [491, 75], accent, 0);
  const row = cartoonArrow('s03-order-row', [491, 215], [262, 215], accent, 0);
  const response = cartoonArrow('s03-http-response', [-63, 215], [-307, 215], accent, 0);
  const labels = [
    text('HTTP request', 23, { position: request.pointAt(0.5).addY(-78), opacity: 0 }),
    text('getOrder(1042)', 22, {
      position: query.pointAt(0.5).addY(-75),
      fontFamily: theme.fontFamily.mono,
      opacity: 0,
    }),
    text('created', 23, {
      position: row.pointAt(0.5).addY(73),
      fontFamily: theme.fontFamily.mono,
      fill: accent,
      opacity: 0,
    }),
    text('HTTP response', 22, { position: response.pointAt(0.5).addY(73), opacity: 0 }),
  ];
  const packet = paper(258, 90, '#17232f');
  packet.root.position([100, -67]);
  packet.root.opacity(0);
  packet.root.add([
    text('request', 24, { y: -20, fill: accent }),
    text('GET /orders/1042', 21, { y: 21, fontFamily: theme.fontFamily.mono }),
  ]);
  stage.add([request.root, query.root, row.root, response.root, ...labels, packet.root]);
  yield* waitUntil('request');
  yield* all(title.opacity(0, 0.2), frontendNote.opacity(0, 0.2));
  title.children(heading('siparişim ', 'ne durumda?').children());
  market.status.text('…');
  yield* all(title.opacity(1, 0.3), request.reveal(1, 0.4), labels[0].opacity(1, 0.3));
  yield* request.travel(0.65);
  yield* all(request.arrive(), packet.root.opacity(1, 0.3));
  yield* waitUntil('query');
  yield* all(query.reveal(1, 0.4), labels[1].opacity(1, 0.3));
  yield* query.travel(0.65);
  yield* all(query.arrive(), top.stroke(accent, 0.12).to(foreground, 0.35));
  yield* all(row.reveal(1, 0.4), labels[2].opacity(1, 0.3));
  yield* row.travel(0.65);
  yield* all(row.arrive(), lights[1].opacity(1, 0.12).to(0.65, 0.25));
  yield* waitUntil('response');
  yield* all(response.reveal(1, 0.4), labels[3].opacity(1, 0.3));
  yield* response.travel(0.65);
  market.status.text('created');
  yield* all(response.arrive(), market.shell.stroke(accent, 0.12).to(foreground, 0.3));

  yield* waitUntil('stateless');
  yield* title.opacity(0, 0.2);
  title.children(heading('request biter, ', 'kayıt kalır.').children());
  const stateless = text('often stateless', 25, {
    position: [100, 326],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  stage.add(stateless);
  yield* all(
    title.opacity(1, 0.3),
    packet.root.opacity(0, 0.5),
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
    zone.stroke(accent, 0.3),
    zone.opacity(0.7, 0.3),
    backendLabel.fill(accent, 0.3),
  );
  yield* waitUntil('next');
  yield* title.opacity(0, 0.2);
  title.children(heading('aynı veriyi ', 'başka kim', ' kullanıyor?').children());
  yield* all(
    title.opacity(1, 0.3),
    market.root.opacity(1, 0.3),
    zone.stroke(muted, 0.3),
    zone.opacity(0.35, 0.3),
    backendLabel.fill(foreground, 0.3),
  );
  yield* waitUntil('end');
});
