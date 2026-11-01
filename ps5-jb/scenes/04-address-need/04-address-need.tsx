import { Layout, Txt, makeScene2D } from '@motion-canvas/2d';
import { all, delay, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import { wrongReference } from '../03-reference/03-reference';
import { preparationPose } from './preparation-visuals';
import { heapPlacement } from './heap-placement';

function* replaceText(label: Txt, value: string) {
  yield* label.opacity(0, 0.25);
  label.text(value);
  yield* label.opacity(1, 0.25);
}

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const wrong = wrongReference();
  const prepared = preparationPose(false);
  const heap = heapPlacement(prepared);
  for (const node of [
    prepared.fake,
    prepared.referenceSlot,
    prepared.referencePath,
    prepared.real,
    prepared.a,
    prepared.originalPath,
    prepared.fakePath,
    prepared.targetMark,
    prepared.result,
    prepared.fakeHeader,
    prepared.fakeLength,
    prepared.fakePointer,
  ])
    node.opacity(0);
  prepared.fakeName.text('object içindeki data');
  prepared.fakeFace.stroke(palette.rule);
  prepared.fakeFace.fill(palette.wash);
  prepared.fakePointer.text('data');
  prepared.fakePointer.fill(palette.muted);
  prepared.aBytes.values.forEach((value) => value.opacity(0));
  prepared.real.position([0, -130]);
  prepared.realFace.size([240, 90]);
  prepared.realName.position([0, 0]);
  prepared.pointer.opacity(0);
  prepared.length.opacity(0);
  prepared.type.opacity(0);
  prepared.originalPath.points([
    [120, -130],
    [330, -130],
  ]);
  prepared.originalPath.end(0);
  prepared.fakePath.end(0);

  const constructor = text('const view = new Uint8Array(buffer)', 0, 300, 30, palette.ink, true);
  constructor.opacity(0);
  const metadata = text('metadata', 0, -235, 25, palette.muted, true);
  metadata.opacity(0);
  const readout = new Layout({ position: [0, 150], opacity: 0 });
  const query = text('view[0]', -150, 0, 36, palette.ink, true);
  const result = text('24', 150, 0, 36, palette.accent, true);
  result.opacity(0);
  const readArrow = wire(
    [
      [-45, 0],
      [95, 0],
    ],
    palette.accent,
  );
  readArrow.end(0);
  readout.add([query, readArrow, result]);
  view.add([wrong.root, prepared.root, constructor, metadata, readout, heap.root]);

  yield* waitUntil('choose-content');
  yield* all(
    wrong.list.root.opacity(0, 0.5),
    wrong.title.opacity(0, 0.5),
    wrong.start.opacity(0, 0.5),
    wrong.startName.opacity(0, 0.5),
    wrong.wrongIndex.opacity(0, 0.5),
    wrong.path.opacity(0, 0.5),
  );

  yield* waitUntil('allocated');
  yield* wrong.root.opacity(0, 0.5);
  yield* prepared.a.opacity(1, 0.6);

  yield* waitUntil('buffer-24');
  yield* prepared.aBytes.values[0].opacity(1, 0.2);
  yield* waitUntil('buffer-48');
  yield* prepared.aBytes.values[1].opacity(1, 0.2);
  yield* waitUntil('buffer-72');
  yield* prepared.aBytes.values[2].opacity(1, 0.2);
  yield* waitUntil('buffer-96');
  yield* prepared.aBytes.values[3].opacity(1, 0.2);

  yield* waitUntil('normal-view');
  yield* all(prepared.real.opacity(1, 0.5), constructor.opacity(1, 0.5));
  prepared.originalPath.opacity(1);
  yield* prepared.originalPath.end(1, 0.7);

  yield* waitUntil('read-zero');
  yield* all(
    prepared.originalPath.stroke(palette.accent, 0.3),
    prepared.aBytes.cells[0].stroke(palette.accent, 0.3),
    readout.opacity(1, 0.3),
  );
  yield* readArrow.end(1, 0.5);

  yield* waitUntil('read-result');
  yield* result.opacity(1, 0.3);

  yield* waitUntil('expand-view');
  yield* all(readout.opacity(0, 0.35), constructor.opacity(0, 0.35));
  yield* all(
    prepared.real.y(-80, 0.8),
    prepared.realFace.size([380, 220], 0.8),
    prepared.realName.y(-190, 0.8),
    prepared.originalPath.points(
      [
        [190, -130],
        [330, -130],
      ],
      0.8,
    ),
    prepared.originalPath.stroke(palette.muted, 0.8),
    prepared.aBytes.cells[0].stroke(palette.rule, 0.8),
  );
  yield* waitUntil('view-type');
  yield* prepared.type.opacity(1, 0.35);
  yield* waitUntil('view-length');
  yield* prepared.length.opacity(1, 0.35);
  yield* waitUntil('view-pointer');
  yield* prepared.pointer.opacity(1, 0.35);
  yield* waitUntil('metadata-name');
  yield* metadata.opacity(1, 0.35);

  yield* waitUntil('pointer-source');
  yield* all(
    prepared.pointer.fill(palette.accent, 0.4),
    prepared.originalPath.stroke(palette.accent, 0.4),
    prepared.aBytes.cells[0].stroke(palette.accent, 0.4),
  );

  yield* waitUntil('pointer-target');
  yield* all(
    prepared.targetMark.opacity(1, 0.4),
    prepared.originalPath.stroke(palette.muted, 0.4),
    prepared.aBytes.cells[0].stroke(palette.rule, 0.4),
  );

  yield* waitUntil('fake-data');
  yield* prepared.fake.opacity(1, 0.5);

  yield* waitUntil('fake-type');
  // Carry the familiar type information into the data we arrange ourselves.
  const header = prepared.type.clone();
  prepared.root.add(header);
  header.position([0, -10]);
  yield* all(header.position([-550, -10], 0.9), header.fontSize(24, 0.9));
  header.remove();
  prepared.fakeHeader.opacity(1);

  yield* waitUntil('fake-length');
  yield* prepared.fakeLength.opacity(1, 0.4);

  yield* waitUntil('fake-data-field');
  yield* prepared.fakePointer.opacity(1, 0.35);

  yield* waitUntil('copy-view-reference');
  // Only a reference token moves. The real view stays in its original place.
  const reference = prepared.realName.clone();
  prepared.root.add(reference);
  reference.position(
    prepared.realName.absolutePosition().transformAsPoint(prepared.root.worldToLocal()),
  );
  reference.opacity(0);
  yield* all(
    delay(0.25, reference.opacity(1, 0.15)),
    reference.position([-550, -130], 0.9),
    reference.fontSize(24, 0.9),
    prepared.fakePointer.opacity(0, 0.15),
  );
  reference.remove();
  // Change the field text only after the reference has settled in its destination.
  prepared.fakePointer.text('data → view');
  prepared.fakePointer.fill(palette.ink);
  prepared.fakePointer.opacity(1);

  yield* waitUntil('fake-target');
  prepared.fakePath.opacity(1);
  yield* prepared.fakePath.end(1, 0.8);

  yield* waitUntil('fake-view-name');
  yield* all(
    replaceText(prepared.fakeName, 'sahte view'),
    prepared.fakeFace.stroke(palette.accent, 0.5),
    prepared.fakeFace.fill(palette.surface, 0.5),
  );

  yield* waitUntil('heap-layout');
  yield* all(
    prepared.real.opacity(0, 0.5),
    prepared.a.opacity(0, 0.5),
    prepared.originalPath.opacity(0, 0.5),
    prepared.fakePath.opacity(0, 0.5),
    prepared.targetMark.opacity(0, 0.5),
    metadata.opacity(0, 0.5),
  );
  yield* heap.show();

  yield* waitUntil('release-gap');
  yield* heap.release();

  yield* waitUntil('place-object-list');
  yield* heap.placeList();

  yield* waitUntil('repeat-address');
  yield* heap.fill();

  yield* waitUntil('outside-read');
  yield* heap.readOutside();

  yield* waitUntil('address-to-fake');
  yield* heap.connectFake();

  yield* waitUntil('grooming-name');
  yield* heap.nameGrooming();

  yield* waitUntil('summary-buffer');
  yield* heap.summarize();

  yield* waitUntil('summary-address-link');
  yield* heap.connectSummary();

  yield* waitUntil('summary-real-view');
  yield* all(
    prepared.real.opacity(1, 0.6),
    prepared.a.opacity(1, 0.6),
    prepared.originalPath.opacity(1, 0.6),
    prepared.originalPath.stroke(palette.muted, 0.6),
    prepared.pointer.fill(palette.ink, 0.6),
  );

  yield* waitUntil('summary-metadata-link');
  prepared.fakePath.opacity(1);
  prepared.fakePath.end(0);
  yield* all(prepared.fakePath.end(1, 0.8), prepared.targetMark.opacity(1, 0.4));

  yield* waitUntil('plan-unchanged');
  yield* all(
    prepared.originalPath.stroke(palette.accent, 0.4),
    prepared.aBytes.cells[0].stroke(palette.accent, 0.4),
  );

  yield* waitUntil('normal-result');
  yield* prepared.result.opacity(1, 0.35);

  yield* waitUntil('need-address');
  yield* all(
    prepared.originalPath.stroke(palette.muted, 0.4),
    prepared.aBytes.cells[0].stroke(palette.rule, 0.4),
  );
  // Keep the address cells and their target visible; the plan still needs this address.
  yield* waitUntil('end');
});
