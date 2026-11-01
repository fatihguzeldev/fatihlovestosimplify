import { makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  cartoonDatabase,
  cartoonService,
  heading,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(background);
  const title = heading('aynı sunucuya\n', 'dönmek zorunda mıyız?');
  const order = paper(720, 165, '#101519');
  order.root.y(-400);
  const state = text('created', 48, { y: 32, fill: accent });
  order.root.add([text('sipariş #1042', 36, { y: -34 }), state]);
  const server = cartoonService('sunucu 1', accent);
  server.root.scale(1.2);
  server.caption.position([238, 0]);
  server.caption.fontSize(28);
  const code = text('getOrder(id)', 35, { y: 180, fill: muted });
  const database = cartoonDatabase('sales database', accent);
  database.root.position([0, 470]);
  database.root.scale(1.25);
  const record = text('#1042 · created', 27, { y: 23, fill: accent });
  database.root.add(record);
  const request = cartoonArrow('short-stateless-request', [0, -295], [0, -155], accent);
  const query = cartoonArrow('short-stateless-query', [0, 235], [0, 315], accent, 0);
  const reply = cartoonArrow('short-stateless-reply', [-215, 385], [-215, 145], accent, 0);
  const response = cartoonArrow('short-stateless-response', [-215, -160], [-215, -290], accent, 0);
  const requestLabel = text('GET /orders/1042', 27, { position: [228, -240] });
  const stateless = text('stateless', 49, { position: [0, 748], fill: accent, opacity: 0 });
  view.add([
    title,
    order.root,
    server.root,
    code,
    database.root,
    request.root,
    query.root,
    reply.root,
    response.root,
    requestLabel,
    stateless,
  ]);
  yield* waitUntil('replace');
  yield* server.root.opacity(0, 0.25);
  server.caption.text('sunucu 2');
  yield* server.root.opacity(1, 0.35);
  yield* waitUntil('request');
  state.text('yükleniyor…');
  yield* request.travel(0.55);
  yield* request.arrive();
  yield* waitUntil('query');
  yield* query.reveal(1, 0.25);
  yield* query.travel(0.45);
  yield* query.arrive();
  yield* reply.reveal(1, 0.25);
  yield* reply.travel(0.45);
  yield* reply.arrive();
  yield* waitUntil('response');
  yield* response.reveal(1, 0.25);
  yield* response.travel(0.55);
  state.text('created');
  yield* response.arrive();
  yield* waitUntil('independent');
  title.children(heading('sunucu değişti.\n', 'sipariş hâlâ burada.').children());
  yield* all(request.root.opacity(0.2, 0.3), reply.root.opacity(0.2, 0.3));
  yield* waitUntil('stateless');
  yield* stateless.opacity(1, 0.4);
  yield* waitUntil('stored-state');
  yield* record.scale(1.12, 0.16).to(1, 0.24);
  yield* waitUntil('application');
  code.fill(accent);
  yield* server.root.scale(1.25, 0.16).to(1.2, 0.24);
  yield* waitUntil('end');
});
