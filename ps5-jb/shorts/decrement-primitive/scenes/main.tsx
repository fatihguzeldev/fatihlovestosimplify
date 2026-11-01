import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, bytes, label, palette, panel, replace } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(palette.paper);
  const root = new Layout({ x: -20 });
  view.add(root);

  const example = new Layout({});
  const valueFace = panel(420, 220, 0, -320);
  const value = label('7', 0, -320, 100, palette.ink, true);
  const numberName = label('sayı', -210, -370, 46, palette.muted);
  numberName.opacity(0);
  example.add([valueFace, value, numberName]);
  const operation = label('−1', 0, -650, 66, palette.accent, true);
  const operationPath = arrow(
    [
      [0, -595],
      [0, -445],
    ],
    palette.accent,
  );
  const primitiveName = label('decrement primitive', 0, 40, 44, palette.muted);
  primitiveName.opacity(0);

  const address = new Layout({ opacity: 0 });
  const addressFace = panel(740, 150, 0, -150);
  address.add([
    addressFace,
    label('adres', -210, -150, 46, palette.muted),
    label('data pointer', 130, -150, 40, palette.ink, true),
  ]);
  const permission = new Layout({ opacity: 0 });
  const permissionFace = panel(740, 150, 0, 70);
  permission.add([
    permissionFace,
    label('izin', -210, 70, 46, palette.muted),
    label('write: kapalı', 125, 70, 40, palette.ink, true),
  ]);
  root.add([example, operation, operationPath, primitiveName, address, permission]);

  const oid = new Layout({ opacity: 0 });
  const oidFace = panel(760, 500, 0, -120);
  const oidName = label('kernel kaydı', -170, -430, 44, palette.muted);
  const fields = new Layout({ opacity: 0 });
  const kindFace = panel(640, 200, 0, -170);
  const kindName = label('tür / izin', 0, -325, 42, palette.muted);
  const writePermission = label('write: kapalı', 0, -170, 44, palette.ink, true);
  const kind = bytes(['02', '80', '04', '80'], 0, -180, 150);
  kind.root.opacity(0);
  fields.add([kindFace, kindName, writePermission, kind.root]);

  const target = new Layout({ opacity: 0 });
  const targetPath = arrow([
    [0, 85],
    [0, 385],
  ]);
  const dataFace = panel(420, 190, 0, 480);
  const dataValue = label('8', 0, 510, 72, palette.ink, true);
  target.add([
    label('data pointer', 0, 40, 42, palette.muted, true),
    targetPath,
    dataFace,
    label('data', 0, 430, 42, palette.muted),
    dataValue,
  ]);
  const request = new Layout({ opacity: 0 });
  const requestFace = panel(500, 150, 0, -620);
  const result = label('', 0, -585, 38, palette.accent);
  request.add([requestFace, label('write(9)', 0, -640, 50, palette.ink, true), result]);
  const requestPath = arrow(
    [
      [200, -545],
      [350, -545],
      [350, -180],
      [320, -180],
    ],
    palette.accent,
  );
  requestPath.end(0);
  oid.add([oidFace, oidName, fields, target, request, requestPath]);
  root.add(oid);

  yield* waitUntil('one-less');
  valueFace.stroke(palette.accent);
  yield* replace(value, '6', 0.3);
  yield* waitUntil('name-primitive');
  yield* primitiveName.opacity(1, 0.25);

  yield* waitUntil('meanings');
  yield* all(
    operation.opacity(0, 0.2),
    operationPath.opacity(0, 0.2),
    primitiveName.opacity(0, 0.2),
  );
  yield* all(
    valueFace.size([740, 150], 0.55),
    valueFace.y(-370, 0.55),
    value.position([210, -370], 0.55),
    value.fontSize(54, 0.55),
    valueFace.stroke(palette.rule, 0.3),
  );
  yield* waitUntil('number');
  yield* numberName.opacity(1, 0.2);
  yield* waitUntil('address');
  yield* address.opacity(1, 0.25);
  yield* waitUntil('permission');
  yield* permission.opacity(1, 0.25);
  yield* waitUntil('permission-matters');
  yield* all(
    example.opacity(0.35, 0.35),
    address.opacity(0.35, 0.35),
    permissionFace.stroke(palette.accent, 0.35),
    permissionFace.fill(palette.accentWash, 0.35),
  );

  yield* waitUntil('kernel-record');
  yield* all(
    example.opacity(0, 0.25),
    address.opacity(0, 0.25),
    permission.opacity(0, 0.25),
    primitiveName.opacity(0, 0.25),
  );
  yield* oid.opacity(1, 0.4);
  yield* waitUntil('name-oid');
  yield* replace(oidName, 'OID', 0.24);
  yield* waitUntil('record-fields');
  yield* fields.opacity(1, 0.3);
  yield* waitUntil('record-pointer');
  yield* target.opacity(1, 0.35);

  yield* waitUntil('denied-write');
  yield* request.opacity(1, 0.25);
  yield* requestPath.end(1, 0.45);
  yield* waitUntil('write-denied');
  result.text('reddedildi');
  requestFace.stroke(palette.accent);
  yield* waitUntil('metadata');
  yield* all(kindFace.stroke(palette.accent, 0.35), kindFace.fill(palette.accentWash, 0.35));
  yield* waitUntil('four-bytes');
  yield* all(kindFace.height(270, 0.35), kindFace.y(-150, 0.35), writePermission.y(-55, 0.35));
  yield* kind.root.opacity(1, 0.25);
  yield* waitUntil('repeat-decrement');
  operation.position([225, -420]);
  operation.fontSize(50);
  operationPath.points([
    [225, -375],
    [225, -232],
  ]);
  operationPath.end(1);
  operation.opacity(1);
  operationPath.opacity(1);
  kind.cells[3].stroke(palette.accent);
  kind.values[3].fill(palette.accent);
  // Sixteen -1 operations turn 0x80 into 0x70; the other three bytes do not change.
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
