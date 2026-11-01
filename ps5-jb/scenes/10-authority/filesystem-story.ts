import { Circle, Layout } from '@motion-canvas/2d';
import { frame, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** The file stays outside the subtree while the process's search origin changes. */
export function filesystemTree() {
  const root = new Layout({ opacity: 0 });
  const sandbox = frame(360, 180, 0, 40, palette.accent, 'transparent');
  const name = text('process’in dosya ağacı', 0, -100, 28, palette.muted);
  const currentRoot = new Circle({ position: [0, -10], size: 14, fill: palette.accent });
  const currentName = text('/', 45, -10, 33, palette.accent, true);
  const systemRoot = new Circle({ position: [120, -200], size: 14, fill: palette.muted });
  const systemName = text('system root /', 120, -300, 28, palette.muted);
  const localFiles = text('dosyalar', 0, 85, 28, palette.muted);
  const localPath = wire(
    [
      [0, 8],
      [0, 55],
    ],
    palette.rule,
    2,
    false,
  );
  const parentPath = wire(
    [
      [120, -180],
      [-205, -180],
      [-205, -60],
      [0, -60],
      [0, -30],
    ],
    palette.rule,
    2,
    false,
  );
  const targetPath = wire(
    [
      [140, -200],
      [590, -200],
      [590, -155],
    ],
    palette.rule,
    2,
  );
  const origin = text('path başlangıcı', -320, 115, 25, palette.accent);
  root.add([
    sandbox,
    name,
    currentRoot,
    currentName,
    systemRoot,
    systemName,
    localFiles,
    localPath,
    parentPath,
    targetPath,
    origin,
  ]);
  return { root, sandbox, name, currentRoot, currentName, systemRoot, systemName, targetPath };
}
