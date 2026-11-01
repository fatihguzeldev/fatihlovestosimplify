import { Circle, Layout, Rect, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, bytes, label, palette, panel, replace } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const kernel = panel(860, 900, -20, -40);
  const kernelName = label('kernel', -320, -440, 44, palette.muted);
  const programName = label('program', -20, -655, 44, palette.muted);
  const priorMemory = new Layout({});
  priorMemory.add([
    panel(740, 200, -20, -40),
    label('kernel memory', -20, -90, 44, palette.muted),
    label('adres K', -270, -5, 38, palette.muted, true),
    label('43', -20, -5, 64, palette.ink, true),
  ]);
  const priorResult = label('43', 150, -230, 48, palette.accent, true);
  priorResult.opacity(0);
  const priorPath = arrow(
    [
      [-20, -505],
      [-20, -140],
    ],
    palette.accent,
  );
  priorPath.end(0);
  const pipe = new Layout({ position: [-20, -40], opacity: 0 });
  const pipeFace = panel(740, 500, 0, 0);
  const pipeName = label('pipe', -220, -310, 48);
  const pointerFace = panel(540, 110, 0, 0);
  const pointerName = label('buffer pointer', 0, -85, 38, palette.muted, true);
  const pointerValue = label('adres A', 0, 0, 48, palette.ink, true);
  const pointer = new Layout({ opacity: 0 });
  pointer.add([pointerFace, pointerName, pointerValue]);
  pipe.add([pipeFace, pipeName, pointer]);

  const normalBuffer = new Layout({ position: [-20, -40], opacity: 0 });
  const abc = bytes(['A', 'B', 'C'], 0, 0, 150);
  const bufferName = label('buffer', 0, -90, 44, palette.muted);
  bufferName.opacity(0);
  normalBuffer.add([abc.root, bufferName]);
  const input = new Layout({ position: [-20, -555] });
  const inputFace = panel(720, 100, 0, 0);
  const inputName = label('sysctl read(K)', 0, 0, 42, palette.ink, true);
  input.add([inputFace, inputName]);
  const output = new Layout({ position: [-20, 555], opacity: 0 });
  output.add([panel(450, 100, 0, 0), label('read end', 0, 0, 48, palette.ink, true)]);
  const incoming = arrow(
    [
      [-20, -505],
      [-20, -290],
    ],
    palette.accent,
  );
  const outgoing = arrow(
    [
      [-20, 210],
      [-20, 505],
    ],
    palette.muted,
  );
  incoming.end(0);
  outgoing.end(0);
  const normalResult = label('A B C', 150, 420, 48, palette.accent, true);
  normalResult.opacity(0);

  const control = new Layout({ position: [-20, -490], opacity: 0 });
  const controlFace = panel(700, 260, 0, 0);
  const controlPointerFace = panel(540, 110, 0, 20);
  const controlValue = label('—', 0, 20, 48, palette.muted, true);
  control.add([
    controlFace,
    label('control pipe', 0, -185, 48),
    controlPointerFace,
    label('buffer pointer', 0, -65, 38, palette.muted, true),
    controlValue,
  ]);
  const fieldAddress = label('alanın adresi: M', -20, 65, 38, palette.accent, true);
  fieldAddress.opacity(0);
  const controlPath = arrow(
    [
      [-290, -470],
      [-405, -470],
      [-405, -50],
      [-290, -50],
    ],
    palette.accent,
  );
  controlPath.end(0);
  const dataPath = arrow(
    [
      [250, -40],
      [330, -40],
      [330, 400],
      [205, 400],
    ],
    palette.muted,
  );
  dataPath.end(0);
  dataPath.points(
    () =>
      [
        [250, pipe.y()],
        [330, pipe.y()],
        [330, normalBuffer.y()],
        [205, normalBuffer.y()],
      ] as [number, number][],
  );
  const prepared = new Circle({
    position: [-20, -470],
    size: 16,
    fill: palette.accent,
    opacity: 0,
  });

  const selected = new Layout({ position: [-20, 430], opacity: 0 });
  const selectedFace = panel(250, 130, 0, 0);
  const selectedValue = label('43', 0, 0, 64, palette.ink, true);
  selected.add([selectedFace, selectedValue, label('adres K', 0, -110, 44, palette.muted, true)]);
  const addressPacket = new Layout({ position: [-405, -470], opacity: 0 });
  addressPacket.add([
    new Rect({ width: 60, height: 72, fill: palette.paper }),
    label('K', 0, 0, 48, palette.accent, true),
  ]);
  const result = label('read → 43', -20, 220, 48, palette.accent, true);
  result.opacity(0);
  const writePacket = new Layout({ position: [-20, 220], opacity: 0 });
  writePacket.add([
    new Rect({ width: 100, height: 85, fill: palette.paper }),
    label('44', 0, 0, 64, palette.accent, true),
  ]);
  const lookup = new Layout({ opacity: 0 });
  const lookupName = label('process record / PID', -20, -425, 40, palette.muted);
  const descriptors = new Layout({ opacity: 0 });
  const fdFour = panel(560, 64, -20, -280);
  descriptors.add([
    panel(560, 64, -20, -355),
    label('3 → pipe', -20, -355, 38, palette.ink, true),
    fdFour,
    label('4 → pipe', -20, -280, 38, palette.ink, true),
  ]);
  lookup.add([panel(740, 240, -20, -350), lookupName, descriptors]);
  const descriptorPath = arrow(
    [
      [260, -280],
      [375, -280],
      [375, 120],
      [350, 120],
    ],
    palette.accent,
  );
  descriptorPath.end(0);
  view.add([
    kernel,
    kernelName,
    priorMemory,
    priorPath,
    priorResult,
    pipe,
    normalBuffer,
    input,
    output,
    incoming,
    outgoing,
    normalResult,
    control,
    fieldAddress,
    controlPath,
    dataPath,
    prepared,
    selected,
    addressPacket,
    result,
    writePacket,
    lookup,
    descriptorPath,
    programName,
  ]);
  abc.values.forEach((value) => value.opacity(0));

  yield* waitUntil('existing-access');
  yield* priorPath.end(1, 0.5);
  yield* priorResult.opacity(1, 0.25);
  yield* waitUntil('move-to-pipes');
  yield* all(
    priorPath.end(0, 0.25),
    priorMemory.opacity(0, 0.3),
    priorResult.opacity(0, 0.3),
    input.opacity(0, 0.3),
  );
  yield* waitUntil('normal-pipe');
  inputName.text('write end');
  yield* all(
    pipe.opacity(1, 0.35),
    normalBuffer.opacity(1, 0.35),
    input.opacity(1, 0.35),
    output.opacity(1, 0.35),
  );

  yield* waitUntil('normal-write');
  yield* incoming.end(1, 0.35);
  yield* waitUntil('normal-a');
  yield* abc.values[0].opacity(1, 0.16);
  yield* waitUntil('normal-b');
  yield* abc.values[1].opacity(1, 0.16);
  yield* waitUntil('normal-c');
  yield* abc.values[2].opacity(1, 0.16);
  yield* waitUntil('normal-read');
  yield* outgoing.end(1, 0.4);
  yield* waitUntil('normal-result');
  yield* normalResult.opacity(1, 0.25);
  yield* waitUntil('metadata');
  yield* all(
    incoming.end(0, 0.25),
    outgoing.end(0, 0.25),
    normalResult.opacity(0, 0.25),
    output.opacity(0, 0.25),
    input.opacity(0, 0.25),
    programName.opacity(0, 0.25),
    kernelName.opacity(0, 0.25),
  );
  kernelName.y(610);
  yield* all(
    pipeFace.height(300, 0.5),
    pipeName.y(-220, 0.5),
    normalBuffer.y(400, 0.5),
    kernel.height(1140, 0.5),
    kernel.y(80, 0.5),
  );
  yield* all(pointer.opacity(1, 0.25), bufferName.opacity(1, 0.25), kernelName.opacity(1, 0.25));
  yield* dataPath.end(1, 0.45);
  yield* waitUntil('fd-numbers');
  inputName.text('fd: 3, 4');
  yield* all(input.opacity(1, 0.3), programName.opacity(1, 0.3));
  yield* waitUntil('fd-three-four');
  inputName.fontSize(38);
  yield* replace(inputName, '3: write   4: read');
  yield* waitUntil('find-process');
  yield* all(pipe.y(120, 0.6), normalBuffer.y(520, 0.6));
  yield* lookup.opacity(1, 0.3);
  yield* waitUntil('fd-table');
  yield* replace(lookupName, 'fd table', 0.24);
  yield* descriptors.opacity(1, 0.3);
  yield* waitUntil('follow-fd');
  fdFour.stroke(palette.accent);
  yield* descriptorPath.end(1, 0.6);
  yield* waitUntil('field-found');
  yield* pointerFace.stroke(palette.accent, 0.3);
  yield* waitUntil('second-pipe');
  yield* all(
    descriptorPath.end(0, 0.25),
    lookup.opacity(0, 0.3),
    input.opacity(0, 0.3),
    programName.opacity(0, 0.3),
  );
  yield* all(
    pipe.y(-40, 0.5),
    normalBuffer.y(400, 0.5),
    kernel.height(1370, 0.5),
    kernel.y(-35, 0.5),
  );
  yield* replace(pipeName, 'data pipe');
  yield* control.opacity(1, 0.4);
  yield* waitUntil('previous-access');
  yield* all(prepared.opacity(1, 0.25), controlPointerFace.stroke(palette.accent, 0.25));
  yield* waitUntil('prepare-control');
  yield* replace(controlValue, 'field adresi');
  controlValue.fill(palette.accent);
  yield* controlPath.end(1, 0.6);
  yield* prepared.opacity(0, 0.2);
  yield* waitUntil('field-address');
  yield* all(fieldAddress.opacity(1, 0.25), replace(controlValue, 'adres M'));
  yield* waitUntil('send-address');
  yield* all(dataPath.end(0, 0.25), normalBuffer.opacity(0, 0.25));
  yield* selected.opacity(1, 0.25);
  yield* addressPacket.opacity(1, 0.2);
  // The address travels along control's existing connection. Its own M field stays put.
  yield* addressPacket.y(-50, 0.75);
  yield* addressPacket.x(-330, 0.3);
  yield* waitUntil('retarget');
  yield* dataPath.end(0, 0.2);
  yield* all(pointerValue.opacity(0, 0.12), normalBuffer.opacity(0, 0.2));
  yield* addressPacket.position([66.4, -40], 0.35);
  pointerValue.text('adres K');
  pointerValue.fill(palette.accent);
  yield* all(addressPacket.opacity(0, 0.15), pointerValue.opacity(1, 0.15));
  selected.opacity(1);
  dataPath.points([
    [250, -40],
    [330, -40],
    [330, 430],
    [105, 430],
  ]);
  yield* all(dataPath.stroke(palette.accent, 0.25), dataPath.end(1, 0.45));
  yield* waitUntil('read');
  yield* all(
    result.opacity(1, 0.3),
    selectedFace.stroke(palette.accent, 0.3),
    selectedValue.fill(palette.accent, 0.3),
  );
  yield* waitUntil('write');
  yield* result.opacity(0, 0.15);
  yield* writePacket.opacity(1, 0.15);
  yield* writePacket.x(330, 0.3);
  yield* writePacket.y(430, 0.4);
  yield* writePacket.x(165, 0.25);
  yield* waitUntil('commit-data');
  yield* selectedValue.opacity(0, 0.15);
  yield* writePacket.x(-20, 0.35);
  selectedValue.text('44');
  yield* all(writePacket.opacity(0, 0.2), selectedValue.opacity(1, 0.2));
  yield* waitUntil('roles');
  yield* all(controlFace.stroke(palette.accent, 0.3), pipeFace.stroke(palette.accent, 0.3));
  yield* waitUntil('end');
});
