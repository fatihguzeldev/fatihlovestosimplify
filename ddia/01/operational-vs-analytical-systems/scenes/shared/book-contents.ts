import { Layout, Node, Path } from '@motion-canvas/2d';
import { all, createSignal, easeInOutCubic, easeOutCubic, waitUntil } from '@motion-canvas/core';
import { accent, background, foreground, text } from './drawing';

type Section = 'introduction' | 'systems' | 'transactions' | 'warehousing' | 'records';

export function* bookContents(view: Node, from: Section, to: Section) {
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
    text('.', 31, {
      position: () => chapter.position().addX(chapter.width() + 3),
      offset: [-1, 0],
      fill: accent,
    }),
    ...rows.map(({ label }) => label),
  ]);
  view.add(root);
  const initial = rows.find(({ id }) => id === from)!.label;
  const target = rows.find(({ id }) => id === to)!.label;
  const width = createSignal(initial.width() + 44);
  const height = createSignal(initial.fontSize() + 30);
  const marker = new Path({
    key: 'contents-marker',
    position: initial.position().addX(-22),
    fill: accent,
    clip: true,
    data: () => {
      const w = width();
      const h = height() / 2;
      return `M 6 ${-h + 6} Q ${w * 0.3} ${-h - 1} ${w * 0.59} ${-h + 3}
        T ${w - 6} ${-h + 2} L ${w - 9} ${-h + 10} L ${w - 1} ${-h + 17}
        L ${w - 7} ${-h + 27} L ${w - 2} 2 L ${w - 8} ${h - 16}
        L ${w - 3} ${h - 5} Q ${w * 0.65} ${h + 2} ${w * 0.4} ${h - 2}
        T 3 ${h - 3} L 8 ${h - 13} L 1 ${h - 22} L 6 0 L 2 ${-h + 19} Z`;
    },
  });
  root.add(marker);
  marker.add(
    rows.map(({ id, label }) =>
      label.snapshotClone({
        key: `contents-ink-${id}`,
        fill: background,
        position: () => label.position().sub(marker.position()),
      }),
    ),
  );
  yield* root.opacity(1, 0.3);
  yield* waitUntil('contents-focus');
  yield* height((initial.fontSize() + 30) * 0.86, 0.14);
  yield* all(
    marker.position(target.position().addX(-22), 0.86, easeInOutCubic),
    width(target.width() + 44, 0.86, easeInOutCubic),
    height((target.fontSize() + 30) * 0.86, 0.86, easeInOutCubic),
  );
  yield* height(target.fontSize() + 30, 0.18, easeOutCubic);
  yield* waitUntil('contents-close');
  yield* root.opacity(0, 0.27);
  root.remove();
}
