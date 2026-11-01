import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, label, palette, panel, replace } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(palette.paper);
  const root = new Layout({ x: -40 });
  view.add(root);

  const kernel = panel(860, 1040, 0, -190);
  const kernelName = label('kernel', -280, -650, 48, palette.muted);
  const a = new Layout({ position: [0, -450] });
  const aFace = panel(320, 140, 0, 0);
  const aName = label('read request', 0, 0, 40, palette.ink, true);
  a.add([aFace, aName]);
  const pending = label('bekleniyor', 200, -345, 40, palette.muted);
  pending.opacity(0);
  const b = new Layout({ position: [190, -450], opacity: 0 });
  const bFace = panel(320, 140, 0, 0);
  b.add([bFace, label('request B', 0, 0, 44, palette.ink, true)]);

  const waiter = new Layout({ opacity: 0 });
  const waiterFace = panel(620, 280, 0, 0);
  const waiterName = label('bekleyiş', 0, -70, 48);
  const owner = new Layout({ opacity: 0 });
  const ownerFace = panel(440, 96, 0, 55);
  const ownerName = label('owner:', -95, 55, 46, palette.muted, true);
  const ownerValue = label('A', 140, 55, 50, palette.ink, true);
  owner.add([ownerFace, ownerName, ownerValue]);
  const newContent = new Layout({ opacity: 0 });
  const contentFace = panel(440, 96, 0, 55);
  newContent.add([contentFace, label('request data', 0, 55, 44, palette.ink, true)]);
  waiter.add([waiterFace, waiterName, owner, newContent]);

  const aPath = arrow([
    [0, -380],
    [0, -140],
  ]);
  aPath.points(
    () =>
      [
        [a.x(), -380],
        [a.x(), -260],
        [a.x() / 2, -260],
        [a.x() / 2, -140],
      ] as [number, number][],
  );
  aPath.end(0);
  const bPath = arrow([
    [190, -380],
    [190, -260],
    [95, -260],
    [95, -140],
  ]);
  bPath.end(0);

  const program = new Layout({});
  const programFace = panel(720, 180, 0, 520);
  const programState = label('read("notlar.txt")', 0, 550, 40, palette.ink, true);
  program.add([programFace, label('program', 0, 470, 46), programState]);
  const allocation = arrow(
    [
      [0, 430],
      [0, 160],
    ],
    palette.accent,
  );
  allocation.end(0);
  const syscall = label('syscall', 200, 365, 38, palette.muted, true);
  syscall.opacity(0);
  const firstRequest = arrow(
    [
      [0, 430],
      [0, -380],
    ],
    palette.accent,
  );
  firstRequest.end(0);
  const packet = new Layout({ position: [0, 390], opacity: 0 });
  packet.add([panel(180, 76, 0, 0, palette.accent), label('data', 0, 0, 42, palette.ink, true)]);
  root.add([
    kernel,
    kernelName,
    a,
    b,
    waiter,
    aPath,
    bPath,
    program,
    firstRequest,
    pending,
    allocation,
    syscall,
    packet,
  ]);

  yield* waitUntil('read-job');
  yield* firstRequest.end(1, 0.65);
  yield* waitUntil('job-pending');
  yield* pending.opacity(1, 0.3);
  yield* waitUntil('track-job');
  yield* aFace.stroke(palette.accent, 0.3);
  yield* waitUntil('kernel-record');
  yield* aFace.fill(palette.accentWash, 0.3);

  yield* waitUntil('name-request');
  yield* replace(aName, 'request', 0.24);
  yield* waitUntil('aio');
  yield* replace(pending, 'AIO', 0.24);
  yield* waitUntil('waiting-record');
  yield* all(firstRequest.end(0, 0.3), pending.opacity(0, 0.3));
  programState.text('bekliyor');
  yield* waiter.opacity(1, 0.35);
  yield* waitUntil('name-waiter');
  yield* replace(waiterName, 'waiter', 0.24);
  yield* waitUntil('request-pointer');
  yield* aPath.end(1, 0.75);

  yield* waitUntil('two-requests');
  yield* aPath.end(0, 0.25);
  yield* a.x(-190, 0.65);
  yield* waitUntil('name-a');
  yield* replace(aName, 'request A', 0.24);
  yield* waitUntil('introduce-b');
  yield* b.opacity(1, 0.35);
  yield* waitUntil('wait-together');
  yield* programFace.stroke(palette.accent, 0.35);
  yield* waitUntil('multi-wait');
  programState.fontSize(38);
  yield* replace(programState, 'aio_multi_wait', 0.24);
  yield* waitUntil('shared-waiter');
  yield* waiterFace.stroke(palette.accent, 0.35);

  yield* waitUntil('connect-a');
  aPath.stroke(palette.accent);
  yield* aPath.end(1, 0.65);
  yield* waitUntil('owner-field');
  yield* owner.opacity(1, 0.3);
  yield* waitUntil('owner-a');
  yield* all(ownerFace.stroke(palette.accent, 0.25), ownerValue.fill(palette.accent, 0.25));
  yield* waitUntil('connect-b');
  aPath.stroke(palette.muted);
  bPath.stroke(palette.accent);
  yield* bPath.end(1, 0.65);
  yield* waitUntil('overwrite-owner');
  yield* replace(ownerValue, 'B', 0.24);
  yield* waitUntil('a-still-connected');
  aFace.stroke(palette.accent);
  aPath.stroke(palette.accent);
  bPath.stroke(palette.muted);

  yield* waitUntil('cleanup-owner');
  yield* all(ownerFace.fill(palette.accentWash, 0.3), bFace.stroke(palette.accent, 0.3));
  yield* waitUntil('disconnect-b');
  yield* bPath.end(0, 0.5);
  bFace.stroke(palette.rule);
  yield* b.opacity(0.4, 0.25);
  yield* waitUntil('free-waiter');
  waiterFace.lineDash([12, 8]);
  waiterFace.stroke(palette.accent);
  waiterName.fill(palette.muted);
  yield* replace(waiterName, 'free', 0.24);
  // Free does not zero the old bytes. The stale owner remains dim until overwritten.
  yield* owner.opacity(0.25, 0.25);
  yield* waitUntil('a-pointer-remains');
  yield* aPath.lineWidth(6, 0.3);
  yield* aPath.lineWidth(4, 0.3);
  yield* waitUntil('name-use-after-free');
  yield* waiterFace.fill(palette.accentWash, 0.4);
  yield* waiterFace.fill(palette.surface, 0.4);
  yield* waitUntil('same-address');
  yield* waiterFace.lineWidth(4, 0.3);
  yield* waiterFace.lineWidth(2.5, 0.3);

  yield* waitUntil('prepare-request-data');
  programState.fontSize(44);
  yield* replace(programState, 'request data', 0.24);
  yield* waitUntil('send-syscall-data');
  yield* all(syscall.opacity(1, 0.25), allocation.end(1, 0.7));
  yield* packet.opacity(1, 0.2);
  yield* packet.y(240, 0.7);
  yield* waitUntil('same-area-reused');
  yield* owner.opacity(0, 0.2);
  waiterFace.lineDash([]);
  yield* all(
    replace(waiterName, 'yeni kayıt', 0.24),
    waiterFace.fill(palette.wash, 0.4),
    packet.y(55, 0.55),
  );
  yield* packet.opacity(0, 0.12);
  yield* newContent.opacity(1, 0.15);
  yield* waitUntil('old-pointer-new-content');
  yield* all(aPath.lineWidth(6, 0.3), contentFace.stroke(palette.accent, 0.3));
  yield* aPath.lineWidth(4, 0.3);
  yield* waitUntil('kernel-creates-record');
  yield* all(
    aPath.stroke(palette.muted, 0.3),
    waiterFace.stroke(palette.accent, 0.3),
    contentFace.fill(palette.accentWash, 0.3),
  );

  yield* waitUntil('end');
});
