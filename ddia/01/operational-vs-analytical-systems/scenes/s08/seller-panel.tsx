import { Layout, Path, Rect } from '@motion-canvas/2d';
import { createSignal } from '@motion-canvas/core';
import { theme } from '../../theme';
import { accent, foreground, ink, muted, text } from '../shared/drawing';

const mono = theme.fontFamily.mono;
export const money = (amount: number) => `${Math.round(amount).toLocaleString('tr-TR')}₺`;

export function sellerPanel() {
  const root = new Layout({ position: [0, 80] });
  const chrome = new Layout({ opacity: 0 });
  const details = new Layout({ opacity: 0 });
  const total = text('700₺', 64, {
    position: [-474, 31],
    offset: [-1, 0],
    fontFamily: mono,
  });
  const period = text('ocak 2026', 25, { position: [400, -149] });
  const loading = text('satışlar hesaplanıyor…', 29, { y: 52, fill: muted, opacity: 0 });
  const updated = text('satışlar güncellendi', 22, {
    position: [-474, 221],
    offset: [-1, 0],
    fill: accent,
    opacity: 0,
  });
  const nav = new Rect({ position: [-182, -241], size: [112, 42], radius: 6, fill: '#182638' });
  const pointer = new Path({
    ...ink,
    position: [485, -93],
    fill: foreground,
    stroke: '#101315',
    lineWidth: 2,
    data: 'M 0 0 L 0 29 L 8 22 L 15 35 L 21 32 L 14 19 L 25 17 Z',
    opacity: 0,
  });
  chrome.add([
    new Path({
      ...ink,
      fill: '#101315',
      data: 'M -520 -280 Q -550 -281 -548 -250 L -547 248 Q -548 279 -519 280 L 520 278 Q 550 279 548 247 L 550 -248 Q 551 -278 520 -278 Z',
    }),
    new Path({ ...ink, lineWidth: 1.5, opacity: 0.3, data: 'M -548 -205 Q 0 -203 548 -207' }),
    new Path({
      ...ink,
      position: [-502, -244],
      stroke: accent,
      lineWidth: 2.5,
      data: 'M -14 -8 L 13 -9 L 16 15 Q 0 18 -16 15 Z M -7 -5 L -7 -13 Q 0 -25 7 -13 L 7 -5',
    }),
    text('market', 32, { position: [-470, -244], offset: [-1, 0], fontWeight: 500 }),
    nav,
    text('satışlar', 23, { position: [-182, -242], fill: accent }),
    text('satıcı paneli', 24, { position: [493, -244], offset: [1, 0], fill: muted }),
    text('satış özeti', 32, { position: [-474, -148], offset: [-1, 0], fontWeight: 500 }),
    new Rect({ position: [400, -149], size: [186, 47], radius: 6, fill: '#1b2530' }),
    period,
  ]);
  details.add([
    text('toplam satış', 27, { position: [-474, -32], offset: [-1, 0], fill: muted }),
    total,
    text('2 mağaza', 23, { position: [-474, 91], offset: [-1, 0], fill: muted }),
  ]);
  const chart = new Layout({ opacity: 0 });
  const amounts = [createSignal(1200), createSignal(900)];
  amounts.forEach((amount, i) => {
    const x = 132 + i * 218;
    chart.add([
      new Path({
        fill: accent,
        data: () => {
          const top = 156 - amount() * 0.13;
          return `M ${x - 45} 156 L ${x - 46} ${top + 1} Q ${x} ${top - 2} ${x + 45} ${top} L ${x + 46} 156 Z`;
        },
      }),
      text('', 29, {
        text: () => money(amount()),
        x,
        y: () => 156 - amount() * 0.13 - 29,
        fontFamily: mono,
      }),
      text(`mağaza ${i ? 'b' : 'a'}`, 25, { position: [x, 188] }),
    ]);
  });
  chart.add(new Path({ ...ink, data: 'M 52 156 Q 240 158 437 155', lineWidth: 1.5, opacity: 0.5 }));
  const sum = () => amounts.reduce((value, amount) => value + amount(), 0);
  root.add([chrome, details, chart, loading, updated, pointer]);
  return {
    root,
    chrome,
    details,
    total,
    period,
    loading,
    updated,
    nav,
    pointer,
    chart,
    amounts,
    sum,
  };
}

export function newSale() {
  const root = new Layout({ position: [-631, 105], rotation: -3, opacity: 0 });
  root.add([
    new Path({
      ...ink,
      fill: '#17232f',
      data: 'M -153 -132 Q 0 -136 153 -130 L 152 112 L 131 124 L 110 113 L 89 126 L 68 113 L 47 124 L 26 114 L 5 126 L -16 113 L -37 126 L -58 115 L -79 127 L -100 115 L -121 126 L -153 114 Z',
    }),
    text('yeni satış', 30, { y: -80, fontWeight: 500 }),
    text('mağaza a', 26, { y: -30, fill: muted }),
    text('+185₺', 48, { y: 39, fill: accent, fontFamily: mono }),
  ]);
  return root;
}
