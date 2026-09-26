import { Layout, Path } from '@motion-canvas/2d';
import { theme } from '../../theme';
import { accent, banana, foreground, ink, muted, paper, text } from '../shared/drawing';

export const searchProducts = [
  { id: 'p17', name: 'muz', price: '60 ₺', tilt: -6 },
  { id: 'p42', name: 'yerli muz', price: '55 ₺', tilt: 5 },
];

export function searchIndex() {
  const root = new Layout({ position: [536, 95] });
  root.add(text('search index', 30, { y: -246 }));
  const deck = new Layout({ position: [-137, 10] });
  for (const [label, x, y, rotation] of [
    ['elma', -14, -67, -7],
    ['süt', -5, -33, -3],
  ] as const) {
    const card = paper(162, 182, '#101519');
    card.root.position([x, y]);
    card.root.rotation(rotation);
    card.root.add(text(label, 23, { position: [-59, -74], offset: [-1, 0], fill: muted }));
    deck.add(card.root);
  }
  const word = paper(162, 182, '#17222d');
  const wordLabel = text('muz', 40, { y: 20, fontWeight: 500 });
  word.root.add([
    new Path({
      ...ink,
      lineWidth: 2.3,
      data: 'M -10 -59 C -35 -62 -36 -25 -12 -24 C 12 -23 14 -58 -10 -59 M 4 -28 L 23 -9',
    }),
    wordLabel,
    new Path({
      ...ink,
      stroke: accent,
      lineWidth: 2,
      opacity: 0.55,
      data: 'M 48 66 L 57 53 M 59 67 L 68 53',
    }),
  ]);
  deck.add(word.root);
  const links = [-69, 84].map(
    (y) =>
      new Path({
        ...ink,
        stroke: accent,
        lineWidth: 2.7,
        end: 0,
        data: `M -54 21 C -14 24 -29 ${y} 26 ${y}`,
      }),
  );
  links.forEach((link) => link.opacity(() => (link.end() > 0 ? 1 : 0)));
  const documents = searchProducts.map((product, i) => {
    const card = paper(212, 114, '#131b23');
    card.root.position([130, -69 + i * 153]);
    card.root.rotation(i === 0 ? 2 : -2);
    card.root.opacity(0.42);
    const fruit = banana();
    fruit.position([-64, -1]);
    fruit.scale(0.72);
    fruit.rotation(product.tilt);
    card.root.add([
      fruit,
      text(product.name, 24, { position: [-25, -15], offset: [-1, 0] }),
      text(product.id, 19, {
        position: [-25, 23],
        offset: [-1, 0],
        fontFamily: theme.fontFamily.mono,
        fill: muted,
      }),
    ]);
    return card;
  });
  root.add([
    ...links,
    deck,
    ...documents.map((card) => card.root),
    new Path({
      ...ink,
      stroke: foreground,
      lineWidth: 1.5,
      opacity: 0.2,
      data: 'M -221 137 Q -140 142 -47 137 M 24 169 Q 132 174 238 166',
    }),
  ]);
  return { root, word, wordLabel, links, documents };
}
