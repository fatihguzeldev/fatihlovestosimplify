import {Layout, Path, type View2D} from '@motion-canvas/2d';
import {all, waitFor, waitUntil} from '@motion-canvas/core';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {cartoonService} from '../../../../../common/cartoon-system';
import {theme} from '../../theme';
import {accent, foreground, heading, muted, paper, text} from './drawing';

const orders = [
  {id: 1042, amount: 185, time: '10:00'},
  {id: 1043, amount: 260, time: '10:01'},
  {id: 1044, amount: 155, time: '10:02'},
];

export function* showProcessing(view: View2D) {
  const root = new Layout({opacity: 0});
  const title = heading('', 'her siparişte', ' toplamı güncelleyelim.');
  const receipts = orders.map((order, index) => {
    const card = paper(330, 88, '#13191f');
    card.root.position([-600, -45 + index * 130]);
    card.root.opacity(0);
    card.root.add([
      text(`#${order.id}`, 27, {position: [-141, -18], offset: [-1, 0], fontFamily: theme.fontFamily.mono}),
      text(order.time, 21, {position: [-141, 19], offset: [-1, 0], fontFamily: theme.fontFamily.mono, fill: muted}),
      text(`${order.amount} ₺`, 30, {position: [141, 0], offset: [1, 0], fontFamily: theme.fontFamily.mono, fill: accent}),
    ]);
    root.add(card.root);
    return card;
  });
  const {root: processor, caption, lights} = cartoonService('stream processing', accent);
  processor.position([0, 85]);
  processor.scale(0.84);
  caption.fontSize(30 / 0.84);
  const ledger = paper(350, 260, '#13191f');
  ledger.root.position([605, 85]);
  const total = text('0 ₺', 70, {y: -3, fontFamily: theme.fontFamily.mono, fill: accent});
  const updatedAt = text('—', 25, {y: 79, fontFamily: theme.fontFamily.mono, fill: muted});
  ledger.root.add([text('bugünkü satış', 30, {y: -177}), total, updatedAt]);
  const input = cartoonArrow('s02-order-stream', [-390, 85], [-153, 85], accent, 0);
  const output = cartoonArrow('s02-sales-total', [152, 85], [394, 85], accent, 0);
  root.add([title, processor, ledger.root, input.root, output.root, text('siparişler', 30, {position: [-600, -140]})]);
  view.add(root);
  yield* root.opacity(1, 0.5);
  yield* waitUntil('stream-events');
  let sum = 0;
  for (const [index, order] of orders.entries()) {
    yield* receipts[index].root.opacity(1, 0.3);
    if (index === 0) yield* input.reveal(1, 0.3);
    yield* input.travel(0.45);
    yield* all(input.arrive(), lights[index].opacity(1, 0.12).to(0.65, 0.2));
    if (index === 0) yield* output.reveal(1, 0.3);
    yield* output.travel(0.45);
    sum += order.amount;
    total.text(`${sum} ₺`);
    updatedAt.text(order.time);
    yield* all(output.arrive(), ledger.face.stroke(accent, 0.1).to(foreground, 0.25), receipts[index].root.opacity(0.55, 0.25));
    yield* waitFor(0.45);
  }
  yield* waitUntil('batch');
  yield* all(title.opacity(0, 0.2), caption.opacity(0, 0.2), total.opacity(0, 0.2), updatedAt.opacity(0, 0.2), input.root.opacity(0, 0.25), output.root.opacity(0, 0.25), ...receipts.map(card => card.root.opacity(0, 0.25)));
  title.children(heading('aynı siparişleri ', 'topluca işleyelim.').children());
  caption.text('batch processing');
  total.text('0 ₺');
  updatedAt.text('—');
  const bundle = new Path({data: 'M -421 -103 Q -404 -104 -404 -87 L -402 251 Q -403 272 -421 272', stroke: accent, lineWidth: 3, lineCap: 'round', end: 0});
  const schedule = text('5 dakikada bir', 27, {position: [0, -110], fill: accent, opacity: 0});
  root.add([bundle, schedule]);
  yield* all(title.opacity(1, 0.3), caption.opacity(1, 0.3), total.opacity(1, 0.3), updatedAt.opacity(1, 0.3), schedule.opacity(1, 0.3));
  for (const card of receipts) yield* card.root.opacity(1, 0.35);
  yield* bundle.end(1, 0.45);
  yield* all(input.root.opacity(1, 0.3), output.root.opacity(1, 0.3));
  yield* waitUntil('batch-run');
  yield* input.travel(0.65);
  yield* all(input.arrive(), ...lights.map(light => light.opacity(1, 0.15).to(0.65, 0.35)));
  yield* output.travel(0.65);
  total.text(`${orders.reduce((value, order) => value + order.amount, 0)} ₺`);
  updatedAt.text('10:05');
  yield* all(output.arrive(), ledger.face.stroke(accent, 0.1).to(foreground, 0.3), ...receipts.map(card => card.root.opacity(0.55, 0.3)));
  return root;
}
