import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, tween, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { frame, memory, strip, text, wire } from '../../shared/drawing';
import { createRoom } from '../00-opening/room';
import { palette } from '../../shared/theme';
import { loaderReadyPose } from '../11-native/11-native';

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const trace = loaderReadyPose();
  const room = createRoom();
  room.root.opacity(0);
  const loader = new Layout({});
  const recap = new Layout({});
  const loaderTitles = new Layout({});
  recap.add(loaderTitles);
  const credits = new Layout({ opacity: 0 });
  const creditName = text('ReLapse by ntfargo', 0, -480, 29);
  const sourceName = text('github.com/ntfargo/Relapse-Exploit', 0, -439, 24, palette.muted, true);
  sourceName.opacity(0);
  credits.add([creditName, sourceName]);
  view.add([room.root, trace.root, loader, recap, credits]);

  // Every stage uses the same process and the already-running loader. The
  // recap adds only the earlier access paths; it never sends a new payload.
  const browserMemory = new Layout({ position: [-430, -220], opacity: 0 });
  const bytes = strip(['9', '16', '32', '64'], 0, 0, 72);
  browserMemory.add([text('memory read/write', 0, -80, 28, palette.accent, true), bytes.root]);
  const native = new Layout({ position: [-430, -30], opacity: 0 });
  native.add([frame(380, 110, 0, 0, palette.rule, 'transparent'), text('native kod', 0, 0, 31)]);
  const kernel = new Layout({ opacity: 0 });
  const kernelBoundary = frame(740, 760, 430, 0, palette.rule, 'transparent');
  const request = frame(380, 110, 430, -30, palette.rule, 'transparent');
  const requestName = text('istek', 430, -30, 31);
  kernel.add([kernelBoundary, text('kernel', 430, -345, 31, palette.muted), request, requestName]);
  const kernelMemory = new Layout({ position: [430, -220], opacity: 0 });
  kernelMemory.add([
    memory(320, 100, 0, 0, palette.accent),
    text('data', 0, 0, 31),
    text('memory read/write', 0, -80, 28, palette.accent, true),
  ]);
  const browserToNative = wire(
    [
      [-430, -174],
      [-430, -95],
    ],
    palette.accent,
  );
  const nativeToKernel = wire(
    [
      [-225, -30],
      [225, -30],
    ],
    palette.accent,
  );
  const kernelAccess = wire(
    [
      [430, -95],
      [430, -160],
    ],
    palette.accent,
  );
  const credentials = new Layout({ opacity: 0 });
  const credentialFace = frame(380, 220, 430, 230, palette.rule, 'transparent');
  credentials.add([credentialFace, text('process kayıtları', 430, 80, 28, palette.muted)]);
  const writeCredentials = wire(
    [
      [605, -220],
      [720, -220],
      [720, 230],
      [635, 230],
    ],
    palette.accent,
  );
  const permitLoader = wire(
    [
      [225, 230],
      [-195, 230],
    ],
    palette.accent,
  );
  [browserToNative, nativeToKernel, kernelAccess, writeCredentials, permitLoader].forEach((path) =>
    path.end(0),
  );
  recap.add([
    browserMemory,
    native,
    kernel,
    kernelMemory,
    browserToNative,
    nativeToKernel,
    kernelAccess,
    credentials,
    writeCredentials,
    permitLoader,
  ]);

  yield* waitUntil('loader-is-listening');
  yield* all(trace.listener.fill(palette.accent, 0.35), trace.entry.opacity(0, 0.35));

  yield* waitUntil('recap-browser-memory');
  for (const node of [
    trace.area,
    trace.code,
    trace.data,
    trace.codeName,
    trace.dataName,
    trace.entry,
    trace.run,
  ])
    node.reparent(loader);
  for (const label of [trace.areaName, trace.listener, trace.waiting]) label.reparent(loaderTitles);
  yield* all(
    trace.authority.root.opacity(0, 0.25),
    trace.handoff.root.opacity(0, 0.25),
    trace.codeName.opacity(0, 0.25),
    trace.dataName.opacity(0, 0.25),
  );
  trace.authority.root.reparent(credentials);
  trace.authority.root.position([430, 230]);
  trace.authority.uid.position([0, -60]);
  trace.authority.uid.text('UID 0');
  trace.authority.uid.fontSize(31);
  trace.authority.uid.lineHeight(31 * 1.35);
  trace.authority.filesystem.position([0, 0]);
  trace.authority.filesystem.text('filesystem root: /');
  trace.authority.platform.position([0, 60]);
  trace.authority.platform.text('platform izinleri');
  trace.authority.root.opacity(1);
  yield* all(
    trace.process.position([-430, 0], 0.65),
    trace.process.size([740, 760], 0.65),
    trace.processName.position([-430, -345], 0.65),
    loader.position([-430, 230], 0.65),
    loader.scale(0.55, 0.65),
    loader.opacity(0.25, 0.65),
    loaderTitles.opacity(0.25, 0.65),
    trace.areaName.position([-430, 75], 0.65),
    trace.listener.position([-430, 118], 0.65),
    trace.waiting.position([-430, 168], 0.65),
  );
  trace.processName.text('tarayıcı process’i');
  yield* browserMemory.opacity(1, 0.3);

  yield* waitUntil('recap-native-request');
  yield* all(native.opacity(1, 0.3), kernel.opacity(1, 0.3));
  yield* all(browserToNative.end(1, 0.45), nativeToKernel.end(1, 0.6));

  yield* waitUntil('recap-kernel-memory');
  yield* kernelMemory.opacity(1, 0.3);
  yield* kernelAccess.end(1, 0.45);

  yield* waitUntil('recap-process-records');
  yield* credentials.opacity(1, 0.3);
  yield* writeCredentials.end(1, 0.6);
  yield* credentialFace.stroke(palette.accent, 0.25);

  yield* waitUntil('recap-loader');
  yield* all(
    permitLoader.end(1, 0.55),
    loader.opacity(1, 0.4),
    loaderTitles.opacity(1, 0.4),
    trace.area.stroke(palette.accent, 0.4),
  );

  yield* waitUntil('name-webcontent-process');
  trace.processName.text('WebContent process');
  yield* waitUntil('same-user-mode');
  trace.processName.text('WebContent process (user mode)');
  yield* all(
    trace.process.stroke(palette.accent, 0.4),
    trace.processName.fill(palette.accent, 0.4),
  );

  yield* waitUntil('same-page-same-console');
  // At the console sentence, the whole causal path becomes an interior of
  // the physical PS5. The paper backing makes the first zoom frame seamless.
  const consoleCenter = room.console.position();
  const closeScale = 64;
  const camera = new Layout({});
  const inside = new Layout({});
  view.add(camera);
  credits.moveToTop();
  room.root.reparent(camera);
  camera.add(inside);
  inside.add(frame(1920, 1080, 0, 0, 'transparent', palette.paper, 0));
  trace.root.reparent(inside);
  loader.reparent(inside);
  recap.reparent(inside);
  inside.position(consoleCenter);
  inside.scale(1 / closeScale);
  room.root.opacity(1);
  yield* tween(6.8, (value) => {
    const progress = easeInOutCubic(value);
    const scale = Math.pow(closeScale, 1 - progress);
    camera.scale(scale);
    camera.position(consoleCenter.scale(((1 - scale) * closeScale) / (closeScale - 1)));
    inside.opacity(1 - Math.min(1, Math.max(0, (progress - 0.25) / 0.3)));
    room.consolePorts.opacity(1 - inside.opacity());
  });
  inside.remove();

  yield* waitUntil('source-credit');
  yield* credits.opacity(1, 0.4);
  yield* waitUntil('github-source');
  yield* sourceName.opacity(1, 0.35);
  yield* waitUntil('return-to-original-pose');
  yield* credits.opacity(0, 0.5);
  yield* waitUntil('end');
});
