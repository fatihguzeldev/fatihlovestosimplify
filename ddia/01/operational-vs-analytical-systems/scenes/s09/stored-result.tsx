import {Layout, Line} from '@motion-canvas/2d';
import {all, waitFor, waitUntil} from '@motion-canvas/core';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {cartoonDatabase} from '../../../../../common/cartoon-system';
import {theme} from '../../theme';
import {accent, foreground, heading, muted, paper, text} from '../shared/drawing';
import {monthlyChart} from '../shared/workloads';

export function* storedResult(stage: Layout) {
  const title = heading('sonucu ', 'hazır tutsak?');
  const context = text('başka bir seçenek · aynı database içinde', 28, {position: [-806, -283], offset: [-1, 0], fill: muted});
  const database = cartoonDatabase('sales database', accent);
  database.root.position([-440, 80]);
  database.root.scale(1.9);
  database.caption.fontSize(30 / 1.9);
  database.root.add(text('sales', 25, {y: -13, fontFamily: theme.fontFamily.mono}));
  const totals = paper(174, 72, '#17232f');
  totals.root.position([0, 46]);
  totals.root.opacity(0);
  totals.root.add([
    text('monthly_totals', 16, {y: -19, fill: accent, fontFamily: theme.fontFamily.mono}),
    new Line({points: [[-70, -7], [70, -7]], stroke: muted, lineWidth: 1}),
    text('A 400 · B 300', 16, {y: 17, fontFamily: theme.fontFamily.mono}),
  ]);
  database.root.add(totals.root);
  const chart = monthlyChart();
  chart.root.position([440, 80]);
  chart.root.scale(0.85);
  const ready = paper(305, 82, '#17232f');
  ready.root.position([440, 316]);
  ready.root.opacity(0);
  ready.root.add(text('A 400 · B 300', 29, {fontFamily: theme.fontFamily.mono, fill: accent}));
  stage.add([title, context, database.root, chart.root, ready.root]);
  yield* stage.opacity(1, 0.45);
  yield* ready.root.opacity(1, 0.3);
  yield* waitFor(0.8);
  yield* all(ready.root.position([-440, 167], 0.85), ready.root.scale(0.75, 0.85));
  yield* all(ready.root.opacity(0, 0.15), totals.root.opacity(1, 0.25));
  yield* waitUntil('reuse');
  yield* all(title.opacity(0, 0.2), chart.root.opacity(0.3, 0.25));
  title.children(heading('bir sonraki okuma ', 'hazır sonucu', ' alır.').children());
  const read = cartoonArrow('s09-read-stored-total', [116, 45], [-182, 45], accent, 0);
  const reply = cartoonArrow('s09-stored-total-result', [-182, 207], [116, 207], accent, 0);
  const label = text('read monthly_totals', 23, {position: read.pointAt(0.5).addY(-82), fontFamily: theme.fontFamily.mono, opacity: 0});
  stage.add([read.root, reply.root, label]);
  yield* all(title.opacity(1, 0.3), read.reveal(1, 0.4), label.opacity(1, 0.3));
  yield* read.travel(0.6);
  yield* all(read.arrive(), totals.face.stroke(accent, 0.1).to(foreground, 0.3));
  yield* reply.reveal(1, 0.35);
  yield* reply.travel(0.6);
  yield* all(reply.arrive(), chart.root.opacity(1, 0.3));
  yield* waitUntil('responsibility');
  const benefit = text('hesabı tekrarlamıyoruz.', 32, {position: [-440, 416], fill: accent, fontStyle: 'italic', opacity: 0});
  const cost = text('sonucu güncel tutmalıyız.', 32, {position: [440, 416], opacity: 0});
  stage.add([benefit, cost]);
  yield* all(benefit.opacity(1, 0.35), cost.opacity(1, 0.35));
}
