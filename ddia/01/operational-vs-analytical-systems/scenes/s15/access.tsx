import { Layout, Path, type Txt } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, paper, text } from '../shared/drawing';
import { role } from '../shared/people';

export function* accessExample(stage: Layout, title: Txt) {
  const analyst = role('analyst', '', 1);
  analyst.position([-520, -115]);
  analyst.opacity(1);
  const editor = paper(590, 320, '#101315');
  editor.root.position([-555, 100]);
  const firstLine = text('SELECT amount', 24, {
    position: [-247, -55],
    offset: [-1, 0],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
  });
  const secondLine = text('FROM sales WHERE id = 1042;', 24, {
    position: [-247, -12],
    offset: [-1, 0],
    fontFamily: theme.fontFamily.mono,
  });
  const result = text('—', 40, {
    position: [-247, 97],
    offset: [-1, 0],
    fill: muted,
    fontFamily: theme.fontFamily.mono,
  });
  editor.root.add([
    text('query', 24, {
      position: [-247, -117],
      offset: [-1, 0],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    firstLine,
    secondLine,
    new Path({ data: 'M -249 32 L 245 32', stroke: foreground, lineWidth: 1.5, opacity: 0.25 }),
    result,
  ]);
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([580, 130]);
  warehouse.root.scale(1.55);
  const storedAmount = text('amount: 185', 26, {
    y: 39,
    fill: accent,
    fontFamily: theme.fontFamily.mono,
  });
  warehouse.root.add([
    text('sales · #1042', 23, { y: -19, fontFamily: theme.fontFamily.mono }),
    storedAmount,
  ]);
  const policy = text('analyst · read only', 27, {
    position: [580, -87],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
  });
  const request = cartoonArrow('s15-analyst-read-permission', [-211, 25], [340, 25], accent, 0);
  const response = cartoonArrow('s15-analyst-query-result', [340, 230], [-211, 230], accent, 0);
  const operation = text('SELECT', 28, {
    position: [65, -66],
    fontFamily: theme.fontFamily.mono,
    opacity: () => request.reveal(),
  });
  const returned = text('185', 29, {
    position: [65, 315],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: () => response.reveal(),
  });
  const lock = new Layout({ position: [370, 25], scale: 0.7, opacity: 0 });
  lock.add([
    new Path({
      data: 'M -11 -3 L -11 -19 Q -11 -33 2 -32 Q 14 -31 13 -17 L 13 -3',
      stroke: accent,
      lineWidth: 3,
      lineCap: 'round',
    }),
    new Path({
      data: 'M -22 -4 L 23 -3 L 22 30 L -21 29 Z M 1 9 L 1 18',
      stroke: accent,
      fill: background,
      lineWidth: 3,
      lineJoin: 'round',
    }),
  ]);
  const unchanged = text('kayıt değişmedi.', 29, { position: [580, 420], fill: muted, opacity: 0 });
  stage.add([
    analyst,
    editor.root,
    warehouse.root,
    policy,
    request.root,
    response.root,
    operation,
    returned,
    lock,
    unchanged,
  ]);
  stage.opacity(0);
  title.children(heading('bu rolde yalnızca ', 'okuma izni', ' var.').children());
  yield* all(title.opacity(1, 0.3), stage.opacity(1, 0.5));
  yield* waitUntil('read-query');
  yield* request.reveal(1, 0.3);
  yield* request.travel(0.65);
  yield* request.arrive();
  yield* waitUntil('read-response');
  yield* response.reveal(1, 0.3);
  yield* response.travel(0.65);
  result.text('185');
  result.fill(accent);
  yield* response.arrive();
  yield* waitUntil('write-access');
  yield* all(
    title.opacity(0, 0.2),
    request.root.opacity(0, 0.2),
    response.root.opacity(0, 0.2),
    operation.opacity(0, 0.2),
    returned.opacity(0, 0.2),
    result.opacity(0, 0.2),
  );
  title.children(heading('değiştirmek isterse ', 'izin verilmiyor.').children());
  firstLine.text('UPDATE sales SET amount = 999');
  secondLine.text('WHERE id = 1042;');
  operation.text('UPDATE');
  operation.opacity(() => request.reveal());
  request.reveal(0);
  request.root.opacity(1);
  result.text('permission denied');
  result.fontSize(29);
  yield* title.opacity(1, 0.3);
  yield* waitUntil('write-query');
  yield* request.reveal(1, 0.3);
  yield* request.travel(0.65);
  yield* request.arrive();
  yield* waitUntil('write-denied');
  yield* lock.opacity(1, 0.15);
  response.reveal(0);
  response.root.opacity(1);
  returned.text('permission denied');
  returned.fontSize(24);
  returned.opacity(() => response.reveal());
  yield* response.reveal(1, 0.3);
  yield* response.travel(0.65);
  yield* all(response.arrive(), result.opacity(1, 0.25));
  yield* waitUntil('write-unchanged');
  yield* all(unchanged.opacity(1, 0.25), storedAmount.scale(1.08, 0.2).to(1, 0.3));
  yield* waitUntil('access-summary');
  yield* title.opacity(0, 0.2);
  title.children(heading('okumak ve değiştirmek için ', 'ayrı izinler.').children());
  yield* title.opacity(1, 0.3);
}
