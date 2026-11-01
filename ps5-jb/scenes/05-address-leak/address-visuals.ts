import { Layout, Line } from '@motion-canvas/2d';
import { frame, memory, strip, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** The target is a particular field of a real object, not an arbitrary RAM box. */
export function addressTarget() {
  const root = new Layout({});
  const real = new Layout({ position: [0, -15] });
  const face = memory(390, 190, 0, 0, palette.rule, palette.wash);
  const name = text('view', 0, -180, 37, palette.ink, true);
  const address = text('adres: ?', 0, -120, 28, palette.muted, true);
  address.opacity(0);
  const pointer = text('data pointer', 0, -30, 29, palette.ink, true);
  const length = text('uzunluk: 4', 0, 40, 28, palette.muted, true);
  real.add([face, name, address, pointer, length]);
  const bytes = strip(['41', '42', '43', '44'], 585, -45, 70);
  const bytesName = text('okunan byte’lar', 585, -155, 29, palette.muted);
  const desired = strip(['90', '91', '92', '93'], 585, 235, 70);
  const desiredGroup = new Layout({ opacity: 0 });
  const desiredPath = new Line({
    points: [
      [195, -45],
      [330, -45],
      [330, 235],
      [445, 235],
    ],
    stroke: palette.accent,
    lineWidth: 2,
    lineDash: [8, 9],
    endArrow: true,
    arrowSize: 11,
    end: 0,
  });
  desiredGroup.add([desired.root, desiredPath]);
  const dataPath = wire(
    [
      [195, -45],
      [445, -45],
    ],
    palette.muted,
    2,
  );
  const prepared = new Layout({ position: [-600, -15], opacity: 0.5 });
  const preparedFace = frame(270, 170, 0, 0, palette.rule, palette.surface);
  const preparedName = text('kayıt', 0, -145, 28, palette.muted);
  const destination = text('hedef: ?', 0, 0, 31, palette.ink, true);
  prepared.add([preparedFace, preparedName, destination]);
  const targetPath = new Line({
    points: [
      [-465, -15],
      [-260, -15],
      [-260, -45],
      [-200, -45],
    ],
    stroke: palette.accent,
    lineWidth: 2.2,
    lineCap: 'round',
    lineJoin: 'round',
    lineDash: [8, 9],
    endArrow: true,
    arrowSize: 11,
    end: 0,
  });
  const under = new Line({
    points: [
      [-128, 0],
      [127, 0],
    ],
    stroke: palette.accent,
    lineWidth: 2.5,
    lineCap: 'round',
    end: 0,
  });
  root.add([real, bytes.root, bytesName, dataPath, desiredGroup, prepared, targetPath, under]);
  return {
    root,
    real,
    face,
    name,
    address,
    pointer,
    length,
    bytes,
    bytesName,
    dataPath,
    desiredGroup,
    desiredPath,
    prepared,
    preparedName,
    destination,
    targetPath,
    under,
  };
}

export function addressNeedPose() {
  const scene = addressTarget();
  scene.address.opacity(1);
  scene.targetPath.end(1);
  scene.under.end(1);
  return scene;
}
