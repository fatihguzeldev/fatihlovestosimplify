import { Layout, Rect } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, muted, paper, text } from '../shared/drawing';

function recordCard(label: string, fields: string[], values: string[], width: number) {
  const height = fields.length * 48 + 36;
  const surface = paper(width, height, '#101315');
  surface.root.add(text(label, 27, { y: -height / 2 - 33 }));
  const cells = fields.map((field, i) => {
    const y = (i - (fields.length - 1) / 2) * 48;
    const value = text(values[i], 28, {
      position: [35, y],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
    });
    surface.root.add([
      text(field, 24, {
        position: [-width / 2 + 28, y],
        offset: [-1, 0],
        fill: muted,
        fontFamily: theme.fontFamily.mono,
      }),
      value,
    ]);
    return value;
  });
  return { ...surface, cells };
}

export function eltExample() {
  const root = new Layout({ opacity: 0 });
  const warehouse = paper(1230, 580);
  warehouse.root.position([235, 105]);
  const sources = ['sales database', 'store database'].map((name, i) => {
    const source = cartoonDatabase(name, accent);
    source.root.position([-695, -30 + i * 270]);
    source.root.scale(0.78);
    source.caption.fontSize(32);
    const lines = i === 0 ? ['#1042', 'store A', '185₺'] : ['store A', 'Marmara'];
    source.root.add(
      lines.map((line, index) =>
        text(line, index === 0 ? 32 : 28, {
          y: -10 + index * 43,
          fontFamily: theme.fontFamily.mono,
          fill: index === 1 ? accent : foreground,
        }),
      ),
    );
    return source;
  });
  const sales = recordCard(
    'yüklenen satış kaydı',
    ['id', 'store_id', 'amount (₺)'],
    ['1042', 'A', '185'],
    430,
  );
  sales.root.position([-100, -30]);
  sales.root.opacity(0);
  const stores = recordCard('yüklenen mağaza kaydı', ['id', 'region'], ['A', 'Marmara'], 430);
  stores.root.position([-100, 240]);
  stores.root.opacity(0);
  const result = recordCard(
    'analize hazır kayıt',
    ['id', 'store_id', 'amount (₺)', 'region'],
    ['1042', 'A', '185', 'Marmara'],
    430,
  );
  result.root.position([590, 120]);
  result.root.opacity(0);
  result.cells[3].fill(accent);
  const pending = text('dönüşüm henüz yapılmadı', 26, {
    position: [570, 120],
    fill: muted,
    opacity: 0,
  });
  const loads = [-30, 240].map((y, i) => {
    const arrow = cartoonArrow(`s11-elt-source-${i}`, [0, 0], [255, 0], accent, 0);
    arrow.root.position([-575, y]);
    arrow.root.scale(0.86);
    return arrow;
  });
  const transforms = [-30, 240].map((y, i) => {
    const arrow = cartoonArrow(
      `s11-elt-join-${i}`,
      [0, 0],
      [295, (i === 0 ? 70 : -70) / 0.68],
      accent,
      0,
    );
    arrow.root.position([145, y]);
    arrow.root.scale(0.68);
    return arrow;
  });
  const match = text('store_id = id', 23, {
    position: [241, -103],
    fontFamily: theme.fontFamily.mono,
    fill: accent,
    opacity: 0,
  });
  root.add([
    warehouse.root,
    ...[-30, 240].map((y) => new Rect({ position: [-380, y], size: [20, 114], fill: background })),
    text('data warehouse', 34, { position: [520, -209] }),
    ...sources.map((source) => source.root),
    sales.root,
    stores.root,
    result.root,
    pending,
    ...loads.map((arrow) => arrow.root),
    ...transforms.map((arrow) => arrow.root),
    match,
    ...loads.map((arrow, i) =>
      text('extract → load', 23, {
        position: [-461, -103 + i * 270],
        opacity: () => arrow.reveal(),
      }),
    ),
  ]);
  return { root, sales, stores, result, pending, loads, transforms, match };
}
