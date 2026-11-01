import { Circle, Layout, Line, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, bytes, label, palette, panel } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(palette.paper);

  const data = new Layout({ position: [-40, -300] });
  const dataFace = panel(720, 330, 0, 0);
  const dataName = label('buffer', 0, -105, 46);
  const tape = bytes(['9', '16', '32', '64'], 0, 0, 135);
  const writable = label('write: açık', -170, 112, 38, palette.ink, true);
  const executable = label('execute', 115, 112, 44, palette.muted, true);
  const blocked = new Line({
    points: [
      [25, 112],
      [205, 112],
    ],
    stroke: palette.accent,
    lineWidth: 4,
    opacity: 0,
  });
  data.add([dataFace, dataName, tape.root, writable, executable, blocked]);

  const read = new Layout({ position: [-40, 250] });
  const readFace = panel(720, 300, 0, 0);
  const nativeName = label('mevcut native code', 0, -95, 46, palette.muted);
  const readName = label('read1(B)', 0, -25, 48, palette.ink, true);
  readName.opacity(0);
  const readBody = label('execute: açık', 0, 45, 44, palette.muted, true);
  const running = new Circle({ position: [-310, 0], size: 14, fill: palette.accent, opacity: 0 });
  read.add([readFace, nativeName, readName, readBody, running]);

  const caller = new Layout({ position: [-40, -540], opacity: 0 });
  const callerFace = panel(720, 240, 0, 0);
  const steps = [
    label('1  buffer hazırla', 0, -70, 42, palette.ink, true),
    label('2  read1(B)', 0, 0, 42, palette.ink, true),
    label('3  devam et', 0, 70, 42, palette.ink, true),
  ];
  caller.add([callerFace, ...steps]);
  const call = arrow(
    [
      [320, -540],
      [365, -540],
      [365, 90],
      [320, 90],
    ],
    palette.accent,
  );
  call.end(0);
  const normalReturn = arrow(
    [
      [-400, 90],
      [-430, 90],
      [-430, -470],
      [-400, -470],
    ],
    palette.accent,
  );
  normalReturn.end(0);
  const readPointer = arrow(
    [
      [-242.5, 190],
      [-242.5, 489],
    ],
    palette.accent,
  );
  readPointer.end(0);
  const result = label('result: 9', 90, 300, 46, palette.accent, true);
  result.opacity(0);

  const stack = new Layout({ position: [-40, -250], opacity: 0 });
  const stackFace = panel(720, 170, 0, 0);
  const stackName = label('stack', 0, -135, 44, palette.muted);
  stackName.opacity(0);
  const returnName = label('return adresi', 0, -45, 38, palette.muted);
  const target = label('3. adım', 0, 22, 48, palette.ink, true);
  const extraNames = [-0, 90].map((y) => label('return', -210, y, 38, palette.muted, true));
  const extraTargets = [
    label('read1', 45, 0, 44, palette.ink, true),
    label('parça 3', 45, 90, 44, palette.ink, true),
  ];
  for (const node of [...extraNames, ...extraTargets]) node.opacity(0);
  stack.add([stackFace, stackName, returnName, target, ...extraNames, ...extraTargets]);

  const first = new Layout({ position: [-40, -80], opacity: 0 });
  const firstFace = panel(720, 140, 0, 0);
  const firstName = label('parça 1', 0, -28, 44);
  const firstBody = label('B → argument', 0, 30, 42, palette.muted, true);
  first.add([firstFace, firstName, firstBody]);
  const last = new Layout({ position: [-40, 340], opacity: 0 });
  const lastFace = panel(720, 140, 0, 0);
  const lastName = label('parça 3', -140, -28, 44);
  const lastBody = label('sonucu al', -140, 30, 42, palette.muted, true);
  const lastResult = label('9', 210, 0, 60, palette.accent, true);
  lastResult.opacity(0);
  last.add([lastFace, lastName, lastBody, lastResult]);

  const argument = new Layout({ position: [-40, -240], opacity: 0 });
  const argumentFace = panel(720, 80, 0, 0);
  const argumentName = label('argument', -140, 0, 40, palette.muted, true);
  const argumentValue = label('B', 175, 0, 46, palette.accent, true);
  argumentValue.opacity(0);
  argument.add([argumentFace, argumentName, argumentValue]);
  const selectedReturn = arrow(
    [
      [320, -560],
      [365, -560],
      [365, -80],
      [320, -80],
    ],
    palette.accent,
  );
  selectedReturn.end(0);
  const placeArgument = arrow(
    [
      [-400, -80],
      [-430, -80],
      [-430, -240],
      [-400, -240],
    ],
    palette.accent,
  );
  placeArgument.end(0);
  const chainRead = arrow(
    [
      [-400, 145],
      [-430, 145],
      [-430, 570],
      [-310, 570],
    ],
    palette.accent,
  );
  chainRead.end(0);

  view.add([
    data,
    read,
    caller,
    call,
    normalReturn,
    readPointer,
    result,
    stack,
    first,
    last,
    argument,
    selectedReturn,
    placeArgument,
    chainRead,
  ]);

  yield* waitUntil('no-execute');
  yield* blocked.opacity(1, 0.3);
  yield* waitUntil('native-code');
  yield* all(readFace.stroke(palette.accent, 0.35), running.opacity(1, 0.35));
  yield* waitUntil('read1');
  readBody.text('1 byte oku');
  yield* all(writable.opacity(0, 0.2), executable.opacity(0, 0.2), blocked.opacity(0, 0.2));
  yield* all(
    data.y(510, 0.65),
    dataFace.height(220, 0.65),
    dataName.y(-65, 0.65),
    tape.root.y(25, 0.65),
    read.y(90, 0.65),
    readFace.height(200, 0.65),
    nativeName.opacity(0, 0.3),
    readName.opacity(1, 0.35),
  );
  dataName.text('B adresindeki buffer');
  dataName.x(70);
  yield* waitUntil('caller');
  yield* caller.opacity(1, 0.35);
  yield* waitUntil('call');
  yield* all(steps[1].fill(palette.accent, 0.25), call.end(1, 0.55));
  yield* waitUntil('result');
  yield* readPointer.end(1, 0.45);
  yield* all(tape.cells[0].stroke(palette.accent, 0.25), result.opacity(1, 0.25));
  yield* waitUntil('return-address');
  yield* stack.opacity(1, 0.35);
  yield* waitUntil('third-step');
  yield* all(
    normalReturn.end(1, 0.55),
    steps[2].fill(palette.accent, 0.3),
    running.opacity(0, 0.25),
    readFace.stroke(palette.rule, 0.3),
  );
  yield* waitUntil('stack');
  yield* stackName.opacity(1, 0.3);
  yield* waitUntil('write-return');
  yield* all(
    call.end(0, 0.25),
    normalReturn.end(0, 0.25),
    readPointer.end(0, 0.25),
    result.opacity(0, 0.25),
    caller.opacity(0, 0.25),
  );
  yield* all(
    stack.y(-470, 0.7),
    stackFace.height(330, 0.7),
    stackName.y(-210, 0.7),
    returnName.position([-210, -90], 0.7),
    target.position([45, -90], 0.7),
    read.y(145, 0.7),
    readFace.height(140, 0.7),
    readBody.y(30, 0.7),
    data.y(545, 0.7),
    dataFace.height(210, 0.7),
    dataName.y(-65, 0.7),
  );
  returnName.text('return');
  target.text('parça 1');
  target.fontSize(44);
  yield* all(
    first.opacity(0.55, 0.35),
    last.opacity(0.55, 0.35),
    argument.opacity(1, 0.35),
    stackFace.stroke(palette.accent, 0.35),
  );
  yield* waitUntil('native-target');
  yield* all(
    selectedReturn.end(1, 0.55),
    first.opacity(1, 0.3),
    firstFace.stroke(palette.accent, 0.3),
  );
  yield* waitUntil('pieces');
  yield* all(...[...extraNames, ...extraTargets].map((node) => node.opacity(1, 0.4)));
  yield* waitUntil('pieces-second');
  yield* selectedReturn.end(0, 0.2);
  selectedReturn.points([
    [320, -470],
    [365, -470],
    [365, 145],
    [320, 145],
  ]);
  yield* all(
    selectedReturn.end(1, 0.4),
    firstFace.stroke(palette.rule, 0.3),
    readFace.stroke(palette.accent, 0.3),
  );
  yield* waitUntil('pieces-third');
  yield* selectedReturn.end(0, 0.2);
  selectedReturn.points([
    [320, -380],
    [365, -380],
    [365, 340],
    [320, 340],
  ]);
  yield* all(
    selectedReturn.end(1, 0.4),
    readFace.stroke(palette.rule, 0.3),
    last.opacity(1, 0.3),
    lastFace.stroke(palette.accent, 0.3),
  );
  yield* waitUntil('argument');
  yield* selectedReturn.end(0, 0.2);
  selectedReturn.points([
    [320, -560],
    [365, -560],
    [365, -80],
    [320, -80],
  ]);
  yield* all(
    selectedReturn.end(1, 0.4),
    firstFace.stroke(palette.accent, 0.3),
    lastFace.stroke(palette.rule, 0.3),
    placeArgument.end(1, 0.5),
  );
  yield* argumentValue.opacity(1, 0.25);
  yield* waitUntil('read-piece');
  yield* all(selectedReturn.end(0, 0.2), placeArgument.end(0, 0.2));
  selectedReturn.points([
    [320, -470],
    [365, -470],
    [365, 145],
    [320, 145],
  ]);
  yield* all(
    selectedReturn.end(1, 0.45),
    chainRead.end(1, 0.55),
    firstFace.stroke(palette.rule, 0.3),
    readFace.stroke(palette.accent, 0.3),
  );
  yield* waitUntil('take-result');
  yield* all(selectedReturn.end(0, 0.2), chainRead.end(0, 0.2));
  selectedReturn.points([
    [320, -380],
    [365, -380],
    [365, 340],
    [320, 340],
  ]);
  yield* all(
    selectedReturn.end(1, 0.45),
    readFace.stroke(palette.rule, 0.3),
    lastFace.stroke(palette.accent, 0.3),
    lastResult.opacity(1, 0.3),
  );
  yield* waitUntil('gadgets');
  firstName.text('gadget 1');
  lastName.text('gadget 3');
  target.text('gadget 1');
  extraTargets[1].text('gadget 3');
  yield* waitUntil('end');
});
