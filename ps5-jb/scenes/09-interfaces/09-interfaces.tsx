import { Layout, Txt, makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { kernelWindow } from './kernel-window';
import { memory, record, strip, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import { decrementPose } from '../08-lifetime/08-lifetime';

/** A normal sysctl record. Only three fields have a role in this explanation. */
function oidRecord(title: string, permission: string, address: string) {
  const root = new Layout({ position: [-80, 0] });
  const name = text(title, 0, -230, 34);
  const kind = text('sayı', 75, -90, 31, palette.ink, true);
  const access = text(permission, 75, 0, 31, palette.ink, true);
  const pointer = text(address, 75, 90, 31, palette.ink, true);
  const face = record(450, 310, 0, 0);
  const kindName = text('type', -145, -90, 29, palette.muted);
  const accessName = text('permissions', -130, 0, 25, palette.muted);
  const pointerName = text('data', -145, 90, 29, palette.muted);
  root.add([face, name, kindName, kind, accessName, access, pointerName, pointer]);
  return { root, face, name, kindName, kind, accessName, access, pointerName, pointer };
}

function datum(title: string, value: string, address: string, x: number, y: number) {
  const root = new Layout({ position: [x, y] });
  const content = text(value, 0, 0, 49, palette.ink, true);
  const name = text(title, 0, -130, 31);
  const addressName = text(address, 0, 130, 29, palette.muted, true);
  root.add([memory(240, 140, 0, 0), name, content, addressName]);
  return { root, content, name, addressName };
}

function pointerCard(title: string, address: string, x: number, y: number) {
  const root = new Layout({ position: [x, y] });
  const name = text(title, 0, -135, 33);
  const pointer = text(address, 0, 28, 34, palette.ink, true);
  const pointerName = text('data pointer', 0, -35, 29, palette.muted);
  root.add([record(430, 165, 0, 0), name, pointerName, pointer]);
  return { root, name, pointer, pointerName };
}

function packet() {
  const root = new Layout({ opacity: 0, zIndex: 10 });
  const value = text('', 0, 0, 32, palette.accent, true);
  const face = record(170, 75, 0, 0, palette.accent);
  // Keep addresses readable without letting a two-digit datum mask nearby captions.
  face.width(() => Math.max(90, value.text().length * 20 + 32));
  root.add([face, value]);
  return { root, value };
}

function* relabel(label: Txt, value: string) {
  yield* label.opacity(0, 0.18);
  label.text(value);
  yield* label.opacity(1, 0.25);
}

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const incoming = decrementPose();
  view.add(incoming.root);
  const capability = text('decrement: −1', -650, 350, 32, palette.accent, true);
  capability.opacity(0);
  view.add(capability);
  yield* waitUntil('carry-decrement');
  // Carry only the acquired operation; do not shrink the preceding graph into
  // a corner or keep its unknown memory records behind the next explanation.
  yield* all(incoming.root.opacity(0, 0.6), capability.opacity(1, 0.6));

  const normal = new Layout({ opacity: 0 });
  const action = text('CPU sayısını oku', -650, -75, 31);
  const result = text('', -650, 100, 43, palette.accent, true);
  const scope = text('sysctl', -650, -180, 30, palette.muted, true);
  scope.opacity(0);
  const oid = oidRecord('kernel', 'read', 'CPU adresi');
  const oidFields = [
    oid.kindName,
    oid.kind,
    oid.accessName,
    oid.access,
    oid.pointerName,
    oid.pointer,
  ];
  oidFields.forEach((field) => field.opacity(0));
  const normalValue = datum('örnek CPU sayısı', '4', 'CPU adresi', 650, 90);
  normalValue.root.opacity(0);
  const requestPath = wire(
    [
      [-465, -75],
      [-305, -75],
    ],
    palette.muted,
  );
  const dataPointer = wire(
    [
      [145, 90],
      [530, 90],
    ],
    palette.muted,
  );
  requestPath.end(0);
  dataPointer.end(0);
  normal.add([action, result, scope, oid.root, normalValue.root, requestPath, dataPointer]);
  const moving = packet();
  view.add([normal, moving.root]);
  yield* waitUntil('named-information');
  incoming.root.remove();
  yield* normal.opacity(1, 0.6);
  yield* waitUntil('normal-request');
  yield* requestPath.end(1, 0.65);
  yield* waitUntil('first-result-four');
  result.text('4');
  yield* waitUntil('name-interface');
  yield* scope.opacity(1, 0.4);
  yield* waitUntil('record-information');
  yield* relabel(oid.name, 'CPU bilgisi');
  yield* waitUntil('name-oid');
  yield* relabel(oid.name, 'CPU bilgisi için OID');
  yield* waitUntil('oid-type');
  yield* all(oid.kindName.opacity(1, 0.25), oid.kind.opacity(1, 0.25));
  yield* waitUntil('oid-permissions');
  yield* all(oid.accessName.opacity(1, 0.25), oid.access.opacity(1, 0.25));
  yield* waitUntil('oid-pointer');
  yield* all(oid.pointerName.opacity(1, 0.25), oid.pointer.opacity(1, 0.25));
  yield* waitUntil('normal-read');
  yield* normalValue.root.opacity(1, 0.35);
  yield* dataPointer.end(1, 0.65);
  moving.value.text('4');
  moving.root.position([650, 285]);
  yield* moving.root.opacity(1, 0.2);
  yield* moving.root.position([-650, 285], 1.2);
  yield* moving.root.opacity(0, 0.2);

  yield* waitUntil('allowed-setting');
  yield* all(oid.root.opacity(0, 0.35), normalValue.root.opacity(0, 0.35), result.opacity(0, 0.35));
  oid.name.text('ayrı ayar için OID');
  oid.access.text('read/write');
  oid.pointer.text('ayar adresi');
  action.text('ayarı değiştir');
  const settingLabel = text('izinli ayar', 650, -40, 31);
  const settingAddress = text('ayar adresi', 650, 220, 29, palette.muted, true);
  const settingFace = memory(240, 140, 650, 90);
  const settingContent = text('30', 650, 90, 49, palette.ink, true);
  normal.add([settingFace, settingLabel, settingAddress, settingContent]);
  yield* oid.root.opacity(1, 0.5);
  yield* waitUntil('setting-thirty-one');
  action.text('31 yaz');
  yield* waitUntil('normal-setting-write');
  yield* oid.access.fill(palette.accent, 0.25);
  moving.value.text('31');
  moving.root.position([-650, 100]);
  yield* moving.root.opacity(1, 0.2);
  yield* moving.root.position([-650, 285], 0.3);
  yield* moving.root.position([650, 285], 0.8);
  yield* moving.root.position([650, 310], 0.3);
  yield* waitUntil('setting-result-thirty-one');
  settingContent.text('31');
  yield* moving.root.opacity(0, 0.2);

  yield* waitUntil('restricted-record');
  yield* all(
    oid.root.opacity(0, 0.35),
    settingFace.opacity(0, 0.35),
    settingLabel.opacity(0, 0.35),
    settingAddress.opacity(0, 0.35),
    settingContent.opacity(0, 0.35),
  );
  oid.name.text('etkilenen OID');
  oid.access.text('read');
  oid.access.fill(palette.accent);
  oid.pointer.text('mevcut adres');
  action.text('write');
  normalValue.root.opacity(1);
  normalValue.content.text('8');
  normalValue.name.text('kendi data’sı');
  normalValue.addressName.text('');
  yield* oid.root.opacity(1, 0.5);
  const rejected = text('write reddedildi', -650, 100, 29, palette.accent);
  rejected.opacity(0);
  normal.add(rejected);
  yield* waitUntil('rejected-nine');
  action.text('9 yaz');
  yield* waitUntil('write-rejected');
  yield* rejected.opacity(1, 0.3);

  const flags = new Layout({ opacity: 0 });
  const kindBytes = strip(['02', '80', '04', '80'], 0, -80, 180);
  kindBytes.root.scale(1.25);
  const flagsMeaning = text('write: kapalı', 0, 150, 36);
  const byteIndices = [-337.5, -112.5, 112.5, 337.5].map((x, index) =>
    text(`byte[${index}]`, x, -220, 28, index === 3 ? palette.accent : palette.muted, true),
  );
  const byteOrder = text('düşük adres → yüksek adres', 0, 40, 27, palette.muted);
  const decrease = text('−1', 337.5, -315, 42, palette.accent, true);
  decrease.opacity(0);
  const flagsTitle = text('OID type / flags', 0, -410, 34);
  flags.add([flagsTitle, kindBytes.root, ...byteIndices, byteOrder, decrease, flagsMeaning]);
  view.add(flags);
  yield* waitUntil('metadata-change');
  yield* normal.opacity(0, 0.45);
  yield* flags.opacity(1, 0.55);
  yield* waitUntil('metadata-decrements');
  kindBytes.cells[3].stroke(palette.accent);
  kindBytes.values[3].fill(palette.accent);
  yield* decrease.opacity(1, 0.2);
  yield* waitUntil('metadata-count-from-eighty');
  for (let count = 1; count < 16; count++) {
    kindBytes.values[3].text((0x80 - count).toString(16).toUpperCase());
    yield* waitFor(0.025);
  }
  yield* waitUntil('metadata-seventy');
  kindBytes.values[3].text('70');
  yield* waitUntil('metadata-interpreted');
  yield* relabel(flagsMeaning, 'write: açık');
  yield* flagsMeaning.fill(palette.accent, 0.25);
  yield* waitUntil('own-data-write');
  oid.access.text('read/write');
  rejected.opacity(0);
  yield* flags.opacity(0, 0.4);
  yield* normal.opacity(1, 0.5);
  moving.value.text('9');
  moving.root.position([-650, 100]);
  yield* moving.root.opacity(1, 0.2);
  yield* moving.root.position([-650, 285], 0.3);
  yield* moving.root.position([650, 285], 0.8);
  yield* moving.root.position([650, 310], 0.3);
  yield* waitUntil('own-data-nine');
  normalValue.content.text('9');
  yield* moving.root.opacity(0, 0.2);
  yield* waitUntil('need-other-destination');
  yield* all(oid.pointer.fill(palette.accent, 0.4), dataPointer.stroke(palette.accent, 0.4));

  // The next question concerns destinations. Collapse only the record's
  // unrelated fields, not the whole previous screen into a thumbnail.
  const routing = new Layout({ opacity: 0 });
  const first = pointerCard('ilk OID', 'mevcut adres', -430, 0);
  const second = pointerCard('ikinci OID', 'mevcut adres', 220, 0);
  second.root.opacity(0);
  const original = datum('ilk kaydın data’sı', '9', '', 220, -310);
  const fieldLocation = text('pointer field adresi', 220, 170, 29, palette.muted, true);
  fieldLocation.opacity(0);
  const visibility = new Layout({ position: [220, 255] });
  const visibilityFace = record(430, 76, 0, 0);
  const visibilityValue = text('disabled', 90, 0, 29, palette.muted);
  visibility.add([
    visibilityFace,
    text('query', -110, 0, 28, palette.muted, true),
    visibilityValue,
  ]);
  visibility.opacity(0);
  const visibilityOperation = text('decrement primitive', -430, 180, 28, palette.muted, true);
  const visibilityDecrease = text('−1', -430, 255, 35, palette.accent, true);
  visibilityOperation.opacity(0);
  visibilityDecrease.opacity(0);
  const firstRoute = wire(
    [
      [-215, 28],
      [-100, 28],
      [-100, -310],
      [100, -310],
    ],
    palette.muted,
  );
  const target = datum('kernel data’sı', '…', 'adres K', 690, 230);
  target.root.opacity(0);
  const secondRoute = wire(
    [
      [435, 28],
      [520, 28],
      [520, 230],
      [570, 230],
    ],
    palette.accent,
  );
  secondRoute.end(0);
  const ioResult = text('', -430, 300, 36, palette.accent, true);
  routing.add([
    first.root,
    second.root,
    original.root,
    fieldLocation,
    visibility,
    visibilityOperation,
    visibilityDecrease,
    firstRoute,
    target.root,
    secondRoute,
    ioResult,
  ]);
  view.add(routing);
  yield* waitUntil('point-to-pointer');
  yield* all(normal.opacity(0, 0.45), capability.opacity(0, 0.45));
  yield* routing.opacity(1, 0.6);
  yield* waitUntil('second-oid');
  yield* second.root.opacity(1, 0.5);
  yield* waitUntil('pointer-is-value');
  yield* second.pointer.fill(palette.accent, 0.3);
  yield* waitUntil('pointer-field-address');
  yield* fieldLocation.opacity(1, 0.35);
  yield* waitUntil('pointer-relation');
  yield* all(first.pointer.fill(palette.accent, 0.35), fieldLocation.fill(palette.accent, 0.35));
  yield* waitUntil('first-address-ef58');
  first.pointer.text('…EF58');
  original.addressName.text('…EF58');
  yield* waitUntil('field-address-ee58');
  fieldLocation.text('pointer field adresi: …EE58');
  yield* waitUntil('target-metadata-effect');
  const pointerChange = text('byte[1]: EF − 1 = EE', -430, 180, 28, palette.accent, true);
  const addressDifference = text('adres farkı: −256 byte', -430, 255, 27, palette.muted, true);
  addressDifference.opacity(0);
  routing.add([pointerChange, addressDifference]);
  // Retire the old destination before changing the stored address. Reuse the
  // same route without interpolating incompatible point counts through space.
  yield* all(first.pointer.opacity(0, 0.18), firstRoute.opacity(0, 0.18));
  first.pointer.text('…EE58');
  firstRoute.points([
    [-215, 28],
    [5, 28],
  ]);
  firstRoute.end(0);
  firstRoute.opacity(1);
  yield* all(
    first.pointer.opacity(1, 0.25),
    firstRoute.end(1, 0.65),
    original.root.opacity(0, 0.4),
  );
  yield* waitUntil('address-shift-256');
  yield* addressDifference.opacity(1, 0.3);
  yield* waitUntil('target-interpreted');
  yield* all(fieldLocation.fill(palette.accent, 0.4), second.pointer.fill(palette.accent, 0.4));
  yield* waitUntil('prepare-second-readability');
  yield* all(pointerChange.opacity(0, 0.35), addressDifference.opacity(0, 0.35));
  yield* visibility.opacity(1, 0.4);
  // Public JS targets oid.b.visible separately from b.kind and b.arg1. Its
  // numeric starting value and Sony C member name are not known here.
  yield* waitUntil('second-query-decrement');
  yield* all(visibilityOperation.opacity(1, 0.35), visibilityDecrease.opacity(1, 0.35));
  yield* visibilityDecrease.position([220, 325], 1.1);
  yield* visibilityDecrease.opacity(0, 0.2);
  yield* waitUntil('second-query-ready');
  yield* relabel(visibilityValue, 'enabled');
  yield* all(
    visibilityFace.stroke(palette.accent, 0.35),
    visibilityValue.fill(palette.accent, 0.35),
  );

  yield* waitUntil('select-address');
  yield* target.root.opacity(1, 0.5);
  yield* all(
    fieldLocation.opacity(0, 0.35),
    visibility.opacity(0, 0.35),
    visibilityOperation.opacity(0, 0.35),
  );
  moving.value.text('adres K');
  moving.root.position([-430, 250]);
  yield* moving.root.opacity(1, 0.25);
  yield* moving.root.position([-100, 250], 0.5);
  yield* moving.root.position([-100, 28], 0.4);
  yield* moving.root.position([-35, 28], 0.5);
  yield* waitUntil('second-points-k');
  second.pointer.text('adres K');
  yield* moving.root.opacity(0, 0.2);
  yield* secondRoute.end(1, 0.65);
  yield* waitUntil('second-oid-read');
  yield* all(first.root.opacity(0.3, 0.35), firstRoute.opacity(0.3, 0.35));
  moving.value.text('data');
  moving.root.position([520, 230]);
  yield* moving.root.opacity(1, 0.25);
  yield* moving.root.position([520, 28], 0.4);
  yield* moving.root.position([435, 28], 0.3);
  yield* moving.root.position([435, 300], 0.45);
  yield* moving.root.position([-430, 300], 0.7);
  yield* waitUntil('second-read-forty-two');
  target.content.text('42');
  ioResult.opacity(0);
  yield* moving.root.opacity(0, 0.2);
  ioResult.text('read: 42');
  yield* ioResult.opacity(1, 0.15);
  yield* waitUntil('second-oid-write');
  flagsTitle.text('ikinci OID type / flags');
  flagsMeaning.opacity(0);
  kindBytes.values[3].text('80');
  flagsMeaning.text('write: kapalı');
  yield* routing.opacity(0, 0.25);
  yield* flags.opacity(1, 0.35);
  for (let count = 1; count <= 16; count++) {
    kindBytes.values[3].text((0x80 - count).toString(16).toUpperCase());
    yield* waitFor(0.09);
  }
  flagsMeaning.text('write: açık');
  yield* flagsMeaning.opacity(1, 0.3);
  yield* waitUntil('second-send-forty-three');
  yield* flags.opacity(0, 0.4);
  yield* routing.opacity(1, 0.4);
  ioResult.opacity(0);
  moving.value.text('43');
  moving.root.position([-430, 300]);
  yield* moving.root.opacity(1, 0.25);
  yield* moving.root.position([435, 300], 0.7);
  yield* moving.root.position([435, 28], 0.4);
  yield* moving.root.position([520, 28], 0.3);
  yield* moving.root.position([520, 230], 0.4);
  yield* moving.root.position([540, 230], 0.35);
  yield* waitUntil('second-value-forty-three');
  target.content.text('43');
  yield* moving.root.opacity(0, 0.2);
  yield* waitUntil('need-reusable-io');
  const acquired = text('kernel read/write', 0, -420, 35, palette.accent, true);
  view.add(acquired);
  yield* waitFor(0.6);

  // A pipe first does only its ordinary job: bytes enter one end, remain in a
  // buffer, then leave the other end. Every visible arrow has that same axis.
  const pipe = new Layout({ opacity: 0 });
  const buffer = strip(['A', 'B', 'C'], 0, 0, 120);
  buffer.root.opacity(0);
  const bufferFace = memory(440, 140, 0, 0);
  const bufferName = text('pipe buffer', 0, -130, 34);
  const writeEnd = record(260, 100, -650, 0);
  const readEnd = record(260, 100, 650, 0);
  const writeName = text('write end', -650, -130, 32);
  const readName = text('read end', 650, -130, 32);
  const writeNumber = text('3', -650, 0, 38, palette.accent, true);
  const readNumber = text('4', 650, 0, 38, palette.accent, true);
  writeNumber.opacity(0);
  readNumber.opacity(0);
  const intoBuffer = wire(
    [
      [-520, 0],
      [-220, 0],
    ],
    palette.accent,
  );
  const fromBuffer = wire(
    [
      [220, 0],
      [520, 0],
    ],
    palette.muted,
  );
  const pipeResult = text('', 650, 170, 37, palette.accent, true);
  const bufferMetadata = pointerCard('pipe metadata', 'buffer adresi', 0, -320);
  bufferMetadata.root.opacity(0);
  bufferMetadata.name.y(-115);
  bufferMetadata.pointerName.text('buffer pointer');
  const bufferPointer = wire(
    [
      [0, -209],
      [0, -80],
    ],
    palette.accent,
  );
  bufferPointer.opacity(0);
  pipe.add([
    bufferFace,
    bufferName,
    buffer.root,
    writeEnd,
    readEnd,
    writeName,
    readName,
    writeNumber,
    readNumber,
    intoBuffer,
    fromBuffer,
    pipeResult,
    bufferMetadata.root,
    bufferPointer,
  ]);
  view.add(pipe);
  yield* waitUntil('normal-pipe');
  yield* all(routing.opacity(0, 0.45), acquired.opacity(0, 0.45));
  yield* pipe.opacity(1, 0.6);
  yield* waitUntil('normal-pipe-write');
  moving.value.text('A B C');
  moving.root.position([-650, 0]);
  yield* moving.root.opacity(1, 0.2);
  yield* moving.root.position([0, 0], 0.9);
  yield* moving.root.opacity(0, 0.2);
  yield* waitUntil('normal-pipe-stored');
  yield* buffer.root.opacity(1, 0.3);
  yield* waitUntil('normal-pipe-read');
  yield* all(intoBuffer.stroke(palette.muted, 0.25), fromBuffer.stroke(palette.accent, 0.25));
  yield* buffer.root.opacity(0, 0.15);
  moving.root.position([0, 0]);
  yield* moving.root.opacity(1, 0.15);
  yield* moving.root.position([650, 0], 0.8);
  yield* moving.root.opacity(0, 0.15);
  yield* waitUntil('normal-pipe-result');
  pipeResult.text('A B C');
  yield* waitUntil('normal-buffer-pointer');
  yield* bufferName.opacity(0, 0.3);
  yield* all(bufferMetadata.root.opacity(1, 0.5), bufferPointer.opacity(1, 0.5));
  yield* waitUntil('assign-pipe-descriptors');
  writeNumber.text('fd');
  readNumber.text('fd');
  yield* all(writeNumber.opacity(1, 0.35), readNumber.opacity(1, 0.35));
  yield* waitUntil('descriptor-three');
  writeNumber.text('3');
  yield* waitUntil('descriptor-four');
  readNumber.text('4');

  // Find the existing pipe through the kernel's process/fd metadata. This is a
  // separate navigation stage; the ordinary-flow picture is gone beforehand.
  const lookup = new Layout({ opacity: 0 });
  const processNames = ['başka process', 'bizim process', 'başka process'].map((name, index) =>
    text(name, -590, -130 + index * 130, 31),
  );
  const processRows = processNames.map((label) => record(340, 90, -590, label.y()));
  const fdTable = new Layout({ opacity: 0 });
  const fd4 = text('4  read end', 0, 65, 31, palette.muted, true);
  fdTable.add([
    text('fd tablosu', 0, -180, 33),
    record(360, 90, 0, -65),
    record(360, 90, 0, 65),
    text('3  write end', 0, -65, 31, palette.muted, true),
    fd4,
  ]);
  const pipeRecord = pointerCard('pipe metadata', 'buffer adresi', 610, 65);
  pipeRecord.root.opacity(0);
  pipeRecord.pointerName.text('buffer pointer');
  const processToFd = wire(
    [
      [-420, 0],
      [-300, 0],
      [-300, 65],
      [-180, 65],
    ],
    palette.accent,
  );
  const fdToPipe = wire(
    [
      [180, 65],
      [395, 65],
    ],
    palette.accent,
  );
  processToFd.end(0);
  fdToPipe.end(0);
  lookup.add([
    text('process listesi', -590, -275, 33),
    ...processRows,
    ...processNames,
    fdTable,
    pipeRecord.root,
    processToFd,
    fdToPipe,
  ]);
  view.add(lookup);
  yield* waitUntil('find-process');
  yield* pipe.opacity(0, 0.45);
  yield* lookup.opacity(1, 0.6);
  yield* waitUntil('match-process-id');
  processNames[1].text('bizim process (PID)');
  yield* processRows[1].stroke(palette.accent, 0.4);
  yield* all(processNames[0].opacity(0.25, 0.4), processNames[2].opacity(0.25, 0.4));
  yield* waitUntil('select-descriptor');
  yield* fdTable.opacity(1, 0.45);
  yield* processToFd.end(1, 0.7);
  yield* waitUntil('select-fd-four');
  yield* fd4.fill(palette.accent, 0.3);
  yield* waitUntil('follow-pipe-record');
  yield* pipeRecord.root.opacity(1, 0.45);
  yield* fdToPipe.end(1, 0.7);

  // The new purpose is address selection through an ordinary interface. The
  // first and second pipe are revealed sequentially at full readable size.
  const working = new Layout({ opacity: 0 });
  const dataPipe = pipeRecord;
  const workingTarget = datum('kernel data’sı', '…', 'adres K', 650, -52);
  workingTarget.root.opacity(0);
  const controlPipe = pointerCard('ikinci pipe', 'mevcut adres', -580, 260);
  controlPipe.pointerName.text('buffer pointer');
  controlPipe.root.opacity(0);
  const metadataAddress = text('pointer field adresi', 0, 145, 29, palette.muted, true);
  metadataAddress.opacity(0);
  const controlRoute = wire(
    [
      [-365, 288],
      [-270, 288],
      [-270, -52],
      [-215, -52],
    ],
    palette.accent,
  );
  const dataRoute = wire(
    [
      [215, -52],
      [530, -52],
    ],
    palette.accent,
  );
  controlRoute.end(0);
  dataRoute.end(0);
  const workingResult = text('', 0, 320, 37, palette.accent, true);
  working.add([
    workingTarget.root,
    controlPipe.root,
    metadataAddress,
    controlRoute,
    dataRoute,
    workingResult,
  ]);
  view.add(working);
  yield* waitUntil('working-arrangement');
  // Keep the pipe reached through the fd table. Only its role and position
  // change; replacing it here would erase the lookup's visible payoff.
  dataPipe.root.reparent(view);
  yield* lookup.opacity(0, 0.45);
  yield* dataPipe.root.position([0, -80], 0.85);
  yield* working.opacity(1, 0.6);
  dataPipe.root.reparent(working);
  dataPipe.name.text('ilk pipe');
  yield* waitUntil('second-working-pipe');
  yield* controlPipe.root.opacity(1, 0.5);
  yield* waitUntil('data-pipe-name');
  dataPipe.name.text('data pipe');
  yield* waitUntil('control-pipe-name');
  controlPipe.name.text('control pipe');
  yield* waitUntil('prepare-control-pipe');
  // The existing kernel memory write prepares this pipe; an ordinary pipe
  // operation cannot choose its own buffer pointer.
  moving.value.text('memory write');
  moving.root.position([-580, 450]);
  yield* moving.root.opacity(1, 0.25);
  yield* moving.root.position([-580, 390], 0.75);
  controlPipe.pointer.opacity(0);
  controlPipe.pointer.text('pointer field');
  yield* moving.root.opacity(0, 0.25);
  yield* controlPipe.pointer.opacity(1, 0.2);
  yield* waitUntil('control-to-metadata');
  yield* all(controlRoute.end(1, 0.75), metadataAddress.opacity(1, 0.35));
  yield* waitUntil('pointer-field-m');
  metadataAddress.text('pointer field adresi: M');
  controlPipe.pointer.text('adres M');
  yield* waitUntil('pipe-selects-address');
  yield* workingTarget.root.opacity(1, 0.5);
  moving.value.text('adres K');
  moving.root.position([-580, 390]);
  yield* moving.root.opacity(1, 0.25);
  yield* moving.root.position([-270, 390], 0.5);
  yield* moving.root.position([-270, -52], 0.6);
  yield* moving.root.position([-270, -52], 0.2);
  yield* waitUntil('data-pipe-points-k');
  dataPipe.pointer.text('adres K');
  yield* moving.root.opacity(0, 0.2);
  yield* dataRoute.end(1, 0.65);
  yield* waitUntil('pipe-carries-data');
  yield* all(
    controlPipe.root.opacity(0.3, 0.35),
    controlRoute.opacity(0.3, 0.35),
    metadataAddress.opacity(0, 0.35),
  );
  moving.value.text('data');
  moving.root.position([470, -52]);
  yield* moving.root.opacity(1, 0.25);
  yield* moving.root.position([270, -52], 0.6);
  yield* moving.root.position([215, 320], 0.6);
  yield* moving.root.position([0, 320], 0.3);
  yield* waitUntil('pipe-read-forty-three');
  workingTarget.content.text('43');
  workingResult.opacity(0);
  yield* moving.root.opacity(0, 0.2);
  workingResult.text('read: 43');
  yield* workingResult.opacity(1, 0.15);
  yield* waitUntil('pipe-writes-data');
  yield* workingResult.opacity(0, 0.25);
  moving.value.text('44');
  moving.root.position([0, 320]);
  yield* moving.root.opacity(1, 0.25);
  yield* moving.root.position([215, 320], 0.3);
  yield* moving.root.position([215, -52], 0.6);
  yield* moving.root.position([470, -52], 0.65);
  yield* waitUntil('pipe-value-forty-four');
  workingTarget.content.text('44');
  yield* moving.root.opacity(0, 0.2);
  yield* waitUntil('pipe-control-recap');
  yield* all(controlPipe.root.opacity(1, 0.3), controlRoute.opacity(1, 0.3));
  yield* waitUntil('pipe-data-recap');
  yield* dataRoute.stroke(palette.accent, 0.3);

  yield* waitUntil('recap-decrement');
  capability.position([0, 430]);
  yield* capability.opacity(1, 0.3);

  const outgoing = kernelWindow();
  outgoing.root.opacity(0);
  view.add(outgoing.root);
  yield* waitUntil('kernel-window');
  yield* all(working.opacity(0, 0.5), acquired.opacity(0, 0.5), capability.opacity(0, 0.5));
  yield* outgoing.root.opacity(1, 0.6);
  yield* waitUntil('end');
});
