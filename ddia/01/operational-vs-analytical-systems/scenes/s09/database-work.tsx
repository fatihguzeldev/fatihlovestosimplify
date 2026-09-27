import { Layout, Path, Rect } from '@motion-canvas/2d';
import { linear } from '@motion-canvas/core';
import { theme } from '../../theme';
import { accent, background, ink, muted, paper, text } from '../shared/drawing';

export function databaseWork() {
  const root = new Layout({ opacity: 0 });
  const surface = paper(1480, 440, '#101315');
  surface.root.y(30);
  root.add([
    surface.root,
    text('sales database', 31, { y: -234, fontFamily: theme.fontFamily.mono }),
  ]);
  const left = new Layout({ x: -380 });
  const right = new Layout({ x: 380 });
  const order = paper(540, 74, '#17232f');
  order.root.y(50);
  order.root.add([
    text('#1042', 29, { position: [-220, 0], offset: [-1, 0], fontFamily: theme.fontFamily.mono }),
    text('preparing', 29, { position: [30, 0], fill: accent, fontFamily: theme.fontFamily.mono }),
  ]);
  left.add([
    text('siparişin durumu', 29, { y: -136 }),
    text('getOrder(1042)', 32, { y: -85, fill: accent, fontFamily: theme.fontFamily.mono }),
    order.root,
    text('belirli bir kayıt', 26, { y: 143, fill: muted }),
  ]);
  const scan = new Rect({
    position: [0, -18],
    width: 558,
    height: 31,
    radius: 3,
    fill: '#21364b',
    stroke: accent,
    lineWidth: 2,
  });
  right.add([
    text('ocak satış raporu', 29, { y: -136 }),
    text('SUM(amount)', 32, { y: -85, fill: accent, fontFamily: theme.fontFamily.mono }),
    scan,
  ]);
  for (let i = 0; i < 5; i++) {
    const y = -18 + i * 36;
    right.add(
      new Path({
        ...ink,
        stroke: muted,
        lineWidth: 2,
        data: `M -250 ${y} L -185 ${y + 1} M -142 ${y} L -88 ${y - 1} M -46 ${y} L 114 ${y + 1} M 168 ${y} L 248 ${y}`,
      }),
    );
  }
  right.add(text('⋮', 28, { y: 170, fill: muted }));
  root.add([left, right]);
  const activity = text('tarama sürüyor', 31, { position: [380, 420], fill: accent });
  const response = text('sipariş ekranı', 27, { position: [-380, 369], fill: muted });
  const status = text('preparing', 31, {
    position: [-380, 420],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
  });
  const resources = new Layout({ opacity: 0 });
  const shape =
    'M -666 187 C -674 207 -660 221 -635 215 L -85 212 C -41 207 -18 211 0 229 C 25 208 55 210 87 212 L 635 217 C 662 220 676 205 667 186 L 657 188 C 661 202 644 202 633 201 L 87 197 C 42 195 19 197 0 211 C -23 195 -48 196 -87 198 L -633 201 C -648 202 -656 200 -655 187 Z';
  resources.add(new Path({ ...ink, lineWidth: 2.4, fill: background, data: shape }));
  const hatching = new Path({ data: shape, clip: true });
  for (let x = -647; x < 651; x += 24) {
    hatching.add(
      new Path({ ...ink, stroke: accent, lineWidth: 1.8, data: `M ${x} 218 L ${x + 12} 197` }),
    );
  }
  resources.add([hatching, text('aynı CPU · bellek · disk', 32, { y: 295, fill: accent })]);
  root.add([
    resources,
    response,
    status,
    activity,
    text('rapor', 27, { position: [380, 369], fill: muted }),
  ]);
  const pulse = new Rect({
    position: [-380, 50],
    width: 548,
    height: 82,
    radius: 5,
    stroke: accent,
    lineWidth: 3,
    opacity: 0,
  });
  root.add(pulse);
  return {
    root,
    status,
    activity,
    pulse,
    scan,
    resources,
    *sweep() {
      scan.y(-18);
      yield* scan.y(126, 2.6, linear);
      yield* scan.opacity(0, 0.15);
      scan.y(-18);
      yield* scan.opacity(1, 0.15);
    },
  };
}
