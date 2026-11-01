import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createSignal, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { objectPools } from '../02-history/object-pools';
import { record, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import { readReference } from './reference-record';
import { nativeLookup } from './reference-lookup';
import { compactNumber } from './number-spacing';

export { wrongReference } from './reference-lookup';

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  const pools = objectPools();
  view.add(pools.root);
  yield loadFonts();

  yield* waitUntil('keepalive');
  yield* all(
    pools.tape.root.opacity(0, 0.35),
    ...pools.columns.map((column) => column.faces[1].stroke(palette.rule, 0.35)),
    ...pools.columns.map((column) => column.indices[1].fill(palette.ink, 0.35)),
  );

  // Array values stay visible above both temporary tables. A value being
  // serialized does not imply that it receives an object-reference number.
  // Spread this comparison after the inherited 02 pose, without shrinking its text.
  pools.tape.root.y(465);
  yield* all(
    ...pools.columns.flatMap((column) => [
      column.title.y(-400 - column.root.y(), 0.5),
      column.indexHeading.y(-45 - column.root.y(), 0.5),
      ...column.rows.map((row, i) => row.y(40 + i * 120 - column.root.y(), 0.5)),
    ]),
  );
  const arrays = [-370, 370].map((x, side) => {
    const root = new Layout({ position: [x, -245], opacity: 0 });
    const name = text(side ? 'yeni array' : 'ilk array', 0, -85, 25, palette.muted);
    const cartSlots = [-55, 55].map((x) => {
      const slot = new Layout({ x });
      slot.add([record(110, 72, 0, 0), text('cart', 0, 0, 24, palette.ink, true)]);
      return slot;
    });
    const bigint = new Layout({ opacity: 0 });
    const face = record(180, 72, 0, 0, palette.accent, palette.accentWash);
    const value = text('123n', 0, 0, 32, palette.accent, true);
    bigint.add([face, value]);
    root.add([name, ...cartSlots, bigint]);
    return { root, cartSlots, bigint, face, value };
  });
  const listNames = [-370, 370].map((x) => {
    const label = text('object listesi', x, -115, 26, palette.muted);
    label.opacity(0);
    return label;
  });

  // The reader's extra entry is a reference TO the existing value above it.
  // The BigInt never leaves either array or becomes a second cart.
  const temporary = new Layout({ position: [370, 280], opacity: 0 });
  const temporaryRow = record(480, 82, 0, 0, palette.accent);
  const temporaryIndex = text('2', -270, 0, 32, palette.accent, true);
  const temporaryValue = text('BigInt referansı', 0, 0, 30, palette.accent);
  temporary.add([temporaryRow, temporaryIndex, temporaryValue]);
  const referenceLink = wire(
    [
      [610, 280],
      [740, 280],
      [740, -170],
      [370, -170],
      [370, -207],
    ],
    palette.accent,
    2,
  );
  referenceLink.radius(12);
  referenceLink.end(0);
  pools.root.add([...arrays.map((array) => array.root), ...listNames, temporary, referenceLink]);

  yield* waitUntil('array-values');
  yield* all(
    ...arrays.map((array) => array.root.opacity(1, 0.45)),
    ...listNames.map((label) => label.opacity(1, 0.45)),
  );

  yield* waitUntil('insert-bigint');
  yield* all(
    ...arrays.flatMap((array) => [array.cartSlots[0].x(-225, 0.7), array.cartSlots[1].x(225, 0.7)]),
  );

  yield* waitUntil('show-bigint');
  yield* arrays[0].bigint.opacity(1, 0.4);

  yield* waitUntil('read-bigint');
  yield* arrays[1].bigint.opacity(1, 0.4);

  yield* waitUntil('name-bigint');
  yield* all(
    ...arrays.flatMap((array) => [
      array.face.stroke(palette.rule, 0.4),
      array.face.fill(palette.surface, 0.4),
      array.value.fill(palette.ink, 0.4),
    ]),
  );

  yield* waitUntil('reader-keepalive');
  yield* all(
    arrays[1].face.stroke(palette.accent, 0.3),
    arrays[1].face.fill(palette.accentWash, 0.3),
    arrays[1].value.fill(palette.accent, 0.3),
  );

  yield* waitUntil('reader-reference');
  yield* temporary.opacity(1, 0.4);
  yield* referenceLink.end(1, 0.7);
  const count = createSignal(2);
  const leftCount = text('', -370, 420, 34, palette.ink, true);
  const rightCount = text('', 370, 420, 34, palette.accent, true);
  compactNumber(
    leftCount,
    () => `${Math.round(count()).toLocaleString('en-US').replace(/,/g, '\u202f')} kayıt`,
  );
  compactNumber(
    rightCount,
    () => `${(Math.round(count()) + 1).toLocaleString('en-US').replace(/,/g, '\u202f')} kayıt`,
  );
  leftCount.opacity(0);
  rightCount.opacity(0);
  const unequal = text('≠', 0, 420, 48, palette.accent);
  unequal.opacity(0);
  pools.root.add([leftCount, rightCount, unequal]);

  yield* waitUntil('writer-count');
  yield* leftCount.opacity(1, 0.5);

  yield* waitUntil('count-diverges');
  yield* all(
    rightCount.opacity(1, 0.5),
    unequal.opacity(1, 0.5),
    temporaryRow.fill(palette.accentWash, 0.5),
  );

  const read = yield* readReference(
    view,
    pools,
    { left: leftCount, right: rightCount, total: count },
    temporaryValue,
  );
  yield* nativeLookup(view, read);
});
