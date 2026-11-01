import { Layout, Line } from '@motion-canvas/2d';
import { all } from '@motion-canvas/core';
import { memory, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import type { preparationPose } from './preparation-visuals';

/** Allocation diagram: the pointer buffer stays live while separate holes receive the list. */
export function heapPlacement(prepared: ReturnType<typeof preparationPose>) {
  const root = new Layout({ opacity: 0 });
  const heapName = text('heap’teki hedeflenen yerleşim', 0, 140, 28, palette.muted);
  const bufferName = text('ayırdığımız buffer', -400, 355, 27, palette.muted);
  const listName = text('diğer buffer', 400, 355, 27, palette.muted);
  const listArea = memory(540, 80, 400, 285);
  const allocated = text('buffer', 0, 0, 27, palette.muted, true);
  listArea.add(allocated);
  const others = [-180, 0, 180].map((x, i) => {
    const label = text('', x, 0, 28, palette.ink, true);
    const index = text(i < 2 ? String(i) : '', x, -80, 24, palette.muted, true);
    label.opacity(0);
    index.opacity(0);
    listArea.add([label, index]);
    return { label, index };
  });
  const dividers = [-90, 90].map(
    (x) =>
      new Line({
        points: [
          [x, -40],
          [x, 40],
        ],
        stroke: palette.rule,
        lineWidth: 1.5,
        opacity: 0,
      }),
  );
  listArea.add(dividers);

  prepared.referenceSlot.position([-400, 285]);
  prepared.referenceFace.size([600, 80]);
  prepared.referenceFace.stroke(palette.rule);
  prepared.referenceFace.fill(palette.wash);
  prepared.referenceName.opacity(0);
  prepared.referenceValue.text('adres');
  const copies = prepared.referenceCopies;
  const cells = prepared.referenceCells;
  const labels = prepared.referenceLabels;
  copies.opacity(0);
  for (const cell of cells) cell.stroke(palette.rule);
  for (const label of labels) label.opacity(0);
  prepared.referencePath.points([
    [-400, 245],
    [-400, 145],
    [-790, 145],
    [-790, -80],
    [-730, -80],
  ]);
  prepared.referencePath.end(0);

  // The negative lookup enters the cell from below; its target link leaves from above.
  const negativeRead = wire(
    [
      [130, 285],
      [50, 285],
      [50, 415],
      [-400, 415],
      [-400, 325],
    ],
    palette.accent,
  );
  negativeRead.radius(12);
  negativeRead.lineDash([8, 12]);
  negativeRead.end(0);
  const readName = text('liste dışındaki okuma', -400, 475, 28, palette.accent);
  readName.opacity(0);
  const name = text('heap grooming', 400, 450, 30, palette.muted, true);
  name.opacity(0);
  root.add([heapName, bufferName, listName, listArea, negativeRead, readName, name]);

  function* show() {
    yield* all(root.opacity(1, 0.6), prepared.referenceSlot.opacity(1, 0.6));
  }

  function* release() {
    yield* all(
      allocated.opacity(0, 0.5),
      listArea.fill(palette.surface, 0.5),
      listName.opacity(0, 0.3),
    );
    listName.text('boş alan');
    yield* listName.opacity(1, 0.3);
  }

  function* fill() {
    yield* copies.opacity(1, 0.4);
    for (const label of labels) yield* label.opacity(1, 0.25);
    yield* all(cells[1].stroke(palette.accent, 0.4), bufferName.opacity(0, 0.3));
    bufferName.text('aynı adresin kopyaları');
    yield* bufferName.opacity(1, 0.3);
  }

  function* connectFake() {
    prepared.referencePath.opacity(1);
    yield* prepared.referencePath.end(1, 0.9);
  }

  function* placeList() {
    ['array', 'cart', '…'].forEach((value, i) => {
      others[i].label.text(value);
      others[i].label.fill(palette.ink);
      others[i].label.fontSize(28);
    });
    yield* listName.opacity(0, 0.25);
    listName.text('okuyucunun object listesi');
    yield* all(
      listName.position([400, 155], 0.7),
      listName.opacity(1, 0.5),
      listArea.fill(palette.wash, 0.5),
      ...dividers.map((divider) => divider.opacity(1, 0.5)),
      ...others.flatMap((v) => [v.label.opacity(1, 0.5), v.index.opacity(1, 0.5)]),
    );
  }

  function* readOutside() {
    // The address-copy caption has served its purpose; clear the lookup's route.
    yield* all(bufferName.opacity(0, 0.3), readName.opacity(1, 0.4), negativeRead.end(1, 1));
  }

  function* nameGrooming() {
    yield* name.opacity(1, 0.4);
  }

  function* summarize() {
    // Retain the actual buffer and address copies; retire only the placement detail.
    yield* all(root.opacity(0, 0.5), prepared.referencePath.end(0, 0.4));
    yield* prepared.referenceSlot.position([-550, 245], 0.9);
  }

  function* connectSummary() {
    prepared.referencePath.points([
      [-550, 205],
      [-550, 30],
    ]);
    yield* all(prepared.referenceName.opacity(1, 0.4), prepared.referencePath.end(1, 0.7));
  }

  return {
    root,
    show,
    release,
    fill,
    connectFake,
    placeList,
    readOutside,
    nameGrooming,
    summarize,
    connectSummary,
  };
}
