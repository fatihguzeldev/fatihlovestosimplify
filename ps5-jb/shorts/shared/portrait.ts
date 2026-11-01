import { Txt } from '@motion-canvas/2d';
import { record, strip, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

export { palette };

// Keep the diagrams clear of the Shorts controls and caption area.
export const safe = { left: -430, right: 390, top: -720, bottom: 650 } as const;

export function label(
  value: string,
  x: number,
  y: number,
  size = 48,
  color: string = palette.ink,
  mono = false,
) {
  return text(value, x, y, size, color, mono);
}

export function panel(
  width: number,
  height: number,
  x: number,
  y: number,
  color: string = palette.rule,
  fill: string = palette.surface,
) {
  const box = record(width, height, x, y, color, fill);
  box.lineWidth(2.5);
  return box;
}

export function arrow(points: [number, number][], color: string = palette.muted) {
  const line = wire(points, color, 4);
  line.arrowSize(18);
  return line;
}

export function bytes(values: string[], x: number, y: number, cellWidth = 150) {
  const tape = strip(values, x, y, cellWidth);
  tape.cells.forEach((cell) => {
    cell.height(92);
    cell.lineWidth(2.5);
  });
  tape.values.forEach((value) => value.fontSize(44));
  return tape;
}

export function* replace(label: Txt, value: string, duration = 0.24) {
  yield* label.opacity(0, duration / 2);
  label.text(value);
  yield* label.opacity(1, duration / 2);
}
