import { Layout, type Txt, type View2D } from '@motion-canvas/2d';
import { all, type SimpleSignal, waitUntil } from '@motion-canvas/core';
import type { objectPools } from '../02-history/object-pools';
import { record, strip, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import { wrongReference } from './reference-lookup';
import { compactNumber } from './number-spacing';

export type ReadReference = {
  root: Layout;
  explanation: Layout;
  lookup: ReturnType<typeof wrongReference>;
  value: Txt;
  label: Txt;
  face: ReturnType<typeof record>;
};

type ReferenceCounts = { left: Txt; right: Txt; total: SimpleSignal<number> };

/** Keep 1 → cart above the format decision; this same list later receives the bad index. */
function* chooseReferenceWidth(
  view: View2D,
  pools: ReturnType<typeof objectPools>,
  counts: ReferenceCounts,
  extraReference: Txt,
) {
  yield* waitUntil('width-rule');
  const root = new Layout({ opacity: 0 });
  const explanation = new Layout({});
  const lookup = wrongReference();
  lookup.title.text('okuyucunun object listesi');
  lookup.root.y(-300);
  lookup.title.y(-160);
  for (const node of [
    lookup.before,
    lookup.beforeName,
    lookup.wrongIndex,
    lookup.path,
    lookup.start,
    lookup.startName,
    lookup.outsideValue,
  ])
    node.opacity(0);
  lookup.path.end(0);
  lookup.list.cells[1].stroke(palette.accent);
  lookup.list.values[1].fill(palette.accent);

  const value = pools.tape.values[1];
  value.reparent(root);
  value.position([-470, -300]);
  value.fontSize(44);
  const label = text('referans', -470, -390, 28, palette.muted);
  const face = record(260, 100, -470, -300);
  const normalPath = wire(
    [
      [-340, -300],
      [-200, -300],
      [-200, -210],
      [145, -210],
      [145, -258],
    ],
    palette.accent,
    2.5,
  );
  normalPath.radius(12);
  normalPath.end(0);
  explanation.add(normalPath);
  root.add([face, label, lookup.root, explanation]);
  // Put the number above its face without replacing the familiar reference glyph.
  value.moveToTop();
  view.add(root);

  const choice = new Layout({});
  view.add(choice);
  const carried = [counts.left, counts.right, extraReference, ...pools.columns.map((c) => c.title)];
  for (const node of carried) node.reparent(choice);
  yield* all(
    pools.root.opacity(0, 0.6),
    ...carried.map((node) => node.opacity(0, 0.6)),
    root.opacity(1, 0.6),
  );
  yield* normalPath.end(1, 0.7);

  const countHeading = text('object listesi kayıt sayısı', -300, -120, 28, palette.muted);
  const widthHeading = text('referans uzunluğu', 320, -120, 28, palette.muted);
  countHeading.opacity(0);
  widthHeading.opacity(0);
  choice.add([countHeading, widthHeading]);
  // Show the boundary used in this example, after the normal lookup is established.
  const rules = [
    ['256 – 65\u202f535', '2 byte'],
    ['≥ 65\u202f536', '4 byte'],
  ].map(([range, width], i) => {
    const row = new Layout({ y: -35 + i * 105, opacity: 0 });
    const ruleFace = record(1280, 80, 0, 0);
    const input = compactNumber(text(range, -300, 0, 34, palette.ink, true));
    const output = text(width, 320, 0, 34, palette.ink, true);
    const arrow = wire(
      [
        [-65, 0],
        [130, 0],
      ],
      palette.muted,
      2,
    );
    row.add([ruleFace, input, arrow, output]);
    arrow.opacity(0);
    output.opacity(0);
    choice.add(row);
    return { row, face: ruleFace, arrow, output };
  });
  yield* waitUntil('width-table');
  yield* all(countHeading.opacity(1, 0.5), widthHeading.opacity(1, 0.5));
  yield* waitUntil('two-byte-rule');
  yield* rules[0].row.opacity(1, 0.5);
  yield* waitUntil('two-byte-width');
  yield* all(rules[0].arrow.opacity(1, 0.4), rules[0].output.opacity(1, 0.4));
  yield* waitUntil('four-byte-rule');
  yield* rules[1].row.opacity(1, 0.5);
  yield* waitUntil('four-byte-width');
  yield* all(rules[1].arrow.opacity(1, 0.4), rules[1].output.opacity(1, 0.4));

  for (const [side, column] of pools.columns.entries()) {
    column.title.position([side ? 430 : -430, 170]);
  }
  counts.left.position([-430, 245]);
  counts.right.position([430, 245]);
  counts.left.fontSize(42);
  counts.right.fontSize(42);
  extraReference.position([430, 310]);
  const widths = [-430, 430].map((x, side) => {
    const cells = strip(side ? ['', '', '', ''] : ['01', '00'], x, 385, 110);
    cells.root.scale(1.1);
    cells.root.opacity(0);
    const name = text(
      side ? 'beklediği: 4 byte' : 'yazdığı: 2 byte',
      x,
      470,
      30,
      side ? palette.accent : palette.ink,
    );
    name.opacity(0);
    choice.add([cells.root, name]);
    return { cells, name };
  });

  yield* waitUntil('writer-width');
  yield* all(pools.columns[0].title.opacity(1, 0.5), counts.left.opacity(1, 0.5));
  yield* waitUntil('grow-writer-list');
  yield* counts.total(65535, 2.4);

  yield* waitUntil('writer-range');
  yield* all(
    rules[0].face.stroke(palette.accent, 0.5),
    rules[0].face.fill(palette.accentWash, 0.5),
    rules[0].arrow.stroke(palette.accent, 0.5),
    rules[0].output.fill(palette.accent, 0.5),
  );

  yield* waitUntil('writer-two-bytes');
  yield* all(widths[0].cells.root.opacity(1, 0.5), widths[0].name.opacity(1, 0.5));

  yield* waitUntil('reader-wider');
  compactNumber(counts.right, '65\u202f535 + 1');
  yield* all(
    pools.columns[1].title.opacity(1, 0.5),
    counts.right.opacity(1, 0.5),
    extraReference.opacity(1, 0.5),
  );

  yield* waitUntil('reader-count');
  yield* all(counts.right.opacity(0, 0.25), extraReference.opacity(0, 0.25));
  compactNumber(counts.right, '65\u202f536 kayıt');
  yield* counts.right.opacity(1, 0.4);

  yield* waitUntil('reader-four-bytes');
  yield* all(
    rules[0].face.stroke(palette.rule, 0.5),
    rules[0].face.fill(palette.surface, 0.5),
    rules[0].arrow.stroke(palette.muted, 0.5),
    rules[0].output.fill(palette.ink, 0.5),
    rules[1].face.stroke(palette.accent, 0.5),
    rules[1].face.fill(palette.accentWash, 0.5),
    rules[1].arrow.stroke(palette.accent, 0.5),
    rules[1].output.fill(palette.accent, 0.5),
    widths[1].cells.root.opacity(1, 0.5),
    widths[1].name.opacity(1, 0.5),
  );
  return { choice, root, explanation, lookup, value, label, face, normalPath };
}

/** Compare the normal read with the overread before interpreting the same bits as an index. */
export function* readReference(
  view: View2D,
  pools: ReturnType<typeof objectPools>,
  counts: ReferenceCounts,
  extraReference: Txt,
) {
  const read = yield* chooseReferenceWidth(view, pools, counts, extraReference);
  const { root, explanation, lookup, value, label, face, normalPath } = read;
  yield* waitUntil('same-bytes');
  yield* read.choice.opacity(0, 0.5);

  const bytes = strip(['01', '00', '00', '80'], 0, 25, 160);
  bytes.root.scale(1.2);
  bytes.root.opacity(0);
  const following = [...bytes.cells.slice(2), ...bytes.values.slice(2)];
  for (const node of following) node.opacity(0);
  const referenceName = text('referans 1', -192, -80, 30);
  const other = text('sonraki alan', 192, -80, 30, palette.muted);
  other.opacity(0);
  const boundary = wire(
    [
      [0, -40],
      [0, 85],
    ],
    palette.ink,
    2,
    false,
  );
  boundary.opacity(0);
  const written = wire(
    [
      [-384, 90],
      [-384, 115],
      [0, 115],
      [0, 90],
    ],
    palette.muted,
    2,
    false,
  );
  const writtenName = text('yazılan: 2 byte', -192, 155, 30, palette.muted);
  const decoded = wire(
    [
      [-384, 25],
      [-690, 25],
      [-690, -300],
      [-600, -300],
    ],
    palette.accent,
    2.5,
  );
  decoded.radius(12);
  decoded.end(0);
  const cursor = wire(
    [
      [-384, 230],
      [384, 230],
    ],
    palette.accent,
    4,
  );
  cursor.end(0);
  const readName = text('okunan: 4 byte', 0, 285, 30, palette.accent);
  readName.opacity(0);
  const interpretation = text('aynı 32 bit', -470, -205, 26, palette.muted);
  interpretation.opacity(0);
  const encoded = text('0x80000001', -470, -150, 26, palette.muted, true);
  encoded.opacity(0);
  explanation.add([
    bytes.root,
    referenceName,
    other,
    boundary,
    written,
    writtenName,
    decoded,
    cursor,
    readName,
    interpretation,
    encoded,
  ]);
  yield* bytes.root.opacity(1, 0.6);

  yield* waitUntil('reference-one');
  yield* decoded.end(1, 0.9);

  yield* waitUntil('following-field');
  yield* all(
    ...following.map((node) => node.opacity(1, 0.6)),
    other.opacity(1, 0.6),
    boundary.opacity(1, 0.6),
  );

  yield* waitUntil('overread');
  yield* all(decoded.opacity(0, 0.4), normalPath.opacity(0, 0.4), readName.opacity(1, 0.4));

  yield* waitUntil('read-reference-bytes');
  yield* cursor.end(0.5, 1);

  yield* waitUntil('read-following-bytes');
  yield* cursor.end(1, 1.2);

  yield* waitUntil('combined-reference');
  yield* all(value.opacity(0, 0.25), label.opacity(0, 0.25));
  label.text('okunan referans');
  compactNumber(value, '0x80000001');
  value.fontSize(32);
  yield* all(
    value.opacity(1, 0.4),
    label.opacity(1, 0.4),
    face.stroke(palette.accent, 0.4),
    lookup.list.cells[1].stroke(palette.rule, 0.4),
    lookup.list.values[1].fill(palette.ink, 0.4),
  );

  yield* waitUntil('native-index');
  yield* lookup.title.opacity(0, 0.2);
  lookup.title.text('C++ object listesi');
  yield* lookup.title.opacity(1, 0.3);

  yield* waitUntil('index-role');
  yield* label.opacity(0, 0.2);
  label.text('index');
  yield* label.opacity(1, 0.2);

  yield* waitUntil('signed-index');
  // The byte strip never changes; retain its hex value alongside the signed interpretation.
  yield* label.opacity(0, 0.2);
  label.text('signed int32 index');
  yield* all(label.opacity(1, 0.4), interpretation.opacity(1, 0.4), encoded.opacity(1, 0.4));

  yield* waitUntil('signed-negative');
  yield* value.opacity(0, 0.25);
  compactNumber(value, '−2\u202f147\u202f483\u202f647');
  value.fontSize(30);
  yield* value.opacity(1, 0.4);
  return { root, explanation, lookup, value, label, face } satisfies ReadReference;
}
