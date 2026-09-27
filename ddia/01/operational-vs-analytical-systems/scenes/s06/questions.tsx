import { Circle, Layout, Path } from '@motion-canvas/2d';
import { storefront } from '../s02/delivery';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { accent, background, banana, foreground, ink, muted, paper, text } from '../shared/drawing';

export function promotion() {
  const root = new Layout({ opacity: 0 });
  const periods = ['kampanyasız hafta', 'kampanya haftası'].map((label, i) => {
    const period = new Layout({ position: [-420 + i * 840, 58], opacity: 0 });
    const shop = storefront();
    shop.position([-126, -25]);
    shop.scale(2.6);
    const stall = new Layout({ position: [-126, 112] });
    const fruit = banana();
    fruit.position([-10, -24]);
    fruit.scale(1.35);
    const secondFruit = banana();
    secondFruit.position([23, -25]);
    secondFruit.scale(1.1);
    secondFruit.rotation(-17);
    stall.add([
      fruit,
      secondFruit,
      new Path({
        ...ink,
        fill: '#17222d',
        data: 'M -76 -3 Q 0 3 76 -4 L 68 44 Q 0 50 -68 45 Z M -72 10 L 72 9 M -44 12 L -41 44 M -4 12 L -3 47 M 38 11 L 36 45',
      }),
      new Path({
        ...ink,
        stroke: accent,
        lineWidth: 1.8,
        data: 'M -63 29 L -54 18 M 48 38 L 61 23 M 54 41 L 65 28',
      }),
    ]);
    const receipt = new Layout({ position: [144, 29], rotation: i ? 2 : -2 });
    receipt.add([
      new Path({
        ...ink,
        lineWidth: 2.5,
        fill: '#131b22',
        data: 'M -111 -133 Q 3 -138 112 -131 L 111 117 L 94 128 L 77 118 L 59 129 L 42 120 L 24 130 L 7 121 L -11 130 L -29 120 L -47 128 L -65 119 L -84 127 L -111 115 Z',
      }),
      text('muz satışı', 29, { y: -86 }),
      new Path({ ...ink, lineWidth: 1.5, opacity: 0.3, data: 'M -85 -51 Q 0 -48 87 -52' }),
      text('? kg', 58, { y: 0, fill: i ? accent : foreground }),
      text('haftalık toplam', 24, { y: 73, fill: muted }),
      new Path({
        ...ink,
        stroke: accent,
        lineWidth: 1.7,
        opacity: 0.65,
        data: 'M 69 104 L 78 92 M 82 106 L 90 94',
      }),
    ]);
    period.add([
      text(label, 33, { position: [0, -230], fill: i ? accent : foreground }),
      shop,
      stall,
      receipt,
    ]);
    if (i) {
      const tag = new Layout({ position: [-116, -136], rotation: -12 });
      tag.add([
        new Path({ ...ink, lineWidth: 2, data: 'M -51 1 Q -73 4 -79 33' }),
        new Path({
          ...ink,
          fill: '#1b2b3c',
          data: 'M -58 0 L -32 -33 L 55 -30 L 56 32 L -34 31 Z',
        }),
        new Circle({ position: [-40, 0], size: 6, stroke: accent, lineWidth: 2 }),
        text('%', 45, { x: 12, fill: accent }),
        new Path({
          ...ink,
          stroke: accent,
          lineWidth: 2,
          data: 'M 68 -19 L 81 -25 M 71 1 L 87 2 M 64 22 L 76 30',
        }),
      ]);
      period.add(tag);
    }
    root.add(period);
    return period;
  });
  const comparison = new Layout({ y: 283 });
  const data = `M -712 -17 C -719 4 -707 14 -684 11
    L -82 7 C -46 4 -20 5 -4 17 L 2 22 L 10 14
    C 28 3 63 7 96 8 L 688 12 C 713 15 724 0 718 -18
    L 708 -17 C 713 -3 696 -3 683 -3
    L 90 -7 C 48 -10 27 -7 2 3 C -20 -10 -53 -9 -83 -7
    L -685 -2 C -699 -1 -702 -8 -701 -17 Z`;
  const outline = new Path({ ...ink, lineWidth: 2.4, fill: background, data, end: 0 });
  outline.opacity(() => (outline.end() > 0 ? 1 : 0));
  const hatch = new Path({ data, clip: true, opacity: 0 });
  for (let i = 0, x = -695; x < 700; i++, x += 25 + (i % 3) * 3) {
    hatch.add(
      new Path({
        ...ink,
        stroke: accent,
        lineWidth: 1.7,
        data: `M ${x} ${11 + (i % 3)} Q ${x + 5} 2 ${x + 9 + (i % 2) * 3} -7`,
      }),
    );
  }
  comparison.add([outline, hatch]);
  const scope = text('aynı mağaza', 28, { y: 348, fill: muted, opacity: 0 });
  root.add([comparison, scope]);
  return { root, periods, outline, hatch, scope };
}

export function together() {
  const root = new Layout({ opacity: 0 });
  const diapers = paper(290, 300, '#17232f');
  diapers.root.position([-340, 55]);
  diapers.root.add([
    text('marka x', 29, { y: -98, fill: accent }),
    new Path({
      ...ink,
      lineWidth: 4,
      data: 'M -82 -30 L 82 -28 Q 77 16 53 65 Q 24 45 0 45 Q -29 46 -53 66 Q -77 14 -82 -30 Z M -79 -17 Q 0 3 79 -17 M -62 -4 Q -62 26 -30 49 M 62 -3 Q 62 23 32 49',
      fill: background,
    }),
    text('bebek bezi', 29, { y: 119 }),
  ]);
  const jar = new Layout({ position: [375, 40] });
  jar.add([
    new Path({
      ...ink,
      lineWidth: 4,
      fill: '#17232f',
      data: 'M -110 -85 L -110 -122 Q 0 -132 112 -121 L 112 -84 Z M -103 -84 Q -128 -69 -128 -46 L -125 128 Q -123 151 -96 153 L 100 152 Q 126 150 127 127 L 128 -42 Q 125 -69 101 -84 Z M -125 -31 L 127 -29 M -125 97 L 127 96',
    }),
    text('?', 102, { y: 25, fill: accent, fontStyle: 'italic' }),
    text('mama markası', 30, { y: 205 }),
  ]);
  const arrow = cartoonArrow('s06-bought-together', [-130, 55], [176, 55], accent);
  root.add([
    diapers.root,
    jar,
    arrow.root,
    text('birlikte alınan ürünler', 30, { position: [0, 355], fill: muted }),
  ]);
  return { root, arrow };
}
