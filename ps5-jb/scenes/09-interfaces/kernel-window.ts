import { Circle, Layout, Line } from '@motion-canvas/2d';
import { frame, memory, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

export function kernelWindow() {
  const root = new Layout({});
  const user = frame(400, 310, -530, 0, palette.rule, 'transparent');
  const userName = text('sayfayı çalıştıran\nprocess', -530, -90, 28);
  const access = text('memory read/write', -530, 20, 28, palette.accent, true);
  const target = memory(610, 260, 340, 0, palette.accent, palette.surface);
  const targetName = text('kernel data’sı', 340, -160, 34);
  const value = text('data', 340, 0, 42);
  const path = wire(
    [
      [-330, 0],
      [35, 0],
    ],
    palette.accent,
  );
  const marker = new Circle({ position: [35, 0], size: 10, fill: palette.accent });
  const separate = new Line({
    points: [
      [-80, -290],
      [-80, 290],
    ],
    stroke: palette.rule,
    lineWidth: 1.5,
    lineDash: [8, 12],
  });
  root.add([user, userName, access, target, targetName, value, path, marker, separate]);
  return { root, user, target, targetName, value, path, marker, access };
}
