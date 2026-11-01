import { Layout } from '@motion-canvas/2d';
import { frame, memory, record, strip, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** The unresolved target survives the address investigation and its return. */
export function preparationPose(knownAddress = false) {
  const root = new Layout({});
  const boundary = frame(1600, 700, 0, 0, palette.rule, 'transparent');
  const processName = text('sayfayı çalıştıran process', -500, 310, 32, palette.muted);
  // Process scope is introduced in06, after the memory operation is understood.
  boundary.opacity(0);
  processName.opacity(0);
  const fake = new Layout({ position: [-550, -80] });
  const fakeFace = record(340, 220, 0, 0, palette.accent);
  const fakeName = text('sahte view', 0, -190, 30, palette.accent);
  const fakeHeader = text('type: Uint8Array', 0, 70, 24, palette.muted, true);
  const fakeLength = text('length', 0, 10, 24, palette.muted, true);
  const fakePointer = text('data → view', 0, -50, 24, palette.ink, true);
  fake.add([fakeFace, fakeName, fakeHeader, fakeLength, fakePointer]);
  const referenceSlot = new Layout({ position: [-550, 245] });
  // Keep the live address buffer from heap grooming, including its selected cell.
  const referenceValue = text(knownAddress ? 'F' : 'adres', 0, 0, 26, palette.accent, true);
  const referenceFace = memory(600, 80, 0, 0);
  const referenceName = text('ayırdığımız buffer', 0, 80, 26, palette.muted);
  const referenceCopies = new Layout({});
  const referenceCells = [-180, 0, 180].map((x) =>
    record(180, 72, x, 0, x === 0 ? palette.accent : palette.rule),
  );
  const referenceLabels = [-180, 0, 180].map((x) => {
    if (x === 0) return referenceValue;
    const label = text('', x, 0, 26, palette.muted, true);
    label.text(() => referenceValue.text());
    return label;
  });
  referenceCopies.add([...referenceCells, ...referenceLabels]);
  referenceSlot.add([referenceFace, referenceCopies, referenceName]);
  const referencePath = wire(
    [
      [-550, 205],
      [-550, 30],
    ],
    palette.accent,
  );
  referencePath.lineDash([8, 12]);
  const real = new Layout({ position: [0, -80] });
  const realFace = record(380, 220, 0, 0);
  const realName = text('view', 0, -190, 32);
  const pointer = text('data pointer', 0, -50, 29, palette.ink, true);
  const length = text('length: 4', 0, 10, 29, palette.ink, true);
  const type = text('Uint8Array', 0, 70, 29, palette.muted, true);
  // F is introduced only after the address investigation in05.
  // The real view is already held as an object reference inside that record.
  real.add([realFace, realName, pointer, length, type]);
  const a = new Layout({ position: [500, -130] });
  const aBytes = strip(['24', '48', '72', '96'], 0, 0, 85);
  const aName = text('buffer', 0, -90, 30, palette.muted);
  a.add([aBytes.root, aName]);
  const originalPath = wire(
    [
      [190, -130],
      [330, -130],
    ],
    palette.muted,
    2,
  );
  const fakePath = wire(
    [
      [-380, -130],
      [-190, -130],
    ],
    palette.accent,
  );
  fakePath.lineDash([8, 12]);
  const targetMark = wire(
    [
      [-140, -103],
      [140, -103],
    ],
    palette.accent,
    2,
    false,
  );
  const result = text('view[0] → 24', 500, 70, 31, palette.ink, true);
  root.add([
    boundary,
    processName,
    fake,
    referenceSlot,
    referencePath,
    real,
    a,
    originalPath,
    fakePath,
    targetMark,
    result,
  ]);
  return {
    root,
    boundary,
    processName,
    fake,
    fakeFace,
    fakeName,
    fakePointer,
    fakeHeader,
    fakeLength,
    referenceSlot,
    referenceFace,
    referenceValue,
    referenceName,
    referenceCopies,
    referenceCells,
    referenceLabels,
    referencePath,
    real,
    realFace,
    realName,
    pointer,
    length,
    type,
    a,
    aBytes,
    aName,
    originalPath,
    fakePath,
    targetMark,
    result,
  };
}
