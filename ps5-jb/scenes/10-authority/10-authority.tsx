import { Circle, Layout, Line, Rect, Txt, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { kernelWindow } from '../09-interfaces/kernel-window';
import { nativeReady } from './native-ready';
import { filesystemTree } from './filesystem-story';
import { frame, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** The same process and its open working resources continue into native loading. */
export function nativePreparation() {
  const pose = nativeReady();
  pose.area.opacity(0);
  pose.areaName.opacity(0);
  pose.authority.root.opacity(0);
  return pose;
}

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const incoming = kernelWindow();
  view.add(incoming.root);

  // Borrow the actual handoff resources rather than introducing a second pair
  // after explaining that these working pipes stay open.
  const outgoing = nativePreparation();
  outgoing.root.opacity(0);
  view.add(outgoing.root);
  const workingPipes = outgoing.pipes;
  workingPipes.reparent(view);
  workingPipes.position([-530, 350]);
  workingPipes.opacity(0);

  const aio = new Layout({ opacity: 0 });
  const pending = frame(285, 150, 160, 0);
  const pendingName = text('bekleyen istek', 160, 0, 30);
  const aioRecord = frame(240, 150, 580, 0);
  const aioName = text('AIO kaydı', 580, 0, 30);
  const staleLink = wire(
    [
      [310, 0],
      [450, 0],
    ],
    palette.accent,
  );
  aio.add([pending, pendingName, staleLink, aioRecord, aioName]);
  view.add(aio);

  const decision = new Layout({ opacity: 0 });
  const process = incoming.user;
  // The frozen incoming factory keeps its process identity label next to its frame.
  const processName = incoming.root.children()[1] as Txt;
  const operation = text('dosyayı aç', -600, -30, 35);
  const mode = text('user mode', -600, 100, 29, palette.muted);
  mode.opacity(0);
  const kernelName = text('kernel', 120, -410, 32, palette.muted);
  const kernelScope = frame(1140, 660, 180, 0, palette.rule, 'transparent');
  const record = frame(440, 280, 0, 0);
  const recordName = text('kullanıcı / grup bilgisi', 0, -220, 31, palette.muted);
  const primary = text('kullanıcı kimliği', 0, -50, 31, palette.ink, true);
  const secondary = text('grup bilgisi', 0, 65, 29, palette.muted);
  [record, recordName, primary, secondary].forEach((node) => node.opacity(0));
  const resource = frame(270, 280, 590, 0);
  const resourceName = text('dosya', 590, -220, 31, palette.muted);
  const requirement = text('dosya izinleri', 590, -50, 29);
  const result = text('izin yok', 590, 65, 33, palette.accent);
  requirement.opacity(0);
  result.opacity(0);
  const requestPath = wire(
    [
      [-425, 0],
      [-235, 0],
    ],
    palette.muted,
  );
  const decisionPath = wire(
    [
      [235, 0],
      [440, 0],
    ],
    palette.muted,
  );
  requestPath.end(0);
  decisionPath.end(0);
  const packet = new Circle({ size: 13, fill: palette.accent, opacity: 0 });
  const editName = text('kernel memory write', 0, 255, 30, palette.accent, true);
  const editPath = new Line({
    points: [
      [0, 225],
      [0, 155],
    ],
    stroke: palette.accent,
    lineWidth: 3,
    endArrow: true,
    arrowSize: 12,
    end: 0,
  });
  editName.opacity(0);
  const filesystem = filesystemTree();
  const treeChildren = filesystem.root.children();
  const localFiles = treeChildren[6];
  const localPath = treeChildren[7];
  const parentPath = treeChildren[8];
  const originName = treeChildren[10];
  treeChildren.forEach((node) => node.opacity(0));
  filesystem.currentRoot.fill(palette.muted);
  originName.position([-290, 115]);
  decision.add([
    kernelScope,
    kernelName,
    operation,
    mode,
    record,
    recordName,
    primary,
    secondary,
    resource,
    resourceName,
    requirement,
    result,
    requestPath,
    decisionPath,
    editName,
    editPath,
    packet,
    filesystem.root,
  ]);
  view.add(decision);

  function* sendRequest() {
    packet.position([-425, 0]);
    yield* packet.opacity(1, 0.12);
    yield* packet.x(-235, 0.55, easeInOutCubic);
    yield* packet.opacity(0, 0.12);
  }
  function* editRecord() {
    yield* all(editName.opacity(1, 0.3), editPath.end(1, 0.45));
    yield* record.stroke(palette.accent, 0.3);
  }

  yield* waitUntil('stabilize-aio');
  yield* all(
    incoming.target.opacity(0, 0.25),
    incoming.targetName.opacity(0, 0.25),
    incoming.value.opacity(0, 0.25),
    incoming.path.opacity(0, 0.25),
    incoming.marker.opacity(0, 0.25),
  );
  incoming.targetName.text('geçici AIO bağlantısı');
  yield* all(aio.opacity(1, 0.3), incoming.targetName.opacity(1, 0.3));
  yield* waitUntil('clear-aio');
  yield* staleLink.end(0, 0.65);
  yield* all(pending.opacity(0.35, 0.3), pendingName.opacity(0.35, 0.3));
  yield* waitUntil('working-pipes-remain');
  yield* all(incoming.access.opacity(0, 0.3), workingPipes.opacity(1, 0.45));

  yield* waitUntil('ordinary-file-request');
  process.reparent(view);
  processName.reparent(view);
  yield* all(
    aio.opacity(0, 0.5),
    incoming.root.opacity(0, 0.5),
    process.position([-600, 0], 0.7),
    process.size([340, 360], 0.7),
    processName.position([-600, -245], 0.7),
    workingPipes.x(-600, 0.7),
  );
  processName.text('aynı process');
  processName.fontSize(31);
  processName.lineHeight(31 * 1.35);
  processName.fill(palette.muted);
  yield* decision.opacity(1, 0.5);
  process.reparent(decision);
  processName.reparent(decision);
  aio.remove();
  incoming.root.remove();

  yield* waitUntil('identity-fields');
  yield* all(
    record.opacity(1, 0.35),
    recordName.opacity(1, 0.35),
    primary.opacity(1, 0.35),
    secondary.opacity(1, 0.35),
    requestPath.end(1, 0.45),
  );
  yield* sendRequest();
  yield* waitUntil('file-permissions');
  yield* all(requirement.opacity(1, 0.3), decisionPath.end(1, 0.45));
  yield* waitUntil('file-needs-root');
  requirement.text('root gerekiyor');
  yield* waitUntil('identity-decision');
  yield* result.opacity(1, 0.35);
  yield* waitUntil('name-credentials');
  recordName.text('credentials');
  yield* waitUntil('name-uid');
  yield* primary.opacity(0, 0.15);
  primary.text('UID ≠ 0');
  primary.fontSize(42);
  primary.lineHeight(42 * 1.35);
  yield* primary.opacity(1, 0.2);
  yield* waitUntil('root-zero-definition');
  requirement.text('root (UID 0)');
  yield* waitUntil('change-identity');
  yield* editRecord();
  yield* waitUntil('identity-zero');
  primary.text('UID 0');
  secondary.text('root');
  yield* primary.fill(palette.accent, 0.3);
  yield* waitUntil('same-request');
  yield* result.opacity(0, 0.2);
  yield* sendRequest();
  yield* waitUntil('root-identity-used');
  yield* decisionPath.stroke(palette.accent, 0.3);
  yield* waitUntil('same-request-granted');
  result.text('izin verildi');
  result.fill(palette.ink);
  yield* result.opacity(1, 0.3);
  yield* waitUntil('same-execution-mode');
  yield* all(mode.opacity(1, 0.35), editName.opacity(0, 0.35), editPath.opacity(0, 0.35));

  yield* waitUntil('filesystem-boundary');
  yield* all(
    record.opacity(0, 0.3),
    recordName.opacity(0, 0.3),
    primary.opacity(0, 0.3),
    secondary.opacity(0, 0.3),
    result.opacity(0, 0.3),
    decisionPath.opacity(0, 0.3),
    requestPath.opacity(0, 0.3),
    requirement.opacity(0, 0.3),
    resourceName.y(-280, 0.3),
    operation.y(-80, 0.3),
  );
  // Keep the known root identity attached to the same process while its path
  // origin is explained separately. It is no longer a second central record.
  primary.position([-600, 25]);
  primary.fontSize(28);
  primary.lineHeight(28 * 1.35);
  yield* primary.opacity(1, 0.25);
  filesystem.root.opacity(1);
  yield* waitUntil('filesystem-tree');
  yield* all(
    filesystem.systemRoot.opacity(1, 0.35),
    filesystem.systemName.opacity(1, 0.35),
    filesystem.currentRoot.opacity(1, 0.35),
    parentPath.opacity(1, 0.35),
    localFiles.opacity(1, 0.35),
    localPath.opacity(1, 0.35),
  );
  yield* waitUntil('process-filesystem-root');
  requestPath.points([
    [-425, 0],
    [-240, 0],
    [-240, -10],
    [-20, -10],
  ]);
  requestPath.end(0);
  requestPath.opacity(1);
  requestPath.stroke(palette.accent);
  yield* all(
    filesystem.sandbox.opacity(1, 0.4),
    filesystem.name.opacity(1, 0.4),
    filesystem.currentRoot.fill(palette.accent, 0.4),
    originName.opacity(1, 0.4),
    requestPath.end(1, 0.55),
  );
  yield* waitUntil('process-slash');
  yield* filesystem.currentName.opacity(1, 0.3);
  yield* waitUntil('name-filesystem-sandbox');
  filesystem.name.text('filesystem sandbox');
  yield* waitUntil('file-outside-subtree');
  filesystem.targetPath.end(0);
  filesystem.targetPath.opacity(1);
  yield* filesystem.targetPath.end(1, 0.55);
  yield* waitUntil('filesystem-unreachable');
  requirement.text('sandbox dışında');
  yield* requirement.opacity(1, 0.25);
  result.text('ulaşılamıyor');
  result.fill(palette.accent);
  yield* result.opacity(1, 0.3);
  yield* waitUntil('change-filesystem-links');
  editPath.opacity(0);
  // This edit changes the path-origin link, not the directory's contents.
  yield* all(editName.opacity(1, 0.3), requestPath.lineWidth(4.5, 0.3));
  yield* waitUntil('filesystem-origin-system-root');
  // Retire the old destination and completed write callout before retargeting.
  yield* all(requestPath.opacity(0, 0.18), editName.opacity(0, 0.18));
  requestPath.lineWidth(3);
  requestPath.points([
    [-425, 0],
    [-240, 0],
    [-240, -260],
    [120, -260],
    [120, -215],
  ]);
  requestPath.end(0);
  requestPath.opacity(1);
  yield* all(
    filesystem.sandbox.stroke(palette.rule, 0.65),
    filesystem.currentRoot.fill(palette.muted, 0.65),
    filesystem.currentName.fill(palette.muted, 0.65),
    filesystem.systemRoot.fill(palette.accent, 0.65),
    filesystem.systemName.fill(palette.accent, 0.65),
    filesystem.targetPath.stroke(palette.accent, 0.65),
    requestPath.end(1, 0.65),
  );
  yield* waitUntil('filesystem-reachable');
  result.text('ulaşılabilir');
  result.fill(palette.ink);

  const authid = text('authid', 0, -50, 35, palette.ink, true);
  authid.opacity(0);
  decision.add(authid);
  yield* waitUntil('platform-checks');
  yield* all(
    operation.opacity(0, 0.3),
    resourceName.opacity(0, 0.3),
    result.opacity(0, 0.3),
    editName.opacity(0, 0.3),
    editPath.opacity(0, 0.3),
    filesystem.root.opacity(0, 0.4),
    requestPath.opacity(0, 0.4),
    requirement.opacity(0, 0.3),
  );
  recordName.text('platform izinleri');
  secondary.text('capabilities');
  secondary.fill(palette.muted);
  requirement.text('platform kontrolü');
  result.text('henüz izin yok');
  result.fill(palette.accent);
  record.stroke(palette.rule);
  yield* all(record.opacity(1, 0.35), recordName.opacity(1, 0.35));
  yield* waitUntil('platform-library-call');
  operation.text('library çağrısı');
  resourceName.text('library çağrısı');
  resourceName.y(-220);
  requestPath.points([
    [-425, 0],
    [-235, 0],
  ]);
  requestPath.end(0);
  requestPath.opacity(1);
  requestPath.stroke(palette.muted);
  yield* all(
    operation.opacity(1, 0.35),
    resourceName.opacity(1, 0.35),
    requirement.opacity(1, 0.35),
    requestPath.end(1, 0.45),
  );
  yield* waitUntil('name-authid');
  yield* authid.opacity(1, 0.35);
  yield* waitUntil('name-capabilities');
  yield* secondary.opacity(1, 0.35);
  yield* waitUntil('platform-identity');
  editPath.opacity(1);
  editPath.end(0);
  yield* editRecord();
  yield* waitUntil('platform-system-core');
  authid.text('authid: system core');
  authid.fontSize(30);
  authid.lineHeight(30 * 1.35);
  yield* authid.fill(palette.accent, 0.3);
  yield* waitUntil('scoped-capabilities');
  secondary.text('capabilities ayarlandı');
  yield* secondary.fill(palette.accent, 0.3);
  yield* all(editName.opacity(0, 0.25), editPath.opacity(0, 0.25));
  yield* waitUntil('library-constraints');
  requirement.text('library kısıtı');
  yield* requirement.fill(palette.accent, 0.3);
  yield* waitUntil('change-library-constraint');
  yield* resource.stroke(palette.accent, 0.35);
  requirement.text('kısıt değiştirildi');
  result.text('çağrı hazırlanabilir');
  result.fontSize(28);
  result.fill(palette.ink);
  yield* waitUntil('platform-request-recap');
  decisionPath.opacity(1);
  decisionPath.end(0);
  yield* decisionPath.end(1, 0.4);
  yield* sendRequest();
  yield* result.opacity(1, 0.3);

  yield* waitUntil('ready-for-new-code');
  process.reparent(view);
  processName.reparent(view);
  yield* decision.opacity(0, 0.5);
  decision.remove();
  outgoing.process.remove();
  outgoing.name.remove();
  // The widening process boundary passes behind the same carried resource.
  // Back only its face and title, leaving the initial process edge unobscured.
  process.moveToBottom();
  const pipeFace = workingPipes.children()[0] as Rect;
  const pipeFill = pipeFace.fill();
  const pipeTitleBacking = frame(270, 54, 0, -130, 'transparent', palette.paper, 0);
  workingPipes.add(pipeTitleBacking);
  pipeTitleBacking.moveToBottom();
  pipeFace.fill(palette.paper);
  yield* all(
    process.position([0, 10], 0.85),
    process.size([1600, 900], 0.85),
    processName.position([-520, -355], 0.85),
    workingPipes.position([400, 0], 0.85),
  );
  // Exact endpoint values keep the carried frame and resource actor identical
  // to the shared pose imported by11.
  process.position([0, 10]);
  process.size([1600, 900]);
  processName.position([-520, -355]);
  workingPipes.position([400, 0]);
  pipeFace.fill(pipeFill);
  pipeTitleBacking.remove();
  yield* outgoing.root.opacity(1, 0.5);
  process.reparent(outgoing.root);
  processName.reparent(outgoing.root);
  workingPipes.reparent(outgoing.root);
  processName.moveToBottom();
  process.moveToBottom();
  yield* waitUntil('end');
});
