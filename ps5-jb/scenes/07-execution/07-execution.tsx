import { Circle, Layout, Txt, makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { serviceRequest } from './service-request';
import { codeBlock, memory, record, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import { processAccess } from '../06-memory/06-memory';

function* replaceText(label: Txt, value: string, duration = 0.6) {
  yield* label.opacity(0, duration / 2);
  label.text(value);
  yield* label.opacity(1, duration / 2);
}

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  const access = processAccess();
  view.add(access.root);
  // This is still the process whose byte access was established in 06. Keep
  // its actual boundary while the explanation changes what we inspect inside.
  const processBoundary = access.boundary.reparent(view);
  const processName = access.processName.reparent(view);
  yield loadFonts();

  yield* waitUntil('data-and-code');
  const native = new Layout({ opacity: 0 });
  const writable = memory(430, 170, -460, -10);
  const newBytes = access.bBytes;
  const writableName = text('yazılabilir data', -460, -170, 33);
  const executable = codeBlock(570, 280, 350, -10, palette.accent);
  const codeName = text('mevcut native code', 350, -240, 33);
  const codeLines = [
    text('adresi al', 350, -90, 31, palette.ink, true),
    text('bir byte oku', 350, -10, 31, palette.ink, true),
    text('return result', 350, 70, 31, palette.ink, true),
  ];
  const running = new Circle({ position: [65, -90], size: 13, fill: palette.accent });
  const executeName = text('çalıştırılabilir', 350, 210, 31, palette.accent);

  const nativeCode = new Layout({ opacity: 0 });
  nativeCode.add([executable, codeName, ...codeLines, running, executeName]);
  native.add([writable, writableName, nativeCode]);
  view.add(native);
  // Carry the exact byte strip whose first byte was changed in 06.
  newBytes.root.reparent(view);
  yield* all(
    access.root.opacity(0, 0.8),
    native.opacity(1, 0.8),
    processBoundary.height(800, 0.8),
    processName.position([-550, -455], 0.8),
    newBytes.root.position([-460, -10], 0.8),
  );
  newBytes.root.reparent(native);

  yield* waitUntil('writing-is-not-execution');
  const attempt = wire(
    [
      [65, -10],
      [-180, -10],
      [-225, -10],
    ],
    palette.accent,
  );
  attempt.end(0);
  const barrier = wire(
    [
      [-225, -75],
      [-225, 55],
    ],
    palette.muted,
    5,
    false,
  );
  barrier.opacity(0);
  const noExecute = text('çalıştırma izni yok', -460, 210, 30, palette.muted);
  noExecute.opacity(0);
  native.add([attempt, barrier, noExecute]);
  yield* all(barrier.opacity(1, 0.5), noExecute.opacity(1, 0.5));

  yield* waitUntil('existing-native-code');
  yield* nativeCode.opacity(1, 0.6);
  yield* all(running.y(-10, 0.6), attempt.end(1, 0.6));

  yield* waitUntil('function-example');
  const call = new Layout({ opacity: 0 });
  const caller = codeBlock(450, 280, -470, -90);
  const callerName = text('caller function', -470, -300, 31, palette.muted);
  const callerLines = [
    text('1  buffer’ı hazırla', -470, -170, 31, palette.ink, true),
    text('2  call read1(B)', -470, -90, 31, palette.ink, true),
    text('3  devam et', -470, -10, 31, palette.ink, true),
  ];
  // The surrounding pieces are already present. Only the execution path will
  // change later; no instruction is rewritten or carried into a new region.
  const catalogName = text('loaded code', 350, -310, 31, palette.muted);
  const setup = codeBlock(570, 76, 350, -190);
  const setupName = text('argument’ı yerleştir; return', 350, -190, 30, palette.ink, true);
  setup.opacity(0);
  setupName.opacity(0);
  const lengthCode = codeBlock(570, 128, 350, -25);
  const lengthName = text('read1(address)', 350, -50, 32, palette.ink, true);
  const lengthBody = text('read 1 byte → result', 350, 15, 28, palette.muted);
  const finish = codeBlock(570, 76, 350, 160);
  const finishName = text('result’ı al; return', 350, 160, 30, palette.ink, true);
  finish.opacity(0);
  finishName.opacity(0);
  const input = newBytes;
  const inputName = text('buffer B (4 byte)', 350, 360, 30, palette.muted);
  const active = new Circle({ position: [-695, -170], size: 13, fill: palette.accent });
  const callPath = wire(
    [
      [-245, -90],
      [0, -90],
      [0, -50],
      [65, -50],
    ],
    palette.accent,
  );
  callPath.end(0);
  const returnPath = wire(
    [
      [65, 15],
      [0, 15],
      [0, -10],
      [-245, -10],
    ],
    palette.accent,
  );
  returnPath.end(0);
  const stack = record(510, 85, -470, 270);
  const returnAddress = text('adres', -470, 270, 29, palette.ink, true);
  const stackName = text('return adresi', -470, 195, 29, palette.muted);
  stack.opacity(0);
  returnAddress.opacity(0);
  stackName.opacity(0);
  const output = text('result: 9', 350, 85, 32, palette.accent, true);
  output.opacity(0);
  call.add([
    caller,
    callerName,
    ...callerLines,
    catalogName,
    setup,
    setupName,
    lengthCode,
    lengthName,
    lengthBody,
    finish,
    finishName,
    inputName,
    active,
    callPath,
    returnPath,
    stack,
    returnAddress,
    stackName,
    output,
  ]);
  for (const node of [caller, callerName, ...callerLines, active]) node.opacity(0);
  view.add(call);
  // This is the same B strip from06, carried between the two existing layouts.
  input.root.reparent(view);
  yield* native.opacity(0, 0.35);
  yield* all(call.opacity(1, 0.45), input.root.position([350, 265], 0.8));
  input.root.reparent(call);

  yield* waitUntil('buffer-argument');
  yield* replaceText(lengthName, 'read1(B)', 0.4);
  const argumentPath = wire(
    [
      [180, 265],
      [65, 265],
      [65, 15],
    ],
    palette.accent,
  );
  argumentPath.end(0);
  call.add(argumentPath);
  yield* argumentPath.end(1, 0.7);

  yield* waitUntil('example-result');
  yield* output.opacity(1, 0.4);

  yield* waitUntil('caller-program');
  yield* all(
    output.opacity(0, 0.3),
    argumentPath.opacity(0, 0.3),
    caller.opacity(1, 0.4),
    callerName.opacity(1, 0.4),
    ...callerLines.map((line) => line.opacity(1, 0.4)),
    active.opacity(1, 0.4),
  );

  yield* waitUntil('ordinary-call');
  yield* active.y(-90, 0.4);
  yield* callPath.end(1, 0.6);
  yield* active.opacity(0, 0.12);
  active.position([65, -50]);
  yield* active.opacity(1, 0.12);

  yield* waitUntil('argument-and-result');
  argumentPath.end(0);
  argumentPath.opacity(1);
  yield* argumentPath.end(1, 0.6);
  yield* active.y(15, 0.4);

  yield* waitUntil('call-result');
  yield* output.opacity(1, 0.35);

  yield* waitUntil('return-question');
  yield* active.opacity(0, 0.3);

  yield* waitUntil('saved-return-address');
  yield* all(stack.opacity(1, 0.5), returnAddress.opacity(1, 0.5));

  yield* waitUntil('return-address-name');
  yield* stackName.opacity(1, 0.4);

  yield* waitUntil('normal-return');
  yield* replaceText(returnAddress, 'return: 3. adım', 0.35);
  yield* active.opacity(1, 0.2);
  yield* argumentPath.opacity(0, 0.3);
  yield* returnPath.end(1, 0.9);
  yield* active.opacity(0, 0.12);
  active.position([-695, -10]);
  yield* active.opacity(1, 0.12);
  yield* callPath.opacity(0, 0.3);

  yield* waitUntil('stack-name');
  yield* replaceText(stackName, 'stack', 0.4);

  yield* waitUntil('return-changes');
  yield* all(
    callPath.opacity(0, 0.4),
    returnPath.opacity(0, 0.4),
    caller.opacity(0, 0.4),
    callerName.opacity(0, 0.4),
    ...callerLines.map((line) => line.opacity(0, 0.4)),
    argumentPath.opacity(0, 0.4),
    output.opacity(0, 0.4),
    stackName.opacity(0, 0.4),
    active.opacity(0, 0.4),
    waitFor(0.4),
  );
  yield* all(stack.y(-70, 0.65), returnAddress.y(-70, 0.65));
  // The writing capability from the previous scene edits data in this same
  // process. The code at the right remains fixed throughout the demonstration.
  const memoryWriter = access.writeName.reparent(call);
  memoryWriter.text('memory write');
  memoryWriter.fontSize(28);
  memoryWriter.lineHeight(28 * 1.35);
  memoryWriter.fill(palette.ink);
  memoryWriter.position([-470, 330]);
  memoryWriter.opacity(0);
  const writeToStack = wire(
    [
      [memoryWriter.x() - memoryWriter.width() / 2 - 15, 330],
      [-770, 330],
      [-770, -70],
      [-725, -70],
    ],
    palette.accent,
  );
  writeToStack.end(0);
  call.add(writeToStack);
  yield* memoryWriter.opacity(1, 0.45);
  yield* writeToStack.end(1, 1.1);
  yield* waitFor(0.4);
  yield* waitUntil('select-return-target');
  returnAddress.fontSize(27);
  returnAddress.lineHeight(27 * 1.35);
  yield* all(
    replaceText(returnAddress, 'return: argument’ı yerleştir', 0.35),
    stack.stroke(palette.accent, 0.35),
    returnAddress.fill(palette.accent, 0.35),
  );
  const preparedStack = new Layout({ opacity: 0 });
  const stackTitle = text('stack', -470, -300, 30, palette.muted);
  const stackRows = [-170, 30, 130].map((y, index) => {
    const row = record(510, 72, -470, y);
    const label = text(
      ['argument: B', 'return: read1(B)', 'return: result’ı al'][index],
      -470,
      y,
      28,
      palette.ink,
      true,
    );
    return { row, label };
  });
  preparedStack.add([stackTitle, ...stackRows.flatMap((row) => [row.row, row.label])]);
  stackRows.slice(1).forEach(({ row, label }) => {
    row.opacity(0);
    label.opacity(0);
  });
  call.add(preparedStack);
  yield* all(
    lengthCode.opacity(0, 0.4),
    lengthName.opacity(0, 0.4),
    lengthBody.opacity(0, 0.4),
    setup.opacity(1, 0.4),
    setupName.opacity(1, 0.4),
  );
  const controlledReturn = wire(
    [
      [-215, -70],
      [-70, -70],
      [-70, -190],
      [65, -190],
    ],
    palette.accent,
  );
  controlledReturn.end(0);
  call.add(controlledReturn);
  yield* controlledReturn.end(1, 0.8);

  yield* waitUntil('chain-returns');
  yield* preparedStack.opacity(1, 0.5);

  yield* waitUntil('argument-placement');
  const argumentInput = record(390, 65, -470, 270, palette.accent);
  const argumentInputName = text('argument', -470, 195, 29, palette.muted);
  argumentInput.opacity(0);
  argumentInputName.opacity(0);
  const argument = text('B', -470, -170, 29, palette.accent, true);
  argument.opacity(0);
  const inputConnection = wire(
    [
      [-275, 270],
      [65, 270],
      [65, 265],
      [180, 265],
    ],
    palette.accent,
    2,
  );
  inputConnection.end(0);
  call.add([argumentInput, argumentInputName, argument, inputConnection]);
  yield* all(
    memoryWriter.opacity(0, 0.3),
    writeToStack.opacity(0, 0.3),
    argumentInput.opacity(1, 0.4),
    argumentInputName.opacity(1, 0.4),
  );
  yield* waitFor(0.2);
  yield* stackRows[0].label.opacity(0, 0.2);
  yield* argument.opacity(1, 0.2);
  // The gadget places an address in an argument location. The byte strip stays
  // in its buffer; it is neither copied onto the stack nor executed as code.
  yield* argument.position([-775, -170], 0.45);
  yield* argument.position([-775, 270], 0.55);
  yield* argument.position([-470, 270], 0.6);
  yield* inputConnection.end(1, 0.55);
  active.position([65, -190]);
  yield* active.opacity(1, 0.3);

  yield* waitUntil('existing-pieces');
  // Only the currently consumed return entry and its destination are accented.
  // A prior route is retired before the next one appears; the diagram never
  // becomes a simultaneous maze of call/return/argument arrows.
  yield* all(
    controlledReturn.opacity(0, 0.35),
    inputConnection.opacity(0.4, 0.35),
    setup.opacity(0.25, 0.35),
    setupName.opacity(0.25, 0.35),
    active.opacity(0, 0.35),
    memoryWriter.opacity(0, 0.35),
    writeToStack.opacity(0, 0.35),
    stackRows[0].row.opacity(0.3, 0.35),
  );
  const nextReturn = wire(
    [
      [-215, 30],
      [65, 30],
    ],
    palette.accent,
  );
  nextReturn.end(0);
  call.add(nextReturn);
  yield* all(
    stackRows[1].row.opacity(1, 0.4),
    stackRows[1].label.opacity(1, 0.4),
    stackRows[1].row.stroke(palette.accent, 0.4),
    stackRows[1].label.fill(palette.accent, 0.4),
    stack.opacity(0.3, 0.4),
    returnAddress.opacity(0.3, 0.4),
    lengthCode.opacity(1, 0.4),
    lengthName.opacity(1, 0.4),
    lengthBody.opacity(1, 0.4),
  );
  nextReturn.points([
    [-215, 30],
    [-80, 30],
    [-80, -25],
    [65, -25],
  ]);
  yield* nextReturn.end(1, 0.8);
  yield* waitUntil('gadget-read-result');
  output.text('result');
  yield* output.opacity(1, 0.35);

  yield* waitUntil('gadget-take-result');
  yield* all(
    nextReturn.opacity(0, 0.35),
    stackRows[1].row.opacity(0.3, 0.35),
    stackRows[1].label.opacity(0.3, 0.35),
    lengthCode.opacity(0.3, 0.35),
    lengthName.opacity(0.3, 0.35),
    lengthBody.opacity(0.3, 0.35),
    output.opacity(0, 0.35),
    inputConnection.opacity(0, 0.35),
    argument.opacity(0, 0.35),
    argumentInput.opacity(0, 0.35),
    argumentInputName.opacity(0, 0.35),
  );
  yield* all(
    stackRows[2].row.opacity(1, 0.4),
    stackRows[2].label.opacity(1, 0.4),
    stackRows[2].row.stroke(palette.accent, 0.4),
    stackRows[2].label.fill(palette.accent, 0.4),
    finish.opacity(1, 0.4),
    finishName.opacity(1, 0.4),
  );
  nextReturn.points([
    [-215, 130],
    [-80, 130],
    [-80, 160],
    [65, 160],
  ]);
  nextReturn.end(0);
  nextReturn.opacity(1);
  yield* nextReturn.end(1, 0.55);
  yield* waitUntil('gadget-final-result');
  yield* replaceText(output, 'result: 9', 0.35);

  yield* waitUntil('pieces-stay-put');
  yield* input.cells[0].stroke(palette.accent, 0.35);

  yield* waitUntil('name-rop');
  yield* stackTitle.fill(palette.ink, 0.4);

  yield* waitUntil('name-gadgets');
  yield* all(
    setup.opacity(1, 0.4),
    setupName.opacity(1, 0.4),
    lengthCode.opacity(1, 0.4),
    lengthName.opacity(1, 0.4),
    lengthBody.opacity(1, 0.4),
  );

  yield* waitUntil('need-waiting-return');

  yield* waitFor(0.5);
  yield* all(memoryWriter.opacity(0, 0.4), writeToStack.opacity(0, 0.4));

  yield* waitUntil('worker-normal');
  const workerStage = new Layout({ opacity: 0 });

  const page = record(430, 240, -470, -30);
  const pageName = text('sayfanın JavaScript’i', -470, -225, 31);
  const pageWork = text('computation', -470, -30, 31);
  const worker = record(500, 240, 350, -30);
  const workerName = text('Web Worker', 350, -225, 31);
  const workerWork = text('computation', 350, -30, 31);
  const send = wire(
    [
      [-255, -80],
      [100, -80],
    ],
    palette.accent,
  );
  send.end(0);
  const receive = wire(
    [
      [100, 30],
      [-255, 30],
    ],
    palette.accent,
  );
  receive.end(0);
  const message = text('worker.postMessage([120, 240, 360])', -80, -185, 22, palette.muted, true);
  const workerDot = new Circle({
    position: [160, 55],
    size: 12,
    fill: palette.accent,
    opacity: 0,
  });
  const pageDot = new Circle({ position: [-650, 55], size: 12, fill: palette.accent, opacity: 0 });
  const workerProgress = wire(
    [
      [160, 55],
      [540, 55],
    ],
    palette.rule,
    2,
    false,
  );
  const pageProgress = wire(
    [
      [-650, 55],
      [-290, 55],
    ],
    palette.rule,
    2,
    false,
  );
  workerStage.add([
    page,
    pageName,
    pageWork,
    worker,
    workerName,
    workerWork,
    workerProgress,
    pageProgress,
    send,
    receive,
    message,
    workerDot,
    pageDot,
  ]);
  for (const node of [worker, workerName, workerWork, workerProgress, pageProgress, message])
    node.opacity(0);
  view.add(workerStage);
  yield* call.opacity(0, 0.35);
  yield* workerStage.opacity(1, 0.45);

  yield* waitUntil('page-responsive');
  yield* replaceText(pageWork, 'tıklama → yanıt', 0.4);

  yield* waitUntil('worker-thread');
  yield* all(worker.opacity(1, 0.5), workerName.opacity(1, 0.5), workerWork.opacity(1, 0.5));

  yield* waitUntil('worker-numbers');
  yield* replaceText(workerWork, '120 + 240 + 360', 0.4);

  yield* waitUntil('worker-send');
  yield* all(message.opacity(1, 0.4), send.end(1, 0.7));

  yield* waitUntil('parallel-work');
  yield* all(
    workerProgress.opacity(1, 0.3),
    pageProgress.opacity(1, 0.3),
    workerDot.opacity(1, 0.3),
    pageDot.opacity(1, 0.3),
  );
  yield* all(workerDot.x(540, 1.3), pageDot.x(-290, 0.9));

  yield* waitUntil('worker-result');
  yield* all(send.opacity(0, 0.3), message.opacity(0, 0.3));
  workerWork.text('720');
  message.text('postMessage(720)');
  message.fontSize(24);
  message.lineHeight(24 * 1.35);
  message.position([-80, 75]);
  yield* message.opacity(1, 0.3);
  yield* receive.end(1, 0.9);

  yield* waitUntil('worker-wait');
  yield* all(
    send.opacity(0, 0.5),
    receive.opacity(0, 0.5),
    message.opacity(0, 0.5),
    workerDot.opacity(0, 0.5),
    pageDot.opacity(0, 0.5),
    workerProgress.opacity(0, 0.5),
    pageProgress.opacity(0, 0.5),
    replaceText(workerWork, 'yeni mesaj bekliyor', 0.6),
    waitFor(0.4),
  );
  yield* waitUntil('worker-stack');
  const workerStack = record(560, 90, 350, 245);
  const workerReturn = text('return: mesajı işle', 350, 245, 30, palette.ink, true);
  workerReturn.opacity(0);
  const workerStackName = text('worker’ın native stack’i', 350, 155, 30, palette.muted);
  const waitPath = wire(
    [
      [600, 55],
      [720, 55],
      [720, 245],
      [630, 245],
    ],
    palette.muted,
    2,
    false,
  );

  const waitDetails = new Layout({ opacity: 0 });
  waitDetails.add([workerStack, workerReturn, workerStackName, waitPath]);
  workerStage.add(waitDetails);
  yield* waitDetails.opacity(1, 0.8);

  yield* waitUntil('worker-return-address');
  yield* workerReturn.opacity(1, 0.4);

  yield* waitUntil('library-placement');
  const libraryStage = new Layout({ opacity: 0 });
  const reader = record(390, 150, -470, 0);
  const readerName = text('memory read', -470, -150, 28, palette.muted);
  const readerValue = text('adres: ?', -470, 0, 30, palette.muted, true);
  const library = memory(620, 330, 330, 0);
  const libraryName = text('loaded library', 330, -240, 33);
  const libraryCode = [
    text('read1(…)', 330, -80, 31, palette.muted, true),
    text('read(…)', 330, 0, 31, palette.accent, true),
    text('data', 330, 80, 31, palette.muted, true),
  ];
  const libraryBaseName = text('library base', 20, -195, 24, palette.muted);
  libraryBaseName.opacity(0);
  const offsetMark = wire(
    [
      [65, -165],
      [65, 0],
    ],
    palette.muted,
    2,
    false,
  );
  const offsetTicks = [-165, 0].map((y) =>
    wire(
      [
        [55, y],
        [75, y],
      ],
      palette.muted,
      2,
      false,
    ),
  );
  const offsetName = text('offset', 115, -110, 24, palette.muted);
  const offsetDetail = new Layout({ opacity: 0 });
  offsetDetail.add([offsetMark, ...offsetTicks, offsetName]);
  const functionTarget = record(500, 76, 330, 0, palette.accent, 'transparent');
  functionTarget.opacity(0);
  const addressCalculation = text(
    'read adresi = library base + offset',
    330,
    245,
    25,
    palette.ink,
    true,
  );
  addressCalculation.opacity(0);
  const codeAddress = text('read adresi', 330, 95, 28, palette.accent, true);
  codeAddress.opacity(0);
  libraryStage.add([
    reader,
    readerName,
    readerValue,
    library,
    libraryName,
    libraryBaseName,
    offsetDetail,
    functionTarget,
    ...libraryCode,
    addressCalculation,
    codeAddress,
  ]);
  view.add(libraryStage);
  // Carry the actual return record, with padding inside the process boundary.
  yield* waitPath.opacity(0, 0.25);
  workerStack.reparent(view);
  workerReturn.reparent(view);
  workerStackName.reparent(view);
  yield* workerStage.opacity(0, 0.35);
  yield* all(
    workerStack.position([-470, 245], 0.85),
    workerReturn.position([-470, 245], 0.85),
    workerStackName.position([-470, 165], 0.85),
    libraryStage.opacity(1, 0.85),
  );
  workerStack.reparent(libraryStage);
  workerReturn.reparent(libraryStage);
  workerStackName.reparent(libraryStage);

  yield* waitUntil('library-base');
  yield* all(replaceText(readerValue, 'library base: ?', 0.4), libraryBaseName.opacity(1, 0.4));

  yield* waitUntil('library-offset');
  yield* offsetDetail.opacity(1, 0.5);

  yield* waitUntil('address-formula');
  yield* addressCalculation.opacity(1, 0.5);

  yield* waitUntil('find-library');
  // The read yields a base value; it is not an execution jump to a library corner.
  yield* all(replaceText(readerValue, 'library base', 0.5), readerValue.fill(palette.accent, 0.5));
  yield* all(
    functionTarget.opacity(1, 0.4),
    libraryCode[0].opacity(0.25, 0.4),
    libraryCode[2].opacity(0, 0.4),
  );
  yield* waitUntil('code-address-known');
  yield* codeAddress.opacity(1, 0.4);

  yield* waitUntil('worker-return-changes');
  yield* workerReturn.opacity(0, 0.2);
  workerReturn.text('return:');
  workerReturn.fontSize(28);
  workerReturn.lineHeight(28 * 1.35);
  workerReturn.position([-570, 245]);
  // Use the same computed address value in the same worker return record.
  // Its destination card was carried in last; keep the value above its fill.
  codeAddress.moveToTop();
  yield* codeAddress.position([-395, 245], 1.2);
  yield* all(
    workerReturn.opacity(1, 0.35),
    workerReturn.fill(palette.accent, 0.35),
    workerStack.stroke(palette.accent, 0.35),
  );
  const readyReturn = wire(
    [
      [-190, 245],
      [-70, 245],
      [-70, 0],
      [80, 0],
    ],
    palette.accent,
  );
  readyReturn.end(0);
  libraryStage.add(readyReturn);
  yield* readyReturn.end(1, 1.1);
  yield* waitFor(0.6);

  yield* waitUntil('resume-worker');
  const resume = message.reparent(libraryStage);
  resume.text('worker.postMessage(…)');
  resume.position([-470, 335]);
  resume.fontSize(26);
  resume.lineHeight(26 * 1.35);
  resume.fill(palette.ink);
  resume.opacity(0);
  const resumed = new Circle({ position: [-190, 245], size: 13, fill: palette.accent, opacity: 0 });
  libraryStage.add([resume, resumed]);
  yield* resume.opacity(1, 0.4);
  yield* resumed.opacity(1, 0.2);
  for (const point of [
    [-70, 245],
    [-70, 0],
    [80, 0],
  ] as [number, number][]) {
    yield* resumed.position(point, 0.45);
  }
  yield* resumed.opacity(0, 0.3);

  yield* waitUntil('need-system-service');
  yield* all(
    reader.opacity(0.25, 0.4),
    readerName.opacity(0.25, 0.4),
    readerValue.opacity(0.25, 0.4),
    addressCalculation.opacity(0.25, 0.4),
    workerStack.opacity(0.3, 0.4),
    workerReturn.opacity(0.3, 0.4),
    codeAddress.opacity(0.3, 0.4),
    readyReturn.opacity(0.3, 0.4),
    resume.opacity(0.3, 0.4),
  );
  yield* waitUntil('service-layout');
  const service = serviceRequest();
  service.root.opacity(0);
  const syscallName = text('syscall', -160, -55, 28, palette.accent, true);
  syscallName.opacity(0);
  const userLibrary = text('libkernel', -550, 155, 29, palette.muted);
  userLibrary.opacity(0);
  const returnResult = wire(
    [
      [145, 100],
      [-385, 100],
    ],
    palette.muted,
  );
  returnResult.end(0);
  const serviceResult = text('result', -550, 100, 31, palette.ink);
  serviceResult.opacity(0);
  const serviceDetails = new Layout({ opacity: 0 });
  serviceDetails.add([syscallName, userLibrary, returnResult, serviceResult]);
  view.add([service.root, serviceDetails]);
  service.path.end(0);
  const kernelElements = service.root
    .children()
    .filter(
      (node) =>
        node === service.boundary ||
        node === service.request ||
        node === service.requestName ||
        (node instanceof Txt && node.text() === 'kernel'),
    );
  kernelElements.forEach((node) => node.opacity(0));
  // Keep the selected read() actor visible while its surrounding view changes.
  yield* readyReturn.opacity(0, 0.25);
  libraryCode[1].reparent(view);
  service.operation.remove();
  service.operation = libraryCode[1];
  yield* all(
    libraryStage.opacity(0, 0.35),
    processBoundary.opacity(0, 0.35),
    processName.opacity(0, 0.35),
  );
  yield* all(
    service.root.opacity(1, 0.55),
    serviceDetails.opacity(1, 0.55),
    service.operation.position([-550, 0], 1),
  );
  service.operation.reparent(service.root);

  yield* waitUntil('kernel-service');
  yield* all(...kernelElements.map((node) => node.opacity(1, 0.5)), service.path.end(1, 0.8));

  yield* waitUntil('system-call');
  yield* syscallName.opacity(1, 0.4);

  yield* waitUntil('libkernel');
  yield* userLibrary.opacity(1, 0.4);

  yield* waitUntil('kernel-does-work');
  yield* replaceText(service.requestName, 'iş yürütülüyor', 0.5);

  yield* waitUntil('need-kernel-location');
  yield* service.boundary.stroke(palette.muted, 0.4);
  yield* service.boundary.stroke(palette.rule, 0.4);

  yield* waitUntil('route-query');
  yield* all(
    replaceText(service.operation, 'route query', 0.5),
    replaceText(service.requestName, 'query', 0.5),
    userLibrary.opacity(0, 0.5),
    serviceResult.opacity(0, 0.5),
    returnResult.opacity(0, 0.5),
    waitFor(0.5),
  );
  const response = new Layout({ position: [-440, 245], opacity: 0 });
  const leakedAddress = text('kernel adresi', -440, 280, 29, palette.accent);
  leakedAddress.opacity(0);
  response.add([record(600, 150, 0, 0), text('normal result: route', 0, -35, 29)]);
  const responsePath = wire(
    [
      [330, 80],
      [330, 245],
      [-140, 245],
    ],
    palette.accent,
  );
  responsePath.end(0);
  serviceDetails.add([response, responsePath, leakedAddress]);
  yield* waitUntil('query-response');
  yield* replaceText(service.requestName, 'response', 0.4);
  yield* response.opacity(1, 0.4);
  yield* responsePath.end(1, 0.8);

  yield* waitUntil('leaking-response');
  yield* leakedAddress.opacity(1, 0.4);

  yield* waitUntil('kernel-placement');
  yield* all(
    service.request.opacity(0, 0.6),
    service.requestName.opacity(0, 0.6),
    response.opacity(0, 0.6),
    responsePath.opacity(0, 0.6),
    service.path.opacity(0, 0.6),
  );
  const kernelImage = memory(600, 240, 330, 0);
  const kernelImageName = text('kernel code ve data', 330, -155, 31);
  const knownPoint = new Circle({ position: [460, 0], size: 16, fill: palette.accent });
  const knownPointName = text('sızan adres', 330, 70, 29, palette.accent);
  const imageBase = wire(
    [
      [30, -120],
      [30, 120],
    ],
    palette.accent,
    3,
    false,
  );
  const baseName = text('kernel base', 150, 175, 30, palette.accent);
  const kernelPermission = text('erişim izni yok', 330, 225, 27, palette.muted);
  kernelPermission.opacity(0);
  imageBase.opacity(0);
  baseName.opacity(0);
  const relative = wire(
    [
      [460, 0],
      [30, 0],
    ],
    palette.accent,
    2,
    false,
  );
  relative.end(0);
  const relativeName = text('offset', 245, -55, 27, palette.muted);
  relativeName.opacity(0);
  knownPointName.opacity(0);
  const image = new Layout({ opacity: 0 });
  image.add([
    kernelImage,
    kernelImageName,
    knownPoint,
    knownPointName,
    imageBase,
    baseName,
    kernelPermission,
    relative,
    relativeName,
  ]);
  service.root.add(image);
  yield* all(image.opacity(1, 0.8), leakedAddress.position([460, 70], 1));

  yield* waitUntil('kernel-offset');
  yield* all(relative.end(1, 0.8), relativeName.opacity(1, 0.5));

  yield* waitUntil('kernel-base');
  yield* all(imageBase.opacity(1, 0.5), baseName.opacity(1, 0.5));

  yield* waitUntil('kernel-permission');
  yield* kernelPermission.opacity(1, 0.4);

  yield* waitUntil('request-without-control');
  service.requestName.text('başlatılan iş');
  yield* all(
    image.opacity(0, 0.5),
    serviceDetails.opacity(0, 0.5),
    replaceText(service.operation, 'read request', 0.5),
  );
  yield* all(
    service.request.opacity(1, 0.6),
    service.requestName.opacity(1, 0.6),
    service.path.opacity(1, 0.6),
  );
  yield* waitUntil('async-records');
  yield* service.request.stroke(palette.accent, 0.3);
  yield* service.request.stroke(palette.rule, 0.3);
  yield* waitUntil('end');
});
