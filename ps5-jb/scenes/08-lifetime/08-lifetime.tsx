import { Circle, Layout, Line, Path, Txt, makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { serviceRequest } from '../07-execution/service-request';
import { memory, record, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

const slate = { dark: palette.wash, mid: palette.rule, light: palette.muted };

function* relabel(node: Txt, value: string, duration = 0.3) {
  yield* node.opacity(0, duration / 2);
  node.text(value);
  yield* node.opacity(1, duration / 2);
}

function requestRow(id: string, x: number, y: number) {
  const root = new Layout({ position: [x, y] });
  const face = new Path({
    data: 'M -202 -60 Q -10 -64 201 -58 L 205 58 Q 4 63 -205 57 Z',
    fill: slate.dark,
    stroke: palette.ink,
    lineWidth: 2.5,
    lineJoin: 'round',
  });
  const name = text(`request ${id}`, 0, -26, 32);
  const detail = text('waiter pointer’ı', 0, 30, 28, slate.light);
  const term = text('request', 0, -107, 29, slate.light, true);
  term.opacity(0);
  const port = new Circle({ position: [205, 30], size: 9, fill: slate.light });
  root.add([
    face,
    new Line({
      points: [
        [-178, 4],
        [177, 7],
      ],
      stroke: slate.mid,
      lineWidth: 1.8,
    }),
    name,
    detail,
    port,
    term,
  ]);
  return { root, face, name, detail, term, port };
}

/** The limited result is the next scene's exact starting image. */
export function decrementPose() {
  const root = new Layout({});
  const request = requestRow('A', -560, -120);
  request.detail.text('pointer’ı izle → −1');
  request.root.opacity(0.3);
  const slot = new Layout({ position: [-20, -120], opacity: 0.3 });
  const slotArea = memory(380, 190, 0, 0, palette.ink, slate.dark);
  const slotTitle = text('aynı adres', 0, -146, 30, slate.light);
  const slotMain = text('yeni kayıt', 0, -33, 31);
  const slotDetail = text('hedef: adres K', 0, 50, 29, palette.accent);
  slot.add([slotArea, slotTitle, slotMain, slotDetail]);
  const oldPointer = wire(
    [
      [-355, -90],
      [-210, -90],
    ],
    palette.accent,
    2.5,
  );
  oldPointer.opacity(0.3);
  const target = new Layout({ position: [590, 90] });
  const targetArea = memory(260, 160, 0, 0, palette.accent, slate.dark);
  const targetName = text('kernel değeri', 0, -130, 31);
  const value = text('6', 0, 0, 56, palette.ink, true);
  const address = text('adres K', 0, 132, 28, slate.light, true);
  const primitive = text('decrement primitive', 0, 207, 29, slate.light, true);
  target.add([targetArea, targetName, value, address, primitive]);
  const targetPointer = wire(
    [
      [170, -70],
      [300, -70],
      [300, 90],
      [460, 90],
    ],
    palette.accent,
    2.5,
  );
  targetPointer.opacity(0.3);

  root.add([request.root, slot, oldPointer, targetPointer, target]);
  return {
    root,
    request,
    slot,
    slotArea,
    slotTitle,
    slotMain,
    slotDetail,
    oldPointer,
    targetPointer,
    target,
    value,
    primitive,
  };
}

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const incoming = serviceRequest();
  view.add(incoming.root);

  const scene = decrementPose();
  scene.root.opacity(0);
  scene.request.root.position([-120, -150]);
  scene.request.root.opacity(1);
  scene.request.name.text('request');
  scene.request.port.opacity(0);
  scene.request.detail.text('iş sürüyor');
  scene.slot.position([470, 100]);
  scene.slot.opacity(0);
  scene.slotTitle.text('bekleyiş');
  scene.slotMain.text('bekleyiş');
  scene.slotMain.fontSize(28);
  scene.slotDetail.opacity(0);
  scene.oldPointer.points([
    [85, -120],
    [240, -120],
    [240, 100],
    [280, 100],
  ]);
  scene.oldPointer.opacity(1);
  scene.oldPointer.end(0);
  scene.target.opacity(0);
  scene.targetPointer.opacity(1);
  scene.targetPointer.end(0);
  scene.primitive.opacity(0);
  scene.value.text('7');

  view.add(scene.root);

  // A few execution lines are enough to show the program continuing. They are
  // not an invented application screen or another box around an abstract label.
  const user = new Layout({ position: [-650, 0], opacity: 0 });
  const userName = text('sayfayı çalıştıran process', 0, -175, 29, slate.light);
  const activity = text('başka iş', 0, 108, 31);
  const counter = new Circle({ position: [-125, -55], size: 11, fill: palette.accent });
  user.add([
    userName,
    new Line({
      points: [
        [-98, -55],
        [95, -52],
      ],
      stroke: slate.light,
      lineWidth: 3,
    }),
    new Line({
      points: [
        [-98, 0],
        [45, 3],
      ],
      stroke: slate.mid,
      lineWidth: 3,
    }),
    new Line({
      points: [
        [-98, 55],
        [109, 58],
      ],
      stroke: slate.mid,
      lineWidth: 3,
    }),
    counter,
    activity,
  ]);
  const kernelName = text('kernel', 660, -340, 31, slate.light);
  kernelName.opacity(0);
  const progress = wire(
    [
      [-300, -55],
      [60, -55],
    ],
    palette.accent,
    4,
    false,
  );
  progress.end(0);
  const aioName = text('asynchronous I/O (AIO)', -650, -255, 29, slate.light, true);
  aioName.opacity(0);
  view.add([user, kernelName, progress, aioName]);

  yield* waitUntil('start-work');
  // This is the very job launched across the boundary in 07, carried into
  // its more detailed record rather than replaced by an unrelated example.
  incoming.request.reparent(view);
  incoming.requestName.reparent(scene.request.root);
  scene.request.name.remove();
  scene.request.name = incoming.requestName;
  scene.request.face.opacity(0);
  scene.request.detail.opacity(0);
  scene.root.opacity(1);
  yield* all(
    incoming.root.opacity(0, 0.7),
    incoming.request.position([-120, -150], 0.7),
    incoming.request.size([410, 120], 0.7),
    scene.request.name.position([0, -26], 0.7),
    scene.request.name.fontSize(32, 0.7),
    scene.request.name.lineHeight(32 * 1.35, 0.7),
    user.opacity(1, 0.7),
    kernelName.opacity(1, 0.7),
  );
  yield* all(
    incoming.request.opacity(0, 0.15),
    scene.request.face.opacity(1, 0.15),
    scene.request.port.opacity(1, 0.15),
  );
  yield* waitUntil('name-request');
  yield* all(relabel(scene.request.name, 'request', 0.4), scene.request.detail.opacity(1, 0.4));
  incoming.root.remove();
  incoming.request.remove();
  yield* waitUntil('continue-while-pending');
  yield* all(counter.y(55, 1.4), progress.end(0.7, 1.8));

  yield* waitUntil('name-aio');
  yield* aioName.opacity(1, 0.5);

  yield* waitUntil('track-work');
  yield* kernelName.fill(palette.ink, 0.4);

  yield* waitUntil('need-result');
  activity.text('sonucu bekle');
  yield* scene.slot.opacity(1, 0.5);

  yield* waitUntil('name-waiter');
  yield* relabel(scene.slotTitle, 'waiter', 0.4);

  yield* waitUntil('request-waiter-link');
  yield* all(scene.oldPointer.end(1, 0.7), relabel(scene.request.detail, 'waiter pointer’ı', 0.4));

  const result = new Layout({ position: [-120, -120], opacity: 0 });
  result.add([
    new Path({
      data: 'M -85 -32 L 86 -29 L 84 32 L -87 29 Z',
      fill: slate.dark,
      stroke: palette.accent,
      lineWidth: 2.5,
    }),
    text('result', 0, 0, 34, palette.ink, true),
  ]);
  view.add(result);
  yield* waitUntil('normal-completion');
  yield* progress.end(1, 0.7);
  scene.request.name.text('request tamamlandı');

  yield* waitUntil('normal-result');
  // This is the completed I/O result, not data produced by the waiter. Show it
  // at the request before returning it to the program; no field layout is implied.
  yield* all(scene.request.detail.opacity(0, 0.2), progress.opacity(0, 0.2));
  yield* result.opacity(1, 0.25);
  yield* result.y(285, 0.45);
  scene.request.detail.opacity(1);
  yield* result.x(-650, 0.65);
  activity.opacity(0);
  yield* result.y(108, 0.35);
  yield* result.opacity(0, 0.2);
  activity.text('result');
  activity.opacity(1);
  yield* waitFor(0.3);

  yield* waitUntil('normal-cleanup');
  yield* scene.oldPointer.end(0, 0.8);
  scene.request.detail.text('bekleme bağlantısı yok');
  yield* waitFor(0.3);
  yield* waitUntil('normal-free');
  yield* all(scene.slotMain.opacity(0, 0.4), scene.slotArea.fill(palette.paper, 0.5));
  scene.slotTitle.text('serbest alan');
  yield* waitFor(0.3);

  const requestB = requestRow('B', -120, 70);
  requestB.root.opacity(0);
  requestB.detail.text('henüz bağlanmadı');
  const linkB = wire(
    [
      [85, 100],
      [220, 100],
      [280, -10],
    ],
    slate.light,
    2.5,
  );
  linkB.end(0);
  // The owner/list defect follows the published disassembly analysis cited in
  // the narration's research link; it is not an independent Sony binary audit.
  const ownerPath = wire(
    [
      [470, 75],
      [470, 190],
      [120, 190],
      [120, 100],
      [85, 100],
    ],
    palette.accent,
    2.5,
  );
  ownerPath.end(0);
  scene.root.add([requestB.root, linkB, ownerPath]);
  yield* waitUntil('two-jobs');
  yield* all(progress.opacity(0, 0.4), user.opacity(0, 0.4), aioName.opacity(0, 0.4));
  // The completed single-job example has ended. These are two newly pending
  // jobs, not a second request retroactively attached to the finished read.
  yield* all(
    scene.request.root.opacity(0, 0.35),
    scene.slot.opacity(0, 0.35),
    activity.opacity(0, 0.35),
  );
  activity.text('iki yeni iş başlat');
  scene.request.name.text('request A');
  requestB.name.text('request B');
  // These actors are hidden; place the fresh example before revealing A/B.
  scene.request.root.position([-120, -190]);
  scene.slot.position([470, -20]);
  scene.oldPointer.points([
    [85, -160],
    [240, -160],
    [280, -60],
  ]);
  scene.request.term.opacity(0);
  scene.request.detail.text('henüz bağlanmadı');
  yield* all(
    scene.request.root.opacity(1, 0.5),
    requestB.root.opacity(1, 0.5),
    activity.opacity(0, 0.5),
  );
  yield* waitFor(0.3);

  yield* waitUntil('multi-wait-name');
  aioName.text('aio_multi_wait');
  aioName.fontSize(30);
  aioName.position([0, -360]);
  yield* aioName.opacity(1, 0.5);

  yield* waitUntil('shared-waiter');
  scene.slotTitle.text('tek waiter');
  scene.slotMain.text('aynı bekleyiş');
  scene.slotMain.fontSize(31);
  yield* all(
    scene.slot.opacity(1, 0.4),
    scene.slotArea.fill(slate.dark, 0.4),
    scene.slotMain.opacity(1, 0.4),
  );

  yield* waitUntil('first-owner');
  scene.request.detail.text('waiter pointer’ı');
  yield* scene.oldPointer.end(1, 0.7);

  yield* waitUntil('owner-field');
  scene.slotDetail.text('owner');
  yield* scene.slotDetail.opacity(1, 0.4);

  yield* waitUntil('owner-a');
  yield* relabel(scene.slotDetail, 'owner: A', 0.4);

  yield* waitUntil('b-attaches');
  requestB.detail.text('waiter pointer’ı');
  yield* linkB.end(1, 0.7);

  yield* waitUntil('owner-changes');
  yield* relabel(scene.slotDetail, 'owner: B', 0.4);

  yield* waitUntil('a-link-remains');
  yield* scene.oldPointer.lineWidth(3.5, 0.3);
  yield* scene.oldPointer.lineWidth(2.5, 0.3);

  yield* waitUntil('cleanup-follows-owner');
  yield* ownerPath.end(1, 1.15);
  yield* waitFor(0.3);
  yield* waitUntil('wrong-cleanup');
  yield* all(linkB.end(0, 0.8), ownerPath.end(0, 0.8));
  requestB.detail.text('bağlantı kaldırıldı');
  yield* requestB.root.opacity(0.3, 0.4);
  yield* waitFor(0.3);
  yield* waitUntil('free-waiter');
  yield* all(
    scene.slotMain.opacity(0, 0.4),
    scene.slotDetail.opacity(0, 0.4),
    scene.slotArea.fill(palette.paper, 0.5),
  );
  scene.slotTitle.text('serbest alan');

  yield* waitUntil('stale-reference');
  scene.request.detail.text('eski waiter pointer’ı');
  scene.oldPointer.stroke(palette.accent);

  yield* waitUntil('use-after-free');
  scene.request.term.text('use-after-free');
  yield* scene.request.term.opacity(1, 0.5);

  const fixedOperation = new Layout({ position: [-650, 300], opacity: 0 });
  const operationCode = text('*pointer -= 1', 0, 0, 30, palette.accent, true);
  fixedOperation.add([record(360, 75, 0, 0), operationCode]);
  view.add(fixedOperation);
  const replacement = new Layout({ position: [-650, 250], opacity: 0 });
  const replacementName = text('request data', 0, 0, 29);
  replacement.add([
    new Path({
      data: 'M -92 -32 Q 0 -36 92 -30 L 94 31 L -95 34 Z',
      fill: slate.dark,
      stroke: slate.light,
      lineWidth: 2.5,
    }),
    replacementName,
  ]);
  const allocationPath = wire(
    [
      [-500, 250],
      [350, 250],
    ],
    palette.accent,
  );
  allocationPath.end(0);
  const allocationCall = text('syscall', -60, 190, 29, slate.light, true);
  const allocationName = text('kernel allocation', 470, 350, 30, slate.light);
  allocationCall.opacity(0);
  allocationName.opacity(0);
  view.add([replacement, allocationPath, allocationCall, allocationName]);
  yield* waitUntil('request-new-record');
  user.position([-650, 250]);
  userName.y(-95);
  counter.opacity(0);
  activity.text('yeni kayıt iste');
  activity.opacity(1);
  yield* all(user.opacity(1, 0.4), replacement.opacity(1, 0.4));

  yield* waitUntil('syscall-data');
  // The kernel allocates the record; the program sends request data, not a kernel write.
  yield* all(
    allocationCall.opacity(1, 0.3),
    allocationPath.end(1, 0.9),
    replacement.position([470, 250], 0.9),
  );

  yield* waitUntil('kernel-allocation');
  replacementName.text('yeni kayıt');
  yield* allocationName.opacity(1, 0.3);

  yield* waitUntil('reuse-slot');
  yield* all(
    replacement.y(-20, 0.75),
    allocationPath.opacity(0, 0.3),
    allocationCall.opacity(0, 0.3),
    allocationName.opacity(0, 0.3),
  );
  // Carry the actual new-record title into the existing memory area.
  replacementName.reparent(scene.slot);
  scene.slotMain.remove();
  scene.slotMain = replacementName;
  scene.slotTitle.text('aynı adres');
  scene.slotDetail.text('data');
  yield* all(
    replacement.opacity(0, 0.3),
    scene.slotArea.fill(slate.dark, 0.4),
    scene.slotMain.position([0, -33], 0.4),
    scene.slotMain.fontSize(31, 0.4),
    scene.slotMain.lineHeight(31 * 1.35, 0.4),
    scene.slotDetail.opacity(1, 0.4),
  );
  yield* user.opacity(0, 0.3);

  const follow = new Circle({ position: [85, -160], size: 13, fill: palette.accent, opacity: 0 });
  view.add(follow);
  yield* waitUntil('reuse-access');
  yield* follow.opacity(1, 0.25);
  yield* follow.position([240, -160], 0.5);
  yield* follow.position([280, -60], 0.5);
  yield* follow.opacity(0, 0.3);
  yield* waitFor(0.3);

  // The ownership bug is already established. Timing gets its own stage:
  // the viewer compares two event orders, without another moving graph behind.
  const timing = new Layout({ opacity: 0 });
  const timingName = text('olayların sırası', 0, -300, 34);
  const first = text('yeni kayıt yerleşir', -420, -65, 34);
  const second = text('A’nın pointer’ı kullanılır', 420, -65, 34, palette.accent);
  const firstEvent = record(510, 125, -420, -65);
  const secondEvent = record(510, 125, 420, -65, palette.accent);
  const eventOrder = wire(
    [
      [-150, -65],
      [150, -65],
    ],
    slate.light,
  );
  timing.add([timingName, firstEvent, secondEvent, first, second, eventOrder]);
  view.add(timing);
  yield* waitUntil('relative-timing');
  yield* all(
    scene.request.root.opacity(0, 0.45),
    scene.slot.opacity(0, 0.45),
    scene.oldPointer.opacity(0, 0.45),
    requestB.root.opacity(0, 0.45),
    aioName.opacity(0, 0.45),
    user.opacity(0, 0.45),
    fixedOperation.opacity(0, 0.45),
    kernelName.opacity(0, 0.45),
  );
  yield* timing.opacity(1, 0.6);
  yield* waitUntil('allocation-before-access');
  yield* firstEvent.stroke(palette.accent, 0.35);

  yield* waitUntil('access-after-allocation');
  yield* all(firstEvent.stroke(slate.mid, 0.35), secondEvent.stroke(palette.accent, 0.35));

  yield* waitUntil('race-name');
  yield* relabel(timingName, 'race condition', 0.4);

  yield* waitUntil('same-kernel-operation');
  scene.request.term.opacity(0);
  scene.request.detail.text('pointer’ı izle → −1');
  yield* all(
    timing.opacity(0, 0.5),
    user.opacity(0, 0.5),
    requestB.root.opacity(0, 0.5),
    kernelName.opacity(0, 0.5),
    aioName.opacity(0, 0.5),
  );
  yield* all(
    scene.request.root.opacity(1, 0.4),
    scene.slot.opacity(1, 0.4),
    scene.oldPointer.opacity(1, 0.4),
    waitFor(0.4),
  );
  yield* all(
    scene.request.root.position([-560, -120], 0.9),
    scene.slot.position([-20, -120], 0.9),
    scene.oldPointer.points(
      [
        [-355, -90],
        [-210, -90],
      ],
      0.9,
    ),
  );
  fixedOperation.position([-560, 150]);
  yield* fixedOperation.opacity(1, 0.4);

  yield* waitUntil('follow-reused-pointer');
  follow.position([-355, -90]);
  yield* follow.opacity(1, 0.2);
  yield* follow.position([-210, -90], 0.5);
  yield* follow.opacity(0, 0.15);

  yield* waitUntil('read-target-pointer');
  yield* relabel(scene.slotDetail, 'target pointer', 0.4);

  yield* waitUntil('target-address');
  scene.slotDetail.text('hedef: adres K');
  scene.value.opacity(0);
  yield* scene.target.opacity(1, 0.4);
  yield* scene.targetPointer.end(1, 0.7);

  yield* waitUntil('target-value-seven');
  yield* scene.value.opacity(1, 0.3);

  yield* waitUntil('follow-target-pointer');
  // A marker crosses only the external pointer link, never the record's text.
  follow.position([170, -70]);
  yield* follow.opacity(1, 0.15);
  yield* follow.position([300, -70], 0.3);
  yield* follow.position([300, 90], 0.35);
  yield* follow.position([460, 90], 0.35);
  yield* follow.opacity(0, 0.2);

  yield* waitUntil('limited-decrease');
  yield* operationCode.fill(palette.ink, 0.25);
  yield* operationCode.fill(palette.accent, 0.25);

  yield* waitUntil('value-six');
  yield* scene.value.opacity(0, 0.12);
  scene.value.text('6');
  yield* scene.value.opacity(1, 0.2);

  yield* waitUntil('primitive-name');
  yield* scene.primitive.opacity(1, 0.5);
  yield* waitUntil('byte-meanings');
  yield* scene.value.fill(palette.accent, 0.35);
  yield* scene.value.fill(palette.ink, 0.35);

  yield* waitUntil('small-change-next');
  yield* all(
    scene.request.root.opacity(0.3, 0.6),
    scene.slot.opacity(0.3, 0.6),
    scene.oldPointer.opacity(0.3, 0.6),
    scene.targetPointer.opacity(0.3, 0.6),
    fixedOperation.opacity(0, 0.6),
  );
  yield* waitFor(0.3);
  yield* waitUntil('end');
});
