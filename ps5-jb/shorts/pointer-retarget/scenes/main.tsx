import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, bytes, label, palette, panel, replace } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(palette.paper);
  const real = new Layout({ y: -380, opacity: 0 });
  const face = panel(600, 120, 0, 0);
  const constructor = label('Uint8Array(buffer)', 0, 0, 42, palette.ink, true);
  const name = label('view', 0, -140, 48);
  name.opacity(0);
  const metadata = label('metadata', 0, -190, 40, palette.muted);
  metadata.opacity(0);
  const type = label('type: Uint8Array', 0, -70, 44, palette.muted, true);
  const length = label('length: 4', 0, 0, 44, palette.muted, true);
  const pointerName = label('data pointer:', -70, 70, 42, palette.ink, true);
  const pointerValue = label('A', 240, 70, 50, palette.accent, true);
  const pointerSelection = panel(690, 78, 0, 70, palette.accent, 'transparent');
  pointerSelection.opacity(0);
  for (const node of [type, length, pointerName, pointerValue]) node.opacity(0);
  real.add([
    face,
    constructor,
    name,
    metadata,
    type,
    length,
    pointerSelection,
    pointerName,
    pointerValue,
  ]);

  const a = new Layout({ y: 60 });
  const aBytes = bytes(['24', '48', '72', '96'], 0, 0, 160);
  aBytes.values.forEach((value) => value.opacity(0));
  const aName = label('buffer', 0, -110, 46, palette.muted);
  const aAddress = label('adres A', 0, 100, 40, palette.muted, true);
  aAddress.opacity(0);
  a.add([aBytes.root, aName, aAddress]);
  const b = new Layout({ y: 480, opacity: 0 });
  const bBytes = bytes(['8', '16', '32', '64'], 0, 0, 160);
  const bName = label('buffer B', 0, -110, 46, palette.muted);
  const bAddress = label('adres B', 0, 100, 40, palette.accent, true);
  bAddress.opacity(0);
  b.add([bBytes.root, bName, bAddress]);

  const aPath = arrow([
    [-300, -380],
    [-395, -380],
    [-395, 60],
    [-320, 60],
  ]);
  aPath.end(0);
  const bPath = arrow(
    [
      [-370, -310],
      [-395, -310],
      [-395, 480],
      [-320, 480],
    ],
    palette.accent,
  );
  bPath.end(0);

  const readout = new Layout({ y: 315 });
  const query = label('view[0]', -160, 0, 54, palette.ink, true);
  const readArrow = arrow([
    [-5, 0],
    [185, 0],
  ]);
  const value = label('?', 235, 0, 64, palette.accent, true);
  readout.add([query, readArrow, value]);
  view.add([aPath, bPath, real, a, b, readout]);

  yield* waitUntil('byte-24');
  yield* aBytes.values[0].opacity(1, 0.15);
  yield* waitUntil('byte-48');
  yield* aBytes.values[1].opacity(1, 0.15);
  yield* waitUntil('byte-72');
  yield* aBytes.values[2].opacity(1, 0.15);
  yield* waitUntil('byte-96');
  yield* aBytes.values[3].opacity(1, 0.15);
  yield* waitUntil('create-view');
  yield* real.opacity(1, 0.35);
  yield* aPath.end(1, 0.5);
  yield* waitUntil('name-view');
  yield* name.opacity(1, 0.2);
  yield* waitUntil('normal-read');
  yield* readout.opacity(1, 0.2);
  yield* waitUntil('read-24');
  yield* replace(value, '24');
  yield* all(
    value.opacity(1, 0.2),
    readArrow.opacity(1, 0.2),
    aBytes.cells[0].stroke(palette.accent, 0.2),
  );

  yield* waitUntil('open-metadata');
  yield* constructor.opacity(0, 0.2);
  yield* all(
    face.width(740, 0.5),
    face.height(300, 0.5),
    name.y(-240, 0.5),
    aPath.points(
      [
        [-370, -310],
        [-395, -310],
        [-395, 60],
        [-320, 60],
      ],
      0.5,
    ),
  );
  yield* waitUntil('type');
  yield* type.opacity(1, 0.25);
  yield* waitUntil('length');
  yield* length.opacity(1, 0.25);
  yield* waitUntil('pointer');
  aName.text('buffer A');
  yield* all(pointerName.opacity(1, 0.3), pointerValue.opacity(1, 0.3), aAddress.opacity(1, 0.3));
  yield* waitUntil('metadata');
  yield* metadata.opacity(1, 0.25);
  yield* waitUntil('pointer-selects');
  yield* all(pointerSelection.opacity(1, 0.25), aPath.stroke(palette.accent, 0.25));

  yield* waitUntil('second-buffer');
  // A readout is a transient operation; keep the actual buffers visible while reflowing.
  yield* readout.opacity(0, 0.15);
  readout.y(-70);
  yield* all(
    a.y(160, 0.5),
    b.opacity(1, 0.5),
    aPath.points(
      [
        [-370, -310],
        [-395, -310],
        [-395, 160],
        [-320, 160],
      ],
      0.5,
    ),
    aBytes.cells[0].stroke(palette.rule, 0.5),
  );
  yield* readout.opacity(1, 0.2);
  yield* waitUntil('address-b');
  yield* bAddress.opacity(1, 0.25);

  yield* waitUntil('pointer-is-b');
  yield* all(
    aPath.opacity(0, 0.2),
    value.opacity(0, 0.2),
    readArrow.opacity(0, 0.2),
    query.fill(palette.muted, 0.2),
    replace(pointerValue, 'B'),
  );
  yield* bPath.end(1, 0.5);

  yield* waitUntil('read-b');
  yield* query.fill(palette.ink, 0.2);
  yield* waitUntil('read-8');
  value.text('8');
  yield* all(
    value.opacity(1, 0.2),
    readArrow.opacity(1, 0.2),
    bBytes.cells[0].stroke(palette.accent, 0.2),
  );
  yield* waitUntil('a-unchanged');
  yield* all(
    aBytes.cells[0].stroke(palette.accent, 0.25),
    aBytes.values[0].fill(palette.accent, 0.25),
  );

  yield* waitUntil('write-data');
  yield* all(query.opacity(0, 0.15), value.opacity(0, 0.15), readArrow.opacity(0, 0.15));
  query.x(0);
  query.text('view[0] = 9');
  yield* query.opacity(1, 0.2);
  yield* waitUntil('byte-is-9');
  yield* replace(bBytes.values[0], '9');
  yield* bBytes.cells[0].fill(palette.accentWash, 0.2);
  yield* waitUntil('read-again');
  yield* query.opacity(0, 0.12);
  query.text('view[0]');
  query.x(-160);
  value.text('9');
  yield* all(query.opacity(1, 0.2), value.opacity(1, 0.2), readArrow.opacity(1, 0.2));

  yield* waitUntil('first-write');
  yield* all(
    pointerSelection.opacity(1, 0.25),
    bBytes.cells[0].stroke(palette.rule, 0.25),
    aBytes.cells[0].stroke(palette.rule, 0.25),
    aBytes.values[0].fill(palette.ink, 0.25),
  );
  yield* waitUntil('second-write');
  yield* all(pointerSelection.opacity(0.25, 0.25), bBytes.cells[0].stroke(palette.accent, 0.25));
  yield* waitUntil('end');
});
