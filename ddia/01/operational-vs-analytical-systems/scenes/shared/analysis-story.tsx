import { Circle, Layout, Path, Rect } from '@motion-canvas/2d';
import { theme } from '../../theme';
import { accent, muted, paper, text } from './drawing';

export const browsingEvents = [
  { time: '14:00:00', event: 'view', product: 'muz', label: 'muz · görüntüledi' },
  { time: '14:00:12', event: 'view', product: 'süt', label: 'süt · görüntüledi' },
  { time: '14:00:30', event: 'add_to_cart', product: 'muz', label: 'muz · sepete ekledi' },
];

export function browsingJourney() {
  const surface = paper(650, 340, '#101315');
  surface.root.add([
    text('market · oturum #17', 29, { y: -121, fill: accent }),
    new Path({ data: 'M -118 -52 L -118 94', stroke: muted, lineWidth: 2 }),
  ]);
  const rows = browsingEvents.map((event, i) => {
    const y = -52 + i * 73;
    const row = new Layout({ y, opacity: 0 });
    row.add([
      text(event.time, 23, { x: -217, fontFamily: theme.fontFamily.mono, fill: muted }),
      new Circle({ x: -118, size: 10, fill: accent }),
      text(event.label, 27, { x: -82, offset: [-1, 0] }),
    ]);
    surface.root.add(row);
    return row;
  });
  return { ...surface, rows };
}

export function clickstreamSource() {
  const surface = paper(690, 430, '#101315');
  surface.root.add([
    text('clickstream.jsonl', 29, {
      position: [-299, -174],
      offset: [-1, 0],
      fill: accent,
      fontFamily: theme.fontFamily.mono,
    }),
    new Path({ data: 'M -302 -135 Q 0 -132 300 -134', stroke: muted, lineWidth: 1.3 }),
  ]);
  const rows = browsingEvents.map((event, index) => {
    const row = new Layout({ y: -85 + index * 96 });
    const highlight = new Rect({ width: 625, height: 79, radius: 5, fill: '#182638', opacity: 0 });
    const stamp = text(`{"time":"${event.time}", "session":17,`, 23, {
      position: [-294, -18],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
    });
    const action = text(` "event":"${event.event}", "product":"${event.product}"}`, 23, {
      position: [-294, 18],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
    });
    row.add([highlight, stamp, action]);
    surface.root.add(row);
    return { root: row, highlight, stamp, action };
  });
  return { ...surface, rows };
}

export function browsingReport() {
  const surface = paper(610, 320, '#101315');
  surface.root.add([
    text('ürün görüntüleme sayısı', 30, { y: -115 }),
    text('product', 25, {
      position: [-236, -49],
      offset: [-1, 0],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    text('views', 25, {
      position: [178, -49],
      offset: [1, 0],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    new Path({ data: 'M -240 -17 Q 0 -19 239 -17', stroke: muted, lineWidth: 1.4 }),
  ]);
  const values = new Layout({ opacity: 0 });
  ['muz', 'süt'].forEach((product, i) => {
    values.add([
      text(product, 32, { position: [-236, 32 + i * 71], offset: [-1, 0] }),
      text(
        String(
          browsingEvents.filter((event) => event.product === product && event.event === 'view')
            .length,
        ),
        39,
        {
          position: [178, 32 + i * 71],
          offset: [1, 0],
          fill: accent,
          fontFamily: theme.fontFamily.mono,
        },
      ),
    ]);
  });
  surface.root.add(values);
  return { ...surface, values };
}

export function browsingFeatures() {
  const surface = paper(640, 260, '#101315');
  surface.root.add(text('oturum #17 · model input’u', 26, { y: -89, fill: muted }));
  const values = new Layout({ opacity: 0 });
  const fields = [
    ['görüntüleme', String(browsingEvents.filter((event) => event.event === 'view').length)],
    [
      'sepete ekleme',
      String(browsingEvents.filter((event) => event.event === 'add_to_cart').length),
    ],
    ['geçen süre', '30 sn'],
  ];
  fields.forEach(([name, value], i) => {
    const x = -202 + i * 202;
    surface.root.add(text(name, 23, { position: [x, -28] }));
    values.add(
      text(value, 48, { position: [x, 46], fill: accent, fontFamily: theme.fontFamily.mono }),
    );
  });
  surface.root.add(values);
  return { ...surface, values };
}
