import { Layout, Path, Rect } from '@motion-canvas/2d';
import { theme } from '../../theme';
import { accent, background, foreground, ink, muted, paper, text } from '../shared/drawing';

export function orderSlip(id: number, amount: number, time: string) {
  const root = new Layout({ opacity: 0 });
  const face = new Path({
    ...ink,
    lineWidth: 2.5,
    fill: '#13191f',
    data: 'M -175 -52 Q 0 -57 176 -52 L 174 43 L 157 52 L 140 44 L 122 53 L 105 45 L 88 53 L 70 45 L 53 54 L 35 45 L 18 53 L 0 45 L -17 54 L -35 45 L -52 53 L -70 45 L -87 54 L -105 45 L -122 53 L -140 45 L -157 53 L -176 44 Z',
  });
  const stamp = new Path({
    ...ink,
    stroke: accent,
    lineWidth: 3,
    data: 'M -150 18 L -144 24 L -133 10',
    end: 0,
  });
  root.add([
    face,
    text(`#${id}`, 27, {
      position: [-150, -22],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
    }),
    text(time, 21, {
      position: [-117, 18],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
      fill: muted,
    }),
    text(`${amount} ₺`, 31, {
      position: [148, -4],
      offset: [1, 0],
      fontFamily: theme.fontFamily.mono,
      fill: accent,
    }),
    stamp,
  ]);
  return { root, face, stamp };
}

export function addingMachine() {
  const root = new Layout({ position: [0, 80] });
  const face = new Path({
    ...ink,
    fill: '#11171c',
    data: 'M -132 -181 Q -149 -179 -148 -160 L -151 158 Q -151 175 -131 176 L 134 173 Q 149 173 148 156 L 143 -161 Q 144 -180 128 -181 Z',
  });
  const display = new Rect({
    position: [0, -109],
    size: [246, 102],
    radius: 9,
    fill: '#1b2a38',
    stroke: accent,
    lineWidth: 2,
  });
  const expression = text('0 + …', 23, {
    position: [101, -135],
    offset: [1, 0],
    fontFamily: theme.fontFamily.mono,
    fill: muted,
  });
  const result = text('0', 48, {
    position: [101, -91],
    offset: [1, 0],
    fontFamily: theme.fontFamily.mono,
    fill: accent,
  });
  const mode = text('stream processing', 30, { y: -232 });
  const operation = text('total += amount', 24, {
    y: 232,
    fontFamily: theme.fontFamily.mono,
    fill: muted,
  });
  root.add([
    new Path({
      ...ink,
      fill: background,
      data: 'M 128 -181 L 160 -168 L 162 175 L 143 189 L -130 190 L -151 158 Z',
    }),
    face,
    new Path({
      ...ink,
      lineWidth: 1.6,
      data: 'M 148 174 L 162 175 M 146 -157 L 160 -168',
    }),
    new Path({
      stroke: accent,
      lineWidth: 1.8,
      lineCap: 'round',
      opacity: 0.7,
      data: 'M 153 -95 L 159 -108 M 154 -63 L 160 -76 M 155 -25 L 160 -39 M 155 12 L 160 -2 M 155 48 L 160 35 M 155 85 L 160 72 M 155 123 L 160 109 M 155 158 L 161 145',
    }),
    display,
    expression,
    result,
    mode,
    operation,
  ]);
  const keys = ['7', '8', '9', '+', '4', '5', '6', '−', '1', '2', '3', '='].map((label, i) => {
    const key = new Layout({ position: [-93 + (i % 4) * 62, -13 + Math.floor(i / 4) * 62] });
    key.add([
      new Path({
        ...ink,
        stroke: label === '=' ? accent : '#46535f',
        lineWidth: 1.8,
        fill: label === '=' ? accent : '#1e272f',
        data: 'M -23 -24 Q 0 -26 23 -23 L 24 21 Q 1 25 -24 22 Z',
      }),
      text(label, 28, { fill: label === '=' ? background : foreground }),
    ]);
    root.add(key);
    return key;
  });
  return { root, face, display, expression, result, mode, operation, equals: keys[11] };
}

export function salesDisplay() {
  const panel = paper(350, 366, '#11171c');
  panel.root.position([606, 80]);
  const total = text('0 ₺', 66, { y: -88, fontFamily: theme.fontFamily.mono, fill: accent });
  const count = text('0 sipariş', 24, { y: -32, fill: muted });
  const updated = text('güncelleme bekliyor', 20, { y: 4, fill: muted });
  const chart = new Path({
    stroke: accent,
    lineWidth: 3.5,
    lineCap: 'round',
    lineJoin: 'round',
    data: 'M -134 122 L 134 122',
    end: 0,
  });
  panel.root.add([
    text('bugünkü satış', 30, { y: -232 }),
    total,
    count,
    new Path({ ...ink, opacity: 0.16, lineWidth: 1.3, data: 'M -143 31 L 141 31' }),
    new Path({ ...ink, opacity: 0.16, lineWidth: 1.3, data: 'M -134 48 L -134 123 L 134 123' }),
    chart,
    text('10:00', 18, { position: [-90, 153], fill: muted, fontFamily: theme.fontFamily.mono }),
    text('10:05', 18, {
      position: [134, 153],
      offset: [1, 0],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    updated,
  ]);
  return { ...panel, total, count, updated, chart };
}
