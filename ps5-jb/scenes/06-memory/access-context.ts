import { Layout } from '@motion-canvas/2d';
import { codeBlock, frame, memory, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** The operating-system view surrounds the same byte-access diagram. */
export function accessContext() {
  const root = new Layout({ opacity: 0 });
  const os = frame(1760, 860, 0, 0, palette.rule, 'transparent');
  const osName = text('OS', -735, -365, 34, palette.muted, true);
  const other = new Layout({ position: [590, -110], opacity: 0 });
  const otherFace = frame(380, 240, 0, 0, palette.rule, 'transparent');
  const otherName = text('başka process', 0, -65, 29, palette.muted);
  const otherMemory = memory(280, 65, 0, 25, palette.rule);
  other.add([otherFace, otherName, otherMemory]);

  const kernel = new Layout({ position: [590, 220], opacity: 0 });
  const kernelFace = memory(380, 210, 0, 0, palette.rule);
  const kernelName = text('kernel memory', 0, -35, 29, palette.muted);
  const kernelPermission = text('erişim yok', 0, 40, 26, palette.muted);
  kernel.add([kernelFace, kernelName, kernelPermission]);

  // A second address INSIDE this process still needs its own access permission.
  const destination = new Layout({ opacity: 0 });
  const destinationFace = memory(260, 70, 20, -150, palette.rule);
  const destinationName = text('adres ?', 20, -150, 25, palette.muted, true);
  destination.add([destinationFace, destinationName]);
  const permission = text('erişim izni?', 20, -215, 25, palette.muted);
  permission.opacity(0);
  const permissionMark = wire(
    [
      [-110, -185],
      [-110, -115],
    ],
    palette.accent,
    4,
    false,
  );
  permissionMark.opacity(0);
  const accessAttempt = wire(
    [
      [-166, -14],
      [-130, -14],
      [-130, -150],
      [-110, -150],
    ],
    palette.muted,
    2,
  );
  accessAttempt.end(0);

  const native = new Layout({ opacity: 0 });
  const objectsName = text('JavaScript objects', -480, -110, 27, palette.muted);
  const nativeName = text('native code', 30, -110, 29, palette.muted);
  const nativeFace = codeBlock(360, 240, 30, 80);
  nativeName.opacity(0);
  nativeFace.opacity(0);
  const lines = [-5, 55, 115].map((y, index) =>
    wire(
      [
        [-95, y],
        [index === 1 ? 110 : 145, y],
      ],
      palette.muted,
      2,
      false,
    ),
  );
  lines.forEach((line) => line.opacity(0));
  native.add([objectsName, nativeName, nativeFace, ...lines]);
  root.add([
    os,
    osName,
    other,
    kernel,
    destination,
    permission,
    permissionMark,
    accessAttempt,
    native,
  ]);
  return {
    root,
    os,
    osName,
    other,
    otherFace,
    kernel,
    kernelFace,
    permission,
    permissionMark,
    destination,
    accessAttempt,
    native,
    nativeName,
    nativeFace,
    nativeLines: lines,
  };
}
