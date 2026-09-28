import { Layout, Node, Path, Txt } from '@motion-canvas/2d';
import {
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';
import { accent, background, foreground, text } from './drawing';

type Section = 'introduction' | 'systems' | 'transactions' | 'warehousing' | 'records';

function brushData(width: number, height: number) {
  const w = width;
  const h = height / 2;
  const gaps = [
    [0.025, -h + 8, 0.3, 3],
    [0.4, -h + 6, 0.22, 2],
    [0.72, -h + 10, 0.24, 2.8],
    [0.12, -h + 13, 0.15, 1.2],
    [0.025, h - 6, 0.12, 1.8],
    [0.2, h - 8, 0.3, 3],
    [0.59, h - 8, 0.34, 2.5],
  ];
  return `M 14 ${-h + 6} Q ${w * 0.3} ${-h - 1} ${w * 0.59} ${-h + 3}
    T ${w - 19} ${-h + 3} L ${w - 24} ${-h + 8} L ${w - 6} ${-h + 10}
    L ${w - 8} ${-h + 14} L ${w - 17} ${-h + 15}
    Q ${w - 10} ${-h + 22} ${w - 4} ${-h + 25} L ${w - 13} ${-h + 28}
    L ${w - 7} -2 L ${w - 2} 0 L ${w - 5} 5 L ${w - 15} 6
    L ${w - 10} 12 L ${w - 13} 19 L ${w - 5} 20 L ${w - 8} 24
    L ${w - 19} ${h - 11} L ${w - 12} ${h - 6}
    Q ${w * 0.65} ${h + 2} ${w * 0.4} ${h - 2} T 10 ${h - 3}
    L 12 ${h - 7} L 4 ${h - 8} L 7 ${h - 13} L 17 ${h - 14}
    Q 8 16 5 12 L 12 9 L 4 7 L 6 1 L 14 0
    L 8 -8 L 3 -10 L 6 -15 L 15 -16 L 8 ${-h + 16}
    L 3 ${-h + 15} L 6 ${-h + 11} L 18 ${-h + 12} Z
    ${gaps
      .map(([x, y, length, thickness]) => {
        const start = x * w;
        const end = start + length * w;
        return `M ${start} ${y} Q ${start + length * w * 0.23} ${y + thickness * 0.7} ${end} ${y + thickness * 0.1}
          Q ${start + length * w * 0.7} ${y - thickness * 0.55} ${start + length * w * 0.46} ${y - thickness * 0.3}
          T ${start} ${y} Z`;
      })
      .join(' ')}`;
}

function paintRow(id: Section, label: Txt, visible: number) {
  const progress = createSignal(visible);
  const width = label.width() + 44;
  const height = label.fontSize() + 30;
  const wipe = new Path({
    key: `contents-wipe-${id}`,
    position: label.position().addX(-22),
    clip: true,
    opacity: () => (progress() > 0 ? 1 : 0),
    data: () => {
      const x = width * progress();
      const fringe = Math.sin(progress() * Math.PI);
      return `M 0 -50 L ${x - 6 * fringe} -50 L ${x - 6 * fringe} -30
        L ${x - 14 * fringe} -27 L ${x - 2 * fringe} -24 L ${x - 4 * fringe} -16
        L ${x - 10 * fringe} -14 L ${x} -10 L ${x - 3 * fringe} 0
        L ${x - 12 * fringe} 3 L ${x - 2 * fringe} 7 L ${x - 5 * fringe} 18
        L ${x - 13 * fringe} 20 L ${x - fringe} 24 L ${x - 7 * fringe} 30
        L ${x - 7 * fringe} 50 L 0 50 Z`;
    },
  });
  const brush = new Path({
    key: `contents-brush-${id}`,
    fill: accent,
    data: brushData(width, height),
  });
  wipe.add([
    brush,
    label.snapshotClone({
      key: `contents-ink-${id}`,
      fill: background,
      stroke: accent,
      strokeFirst: true,
      lineWidth: 3,
      position: [22, 0],
    }),
  ]);
  return { wipe, progress };
}

export function* bookContents(view: Node, from: Section | null, to: Section) {
  const root = new Layout({ key: 'book-contents', opacity: 0 });
  const chapter = text('chapter 1', 31, {
    position: [-780, -360],
    offset: [-1, 0],
  });
  const rows = [
    { id: 'introduction', label: 'giriş', x: -780, y: -190, size: 48 },
    {
      id: 'systems',
      label: 'operational versus analytical systems',
      x: -780,
      y: -50,
      size: 48,
    },
    {
      id: 'transactions',
      label: 'characterizing transaction processing and analytics',
      x: -680,
      y: 88,
      size: 38,
    },
    { id: 'warehousing', label: 'data warehousing', x: -680, y: 190, size: 38 },
    { id: 'records', label: 'systems of record and derived data', x: -680, y: 292, size: 38 },
  ].map(({ id, label, x, y, size }) => ({
    id,
    label: text(label, size, {
      key: `contents-${id}`,
      position: [x, y],
      offset: [-1, 0],
      fill: foreground,
    }),
  }));
  root.add([
    chapter,
    text('·', 31, {
      position: () => chapter.position().addX(chapter.width() + 20),
      offset: [-1, 0],
      fill: accent,
    }),
    text('trade-offs in data systems architecture', 31, {
      key: 'contents-chapter-title',
      position: () => chapter.position().addX(chapter.width() + 54),
      offset: [-1, 0],
    }),
    new Path({
      key: 'contents-branches',
      stroke: accent,
      opacity: 0.65,
      lineWidth: 2.7,
      lineCap: 'round',
      lineJoin: 'round',
      data: `M -754 -3 C -761 21 -755 47 -756 66
        C -757 86 -745 92 -717 88
        M -756 66 C -760 108 -752 141 -755 165
        C -758 186 -744 193 -718 190
        M -755 165 C -760 213 -754 245 -756 267
        C -757 288 -745 296 -717 292`,
    }),
    ...rows.map(({ label }) => label),
  ]);
  view.add(root);
  const initial = from ? paintRow(from, rows.find(({ id }) => id === from)!.label, 1) : null;
  const target = paintRow(to, rows.find(({ id }) => id === to)!.label, 0);
  if (initial) root.add(initial.wipe);
  root.add(target.wipe);
  yield* root.opacity(1, 0.3);
  yield* waitUntil('contents-focus');
  if (initial) {
    yield* initial.progress(0, 0.42, easeInOutCubic);
    yield* waitFor(0.1);
  }
  yield* target.progress(1, 0.66, easeOutCubic);
  yield* waitUntil('contents-close');
  yield* root.opacity(0, 0.27);
  root.remove();
}
