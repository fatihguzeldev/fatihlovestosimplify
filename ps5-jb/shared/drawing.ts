import { Circle, Gradient, Layout, Line, Path, Rect, Txt } from '@motion-canvas/2d';
import { palette, typeface } from './theme';

export function text(
  value: string,
  x: number,
  y: number,
  size = 32,
  color: string = palette.ink,
  mono = false,
) {
  return new Txt({
    text: value,
    position: [x, y],
    fontFamily: mono ? typeface.mono : typeface.sans,
    fontWeight: 400,
    fontSize: size,
    letterSpacing: mono ? 0 : -0.7,
    lineHeight: size * 1.35,
    fill: color,
    textWrap: false,
  });
}

export function frame(
  w: number,
  h: number,
  x: number,
  y: number,
  stroke: string = palette.rule,
  fill: string = palette.surface,
  radius = 10,
) {
  return new Rect({
    size: [w, h],
    position: [x, y],
    radius: radius ? [radius, radius * 0.7, radius * 1.1, radius * 0.8] : 0,
    stroke: stroke === 'transparent' ? '#00000000' : stroke,
    fill: fill === 'transparent' ? '#00000000' : fill,
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  });
}

export function wire(
  points: [number, number][],
  color: string = palette.muted,
  width = 3,
  arrow = true,
) {
  return new Line({
    points,
    stroke: color === palette.ink ? palette.muted : color,
    lineWidth: width,
    lineCap: 'round',
    lineJoin: 'round',
    endArrow: arrow,
    arrowSize: 13,
  });
}

/** A scope is an extent, not a physical container or a data record. */
export function region(w: number, h: number, x: number, y: number, color: string = palette.rule) {
  const root = frame(w, h, x, y, color, 'transparent');
  root.lineWidth(0);
  for (const side of [-1, 1]) {
    root.add(
      new Line({
        points: [
          [-w / 2, side * (h / 2 - 24)],
          [-w / 2, (side * h) / 2],
          [w / 2, (side * h) / 2],
          [w / 2, side * (h / 2 - 24)],
        ],
        stroke: () => root.stroke(),
        lineWidth: 1.5,
      }),
    );
  }
  return root;
}

/** Allocated virtual space has straight address boundaries and end ticks. */
export function memory(
  w: number,
  h: number,
  x: number,
  y: number,
  color: string = palette.rule,
  fill: string = palette.wash,
) {
  const root = frame(w, h, x, y, color === palette.ink ? palette.rule : color, fill);
  root.lineWidth(0);
  root.add(
    new Line({
      points: () => [
        [-root.width() / 2, -root.height() / 2],
        [root.width() / 2, -root.height() / 2],
      ],
      stroke: () => root.stroke(),
      lineWidth: 2,
    }),
  );
  root.add(
    new Line({
      points: () => [
        [-root.width() / 2, root.height() / 2],
        [root.width() / 2, root.height() / 2],
      ],
      stroke: () => root.stroke(),
      lineWidth: 2,
    }),
  );
  for (const side of [-1, 1])
    root.add(
      new Line({
        points: () => [
          [(side * root.width()) / 2, -root.height() / 2 - 10],
          [(side * root.width()) / 2, root.height() / 2 + 10],
        ],
        stroke: () => root.stroke(),
        lineWidth: 1.5,
      }),
    );
  return root;
}

/** A record has a quiet face; its actual fields carry its identity. */
export function record(
  w: number,
  h: number,
  x: number,
  y: number,
  color: string = palette.rule,
  fill: string = palette.surface,
) {
  const root = frame(w, h, x, y, color === palette.ink ? palette.rule : color, fill);
  root.lineWidth(1.5);
  root.add(
    new Line({
      points: () => [
        [-root.width() / 2, root.height() / 2],
        [root.width() / 2, root.height() / 2],
      ],
      stroke: () => root.stroke(),
      lineWidth: 2,
    }),
  );
  return root;
}

/** Executable code remains literal text; only its gutter marks the active line. */
export function codeBlock(
  w: number,
  h: number,
  x: number,
  y: number,
  color: string = palette.rule,
) {
  const root = frame(w, h, x, y, color, 'transparent');
  root.lineWidth(0);
  root.add(
    new Line({
      points: [
        [-w / 2, -16],
        [-w / 2, 16],
      ],
      stroke: () => root.stroke(),
      lineWidth: 3,
    }),
  );
  return root;
}

export function referenceSlot(w: number, h: number, x: number, y: number) {
  const root = frame(w, h, x, y, palette.rule, 'transparent');
  root.lineWidth(0);
  root.add(
    new Line({
      points: [
        [-w / 2, h / 2 - 6],
        [w / 2, h / 2 - 6],
      ],
      stroke: () => root.stroke(),
      lineWidth: 1.5,
    }),
  );
  root.add(new Circle({ size: 7, x: w / 2, fill: palette.muted }));
  return root;
}

export function reference(points: [number, number][], color: string = palette.muted) {
  return wire(points, color, 2, true);
}

export function fileDrawing(w: number, h: number, x: number, y: number) {
  const root = frame(w, h, x, y, palette.rule, 'transparent');
  root.lineWidth(0);
  const fold = 24;
  root.add(
    new Line({
      points: [
        [-w / 2, -h / 2],
        [w / 2 - fold, -h / 2],
        [w / 2, -h / 2 + fold],
        [w / 2, h / 2],
        [-w / 2, h / 2],
        [-w / 2, -h / 2],
      ],
      stroke: () => root.stroke(),
      lineWidth: 2,
    }),
  );
  root.add(
    new Line({
      points: [
        [w / 2 - fold, -h / 2],
        [w / 2 - fold, -h / 2 + fold],
        [w / 2, -h / 2 + fold],
      ],
      stroke: palette.rule,
      lineWidth: 1.5,
    }),
  );
  return root;
}

export function strip(values: string[], x: number, y: number, cellWidth = 88) {
  const root = new Layout({ position: [x, y] });
  const cells: Rect[] = [];
  const labels: Txt[] = [];
  values.forEach((value, index) => {
    const cellX = (index - (values.length - 1) / 2) * cellWidth;
    const cell = frame(cellWidth, 72, cellX, 0, palette.rule, palette.wash);
    cell.lineWidth(1.5);
    const label = text(value, cellX, 0, 29, palette.ink, true);
    root.add([cell, label]);
    cells.push(cell);
    labels.push(label);
  });
  const half = (values.length * cellWidth) / 2;
  for (const side of [-1, 1])
    root.add(
      wire(
        [
          [side * half, -46],
          [side * half, 46],
        ],
        palette.rule,
        1.5,
        false,
      ),
    );
  return { root, cells, values: labels };
}

export function selectCell(tape: ReturnType<typeof strip>, index: number, selected = true) {
  tape.cells[index].fill(selected ? palette.accent : palette.wash);
  tape.cells[index].stroke(selected ? palette.accent : palette.rule);
  tape.values[index].fill(selected ? palette.paper : palette.ink);
}

export function consoleDrawing() {
  const root = new Layout({});
  const plate = (from: number, to: number) =>
    new Gradient({
      from: [from, 0],
      to: [to, 0],
      stops: [
        { offset: 0, color: '#a9adb4' },
        { offset: 0.4, color: palette.white },
        { offset: 1, color: '#e2e4e8' },
      ],
    });
  root.add(
    new Path({
      data: 'M -58 -310 C -37 -279 24 -276 67 -300 L 75 295 L -54 305 Z',
      fill: new Gradient({
        from: [-58, 0],
        to: [75, 0],
        stops: [
          { offset: 0, color: '#0d0e10' },
          { offset: 0.5, color: '#292a2e' },
          { offset: 1, color: '#0e0f11' },
        ],
      }),
    }),
  );
  root.add(
    new Path({
      data: 'M -120 -350 C -87 -312 -64 -275 -66 -213 L -62 290 C -82 301 -111 312 -142 311 C -112 239 -107 156 -108 63 L -109 -237 C -109 -280 -111 -315 -120 -350 Z',
      fill: plate(-142, -62),
    }),
  );
  root.add(
    new Path({
      data: 'M 88 -345 C 66 -299 64 -261 69 -205 L 75 20 C 127 45 144 76 142 132 L 133 285 C 116 304 83 312 57 307 L 47 -227 C 43 -279 56 -319 88 -345 Z',
      fill: plate(47, 142),
    }),
  );
  for (let i = 0; i < 9; i++) {
    root.add(
      wire(
        [
          [-49, -247 + i * 16],
          [-37, -252 + i * 16],
        ],
        '#777a81',
        2,
        false,
      ),
    );
  }
  root.add(
    wire(
      [
        [107, 112],
        [103, 234],
      ],
      '#18191c',
      8,
      false,
    ),
  );
  root.add(frame(15, 6, -12, 224, '#65676e', '#0a0b0c', 2));
  root.add(frame(12, 22, -12, 253, '#65676e', '#0a0b0c', 2));
  root.add(
    new Path({
      data: 'M -153 316 Q -15 279 151 316 L 164 332 Q 0 355 -165 332 Z',
      fill: '#101113',
    }),
  );
  root.add(text('PS5', 0, 398, 37, palette.muted));
  return root;
}
