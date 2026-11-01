import { Layout, Line, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { consoleDrawing } from '../../../shared/drawing';
import { arrow, label, palette, panel } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(palette.paper);

  const system = panel(860, 1280, -40, 0);
  const systemName = label('PS5', -40, -690, 54);
  const console = consoleDrawing();
  console.position([-40, -50]);
  console.scale(0.85);
  const process = new Layout({ position: [-40, -300], opacity: 0 });
  const processFace = panel(760, 510, 0, 0);
  const processName = label('process', 0, -195, 46, palette.muted);
  const object = label('object', 0, -90, 48, palette.ink, true);
  const typedView = label('view', 0, 10, 48, palette.ink, true);
  const buffer = label('buffer', 0, 110, 48, palette.ink, true);
  object.opacity(0);
  typedView.opacity(0);
  buffer.opacity(0);
  process.add([processFace, processName, object, typedView, buffer]);

  const kernel = new Layout({ position: [-40, 430], opacity: 0 });
  const kernelFace = panel(760, 240, 0, 0);
  const kernelName = label('kernel memory', 0, 0, 48, palette.muted);
  kernel.add([kernelFace, kernelName]);
  const attempt = arrow(
    [
      [-40, -45],
      [-40, 220],
    ],
    palette.accent,
  );
  attempt.end(0);
  const permission = new Line({
    points: [
      [-100, 220],
      [20, 220],
    ],
    stroke: palette.accent,
    lineWidth: 6,
    opacity: 0,
  });
  const permissionName = label('izin', 95, 220, 42, palette.muted);
  permissionName.opacity(0);
  const operations = label('read / write', -40, 70, 46, palette.accent, true);
  operations.opacity(0);
  view.add([
    system,
    systemName,
    console,
    process,
    kernel,
    attempt,
    permission,
    permissionName,
    operations,
  ]);

  yield* waitUntil('processes');
  yield* console.opacity(0, 0.35);
  yield* all(process.opacity(1, 0.4), kernel.opacity(0.7, 0.4));
  yield* waitUntil('webcontent');
  processName.text('WebContent process');
  yield* processName.fill(palette.ink, 0.25);
  yield* waitUntil('objects');
  yield* object.opacity(1, 0.25);
  yield* waitUntil('views');
  yield* typedView.opacity(1, 0.25);
  yield* waitUntil('buffers');
  yield* buffer.opacity(1, 0.25);
  yield* waitUntil('read-write');
  yield* all(processFace.stroke(palette.accent, 0.35), operations.opacity(1, 0.35));
  yield* waitUntil('permissions');
  yield* all(permission.opacity(1, 0.3), permissionName.opacity(1, 0.3));
  yield* waitUntil('pointer');
  yield* operations.opacity(0, 0.2);
  yield* attempt.end(1, 0.65);
  yield* waitUntil('access');
  yield* permissionName.fill(palette.accent, 0.3);
  yield* waitUntil('not-all-ram');
  yield* system.stroke(palette.muted, 0.35);
  yield* waitUntil('kernel');
  yield* kernel.opacity(1, 0.5);
  yield* waitUntil('end');
});
