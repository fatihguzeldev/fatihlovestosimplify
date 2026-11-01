import { Circle, Layout, Line, Path, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { frame, memory, text } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import { nativePreparation } from '../10-authority/10-authority';
import { authorityRecord } from '../10-authority/native-ready';

const surface = '#303b44';
const slate = '#526e80';
const pale = '#8299a5';
function ink(data: string, fill = 'transparent', stroke: string = palette.ink, width = 2.5) {
  return new Path({
    data,
    fill: fill === 'transparent' ? '#00000000' : fill,
    stroke,
    lineWidth: width,
    lineCap: 'round',
    lineJoin: 'round',
  });
}
function instructionRows(x: number, y: number, color: string = pale) {
  const root = new Layout({ position: [x, y] });
  root.add([
    ink('M -62 -20 L 60 -19 M -63 0 L 35 0 M -61 20 L 50 19', 'transparent', color, 2.3),
    ink('M -75 -21 L -75 22', 'transparent', color, 3),
  ]);
  return root;
}
function dataMarks(x: number, y: number, color: string = pale) {
  const root = new Layout({ position: [x, y] });
  for (const offset of [-48, -16, 16, 48]) {
    const mark = ink('M -9 -10 L 10 -9 L 9 11 L -10 10 Z', surface, color, 1.8);
    mark.x(offset);
    root.add(mark);
  }
  return root;
}
function programFile(x: number, y: number, name: string) {
  const root = new Layout({ position: [x, y] });
  const paper = ink(
    'M -139 -173 Q -20 -178 92 -172 L 140 -125 L 136 174 Q 0 179 -140 171 Z',
    surface,
  );
  const fold = ink('M 91 -172 L 90 -123 L 139 -125', 'transparent', pale, 1.8);
  const nameLabel = text(name, 0, -275, 31);
  const status = text('henüz çalışmıyor', 0, -225, 25, palette.muted);
  const header = text('layout / entry', 0, -101, 28, palette.muted);
  const headerRule = ink('M -107 -59 L 108 -57', 'transparent', slate, 1.6);
  const code = instructionRows(0, -5);
  const data = dataMarks(0, 105);
  const codeName = text('code', -200, -5, 25, palette.muted);
  const dataName = text('data', -200, 105, 25, palette.muted);
  root.add([paper, fold, nameLabel, status, header, headerRule, code, data, codeName, dataName]);
  return { root, paper, name: nameLabel, status, header, code, data, codeName, dataName };
}

function handoffResources(x: number, y: number) {
  const root = new Layout({ position: [x, y] });
  const name = text('sonraki kodun pipe’ları', 0, -120, 28, palette.accent);
  const descriptors = text('fd × 4', 0, 0, 31, palette.ink, true);
  root.add([frame(340, 170, 0, 0, palette.accent, 'transparent', 16), name, descriptors]);
  return { root, name, descriptors };
}

/** The closing carries the ELF loader that is already listening for a payload. */
export function loaderReadyPose() {
  const root = new Layout({});
  const process = frame(1600, 900, 0, 10, palette.rule, 'transparent');
  const processName = text('aynı process', -520, -355, 31, palette.muted);
  const authority = authorityRecord();
  const handoff = handoffResources(400, 350);
  handoff.name.text('loader’ın pipe’ları');
  handoff.descriptors.fill(palette.accent);
  const area = memory(800, 340, 0, 20);
  const areaName = text('ELF loader', 0, -225, 31);
  const code = frame(500, 100, 0, -5, pale, surface);
  const data = frame(500, 82, 0, 105, slate, surface);
  code.add(instructionRows(0, 0));
  data.add(dataMarks(0, 0));
  const codeName = text('code', 340, -5, 28, palette.muted);
  const dataName = text('data', 340, 105, 28, palette.muted);
  const entry = new Circle({
    position: [-250, -5],
    size: 14,
    stroke: palette.accent,
    lineWidth: 2.5,
  });
  const run = new Circle({ position: [150, -5], size: 17, fill: palette.accent });
  const listener = text('TCP :9021', 0, -175, 28, palette.muted, true);
  const waiting = text('payload bekliyor', 0, -105, 28, palette.accent);
  root.add([
    process,
    processName,
    area,
    areaName,
    code,
    data,
    codeName,
    dataName,
    entry,
    run,
    listener,
    waiting,
    authority.root,
    handoff.root,
  ]);
  return {
    root,
    process,
    processName,
    area,
    areaName,
    code,
    data,
    codeName,
    dataName,
    entry,
    run,
    listener,
    waiting,
    authority,
    handoff,
  };
}

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const incoming = nativePreparation();
  view.add(incoming.root);
  incoming.process.reparent(view);
  incoming.name.reparent(view);
  incoming.authority.root.reparent(view);
  incoming.pipes.reparent(view);

  const acceptance = new Layout({ opacity: 0 });
  const loaderFile = programFile(-500, 0, 'program dosyası');
  loaderFile.header.text('machine code');
  loaderFile.header.opacity(0);
  const application = frame(400, 300, 420, 0, palette.rule, 'transparent');
  const applicationName = text('normal başlatma', 420, -220, 31, palette.muted);
  const compatibility = text('dosya / ortam uyumu', 420, -50, 30);
  compatibility.opacity(0);
  application.opacity(0);
  applicationName.opacity(0);
  const signature = text('Sony imzası', 420, 65, 31, palette.accent);
  signature.opacity(0);
  const normalPath = new Line({
    points: [
      [-345, 0],
      [205, 0],
    ],
    stroke: pale,
    lineWidth: 2.5,
    endArrow: true,
    arrowSize: 13,
    end: 0,
  });
  acceptance.add([
    loaderFile.root,
    application,
    applicationName,
    compatibility,
    signature,
    normalPath,
  ]);
  view.add(acceptance);

  yield* waitUntil('ordinary-application-acceptance');
  yield* all(
    incoming.root.opacity(0, 0.45),
    incoming.authority.root.opacity(0, 0.45),
    incoming.pipes.position([-500, 350], 0.7),
  );
  yield* acceptance.opacity(1, 0.5);
  yield* waitUntil('name-loader');
  loaderFile.name.text('loader dosyası');
  yield* waitUntil('machine-code-in-file');
  yield* loaderFile.header.opacity(1, 0.3);
  yield* waitUntil('normal-application-route');
  yield* all(application.opacity(1, 0.35), applicationName.opacity(1, 0.35));
  yield* normalPath.end(1, 0.55);
  yield* waitUntil('signature-condition');
  yield* signature.opacity(1, 0.35);
  yield* waitUntil('loading-in-existing-process');
  // Keep the same file at full size. The launch gate leaves before a new
  // mechanism appears, rather than keeping an unreadable miniature overview.
  loaderFile.root.reparent(view);
  yield* acceptance.opacity(0, 0.55);
  acceptance.remove();
  yield* loaderFile.root.position([500, 0], 0.95, easeInOutCubic);
  yield* incoming.authority.root.opacity(1, 0.45);
  loaderFile.header.opacity(0);

  const starter = new Layout({ position: [-500, 0], opacity: 0 });
  const starterName = text('başlangıç kodu', 0, -110, 30);
  starter.add([frame(260, 130, 0, 0), instructionRows(0, 0), starterName]);
  view.add(starter);
  yield* waitUntil('starter-code');
  yield* starter.opacity(1, 0.5);
  yield* waitUntil('name-starter-bootstrap');
  starterName.text('bootstrap');

  const mapped = new Layout({ opacity: 0 });
  const codeArea = incoming.area;
  codeArea.opacity(0);
  codeArea.reparent(mapped);
  codeArea.position([-400, 60]);
  const mappingName = text('memory', -400, -95, 31, palette.muted);
  const permission = text('read + write + execute', -400, 125, 28, palette.accent);
  permission.opacity(0);
  const codeRows = instructionRows(-400, 20);
  codeRows.opacity(0);
  const check = text('yazılan byte’lar doğrulandı', -400, 125, 28, palette.muted);
  check.opacity(0);
  const bootstrap = text('bootstrap', -400, -95, 31, palette.ink, true);
  bootstrap.opacity(0);
  const argumentsArea = frame(450, 70, -400, 135, pale, 'transparent');
  const argumentsName = text('arguments', -400, 76, 27, palette.muted);
  const descriptorCopy = text('fd × 4', 400, 350, 28, palette.accent, true);
  const loaderArgument = text('loader adresi', 500, 0, 28, palette.accent);
  [argumentsArea, argumentsName, descriptorCopy, loaderArgument].forEach((node) => node.opacity(0));
  const thread = new Line({
    points: [
      [-670, 20],
      [-515, 20],
    ],
    stroke: palette.accent,
    lineWidth: 2.5,
    endArrow: true,
    arrowSize: 13,
    end: 0,
  });
  const threadName = text('native thread', -400, -175, 29, palette.accent);
  threadName.opacity(0);
  const bootstrapEntry = new Circle({
    position: [-500, 20],
    size: 14,
    stroke: palette.accent,
    lineWidth: 2.5,
    opacity: 0,
  });
  const run = new Circle({ position: [-670, 20], size: 17, fill: palette.accent, opacity: 0 });
  mapped.add([
    codeArea,
    mappingName,
    permission,
    codeRows,
    check,
    bootstrap,
    argumentsArea,
    argumentsName,
    descriptorCopy,
    loaderArgument,
    thread,
    threadName,
    bootstrapEntry,
    run,
  ]);
  view.add(mapped);

  yield* waitUntil('request-code-area');
  yield* starter.opacity(0, 0.45);
  yield* all(mapped.opacity(1, 0.5), codeArea.opacity(1, 0.5));
  yield* waitUntil('mapping-with-permissions');
  yield* codeArea.stroke(palette.accent, 0.35);
  yield* waitUntil('mapping-permissions');
  permission.text('read');
  yield* permission.opacity(1, 0.25);
  yield* waitUntil('mapping-write-permission');
  permission.text('read + write');
  yield* waitUntil('mapping-execute-permission');
  permission.text('read + write + execute');
  yield* waitUntil('name-mapping');
  mappingName.text('mapping');
  yield* waitUntil('place-new-code');
  yield* permission.opacity(0, 0.35);
  yield* codeRows.opacity(1, 0.7);
  yield* waitUntil('verify-new-code');
  yield* check.opacity(1, 0.4);
  yield* waitUntil('name-bootstrap');
  yield* all(mappingName.opacity(0, 0.35), check.opacity(0, 0.35), starter.opacity(0, 0.35));
  check.text('henüz çalışmıyor');
  check.position([-400, -175]);
  yield* all(bootstrap.opacity(1, 0.45), check.opacity(1, 0.45));

  const task = new Line({
    points: [
      [-140, 20],
      [100, 20],
      [100, -101],
      [355, -101],
    ],
    stroke: pale,
    lineWidth: 2,
    lineDash: [5, 8],
    endArrow: true,
    arrowSize: 12,
    end: 0,
  });
  view.add(task);
  const handoff = handoffResources(400, 350);
  handoff.root.opacity(0);
  const prepare = new Line({
    points: [
      [-330, 350],
      [215, 350],
    ],
    stroke: palette.accent,
    lineWidth: 2.5,
    endArrow: true,
    arrowSize: 13,
    end: 0,
  });
  view.add([handoff.root, prepare]);

  yield* waitUntil('loader-is-a-file');
  yield* loaderFile.paper.stroke(palette.accent, 0.35);
  yield* task.end(1, 0.75);
  yield* loaderFile.paper.stroke(palette.ink, 0.35);
  yield* waitUntil('argument-information');
  yield* argumentsArea.opacity(1, 0.35);
  yield* waitUntil('loader-address-source');
  yield* loaderFile.paper.stroke(palette.accent, 0.2);
  yield* loaderFile.paper.stroke(palette.ink, 0.2);
  yield* waitUntil('kernel-pipes-source');
  yield* incoming.pipes.opacity(0.55, 0.15);
  yield* incoming.pipes.opacity(1, 0.25);
  yield* waitUntil('prepare-handoff-pipes');
  handoff.descriptors.opacity(0);
  yield* handoff.root.opacity(1, 0.55);
  yield* prepare.end(1, 1.1);
  yield* waitUntil('name-four-descriptors');
  yield* handoff.descriptors.opacity(1, 0.3);
  yield* waitUntil('handoff-descriptors');
  yield* prepare.opacity(0.25, 0.3);
  yield* all(argumentsArea.opacity(1, 0.35), argumentsName.opacity(1, 0.35));
  // Reveal the copied fd token only after it has separated from its source.
  descriptorCopy.position([150, 350]);
  yield* descriptorCopy.opacity(1, 0.15);
  yield* descriptorCopy.position([-100, 350], 0.3, easeInOutCubic);
  yield* descriptorCopy.position([-100, 135], 0.35, easeInOutCubic);
  yield* descriptorCopy.position([-515, 135], 0.45, easeInOutCubic);
  yield* waitUntil('loader-argument-address');
  loaderArgument.position([200, 150]);
  yield* loaderFile.paper.stroke(palette.accent, 0.2);
  yield* loaderArgument.opacity(1, 0.15);
  yield* loaderArgument.position([-285, 135], 0.8, easeInOutCubic);
  yield* loaderFile.paper.stroke(palette.ink, 0.2);
  yield* waitUntil('loader-argument-size');
  loaderArgument.text('adres + size');
  yield* waitUntil('resources-stay-open');
  yield* handoff.descriptors.fill(palette.accent, 0.45);
  const argumentPath = new Line({
    points: [
      [-640, 135],
      [-690, 135],
      [-690, 20],
      [-670, 20],
    ],
    stroke: pale,
    lineWidth: 2,
    endArrow: true,
    arrowSize: 12,
    end: 0,
  });
  mapped.add(argumentPath);
  yield* waitUntil('start-native-thread');
  yield* check.opacity(0, 0.2);
  yield* all(threadName.opacity(1, 0.35), bootstrapEntry.opacity(1, 0.35), thread.end(1, 0.6));
  yield* waitUntil('thread-arguments');
  yield* argumentPath.end(1, 0.55);
  yield* waitUntil('thread-runs-bootstrap');
  yield* run.opacity(1, 0.2);
  yield* run.x(-250, 1.1, easeInOutCubic);

  const loading = new Layout({ opacity: 0 });
  const memoryArea = memory(800, 340, 350, 20);
  const areaName = text('loader memory', 350, -225, 31);
  const loaderCode = frame(500, 100, 350, -5, pale, surface);
  const loaderData = frame(500, 82, 350, 105, slate, surface);
  const loaderCodeName = text('code', 690, -5, 28, palette.muted);
  const loaderDataName = text('data', 690, 105, 28, palette.muted);
  loaderCode.add(instructionRows(0, 0));
  loaderData.add(dataMarks(0, 0));
  const entry = new Circle({
    position: [100, -5],
    size: 14,
    stroke: palette.accent,
    lineWidth: 2.5,
  });
  const entryName = text('entry point', 185, -100, 28, palette.accent);
  const loaderRun = new Circle({ position: [100, -5], size: 17, fill: palette.accent });
  const fileCode = instructionRows(-500, -5, palette.accent);
  const fileData = dataMarks(-500, 105, palette.accent);
  const elfLayout = new Line({
    points: [
      [-345, -101],
      [-65, -101],
    ],
    stroke: pale,
    lineWidth: 2,
    endArrow: true,
    arrowSize: 12,
    end: 0,
  });
  let initializer = text('bootstrap', -125, -345, 30, palette.muted, true);
  let initializerMarker = new Circle({ position: [-125, -285], size: 14, fill: palette.accent });
  const enter = new Line({
    points: [
      [-125, -285],
      [100, -285],
      [100, -5],
    ],
    stroke: palette.accent,
    lineWidth: 2.5,
    endArrow: true,
    arrowSize: 12,
    end: 0,
  });
  [
    memoryArea,
    areaName,
    loaderCode,
    loaderData,
    loaderCodeName,
    loaderDataName,
    entry,
    entryName,
    loaderRun,
    fileCode,
    fileData,
  ].forEach((node) => node.opacity(0));
  loading.add([
    memoryArea,
    areaName,
    loaderCode,
    loaderData,
    loaderCodeName,
    loaderDataName,
    entry,
    entryName,
    loaderRun,
    fileCode,
    fileData,
    elfLayout,
    initializer,
    initializerMarker,
    enter,
  ]);
  view.add(loading);

  yield* waitUntil('bootstrap-prepares-loader');
  run.reparent(view);
  bootstrap.reparent(view);
  yield* all(task.opacity(0, 0.45), prepare.opacity(0, 0.45), mapped.opacity(0, 0.45));
  yield* all(
    run.position([-125, -285], 0.8, easeInOutCubic),
    bootstrap.position([-125, -345], 0.8, easeInOutCubic),
  );
  // Keep the bootstrap identity visible, but let the moving file title pass
  // without the execution marker crossing its letters.
  yield* run.opacity(0, 0.12);
  yield* loaderFile.root.position([-500, 0], 0.95, easeInOutCubic);
  yield* run.opacity(1, 0.12);
  // Keep the actual running bootstrap and its identity through this carry.
  // The hidden layout placeholders are replaced before any frame is shown.
  initializer.remove();
  initializerMarker.remove();
  initializer = bootstrap;
  initializerMarker = run;
  initializer.reparent(loading);
  initializerMarker.reparent(loading);
  loading.opacity(1);
  yield* waitUntil('file-layout-to-memory');
  yield* all(memoryArea.opacity(1, 0.5), areaName.opacity(1, 0.5));
  yield* waitUntil('name-elf');
  loaderFile.name.text('loader dosyası');
  loaderFile.header.text('ELF layout');
  yield* loaderFile.header.opacity(1, 0.4);
  yield* elfLayout.end(1, 0.7);
  yield* waitUntil('read-elf-layout');
  yield* all(loaderFile.header.fill(palette.accent, 0.25), memoryArea.stroke(palette.accent, 0.25));
  yield* waitUntil('load-loader-code');
  fileCode.position([-300, -5]);
  yield* fileCode.opacity(1, 0.15);
  yield* fileCode.position([350, -5], 0.8, easeInOutCubic);
  yield* all(loaderCode.opacity(1, 0.2), loaderCodeName.opacity(1, 0.2));
  fileCode.opacity(0);
  yield* waitUntil('load-loader-data');
  fileData.position([-300, 105]);
  yield* fileData.opacity(1, 0.15);
  yield* fileData.position([350, 105], 0.8, easeInOutCubic);
  yield* all(loaderData.opacity(1, 0.2), loaderDataName.opacity(1, 0.2));
  fileData.opacity(0);
  yield* waitUntil('loader-entry');
  yield* entry.opacity(1, 0.35);
  yield* waitUntil('name-loader-entry');
  yield* entryName.opacity(1, 0.35);
  yield* waitUntil('loader-runs');
  yield* enter.end(1, 0.7);
  yield* initializerMarker.x(100, 0.5, easeInOutCubic);
  yield* initializerMarker.y(-5, 0.6, easeInOutCubic);
  yield* waitUntil('loader-code-running');
  initializerMarker.opacity(0);
  loaderRun.opacity(1);
  yield* loaderRun.x(500, 1.1, easeInOutCubic);
  areaName.text('çalışan loader');
  loaderFile.status.text('kaynak dosya');
  yield* waitUntil('release-working-tools');
  yield* incoming.pipes.opacity(0.3, 0.6);
  yield* incoming.pipes.opacity(0, 0.6);

  yield* waitUntil('loader-ready');
  // Keep the actual loaded ELF code and its open pipes. No second program is
  // supplied or executed in the result this video claims for ReLapse.
  yield* all(
    loaderFile.root.opacity(0, 0.55),
    elfLayout.opacity(0, 0.55),
    initializer.opacity(0, 0.55),
    enter.opacity(0, 0.55),
    entryName.opacity(0, 0.55),
    areaName.opacity(0, 0.25),
    memoryArea.stroke(palette.rule, 0.55),
  );
  areaName.text('ELF loader');
  handoff.name.text('loader’ın pipe’ları');
  yield* areaName.opacity(1, 0.25);
  const readyLoader = new Layout({});
  view.add(readyLoader);
  for (const node of [
    memoryArea,
    areaName,
    loaderCode,
    loaderData,
    loaderCodeName,
    loaderDataName,
    entry,
    loaderRun,
  ])
    node.reparent(readyLoader);
  yield* readyLoader.x(-350, 1, easeInOutCubic);

  yield* waitUntil('wait-for-payload');
  const listener = text('TCP', 350, -175, 28, palette.muted, true);
  const waiting = text('payload bekliyor', 350, -105, 28, palette.accent);
  listener.opacity(0);
  waiting.opacity(0);
  readyLoader.add([listener, waiting]);
  yield* listener.opacity(1, 0.35);
  yield* waitUntil('listen-port');
  listener.text('TCP :9021');
  yield* waitUntil('payload-not-sent');
  yield* waiting.opacity(1, 0.35);
  yield* waitUntil('end');
});
