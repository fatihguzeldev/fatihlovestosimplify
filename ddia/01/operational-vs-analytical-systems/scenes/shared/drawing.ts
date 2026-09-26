import { Layout, Path, Txt, type TxtProps } from '@motion-canvas/2d';
import { theme } from '../../theme';

export const { background, foreground, accent, muted } = theme.colors;
export const ink = {
  stroke: foreground,
  lineWidth: 3,
  lineCap: 'round' as const,
  lineJoin: 'round' as const,
};

export function text(value: string, fontSize = 30, props: TxtProps = {}) {
  return new Txt({
    text: value,
    fontFamily: theme.fontFamily.sans,
    fontSize,
    fill: foreground,
    textWrap: false,
    ...props,
  });
}

export function heading(before: string, emphasis: string, after = '') {
  return new Txt({
    position: [-806, -370],
    offset: [-1, 0],
    fontFamily: theme.fontFamily.sans,
    fontSize: 56,
    fill: foreground,
    textWrap: false,
    children: [
      new Txt({ text: before }),
      new Txt({ text: emphasis, fill: accent, fontStyle: 'italic', fontWeight: 500 }),
      new Txt({ text: after }),
    ],
  });
}

export function paper(width: number, height: number, fill: string = background) {
  const x = width / 2;
  const y = height / 2;
  const root = new Layout({});
  const edge = new Path({
    ...ink,
    lineWidth: 2,
    fill: background,
    data: `M ${x} ${-y + 3} L ${x + 9} ${-y + 13} L ${x + 7} ${y + 9} L ${-x + 9} ${y + 11} L ${-x} ${y} Z`,
  });
  const face = new Path({
    ...ink,
    lineWidth: 2.6,
    fill,
    data: `M ${-x} ${-y + 2} Q 0 ${-y - 2} ${x} ${-y + 3} L ${x - 2} ${y} Q 0 ${y + 3} ${-x + 1} ${y - 1} Z`,
  });
  root.add([edge, face]);
  return { root, face };
}

export function banana() {
  const root = new Layout({});
  root.add([
    new Path({
      ...ink,
      data: 'M -35 -22 Q -23 27 31 4 Q 9 45 -26 19 Q -44 3 -35 -22 Z',
      fill: '#182638',
    }),
    new Path({
      ...ink,
      stroke: accent,
      lineWidth: 2.5,
      data: 'M -29 -11 Q -13 22 25 10 M -35 -22 L -31 -29 L -25 -26 M 30 4 L 35 0',
    }),
  ]);
  return root;
}
