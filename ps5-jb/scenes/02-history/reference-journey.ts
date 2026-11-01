import { Txt, View2D } from '@motion-canvas/2d';
import { Vector2, all, delay, waitFor } from '@motion-canvas/core';
import { text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import type { CartGraph } from './cart-graph';
import { objectPools } from './object-pools';

type Column = ReturnType<typeof objectPools>['columns'][number];

/** Establish the shared-object problem before revealing temporary bookkeeping. */
export function referenceJourney(view: View2D, source: CartGraph, rebuilt: CartGraph) {
  const pools = objectPools();
  const [writer, reader] = pools.columns;
  pools.root.opacity(0);
  writer.root.position([0, 180]);
  reader.root.position([0, 180]);
  reader.root.opacity(0);
  for (const column of pools.columns) {
    column.title.opacity(0);
    column.indexHeading.opacity(0);
    for (const row of column.rows) row.opacity(0);
    for (const index of column.indices) index.opacity(0);
  }
  pools.tape.root.opacity(0);
  // The first face is the empty list; later its contents fill this same face.
  writer.rows[0].opacity(1);
  writer.faces[0].opacity(0);
  writer.labels[0].opacity(0);
  writer.glyphs[0].opacity(0);
  writer.title.text('object listesi');
  const recordLabel = text('kaydedilen referans', 0, 185, 27, palette.muted);
  recordLabel.opacity(0);
  const arrayType = text('array', 0, -245, 30, palette.muted);
  arrayType.opacity(0);
  source.arrayGroup.add(arrayType);
  view.add([pools.root, recordLabel]);
  const lookup = wire(
    [
      [145, 350],
      [330, 350],
      [330, 175],
      [245, 175],
    ],
    palette.accent,
    3,
  );
  lookup.radius(12);
  lookup.end(0);
  lookup.opacity(0);
  view.add(lookup);

  function point(graph: CartGraph, local: [number, number]) {
    return new Vector2(local)
      .transformAsPoint(graph.root.localToWorld())
      .transformAsPoint(view.worldToLocal());
  }

  function* selectLink(graph: CartGraph, index: number, selected: boolean) {
    if (selected) graph.paths[index].zIndex(1);
    yield* all(
      graph.fields[index].fill(selected ? palette.accent : palette.ink, 0.3),
      graph.paths[index].stroke(selected ? palette.accent : palette.muted, 0.3),
    );
    if (!selected) graph.paths[index].zIndex(0);
  }

  function* showNeed() {
    yield* all(selectLink(source, 0, true), source.cartName.fill(palette.accent, 0.3));
  }

  function* sameObjectAgain() {
    yield* all(selectLink(source, 0, false), selectLink(source, 1, true));
  }

  function* focusArrayObject() {
    yield* all(selectLink(source, 1, false), source.cartName.fill(palette.ink, 0.3));
    yield* all(
      source.array.stroke(palette.accent, 0.5),
      arrayType.opacity(1, 0.5),
      ...source.fields.map((field) => field.opacity(0.25, 0.5)),
      ...source.paths.map((path) => path.opacity(0.25, 0.5)),
      source.cart.opacity(0.25, 0.5),
    );
  }

  function* writerList() {
    yield* all(source.root.position([0, -200], 0.9), source.root.scale(0.9, 0.9));
    pools.root.opacity(1);
    yield* all(writer.title.opacity(1, 0.4), writer.faces[0].opacity(1, 0.4));
  }

  function* rememberObject(graph: CartGraph, column: Column, index: number) {
    const actor = point(graph, index === 0 ? [-420, 120] : [470, 0]);
    const row = column.rows[index].absolutePosition().transformAsPoint(view.worldToLocal());
    const side = index === 0 ? -1 : 1;
    const guide = wire(
      [
        [actor.x, actor.y + (index === 0 ? 10 : 0)],
        [side * 520, actor.y + (index === 0 ? 10 : 0)],
        [side * 520, row.y],
        [side * 252, row.y],
      ],
      palette.accent,
      2,
    );
    guide.radius(12);
    guide.end(0);
    view.add(guide);
    // The object stays put. Its row appears first; only then does its row number appear.
    yield* all(
      column.rows[index].opacity(1, 0.4),
      column.labels[index].opacity(1, 0.4),
      column.glyphs[index].opacity(1, 0.4),
      guide.end(1, 0.7),
    );
    yield* column.faces[index].stroke(palette.accent, 0.25);
    yield* guide.opacity(0, 0.3);
    guide.remove();
  }

  function* numberObject(column: Column, index: number) {
    yield* all(column.indices[index].opacity(1, 0.35), column.indexHeading.opacity(1, 0.35));
    yield* column.faces[index].stroke(palette.rule, 0.3);
  }

  function* writerArray() {
    yield* rememberObject(source, writer, 0);
  }

  function* writerArrayNumber() {
    yield* numberObject(writer, 0);
  }

  function* writerFirstElement() {
    yield* all(
      arrayType.opacity(0, 0.4),
      source.array.stroke(palette.rule, 0.4),
      ...source.fields.map((field) => field.opacity(1, 0.4)),
      ...source.paths.map((path) => path.opacity(1, 0.4)),
      source.cart.opacity(1, 0.4),
    );
    yield* selectLink(source, 0, true);
  }

  function* writerCart() {
    yield* rememberObject(source, writer, 1);
    yield* selectLink(source, 0, false);
  }

  function* writerCartNumber() {
    yield* numberObject(writer, 1);
  }

  function* selectRememberedCart(graph: CartGraph, column: Column) {
    const actor = point(graph, [470, 0]);
    const row = column.rows[1].absolutePosition().transformAsPoint(view.worldToLocal());
    const guide = wire(
      [
        [252, row.y],
        [520, row.y],
        [520, actor.y],
        [actor.x, actor.y],
      ],
      palette.accent,
      2,
    );
    guide.radius(12);
    guide.end(0);
    view.add(guide);
    yield* column.faces[1].stroke(palette.accent, 0.3);
    yield* guide.end(1, 0.75);
    yield* graph.cartName.fill(palette.accent, 0.3);
    yield* waitFor(0.45);
    yield* all(guide.opacity(0, 0.3), graph.cartName.fill(palette.ink, 0.3));
    guide.remove();
  }

  function* writerRepeat() {
    yield* selectLink(source, 1, true);
    yield* selectRememberedCart(source, writer);
    yield* selectLink(source, 1, false);
    // Keep the selected row until its number is written to the reference.
  }

  function* writeReference() {
    yield* source.root.opacity(0, 0.4);
    yield* writer.root.position([0, 0], 0.6);
    pools.tape.values[1].opacity(0);
    yield* all(pools.tape.root.opacity(1, 0.3), recordLabel.opacity(1, 0.3));
    const start = writer.indices[1].absolutePosition().transformAsPoint(view.worldToLocal());
    const number = text('1', start.x, start.y, 32, palette.accent, true);
    number.opacity(0);
    view.add(number);
    // Travel below the strip so the moving number never crosses its 'referans' label.
    yield* all(number.y(350, 0.35), delay(0.1, number.opacity(1, 0.15)));
    yield* number.x(72.5, 0.35);
    yield* number.y(250, 0.25);
    number.remove();
    pools.tape.values[1].opacity(1);
    yield* writer.faces[1].stroke(palette.rule, 0.3);
  }

  function* readerList() {
    yield* writer.root.opacity(0, 0.5);
    writer.title.text('yazarken');
    // The saved number poses a concrete lookup problem before the reader list appears.
    yield* all(pools.tape.root.position([0, 60], 0.6), recordLabel.y(-20, 0.6));
    yield* waitFor(0.4);
    rebuilt.root.position([0, -200]);
    rebuilt.root.scale(0.9);
    rebuilt.root.opacity(1);
    rebuilt.arrayGroup.opacity(0);
    rebuilt.cart.opacity(0);
    rebuilt.arrayName.text('yeni array');
    rebuilt.fields.forEach((field) => field.text(''));
    rebuilt.paths.forEach((path) => {
      path.end(0);
      path.stroke(palette.muted);
      path.zIndex(0);
    });
    const quantity = rebuilt.cart.children()[7] as Txt;
    quantity.text('3');
    quantity.fill(palette.ink);
  }

  function* readerArray() {
    yield* rebuilt.arrayGroup.opacity(1, 0.45);
  }

  function* readerEmptyList() {
    reader.rows[0].opacity(1);
    reader.labels[0].opacity(0);
    reader.glyphs[0].opacity(0);
    yield* all(
      pools.tape.root.position([0, 350], 0.6),
      recordLabel.y(285, 0.6),
      reader.root.opacity(1, 0.4),
      reader.title.opacity(1, 0.4),
      reader.faces[0].opacity(1, 0.4),
    );
  }

  function* readerArrayRow() {
    yield* rememberObject(rebuilt, reader, 0);
  }

  function* readerArrayNumber() {
    yield* numberObject(reader, 0);
  }

  function* readerCart() {
    yield* rebuilt.cart.opacity(1, 0.6);
    rebuilt.fields[0].text('cart');
    yield* rebuilt.paths[0].end(1, 0.65);
  }

  function* readerCartRow() {
    yield* rememberObject(rebuilt, reader, 1);
  }

  function* readerCartNumber() {
    yield* numberObject(reader, 1);
  }

  function* readReference() {
    yield* pools.tape.cells[1].stroke(palette.accent, 0.35);
  }

  function* lookupReference() {
    lookup.opacity(1);
    yield* all(lookup.end(1, 0.7), reader.faces[1].stroke(palette.accent, 0.3));
  }

  function* reuseCart() {
    yield* selectRememberedCart(rebuilt, reader);
  }

  function* readSecondLink() {
    rebuilt.fields[1].text('cart');
    rebuilt.paths[1].zIndex(1);
    yield* all(
      rebuilt.fields[1].fill(palette.accent, 0.3),
      rebuilt.paths[1].stroke(palette.accent, 0.3),
      rebuilt.paths[1].end(1, 0.7),
    );
    yield* all(
      lookup.opacity(0, 0.4),
      reader.faces[1].stroke(palette.rule, 0.4),
      rebuilt.fields[1].fill(palette.ink, 0.4),
      rebuilt.paths[1].stroke(palette.muted, 0.4),
      pools.tape.cells[1].stroke(palette.rule, 0.4),
    );
    rebuilt.paths[1].zIndex(0);
    lookup.remove();
  }

  function* compareLists() {
    yield* all(
      rebuilt.root.opacity(0, 0.35),
      pools.tape.root.opacity(0, 0.35),
      recordLabel.opacity(0, 0.35),
    );
    writer.root.position([-370, -30]);
    pools.tape.root.position([0, 250]);
    yield* all(
      reader.root.position([370, -30], 0.75),
      writer.root.opacity(1, 0.6),
      pools.tape.root.opacity(1, 0.4),
    );
  }

  function* compareRow(index: number) {
    yield* all(
      ...pools.columns.flatMap((column) =>
        column.rows.flatMap((_, row) => [
          column.faces[row].stroke(row === index ? palette.accent : palette.rule, 0.3),
          column.indices[row].fill(row === index ? palette.accent : palette.ink, 0.3),
        ]),
      ),
    );
  }

  function* compareCart(side: number) {
    yield* all(
      ...pools.columns.flatMap((column, index) => [
        column.faces[1].stroke(index === side ? palette.accent : palette.rule, 0.3),
        column.indices[1].fill(index === side ? palette.accent : palette.ink, 0.3),
      ]),
    );
  }

  function* sameOrdinals() {
    yield* all(
      ...pools.columns.flatMap((column) => [
        ...column.faces.map((face) => face.stroke(palette.rule, 0.3)),
        ...column.indices.map((index) => index.fill(palette.accent, 0.3)),
      ]),
    );
  }

  function* settle() {
    yield* all(
      ...pools.columns.flatMap((column) =>
        column.indices.map((index) => index.fill(palette.ink, 0.3)),
      ),
    );
  }

  return {
    showNeed,
    sameObjectAgain,
    focusArrayObject,
    writerList,
    writerArray,
    writerArrayNumber,
    writerFirstElement,
    writerCart,
    writerCartNumber,
    writerRepeat,
    writeReference,
    readerList,
    readerEmptyList,
    readerArray,
    readerArrayRow,
    readerArrayNumber,
    readerCart,
    readerCartRow,
    readerCartNumber,
    readReference,
    lookupReference,
    reuseCart,
    readSecondLink,
    compareLists,
    compareRow,
    compareCart,
    sameOrdinals,
    settle,
  };
}
