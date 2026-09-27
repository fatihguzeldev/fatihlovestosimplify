import { Layout, Path, type View2D } from '@motion-canvas/2d';
import { all, easeOutCubic, sequence, waitFor, waitUntil } from '@motion-canvas/core';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { accent, foreground, heading, ink, text } from '../shared/drawing';
import { addingMachine, orderSlip, salesDisplay } from './processing-art';

const orders = [
  { id: 1042, amount: 185, time: '10:00', updated: '10:00’da güncellendi' },
  { id: 1043, amount: 260, time: '10:01', updated: '10:01’de güncellendi' },
  { id: 1044, amount: 155, time: '10:02', updated: '10:02’de güncellendi' },
];

export function* showProcessing(view: View2D) {
  const root = new Layout({ opacity: 0 });
  const title = heading('sipariş geldikçe ', 'toplam güncellensin.');
  const slips = orders.map((order, i) => {
    const slip = orderSlip(order.id, order.amount, order.time);
    slip.root.position([-606, -48 + i * 128]);
    slip.root.opacity(i === 0 ? 1 : 0);
    return slip;
  });
  const source = new Layout({});
  source.add([
    text('siparişler', 30, { position: [-606, -152] }),
    ...slips.map((slip) => slip.root),
  ]);
  const machine = addingMachine();
  const report = salesDisplay();
  const inputs = orders.map((order, i) =>
    cartoonArrow(`s02-stream-order-${order.id}`, [-393, -48 + i * 128], [-182, 80], accent, 0),
  );
  const batchInput = cartoonArrow('s02-batch-orders', [-366, 80], [-182, 80], accent, 0);
  const output = cartoonArrow('s02-stream-total-update', [197, 80], [400, 80], accent, 0);
  const schedule = new Layout({
    position: [0, 407],
    opacity: 0,
    layout: true,
    direction: 'row',
    alignItems: 'center',
    gap: 18,
  });
  const hand = new Path({
    ...ink,
    layout: false,
    stroke: accent,
    rotation: 30,
    data: 'M 0 -17 L 0 0',
  });
  const clock = new Layout({ width: 60, height: 68 });
  clock.add([
    new Path({
      ...ink,
      layout: false,
      stroke: accent,
      lineWidth: 2.3,
      data: 'M -2 -26 C -37 -28 -34 28 0 27 C 34 28 36 -26 -2 -26 M -10 -34 L 10 -34 M 0 -34 L 0 -27 M 0 0 L -11 -6',
    }),
    hand,
  ]);
  const scheduleLabel = text('10:05’te çalışacak', 24);
  schedule.add([clock, scheduleLabel]);
  const bundle = new Path({
    ...ink,
    position: [-399, 80],
    lineWidth: 2.4,
    data: 'M -17 -192 C 6 -198 13 -186 11 -165 L 7 -100 C 5 -59 4 -20 16 -4 L 20 0 L 14 7 C 2 25 7 64 7 104 L 11 177 C 13 197 0 205 -18 199 L -17 189 C -3 192 -3 177 -3 164 L -7 100 C -10 62 -7 25 2 0 C -10 -21 -9 -58 -7 -100 L -2 -166 C -1 -180 -8 -182 -17 -181 Z',
    end: 0,
  });
  bundle.opacity(() => (bundle.end() > 0 ? 1 : 0));
  const bundleHatching = new Path({
    ...ink,
    stroke: accent,
    lineWidth: 1.7,
    opacity: 0,
    data: 'M -9 -185 L -5 -190 M 1 -163 L 8 -173 M 0 -142 L 7 -153 M -2 -119 L 5 -131 M -3 -94 L 3 -104 M -3 -67 L 2 -79 M -2 -42 L 4 -54 M 2 -17 L 8 -28 M 8 1 L 14 -5 M 0 34 L 5 23 M -3 61 L 2 49 M -3 86 L 3 75 M -2 113 L 4 102 M 0 138 L 6 127 M 1 163 L 7 152 M 1 186 L 7 175 M -10 195 L -5 190',
  });
  bundle.add(bundleHatching);
  root.add([
    title,
    source,
    machine.root,
    report.root,
    ...inputs.map((input) => input.root),
    batchInput.root,
    output.root,
    bundle,
    schedule,
  ]);
  view.add(root);
  yield* root.opacity(1, 0.5);
  yield* waitUntil('stream-events');
  let sum = 0;
  let chart = 'M -134 122';
  for (const [i, order] of orders.entries()) {
    const slip = slips[i];
    const input = inputs[i];
    if (i > 0) yield* inputs[i - 1].root.opacity(0, 0.15);
    if (i === 0) {
      yield* slip.face.stroke(accent, 0.3);
    } else {
      slip.root.y(-40 + i * 128);
      slip.root.rotation(i % 2 ? 2 : -2);
      yield* all(
        slip.root.opacity(1, 0.25),
        slip.root.y(-48 + i * 128, 0.3, easeOutCubic),
        slip.root.rotation(0, 0.3),
        slip.face.stroke(accent, 0.3),
      );
    }
    yield* input.reveal(1, 0.25);
    yield* input.travel(0.5);
    machine.expression.text(`${sum} + ${order.amount}`);
    yield* all(input.arrive(), machine.display.lineWidth(3.5, 0.1).to(2, 0.2));
    yield* waitFor(0.25);
    yield* machine.equals.scale(0.86, 0.12).to(1, 0.18);
    const previous = sum;
    sum += order.amount;
    machine.result.text(`${sum}`);
    yield* slip.stamp.end(1, 0.2);
    if (i === 0) yield* output.reveal(1, 0.35);
    yield* output.travel(0.5);
    report.total.text(`${sum}₺`);
    report.count.text(`${i + 1} sipariş`);
    report.updated.text(order.updated);
    const x = -90 + i * 44.8;
    chart += ` L ${x} ${122 - (previous / 600) * 67} L ${x} ${122 - (sum / 600) * 67}`;
    report.chart.data(chart);
    report.chart.end(1);
    yield* all(
      output.arrive(),
      report.total.scale(1.04, 0.12).to(1, 0.2),
      report.face.stroke(accent, 0.12).to(foreground, 0.25),
      slip.face.stroke(foreground, 0.3),
    );
    yield* waitFor(0.55);
  }
  yield* waitUntil('batch');
  yield* all(
    title.opacity(0, 0.2),
    source.opacity(0, 0.25),
    machine.root.opacity(0, 0.25),
    report.root.opacity(0, 0.25),
    ...inputs.map((input) => input.root.opacity(0, 0.25)),
    output.root.opacity(0, 0.25),
  );
  title.children(heading('aynı siparişleri ', 'topluca işleyelim.').children());
  machine.mode.text('batch processing');
  machine.operation.text('sum(amount)');
  machine.expression.text('…');
  machine.result.text('0');
  report.total.text('0₺');
  report.count.text('0 sipariş');
  report.updated.text('güncelleme bekliyor');
  report.chart.end(0);
  for (const slip of slips) {
    slip.root.opacity(0);
    slip.stamp.end(0);
  }
  yield* all(
    title.opacity(1, 0.3),
    source.opacity(1, 0.3),
    machine.root.opacity(1, 0.3),
    report.root.opacity(1, 0.3),
  );
  yield* schedule.opacity(1, 0.3);
  for (const slip of slips) {
    yield* slip.root.opacity(1, 0.3);
    yield* waitFor(0.5);
  }
  yield* bundle.end(1, 0.35);
  yield* bundleHatching.opacity(1, 0.12);
  yield* waitUntil('batch-run');
  scheduleLabel.text('10:05');
  yield* all(clock.scale(1.08, 0.15).to(1, 0.2), scheduleLabel.fill(accent, 0.3));
  yield* batchInput.reveal(1, 0.3);
  yield* all(batchInput.travel(0.65), ...slips.map((slip) => slip.face.stroke(accent, 0.25)));
  machine.expression.text(orders.map((order) => order.amount).join(' + '));
  yield* batchInput.arrive();
  yield* waitFor(0.4);
  yield* machine.equals.scale(0.86, 0.12).to(1, 0.18);
  machine.result.text(`${sum}`);
  yield* sequence(0.08, ...slips.map((slip) => slip.stamp.end(1, 0.2)));
  yield* output.root.opacity(1, 0.3);
  yield* output.travel(0.65);
  report.total.text(`${sum}₺`);
  report.count.text(`${orders.length} sipariş`);
  report.updated.text('10:05’te güncellendi');
  report.chart.data('M -134 122 L 134 122 L 134 55');
  report.chart.end(1);
  yield* all(
    output.arrive(),
    report.total.scale(1.04, 0.12).to(1, 0.2),
    report.face.stroke(accent, 0.12).to(foreground, 0.3),
    schedule.opacity(0, 0.3),
    ...slips.map((slip) => slip.face.stroke(foreground, 0.3)),
  );
  return root;
}
