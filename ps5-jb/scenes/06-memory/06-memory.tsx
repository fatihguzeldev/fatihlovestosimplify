import { Circle, Layout, Txt, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { frame, record, selectCell, strip, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import { preparationPose } from '../04-address-need/preparation-visuals';
import { accessContext } from './access-context';

function* replaceText(label: Txt, value: string, duration = 0.6) {
  yield* label.opacity(0, duration / 2);
  label.text(value);
  yield* label.opacity(1, duration / 2);
}

/** This exact pose carries the acquired process-local access into native calls. */
export function processAccess() {
  const root = new Layout({});
  const boundary = frame(1600, 700, 0, 0, palette.rule, 'transparent');
  const processName = text('WebContent process', -550, -290, 32, palette.muted);
  const fake = new Layout({ position: [-550, -80] });
  const fakeFace = record(300, 150, 0, 0, palette.accent);
  const fakeName = text('sahte view', 0, -135, 31, palette.accent);
  const fakePointer = text('metadata', 0, 0, 29, palette.ink, true);
  fake.add([fakeFace, fakeName, fakePointer]);
  const real = new Layout({ position: [0, -80] });
  const realFace = record(380, 220, 0, 0);
  const realName = text('view', 0, -190, 32);
  const pointer = text('data pointer → B', 0, -60, 29, palette.accent, true);
  const length = text('length: 4', 0, 10, 29, palette.ink, true);
  const type = text('Uint8Array', 0, 70, 29, palette.muted, true);
  real.add([realFace, realName, pointer, length, type]);
  const a = new Layout({ position: [500, -130] });
  const aBytes = strip(['24', '48', '72', '96'], 0, 0, 85);
  a.add([aBytes.root, text('buffer A', 0, -90, 30, palette.muted)]);
  const b = new Layout({ position: [500, 150] });
  const bBytes = strip(['9', '16', '32', '64'], 0, 0, 85);
  selectCell(bBytes, 0);
  const bName = text('buffer B', 0, -90, 30, palette.accent);
  const bAddress = text('adres B', 0, 75, 26, palette.muted, true);
  b.add([bBytes.root, bName, bAddress]);
  const fakePath = wire(
    [
      [-400, -80],
      [-190, -80],
    ],
    palette.accent,
  );
  const realPath = wire(
    [
      [190, -140],
      [280, -140],
      [280, 150],
      [330, 150],
    ],
    palette.accent,
  );
  const originalPath = wire(
    [
      [190, -140],
      [280, -140],
      [280, -130],
      [330, -130],
    ],
    palette.muted,
    2,
  );
  originalPath.opacity(0);
  const result = text('view[0] → 9', 0, 220, 31, palette.accent, true);
  const readName = text('read', -230, 220, 26, palette.muted);
  const writeResult = text('view[0] = 9', 0, 285, 31, palette.accent, true);
  const writeName = text('write', -230, 285, 26, palette.muted);
  root.add([
    boundary,
    processName,
    fake,
    real,
    a,
    b,
    originalPath,
    fakePath,
    realPath,
    result,
    readName,
    writeResult,
    writeName,
  ]);
  return {
    root,
    boundary,
    processName,
    fake,
    fakeFace,
    fakeName,
    fakePointer,
    real,
    realFace,
    realName,
    pointer,
    length,
    type,
    a,
    aBytes,
    b,
    bBytes,
    bName,
    bAddress,
    fakePath,
    realPath,
    originalPath,
    result,
    readName,
    writeResult,
    writeName,
  };
}

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const preparation = preparationPose(true);
  view.add(preparation.root);
  const endpoint = processAccess();
  endpoint.b.reparent(preparation.root);
  for (const node of [endpoint.readName, endpoint.writeName, endpoint.writeResult]) {
    preparation.root.add(node);
    node.opacity(0);
  }
  endpoint.b.position([500, 150]);
  endpoint.b.opacity(0);
  endpoint.bBytes.values[0].text('');
  endpoint.bName.text('buffer');
  endpoint.bName.fill(palette.muted);
  endpoint.bAddress.opacity(0);
  selectCell(endpoint.bBytes, 0, false);

  const pointerSelection = frame(350, 61, 0, -130, palette.accent, 'transparent');
  pointerSelection.opacity(0);
  const pointerWrite = text('write bytes(B)', -550, 80, 29, palette.accent, true);
  pointerWrite.opacity(0);
  // Each cell is one ADDRESS byte, independent of the DATA byte 8 in buffer B.
  const addressBytes = strip(
    Array.from({ length: 8 }, () => ''),
    -550,
    165,
    42,
  );
  addressBytes.root.opacity(0);
  const addressBytesName = text('B adresinin 8 byte’ı', -550, 245, 27, palette.accent);
  addressBytesName.opacity(0);
  const writeProgress = new Circle({
    position: [-380, -130],
    size: 12,
    fill: palette.accent,
    opacity: 0,
  });
  preparation.root.add([
    pointerSelection,
    pointerWrite,
    addressBytes.root,
    addressBytesName,
    writeProgress,
  ]);
  const context = accessContext();
  context.root.zIndex(-1);
  view.add(context.root);

  yield* waitUntil('known-target');
  yield* preparation.referenceValue.fill(palette.ink, 0.3);
  yield* preparation.referenceValue.fill(palette.accent, 0.3);

  yield* waitUntil('address-buffer');
  yield* preparation.referenceCells[1].fill(palette.accentWash, 0.4);

  yield* waitUntil('wrong-reference');
  preparation.referencePath.lineDash([]);
  yield* preparation.referencePath.lineWidth(3.5, 0.5);

  yield* waitUntil('fake-view');
  yield* preparation.fakeFace.fill(palette.accentWash, 0.5);

  yield* waitUntil('real-reference');
  yield* preparation.fakePointer.fill(palette.accent, 0.4);

  yield* waitUntil('metadata-path');
  preparation.fakePath.lineDash([]);
  yield* preparation.fakePath.lineWidth(3.5, 0.6);

  yield* waitUntil('metadata-access');
  yield* preparation.realFace.stroke(palette.accent, 0.4);

  yield* waitUntil('data-pointer');
  yield* all(
    pointerSelection.opacity(1, 0.4),
    preparation.pointer.fill(palette.accent, 0.4),
    preparation.realFace.stroke(palette.rule, 0.4),
  );

  yield* waitUntil('second-buffer');
  // The resolved F slot leaves before the address-byte operation needs its space.
  yield* all(
    preparation.referenceSlot.opacity(0, 0.4),
    preparation.referencePath.opacity(0, 0.4),
    preparation.result.opacity(0, 0.4),
  );
  yield* all(replaceText(preparation.aName, 'buffer A', 0.4), endpoint.b.opacity(1, 0.5));

  yield* waitUntil('buffer-byte-eight');
  yield* replaceText(endpoint.bBytes.values[0], '8', 0.4);

  yield* waitUntil('buffer-address');
  yield* all(
    replaceText(endpoint.bName, 'buffer B', 0.4),
    endpoint.bName.fill(palette.accent, 0.4),
    endpoint.bAddress.opacity(1, 0.4),
  );

  yield* waitUntil('address-bytes');
  yield* all(addressBytes.root.opacity(1, 0.5), addressBytesName.opacity(1, 0.5));

  yield* waitUntil('write-pointer-bytes');
  yield* pointerWrite.opacity(1, 0.3);
  yield* preparation.fakePath.lineWidth(4.5, 0.2);
  for (const cell of addressBytes.cells) yield* cell.stroke(palette.accent, 0.08);
  yield* writeProgress.opacity(1, 0.15);
  yield* writeProgress.position([-155, -130], 0.85);
  yield* all(writeProgress.opacity(0, 0.2), pointerSelection.fill(palette.accentWash, 0.3));

  yield* waitUntil('pointer-to-b');
  yield* all(
    replaceText(preparation.pointer, 'data pointer → B', 0.5),
    preparation.originalPath.points(
      [
        [190, -130],
        [280, -130],
        [280, 150],
        [330, 150],
      ],
      0.8,
    ),
    preparation.originalPath.stroke(palette.accent, 0.8),
    preparation.originalPath.lineWidth(3, 0.8),
  );

  yield* waitUntil('same-index');
  yield* all(
    pointerWrite.opacity(0, 0.3),
    addressBytes.root.opacity(0, 0.3),
    addressBytesName.opacity(0, 0.3),
    pointerSelection.opacity(0, 0.3),
    preparation.fakePath.lineWidth(3.5, 0.3),
  );
  preparation.result.position([0, 220]);
  preparation.result.text('view[0]');
  preparation.result.fill(palette.accent);
  yield* all(preparation.result.opacity(1, 0.4), endpoint.readName.opacity(1, 0.4));

  yield* waitUntil('read-eight');
  selectCell(endpoint.bBytes, 0);
  yield* replaceText(preparation.result, 'view[0] → 8', 0.4);

  yield* waitUntil('index-unchanged');
  yield* preparation.result.fill(palette.ink, 0.3);
  yield* preparation.result.fill(palette.accent, 0.3);

  yield* waitUntil('a-unchanged');
  yield* preparation.aBytes.cells[0].stroke(palette.accent, 0.35);
  yield* preparation.aBytes.cells[0].stroke(palette.rule, 0.35);

  yield* waitUntil('write-data');
  yield* all(endpoint.writeName.opacity(1, 0.4), endpoint.writeResult.opacity(1, 0.4));

  yield* waitUntil('byte-to-nine');
  yield* replaceText(endpoint.bBytes.values[0], '9', 0.4);

  yield* waitUntil('read-nine');
  yield* replaceText(preparation.result, 'view[0] → 9', 0.4);

  yield* waitUntil('two-writes');
  yield* all(
    preparation.result.fill(palette.ink, 0.3),
    endpoint.writeResult.fill(palette.ink, 0.3),
  );

  yield* waitUntil('metadata-write-recap');
  yield* all(pointerSelection.opacity(1, 0.4), pointerWrite.opacity(1, 0.4));

  yield* waitUntil('data-write-recap');
  yield* all(
    pointerSelection.opacity(0, 0.35),
    pointerWrite.opacity(0, 0.35),
    endpoint.writeResult.fill(palette.accent, 0.35),
    endpoint.bBytes.cells[0].stroke(palette.accent, 0.35),
  );

  yield* waitUntil('choose-address');
  yield* preparation.pointer.fill(palette.ink, 0.3);
  yield* preparation.pointer.fill(palette.accent, 0.3);

  yield* waitUntil('memory-question');
  // The audience sees the completed byte operations, not the answer to the question.
  yield* all(
    preparation.result.fill(palette.accent, 0.35),
    endpoint.writeResult.fill(palette.accent, 0.35),
  );

  yield* waitUntil('os-context');
  yield* context.root.opacity(1, 0.5);

  yield* waitUntil('os-processes');
  // Preserve the same actors while stepping out to the OS-managed process extent.
  preparation.boundary.reparent(view);
  preparation.processName.reparent(view);
  preparation.processName.text('process');
  preparation.processName.position([-550, -235]);
  yield* all(
    preparation.targetMark.opacity(0, 0.5),
    preparation.fakeHeader.opacity(0, 0.5),
    preparation.fakeLength.opacity(0, 0.5),
    preparation.fakeName.y(-135, 0.7),
    preparation.fakeName.fontSize(31, 0.7),
    preparation.fakeName.lineHeight(31 * 1.35, 0.7),
    preparation.fakeFace.size([300, 150], 0.7),
    preparation.fakeFace.fill(palette.surface, 0.7),
    replaceText(preparation.fakePointer, 'metadata', 0.6),
    preparation.fakePointer.y(0, 0.7),
    preparation.fakePointer.fontSize(29, 0.7),
    preparation.fakePointer.lineHeight(29 * 1.35, 0.7),
    preparation.fakePointer.fill(palette.ink, 0.7),
    preparation.fakePath.points(
      [
        [-400, -80],
        [-190, -80],
      ],
      0.7,
    ),
    preparation.fakePath.lineWidth(3, 0.7),
    preparation.pointer.y(-60, 0.7),
    preparation.originalPath.points(
      [
        [190, -140],
        [280, -140],
        [280, 150],
        [330, 150],
      ],
      0.7,
    ),
    preparation.root.position([-280, 70], 0.9),
    preparation.root.scale(0.6, 0.9),
    preparation.boundary.position([-280, 40], 0.9),
    preparation.boundary.size([1060, 660], 0.9),
    preparation.boundary.opacity(1, 0.7),
  );
  pointerSelection.y(-140);
  // The old title and buffer A cross the new labels' areas during this move.
  yield* all(preparation.processName.opacity(1, 0.4), context.other.opacity(1, 0.4));

  yield* waitUntil('web-page-code');
  yield* preparation.processName.fill(palette.ink, 0.4);

  yield* waitUntil('webcontent-name');
  yield* replaceText(preparation.processName, endpoint.processName.text(), 0.5);

  yield* waitUntil('objects-in-process');
  yield* all(
    preparation.realFace.stroke(palette.accent, 0.35),
    preparation.aName.fill(palette.ink, 0.35),
  );
  yield* all(
    preparation.realFace.stroke(palette.rule, 0.35),
    preparation.aName.fill(palette.muted, 0.35),
  );

  yield* waitUntil('local-access');
  yield* preparation.boundary.stroke(palette.accent, 0.5);

  yield* waitUntil('permissions');
  yield* all(
    context.destination.opacity(1, 0.4),
    context.permission.opacity(1, 0.4),
    context.permissionMark.opacity(1, 0.4),
  );

  yield* waitUntil('address-versus-permission');
  yield* all(pointerSelection.opacity(1, 0.4), context.accessAttempt.end(1, 0.7));

  yield* waitUntil('permission-limit');
  yield* all(
    pointerSelection.opacity(0, 0.4),
    context.permission.fill(palette.accent, 0.4),
    preparation.boundary.stroke(palette.rule, 0.4),
  );

  yield* waitUntil('not-all-ram');
  yield* context.os.stroke(palette.muted, 0.4);
  yield* context.os.stroke(palette.rule, 0.4);

  yield* waitUntil('kernel-unavailable');
  yield* context.kernel.opacity(1, 0.6);

  yield* waitUntil('native-question');
  yield* all(
    context.permission.opacity(0, 0.5),
    context.permissionMark.opacity(0, 0.5),
    context.destination.opacity(0, 0.5),
    context.accessAttempt.opacity(0, 0.5),
    preparation.root.position([-480, 140], 0.8),
    preparation.root.scale(0.39, 0.8),
  );
  yield* context.native.opacity(1, 0.45);

  yield* waitUntil('native-code');
  yield* all(
    context.nativeName.opacity(1, 0.4),
    context.nativeFace.opacity(1, 0.4),
    ...context.nativeLines.map((line) => line.opacity(1, 0.4)),
  );

  yield* waitUntil('kernel-question');
  // Return as attention shifts from the code question to the still-unreached kernel.
  // No code is overwritten or executed, and no connector enters kernel memory.
  yield* all(
    context.root.opacity(0, 0.65),
    preparation.root.position([0, 0], 0.9),
    preparation.root.scale(1, 0.9),
    preparation.boundary.position([0, 0], 0.9),
    preparation.boundary.size([1600, 700], 0.9),
    preparation.boundary.stroke(palette.rule, 0.9),
    preparation.processName.position([-550, -290], 0.9),
    preparation.processName.fill(palette.muted, 0.9),
  );
  // End the overview with the exact shared coordinates, including arrow tips.
  preparation.root.position([0, 0]);
  preparation.root.scale(1);
  preparation.boundary.position([0, 0]);
  preparation.boundary.size([1600, 700]);
  preparation.processName.position([-550, -290]);
  preparation.fake.position([-550, -80]);
  preparation.real.position([0, -80]);
  preparation.a.position([500, -130]);
  endpoint.b.position([500, 150]);
  preparation.fakePath.points([
    [-400, -80],
    [-190, -80],
  ]);
  preparation.originalPath.points([
    [190, -140],
    [280, -140],
    [280, 150],
    [330, 150],
  ]);
  // processAccess draws its links after the byte strips, including B's edge.
  preparation.fakePath.moveToTop();
  preparation.originalPath.moveToTop();

  yield* waitUntil('carry-access');
  yield* waitUntil('end');
});
