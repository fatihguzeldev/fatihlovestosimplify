import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, label, palette, panel } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const tree = new Layout({});
  const systemRoot = panel(200, 100, -190, -610);
  const system = panel(300, 100, -190, -360);
  const target = panel(440, 110, -80, -105);
  const targetName = label('hedef dosya', -80, -105, 46);
  const sandbox = panel(300, 100, -190, 155);
  const data = panel(280, 100, -210, 430);
  const cache = panel(280, 100, 170, 430);
  const branch = (points: [number, number][]) => {
    const edge = arrow(points, palette.rule);
    edge.endArrow(false);
    return edge;
  };
  const branches = [
    branch([
      [-190, -560],
      [-190, -410],
    ]),
    branch([
      [-190, -310],
      [-190, -220],
      [-80, -220],
      [-80, -160],
    ]),
    branch([
      [-290, -610],
      [-395, -610],
      [-395, 155],
      [-340, 155],
    ]),
    branch([
      [-190, 205],
      [-190, 300],
      [-210, 300],
      [-210, 380],
    ]),
    branch([
      [-190, 300],
      [170, 300],
      [170, 380],
    ]),
  ];
  tree.add([
    ...branches,
    systemRoot,
    label('/', -190, -610, 58, palette.ink, true),
    system,
    label('system', -190, -360, 46, palette.ink, true),
    target,
    targetName,
    sandbox,
    label('sandbox', -190, 155, 46, palette.ink, true),
    data,
    label('data', -210, 430, 46, palette.ink, true),
    cache,
    label('cache', 170, 430, 46, palette.ink, true),
  ]);
  const boundary = panel(800, 590, -20, 355, palette.accent, 'transparent');
  const localName = label('process’in gördüğü ağaç', -20, 585, 44, palette.muted);
  const process = new Layout({ position: [230, -585] });
  const uid = label('root', 0, 32, 48, palette.accent, true);
  process.add([
    panel(300, 150, 0, 0),
    label('process', 0, -112, 44),
    label('kimlik', 0, -34, 44, palette.muted),
    uid,
  ]);
  const origin = arrow(
    [
      [230, -510],
      [350, -510],
      [350, 155],
      [-40, 155],
    ],
    palette.accent,
  );
  origin.end(0);
  const rootField = label('filesystem root', 150, 15, 38, palette.accent, true);
  rootField.opacity(0);
  view.add([tree, boundary, localName, process, origin, rootField]);
  yield* waitUntil('local-root');
  yield* origin.end(1, 0.6);
  yield* waitUntil('subtree');
  yield* all(boundary.lineWidth(4, 0.35), localName.fill(palette.ink, 0.35));
  yield* waitUntil('slash');
  yield* rootField.opacity(1, 0.3);
  yield* waitUntil('target-outside');
  yield* all(
    target.opacity(1, 0.35),
    targetName.opacity(1, 0.35),
    target.stroke(palette.accent, 0.35),
  );
  yield* waitUntil('root-not-enough');
  yield* all(uid.fontSize(54, 0.3), boundary.stroke(palette.accent, 0.3));
  yield* waitUntil('separate-fields');
  yield* all(uid.fontSize(48, 0.3), rootField.fill(palette.ink, 0.3));
  yield* waitUntil('change-root');
  yield* all(origin.end(0, 0.3), rootField.opacity(0, 0.25));
  origin.points([
    [80, -610],
    [-90, -610],
  ]);
  yield* all(
    origin.end(1, 0.55),
    boundary.opacity(0, 0.55),
    localName.opacity(0, 0.55),
    systemRoot.stroke(palette.accent, 0.55),
  );
  yield* waitUntil('same-file');
  yield* all(target.fill(palette.accentWash, 0.4), targetName.fill(palette.accent, 0.4));
  yield* waitUntil('end');
});
