import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, label, palette, panel, replace } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(palette.paper);
  const index = new Layout({ y: -600 });
  const indexType = label('index', 0, -115, 44, palette.muted);
  const indexValue = label('1', 0, 0, 62, palette.ink, true);
  const indexFace = panel(760, 150, 0, 0);
  index.add([indexFace, indexType, indexValue]);

  const check = new Layout({ y: -350, opacity: 0 });
  const condition = label('0 <= index < count', 0, -25, 42, palette.ink, true);
  const reject = label('0, 1, 2', 0, 45, 40, palette.muted, true);
  check.add([panel(760, 155, 0, 0), condition, reject]);
  const count = label('count = 3', 0, -215, 40, palette.muted, true);
  count.opacity(0);
  const conditionInput = arrow(
    [
      [0, -525],
      [0, -430],
    ],
    palette.accent,
  );
  conditionInput.end(0);

  const outside = new Layout({ y: -35, opacity: 0 });
  const outsideFace = panel(650, 120, 0, 0, palette.accent);
  const outsideName = label('liste öncesi', 0, -110, 44, palette.muted);
  const outsideValue = label('?', 0, 0, 58, palette.accent, true);
  outside.add([outsideFace, outsideName, outsideValue]);
  const invalidPath = arrow(
    [
      [-380, -350],
      [-405, -350],
      [-405, -35],
      [-325, -35],
    ],
    palette.accent,
  );
  invalidPath.end(0);

  const list = new Layout({});
  const listTitle = label('C++ object listesi', 0, -265, 44, palette.muted);
  const listFace = panel(760, 440, 0, 0);
  const entries = ['object', 'cart', 'object'].map((value, i) => {
    const row = new Layout({ y: -135 + i * 135 });
    const face = panel(540, 90, 55, 0);
    row.add([
      face,
      label(String(i), -300, 0, 46, palette.muted, true),
      label(value, 55, 0, 48, palette.ink, true),
    ]);
    return { row, face };
  });
  list.add([listFace, listTitle, ...entries.map((entry) => entry.row)]);
  const result = label('memory read', 0, 620, 46, palette.accent, true);
  result.opacity(0);
  const normalPath = arrow(
    [
      [0, -525],
      [0, -465],
      [365, -465],
      [365, 0],
      [325, 0],
    ],
    palette.accent,
  );
  entries[1].face.stroke(palette.accent);
  view.add([list, index, normalPath, check, count, conditionInput, invalidPath, outside, result]);

  yield* waitUntil('bounds');
  yield* normalPath.opacity(0, 0.2);
  yield* all(list.y(350, 0.45), entries[1].face.stroke(palette.rule, 0.3));
  yield* all(check.opacity(1, 0.35), count.opacity(1, 0.35));
  yield* conditionInput.end(1, 0.4);
  yield* waitUntil('upper-only');
  yield* all(replace(condition, 'if (index >= count)'), replace(reject, 'reject'));

  yield* waitUntil('negative-passes');
  yield* all(replace(indexValue, '−1'), indexValue.fill(palette.accent, 0.25));
  yield* replace(condition, '−1 >= 3');
  yield* replace(reject, 'false');
  reject.fill(palette.accent);

  yield* waitUntil('before-list');
  yield* all(
    entries[1].face.stroke(palette.rule, 0.3),
    outside.opacity(1, 0.35),
    indexFace.stroke(palette.accent, 0.35),
  );
  yield* invalidPath.end(1, 0.6);

  yield* waitUntil('interpret-value');
  yield* replace(outsideValue, 'JS değeri?');
  yield* waitUntil('native-list');
  yield* listTitle.fill(palette.accent, 0.3);
  yield* waitUntil('memory-read');
  yield* result.opacity(1, 0.3);
  yield* waitUntil('end');
});
