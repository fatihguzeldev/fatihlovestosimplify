import { Layout, Line, type View2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { memory, strip, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import type { ReadReference } from './reference-record';
import { compactNumber } from './number-spacing';

/** Shared endpoint: 04 starts with exactly the native lookup left by 03. */
export function wrongReference() {
  const root = new Layout({});
  const title = text('C++ object listesi', 220, -280, 32, palette.muted);
  const list = strip(['array', 'cart', 'BigInt', '…'], 220, 0, 150);
  list.values.forEach((value) => value.fontSize(25));
  ['0', '1', '2', ''].forEach((value, i) => {
    list.root.add(text(value, (i - 1.5) * 150, -100, 24, palette.muted, true));
  });
  // Diagram only: the distant negative access is not drawn to scale or as array[-1].
  const before = memory(230, 110, -470, 0, palette.accent, palette.accentWash);
  const outsideValue = text('?', 0, 0, 46, palette.accent, true);
  before.add(outsideValue);
  const beforeName = text('liste dışındaki alan', -470, 115, 27, palette.accent);
  const wrongIndex = new Layout({ position: [-470, -185] });
  wrongIndex.add([
    text('index', 0, -65, 26, palette.muted, true),
    compactNumber(text('−2\u202f147\u202f483\u202f647', 0, 0, 26, palette.accent, true)),
  ]);
  const path = wire(
    [
      [-470, -145],
      [-470, -58],
    ],
    palette.accent,
  );
  const upper = new Line({
    points: [
      [550, -68],
      [550, 68],
    ],
    stroke: palette.muted,
    lineWidth: 3,
  });
  const upperLabel = compactNumber(text('65\u202f536', 550, 115, 24, palette.muted, true));
  // Retain these handles for scene04 callers; the lookup now focuses only on index0.
  upper.opacity(0);
  upperLabel.opacity(0);
  const start = wire(
    [
      [-95, -68],
      [-95, 68],
    ],
    palette.rule,
    2,
    false,
  );
  start.lineDash([6, 8]);
  const startName = text('listenin başlangıcı', -80, 115, 27, palette.muted);
  root.add([title, list.root, before, beforeName, wrongIndex, path, start, startName]);
  return {
    root,
    title,
    list,
    before,
    outsideValue,
    beforeName,
    wrongIndex,
    path,
    upper,
    upperLabel,
    start,
    startName,
  };
}

export function* nativeLookup(view: View2D, read: ReadReference) {
  yield* waitUntil('bounds');
  const landing = read.lookup;
  const check = new Layout({});
  view.add(check);
  for (const node of [read.face, read.value, read.label]) node.reparent(check);
  // Retire the byte explanation while the very same object list stays visible above.
  yield* all(
    read.explanation.opacity(0, 0.5),
    read.face.position([-260, 70], 0.8),
    read.face.size([460, 110], 0.8),
    read.value.position([-260, 70], 0.8),
    read.value.fontSize(34, 0.8),
    read.label.position([-260, -20], 0.8),
    landing.start.opacity(1, 0.5),
    landing.startName.opacity(1, 0.5),
  );
  const guard = text('if (index >= count) return undefined', 0, -100, 30, palette.ink, true);
  const comparison = text('>=', 80, 70, 44, palette.ink, true);
  const count = compactNumber(text('65\u202f536', 350, 70, 40, palette.ink, true));
  const countName = text('count', 350, -20, 28, palette.muted, true);
  const rejected = text('false', 0, 200, 40, palette.accent, true);
  const next = text('at(index)', 0, 355, 34, palette.ink, true);
  const proceed = wire(
    [
      [0, 245],
      [0, 305],
    ],
    palette.accent,
    2,
  );
  for (const label of [guard, comparison, count, countName, rejected, next]) label.opacity(0);
  proceed.end(0);
  check.add([guard, comparison, count, countName, rejected, proceed, next]);

  yield* waitUntil('upper-bound');
  yield* all(
    guard.opacity(1, 0.5),
    comparison.opacity(1, 0.5),
    count.opacity(1, 0.5),
    countName.opacity(1, 0.5),
  );

  yield* waitUntil('bounds-result');
  yield* rejected.opacity(1, 0.6);

  yield* waitUntil('bounds-access');
  yield* proceed.end(1, 0.6);
  yield* next.opacity(1, 0.5);

  yield* waitUntil('normal-index');
  yield* all(
    landing.list.cells[1].stroke(palette.accent, 0.3),
    landing.list.values[1].fill(palette.accent, 0.3),
  );

  yield* waitUntil('negative-position');
  read.value.reparent(view);
  read.label.reparent(view);
  yield* all(
    check.opacity(0, 0.5),
    landing.list.cells[1].stroke(palette.rule, 0.3),
    landing.list.values[1].fill(palette.ink, 0.3),
  );
  yield* read.label.opacity(0, 0.2);
  read.label.text('index');
  read.label.fontFamily(read.value.fontFamily());
  yield* all(
    read.value.position([-470, -185], 1),
    read.value.fontSize(26, 1),
    read.label.position([-470, -250], 1),
    read.label.fontSize(26, 1),
    landing.root.position([0, 0], 1),
    landing.title.position([220, -280], 1),
  );
  // Replace identical glyphs on the arrival frame, without a double-painted crossfade.
  read.value.remove();
  read.label.remove();
  landing.wrongIndex.opacity(1);

  yield* waitUntil('outside-table');
  yield* all(landing.before.opacity(1, 0.6), landing.beforeName.opacity(1, 0.6));
  landing.path.opacity(1);
  yield* landing.path.end(1, 0.9);

  yield* waitUntil('missing-lower-bound');
  yield* landing.start.stroke(palette.accent, 0.5);

  yield* waitUntil('read-outside-value');
  // The fetched value is separate from the negative selector above the memory slot.
  yield* landing.outsideValue.opacity(1, 0.6);

  yield* waitUntil('native-not-array');
  yield* landing.title.fill(palette.accent, 0.4);

  yield* waitUntil('other-content');
  yield* all(landing.start.stroke(palette.rule, 0.5), landing.title.fill(palette.muted, 0.5));
  yield* waitUntil('end');
}
