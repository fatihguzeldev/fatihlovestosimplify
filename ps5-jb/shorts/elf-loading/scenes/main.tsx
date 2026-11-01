import { Circle, Layout, Line, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, label, palette, panel, replace } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const file = new Layout({ position: [-20, -220] });
  const fileFace = panel(680, 350, 0, 0);
  const filename = label('program dosyası', 0, -225, 48);
  const codeSource = label('code', 0, -85, 48, palette.ink, true);
  const dataSource = label('data', 0, 0, 48, palette.muted, true);
  const layoutInfo = label('yerleşim bilgisi', 0, 95, 44, palette.muted);
  const sectionRule = new Line({
    points: [
      [-280, 45],
      [280, 45],
    ],
    stroke: palette.rule,
    lineWidth: 2,
  });
  file.add([fileFace, filename, codeSource, dataSource, sectionRule, layoutInfo]);
  layoutInfo.opacity(0);
  sectionRule.opacity(0);

  const memory = new Layout({ position: [-20, 240], opacity: 0 });
  const memoryFace = panel(760, 650, 0, 0);
  const codeFace = panel(580, 210, 0, -125);
  const dataFace = panel(580, 150, 0, 170);
  const codeName = label('code', 0, -285, 46, palette.muted, true);
  const dataName = label('data', 0, 280, 44, palette.muted, true);
  const instructions = new Layout({ position: [-35, -125], opacity: 0 });
  for (const [i, width] of [220, 165, 195].entries()) {
    instructions.add(
      new Line({
        points: [
          [-120, -45 + i * 45],
          [-120 + width, -45 + i * 45],
        ],
        stroke: palette.muted,
        lineWidth: 4,
        lineCap: 'round',
      }),
    );
  }
  const dataContent = new Layout({ position: [0, 170], opacity: 0 });
  for (let i = 0; i < 4; i++) dataContent.add(panel(48, 48, -105 + i * 70, 0, palette.muted));
  const entry = new Circle({
    position: [-235, -170],
    size: 15,
    stroke: palette.accent,
    lineWidth: 3,
    opacity: 0,
  });
  const running = new Circle({
    position: [-235, -170],
    size: 16,
    fill: palette.accent,
    opacity: 0,
  });
  memory.add([
    memoryFace,
    label('memory', 0, -385, 46, palette.muted),
    codeFace,
    dataFace,
    codeName,
    dataName,
    instructions,
    dataContent,
    entry,
    running,
  ]);
  const codeCopy = arrow(
    [
      [320, -525],
      [365, -525],
      [365, 115],
      [270, 115],
    ],
    palette.accent,
  );
  const dataCopy = arrow(
    [
      [-360, -440],
      [-395, -440],
      [-395, 410],
      [-310, 410],
    ],
    palette.accent,
  );
  codeCopy.end(0);
  dataCopy.end(0);
  const entryName = label('entry point', -20, 600, 44, palette.accent, true);
  entryName.opacity(0);
  view.add([file, memory, codeCopy, dataCopy, entryName]);

  yield* waitUntil('elf');
  yield* replace(filename, 'loader.elf');
  yield* waitUntil('code-data');
  yield* all(codeSource.fill(palette.accent, 0.35), dataSource.fill(palette.accent, 0.35));
  yield* waitUntil('layout');
  yield* all(layoutInfo.opacity(1, 0.3), sectionRule.opacity(1, 0.3));
  yield* waitUntil('prepare-memory');
  yield* file.y(-440, 0.65);
  yield* memory.opacity(1, 0.35);
  yield* waitUntil('load-code');
  yield* all(codeSource.fill(palette.accent, 0.25), codeFace.stroke(palette.accent, 0.25));
  yield* codeCopy.end(1, 0.45);
  yield* instructions.opacity(1, 0.2);
  yield* codeCopy.end(0, 0.15);
  yield* waitUntil('load-data');
  yield* all(dataSource.fill(palette.accent, 0.25), dataFace.stroke(palette.accent, 0.25));
  yield* dataCopy.end(1, 0.45);
  yield* dataContent.opacity(1, 0.2);
  yield* dataCopy.end(0, 0.15);
  yield* all(codeFace.stroke(palette.rule, 0.25), dataFace.stroke(palette.rule, 0.25));
  yield* waitUntil('entry');
  yield* all(entry.opacity(1, 0.25), entryName.opacity(1, 0.25));
  yield* waitUntil('execute');
  yield* all(
    running.opacity(1, 0.2),
    entryName.opacity(0, 0.2),
    codeFace.stroke(palette.accent, 0.25),
  );
  yield* running.x(100, 1.1);
  yield* waitUntil('loader-runs');
  yield* replace(codeName, 'çalışan loader');
  codeName.fill(palette.accent);
  yield* running.position([-155, -125], 0.28);
  yield* running.x(45, 0.65);
  yield* running.position([-155, -80], 0.28);
  yield* running.x(90, 0.65);
  yield* waitUntil('end');
});
