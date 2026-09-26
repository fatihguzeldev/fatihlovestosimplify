import { Layout, Path, Rect, type View2D } from '@motion-canvas/2d';
import { all, easeOutCubic, sequence, waitUntil } from '@motion-canvas/core';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, banana, foreground, heading, ink, muted, text } from '../shared/drawing';
import { createMarket } from '../shared/market';
import { searchIndex, searchProducts } from './search-index';

export function* showSearch(view: View2D) {
  const root = new Layout({ opacity: 0 });
  const title = heading('muz yazınca ', 'neler geliyor?');
  const market = createMarket();
  market.body.removeChildren();
  market.root.position([-490, 95]);
  market.root.scale(0.9);
  market.label.fontSize(28 / 0.9);
  market.label.position([0, -235 - 40 / 0.9]);
  market.label.offset([0, 0]);
  market.label.fill(foreground);
  const query = text('', 34, { position: [-204, -112], offset: [-1, 0] });
  const placeholder = text('ürün ara', 29, {
    position: [-204, -112],
    offset: [-1, 0],
    fill: muted,
  });
  const searchBox = new Path({
    ...ink,
    stroke: accent,
    lineWidth: 2.2,
    fill: '#18232f',
    data: 'M -266 -147 Q 4 -151 266 -147 Q 282 -147 282 -132 L 280 -94 Q 280 -77 265 -77 L -265 -76 Q -281 -76 -280 -92 L -282 -133 Q -282 -147 -266 -147 Z',
  });
  const cursor = new Path({
    ...ink,
    stroke: accent,
    lineWidth: 2,
    opacity: 0,
    data: 'M -142 -129 L -142 -94',
  });
  market.body.add([
    searchBox,
    new Path({
      ...ink,
      stroke: accent,
      lineWidth: 2.6,
      data: 'M -245 -130 C -268 -133 -269 -103 -247 -103 C -225 -102 -223 -128 -245 -130 M -235 -104 L -224 -92',
    }),
    placeholder,
    query,
    cursor,
  ]);
  const loading = new Layout({ opacity: 0 });
  [18, 134].forEach((y) => {
    loading.add([
      new Rect({ position: [0, y], size: [554, 99], radius: 12, fill: '#13191f' }),
      new Path({
        ...ink,
        lineWidth: 3,
        stroke: '#35414e',
        lineDash: [6, 8],
        data: `M -251 ${y - 30} L -190 ${y - 29} L -191 ${y + 29} L -252 ${y + 28} Z`,
      }),
      new Path({
        ...ink,
        stroke: '#35414e',
        lineWidth: 3,
        data: `M -160 ${y - 12} L 13 ${y - 12} M -160 ${y + 15} L -72 ${y + 16}`,
      }),
    ]);
  });
  const resultCount = text('2 ürün', 22, {
    position: [275, -48],
    offset: [1, 0],
    fill: muted,
    opacity: 0,
  });
  const products = searchProducts.map((product, i) => {
    const row = new Layout({ position: [0, 28 + i * 116], opacity: 0 });
    const fruit = banana();
    fruit.position([-225, 0]);
    fruit.scale(0.83);
    fruit.rotation(product.tilt);
    row.add([
      new Rect({ size: [554, 99], radius: 12, fill: '#151c24', stroke: '#2c3946', lineWidth: 1.2 }),
      new Rect({ position: [-225, 0], size: [80, 79], radius: 10, fill: '#202e3d' }),
      fruit,
      text(product.name, 30, { position: [-164, -21], offset: [-1, 0], fontWeight: 500 }),
      text('1 kg', 21, { position: [-164, 17], offset: [-1, 0], fill: muted }),
      text(product.price, 28, {
        position: [173, 1],
        offset: [1, 0],
        fontFamily: theme.fontFamily.mono,
      }),
      new Path({
        ...ink,
        stroke: accent,
        lineWidth: 2,
        fill: '#182638',
        position: [226, 0],
        data: 'M -20 -23 Q 0 -25 20 -21 Q 24 0 21 21 Q 0 25 -22 20 Z M -10 0 L 10 0 M 0 -10 L 0 10',
      }),
    ]);
    return row;
  });
  market.body.add([loading, ...products, resultCount]);
  const index = searchIndex();
  const request = cartoonArrow('s02-product-search', [-163, 35], [280, 35], accent, 0);
  const response = cartoonArrow('s02-search-results', [280, 205], [-163, 205], accent, 0);
  const requestLabel = text('search("muz")', 25, {
    position: request.pointAt(0.5).addY(-73),
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const responseLabel = text('2 ürün', 27, {
    position: response.pointAt(0.5).addY(66),
    fill: accent,
    opacity: 0,
  });
  root.add([
    title,
    market.root,
    index.root,
    request.root,
    response.root,
    requestLabel,
    responseLabel,
  ]);
  view.add(root);
  yield* root.opacity(1, 0.5);
  yield* placeholder.opacity(0, 0.15);
  yield* query.text('muz', 0.55);
  yield* cursor.opacity(1, 0.15).to(0, 0.2);
  yield* waitUntil('search-results');
  yield* all(request.reveal(1, 0.4), requestLabel.opacity(1, 0.3), loading.opacity(1, 0.25));
  yield* request.travel(0.6);
  yield* all(
    request.arrive(),
    index.word.face.stroke(accent, 0.2),
    index.wordLabel.fill(accent, 0.2),
  );
  yield* sequence(0.16, ...index.links.map((link) => link.end(1, 0.4)));
  yield* sequence(
    0.1,
    ...index.documents.map((card) =>
      all(
        card.root.opacity(1, 0.25),
        card.root.rotation(0, 0.3, easeOutCubic),
        card.face.stroke(accent, 0.25),
      ),
    ),
  );
  yield* all(response.reveal(1, 0.4), responseLabel.opacity(1, 0.3));
  yield* response.travel(0.6);
  yield* all(response.arrive(), loading.opacity(0, 0.15));
  loading.remove();
  yield* sequence(
    0.12,
    ...products.map((row, i) => all(row.opacity(1, 0.25), row.y(18 + i * 116, 0.3, easeOutCubic))),
  );
  yield* resultCount.opacity(1, 0.2);
  return root;
}
