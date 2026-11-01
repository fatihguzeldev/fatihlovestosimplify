import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, bytes, label, palette, panel, replace } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(palette.paper);
  const root = new Layout({ x: -20 });
  view.add(root);

  // The same setting and write remain before and after the permission change.
  const oid = new Layout({});
  const oidFace = panel(760, 500, 0, -120);
  const oidName = label('kernel’deki ayar', 0, -430, 44, palette.muted);
  const kindFace = panel(640, 200, 0, -170);
  const kindName = label('write izni', 0, -325, 44, palette.muted);
  const writePermission = label('write: kapalı', 0, -170, 44, palette.ink, true);
  const kind = bytes(['02', '80', '04', '80'], 0, -180, 150);
  kind.root.opacity(0);
  const targetPath = arrow([
    [0, 85],
    [0, 385],
  ]);
  const dataFace = panel(420, 190, 0, 480);
  const dataValue = label('8', 0, 510, 72, palette.ink, true);
  const requestFace = panel(500, 190, 0, -615);
  const result = label('', 0, -570, 38, palette.accent);
  const requestPath = arrow(
    [
      [200, -520],
      [350, -520],
      [350, -180],
      [320, -180],
    ],
    palette.accent,
  );
  requestPath.end(0);
  oid.add([
    oidFace,
    oidName,
    kindFace,
    kindName,
    writePermission,
    kind.root,
    label('data pointer', 0, 40, 42, palette.muted, true),
    targetPath,
    dataFace,
    label('data', 0, 430, 42, palette.muted),
    dataValue,
    requestFace,
    label('program', 0, -675, 42, palette.muted),
    label('write(9)', 0, -625, 48, palette.ink, true),
    result,
    requestPath,
  ]);

  const cleanup = new Layout({ opacity: 0 });
  const cleanupFace = panel(740, 200, 0, -460);
  const cleanupName = label('kernel’deki cleanup', 0, -515, 44, palette.muted);
  const cleanupCode = label('--(*target)', 0, -425, 58, palette.ink, true);
  const preparedFace = panel(620, 180, 0, -20);
  const preparedValue = label('target', 0, 15, 54, palette.ink, true);
  const follow = arrow([
    [0, -360],
    [0, -110],
  ]);
  const toValue = arrow([
    [0, 70],
    [0, 270],
  ]);
  toValue.end(0);
  const valueFace = panel(420, 180, 0, 360);
  const value = label('7', 0, 380, 76, palette.ink, true);
  const atK = new Layout({ opacity: 0 });
  atK.add([valueFace, value, label('adres K', 0, 300, 44, palette.muted, true)]);
  const staleFace = panel(340, 90, -180, 200, palette.accent);
  staleFace.opacity(0);
  const stale = arrow(
    [
      [-350, 200],
      [-400, 200],
      [-400, -20],
      [-310, -20],
    ],
    palette.accent,
  );
  stale.end(0);
  const staleName = label('eski pointer', -180, 200, 40, palette.muted, true);
  staleName.opacity(0);
  const primitiveName = label('decrement primitive', 0, -515, 44, palette.muted);
  primitiveName.opacity(0);
  cleanup.add([
    cleanupFace,
    cleanupName,
    cleanupCode,
    follow,
    primitiveName,
    preparedFace,
    label('hedef pointer', 0, -65, 42, palette.muted),
    preparedValue,
    toValue,
    atK,
    staleFace,
    stale,
    staleName,
  ]);
  const operation = label('−1', 225, -420, 50, palette.accent, true);
  const operationPath = arrow(
    [
      [225, -375],
      [225, -232],
    ],
    palette.accent,
  );
  operation.opacity(0);
  operationPath.opacity(0);
  root.add([oid, cleanup, operation, operationPath]);

  yield* waitUntil('denied-write');
  yield* requestPath.end(1, 0.5);
  yield* waitUntil('write-denied');
  result.text('reddedildi');
  requestFace.stroke(palette.accent);
  yield* waitUntil('kernel-record');
  yield* oidFace.stroke(palette.accent, 0.3);
  yield* waitUntil('name-oid');
  yield* replace(oidName, 'OID', 0.24);
  yield* waitUntil('record-fields');
  yield* replace(kindName, 'type / izin', 0.24);
  yield* waitUntil('record-pointer');
  yield* all(targetPath.stroke(palette.accent, 0.3), dataFace.stroke(palette.accent, 0.3));

  yield* waitUntil('cleanup-operation');
  yield* oid.opacity(0, 0.3);
  yield* cleanup.opacity(1, 0.4);
  yield* waitUntil('follow-target');
  follow.stroke(palette.accent);
  yield* follow.lineWidth(6, 0.3);
  yield* follow.lineWidth(4, 0.3);
  yield* waitUntil('target-k');
  yield* replace(preparedValue, 'K', 0.24);
  yield* toValue.end(1, 0.6);
  yield* waitUntil('target-seven');
  yield* atK.opacity(1, 0.3);
  yield* waitUntil('one-less');
  yield* all(valueFace.stroke(palette.accent, 0.3), cleanupFace.stroke(palette.accent, 0.3));
  yield* replace(value, '6', 0.3);
  yield* waitUntil('kernel-code');
  yield* cleanupCode.fill(palette.accent, 0.3);
  yield* waitUntil('chosen-target');
  yield* all(staleFace.opacity(1, 0.25), staleName.opacity(1, 0.25));
  yield* all(stale.end(1, 0.6), preparedFace.stroke(palette.accent, 0.3));
  yield* waitUntil('limited-operation');
  yield* valueFace.fill(palette.accentWash, 0.3);
  yield* waitUntil('name-primitive');
  yield* cleanupName.opacity(0, 0.15);
  yield* primitiveName.opacity(1, 0.25);

  yield* waitUntil('permission-in-memory');
  yield* cleanup.opacity(0, 0.3);
  yield* oid.opacity(1, 0.4);
  yield* waitUntil('metadata');
  yield* all(kindFace.stroke(palette.accent, 0.35), kindFace.fill(palette.accentWash, 0.35));
  yield* waitUntil('four-bytes');
  yield* all(kindFace.height(270, 0.35), kindFace.y(-150, 0.35), writePermission.y(-55, 0.35));
  yield* kind.root.opacity(1, 0.25);
  yield* waitUntil('repeat-decrement');
  operation.opacity(1);
  operationPath.opacity(1);
  kind.cells[3].stroke(palette.accent);
  kind.values[3].fill(palette.accent);
  // Sixteen separate -1 operations turn0x80 into0x70.
  for (let byte = 0x7f; byte >= 0x70; byte--) {
    kind.values[3].text(byte.toString(16).toUpperCase());
    yield* kind.cells[3].fill(palette.accentWash, 0.12);
    yield* kind.cells[3].fill(palette.surface, 0.12);
  }
  yield* waitUntil('permission-changed');
  yield* all(operation.opacity(0, 0.2), operationPath.opacity(0, 0.2));
  yield* replace(writePermission, 'write: açık', 0.25);
  writePermission.fill(palette.accent);
  yield* waitUntil('retry-write');
  result.text('');
  requestPath.end(0);
  yield* requestPath.end(1, 0.5);
  yield* waitUntil('write-accepted');
  result.text('kabul edildi');
  targetPath.end(0);
  targetPath.stroke(palette.accent);
  yield* targetPath.end(1, 0.5);
  yield* waitUntil('data-changed');
  dataFace.stroke(palette.accent);
  dataValue.fill(palette.accent);
  yield* replace(dataValue, '9', 0.24);
  yield* waitUntil('end');
});
