import { Layout, Line, makeScene2D } from '@motion-canvas/2d';
import { all, createSignal, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, bytes, label, palette, panel, replace } from '../../shared/portrait';

function objectList(title: string, y: number) {
  const root = new Layout({ y });
  const heading = label(title, 0, -190, 46, palette.muted);
  const face = panel(760, 300, 0, 0);
  const rows = ['0   array', '1   cart', '2   BigInt referansı'].map((value, i) =>
    label(value, 0, -90 + i * 90, 44, i === 2 ? palette.accent : palette.ink, true),
  );
  rows[2].opacity(0);
  const count = createSignal(2);
  const number = label('', 0, 210, 44, palette.ink, true);
  number.text(() => `${Math.round(count()).toLocaleString('en-US').replace(/,/g, ' ')} kayıt`);
  const width = label('2 byte', 220, 0, 44, palette.accent, true);
  width.opacity(0);
  const chooses = arrow([
    [10, 0],
    [110, 0],
  ]);
  chooses.opacity(0);
  root.add([face, ...rows, heading, number, chooses, width]);
  return { root, heading, face, rows, count, number, width, chooses };
}

function widthRule(range: string, width: string, y: number) {
  const root = new Layout({ y, opacity: 0 });
  root.add([
    label(range, -170, 0, 38, palette.muted, true),
    arrow([
      [20, 0],
      [110, 0],
    ]),
    label(width, 235, 0, 44, palette.ink, true),
  ]);
  return root;
}

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(palette.paper);
  const array = bytes(['cart', '123n', 'cart'], 0, -605, 230);
  const arrayName = label('array', 0, -690, 44, palette.muted);
  array.root.opacity(0);
  arrayName.opacity(0);
  const primitive = label('primitive', 0, -515, 40, palette.accent, true);
  primitive.opacity(0);
  array.cells[1].opacity(0);
  array.values[1].opacity(0);
  const writer = objectList('yazarken', -260);
  writer.root.y(330);
  writer.rows[0].opacity(0);
  writer.rows[1].opacity(0);
  writer.count(0);
  const reader = objectList('okurken', 330);
  writer.root.opacity(0);
  reader.root.opacity(0);
  const cart = new Layout({ y: -265 });
  cart.add([
    panel(650, 190, 0, 0),
    label('cart', 0, -145, 46),
    label('price: 120', 0, -40, 44, palette.muted, true),
    label('quantity: 3', 0, 40, 44, palette.ink, true),
  ]);
  const cartPaths = [-1, 1].map((side) =>
    arrow([
      [side * 230, -559],
      [side * 230, -470],
      [side * 300, -470],
      [side * 300, -360],
    ]),
  );
  cartPaths.forEach((path) => path.end(0));
  const command = label('history.replaceState(data, "")', 0, -55, 38, palette.accent, true);
  command.opacity(0);
  const reference = new Layout({ y: 140, opacity: 0 });
  const referenceName = label('referans', 0, -110, 44, palette.muted);
  const referenceValue = label('1', 0, 0, 70, palette.ink, true);
  reference.add([panel(520, 110, 0, 0), referenceName, referenceValue]);
  const two = widthRule('256–65 535', '2 byte', 425);
  const four = widthRule('65 536+', '4 byte', 560);

  const tape = bytes(['01', '00', '00', '80'], 0, -120, 170);
  tape.root.opacity(0);
  const firstTwo = new Line({
    points: [
      [-340, -200],
      [-340, -230],
      [0, -230],
      [0, -200],
    ],
    stroke: palette.muted,
    lineWidth: 3,
    opacity: 0,
  });
  const twoName = label('2 byte', -170, -285, 44, palette.muted);
  twoName.opacity(0);
  const other = label('sonraki alan', 170, 45, 38, palette.muted);
  other.opacity(0);
  const readRange = panel(340, 120, -170, -120, palette.accent, 'transparent');
  readRange.opacity(0);
  const fourName = label('4 byte', 0, -20, 44, palette.accent);
  fourName.opacity(0);
  const byteScene = new Layout({ y: 550 });
  byteScene.add([tape.root, firstTwo, twoName, other, readRange, fourName]);
  // The actual mismatch is visible before its cause is unpacked.
  tape.root.opacity(1);
  firstTwo.opacity(1);
  twoName.text('yazılan: 2 byte');
  twoName.opacity(1);
  readRange.width(680);
  readRange.x(0);
  readRange.opacity(1);
  fourName.text('okunan: 4 byte');
  fourName.opacity(1);
  const result = new Layout({ y: 385, opacity: 0 });
  result.add([
    label('okunan referans', 0, -120, 44, palette.muted),
    panel(760, 150, 0, 0, palette.accent),
    label('2 147 483 649', 0, 0, 54, palette.accent, true),
  ]);
  view.add([
    array.root,
    arrayName,
    cart,
    ...cartPaths,
    command,
    primitive,
    writer.root,
    reader.root,
    reference,
    two,
    four,
    byteScene,
    result,
  ]);

  yield* waitUntil('array');
  yield* all(array.root.opacity(1, 0.3), arrayName.opacity(1, 0.3));
  yield* waitUntil('same-cart');
  yield* all(...cartPaths.map((path) => path.end(1, 0.4)));
  yield* waitUntil('save-history');
  yield* command.opacity(1, 0.25);
  yield* waitUntil('read-history');
  yield* replace(command, 'history.state');
  yield* waitUntil('tracking');
  yield* all(command.opacity(0, 0.25), byteScene.opacity(0, 0.25));
  byteScene.y(0);
  tape.root.opacity(0);
  firstTwo.opacity(0);
  twoName.text('2 byte');
  twoName.opacity(0);
  readRange.width(340);
  readRange.x(-170);
  readRange.opacity(0);
  fourName.text('4 byte');
  fourName.opacity(0);
  yield* writer.root.opacity(1, 0.35);
  yield* waitUntil('list-array');
  yield* all(writer.rows[0].opacity(1, 0.3), writer.count(1, 0.3));
  yield* waitUntil('list-cart');
  yield* all(writer.rows[1].opacity(1, 0.3), writer.count(2, 0.3));
  command.text('ref: 1 → cart');
  yield* command.opacity(1, 0.25);

  yield* waitUntil('bigint');
  yield* all(
    cart.opacity(0, 0.25),
    command.opacity(0, 0.25),
    ...cartPaths.map((path) => path.opacity(0, 0.25)),
  );
  yield* writer.root.y(-260, 0.5);
  yield* all(array.cells[1].opacity(1, 0.3), array.values[1].opacity(1, 0.3));
  yield* waitUntil('primitive');
  yield* primitive.opacity(1, 0.3);
  yield* waitUntil('write-value');
  yield* all(writer.root.opacity(1, 0.4), reader.root.opacity(1, 0.4));
  yield* waitUntil('reader-reference');
  yield* all(
    reader.rows[2].opacity(1, 0.35),
    reader.face.stroke(palette.accent, 0.35),
    array.cells[1].stroke(palette.accent, 0.35),
    array.values[1].fill(palette.accent, 0.35),
  );
  yield* waitUntil('extra-entry');
  yield* reader.count(3, 0.35);
  reader.number.fill(palette.accent);

  yield* waitUntil('width-rule');
  yield* all(
    array.root.opacity(0, 0.3),
    arrayName.opacity(0, 0.3),
    primitive.opacity(0, 0.3),
    ...[...writer.rows, ...reader.rows].map((row) => row.opacity(0, 0.3)),
  );
  yield* all(
    writer.root.y(-470, 0.5),
    reader.root.y(-170, 0.5),
    ...[writer, reader].flatMap((list) => [
      list.face.height(150, 0.5),
      list.heading.y(-120, 0.5),
      list.number.y(0, 0.5),
    ]),
    reference.opacity(1, 0.4),
    two.opacity(1, 0.4),
  );
  yield* waitUntil('four-byte-rule');
  yield* four.opacity(1, 0.4);

  yield* waitUntil('grow-lists');
  yield* all(writer.count(65535, 0.8), reader.count(65536, 0.8));
  yield* waitUntil('writer-two');
  yield* writer.number.x(-165, 0.35);
  yield* all(writer.chooses.opacity(1, 0.25), writer.width.opacity(1, 0.25));
  yield* waitUntil('reader-four');
  reader.width.text('4 byte');
  yield* reader.number.x(-165, 0.35);
  yield* all(reader.chooses.opacity(1, 0.25), reader.width.opacity(1, 0.25));

  yield* waitUntil('bytes');
  yield* all(
    writer.root.opacity(0, 0.3),
    reader.root.opacity(0, 0.3),
    two.opacity(0, 0.3),
    four.opacity(0, 0.3),
  );
  referenceName.text('yazılan referans');
  yield* reference.y(-580, 0.5);
  byteScene.opacity(1);
  yield* tape.root.opacity(1, 0.25);
  yield* waitUntil('written-two');
  yield* all(firstTwo.opacity(1, 0.3), twoName.opacity(1, 0.3));
  yield* waitUntil('next-field');
  yield* other.opacity(1, 0.3);
  yield* waitUntil('read-four');
  yield* all(readRange.opacity(1, 0.25), fourName.opacity(1, 0.25));
  yield* all(
    readRange.width(680, 0.65),
    readRange.x(0, 0.65),
    ...tape.cells.map((cell) => cell.stroke(palette.accent, 0.65)),
  );
  yield* waitUntil('wrong-reference');
  yield* result.opacity(1, 0.4);
  yield* waitUntil('end');
});
