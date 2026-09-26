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
  const searchField = new Layout({ y: -138 });
  const query = text('', 32, { position: [-203, 0], offset: [-1, 0] });
  const placeholder = text('ürün ara', 29, {
    position: [-203, 0],
    offset: [-1, 0],
    fill: muted,
  });
  const searchBox = new Path({
    ...ink,
    stroke: accent,
    lineWidth: 2.2,
    fill: '#18232f',
    data: 'M -262 -35 Q 4 -38 262 -35 Q 277 -35 277 -20 L 276 19 Q 276 35 261 35 L -261 36 Q -277 36 -276 20 L -277 -20 Q -277 -35 -262 -35 Z',
  });
  const cursor = new Path({
    ...ink,
    stroke: accent,
    lineWidth: 2,
    opacity: 0,
    data: 'M -141 -17 L -141 18',
  });
  searchField.add([
    searchBox,
    new Path({
      ...ink,
      stroke: accent,
      lineWidth: 2.6,
      data: 'M -245 -18 C -268 -21 -269 9 -247 9 C -225 10 -223 -16 -245 -18 M -235 8 L -224 20',
    }),
    placeholder,
    query,
    cursor,
  ]);
  market.body.add(searchField);
  const rowPositions = searchProducts.map((_, i) => i * 116);
  const loading = new Layout({ opacity: 0 });
  rowPositions.forEach((y) => {
    loading.add([
      new Rect({ position: [0, y], size: [554, 96], radius: 12, fill: '#13191f' }),
      new Path({
        ...ink,
        lineWidth: 3,
        stroke: '#35414e',
        lineDash: [6, 8],
        data: `M -260 ${y - 31} L -197 ${y - 30} L -198 ${y + 31} L -261 ${y + 30} Z`,
      }),
      new Path({
        ...ink,
        stroke: '#35414e',
        lineWidth: 3,
        data: `M -177 ${y - 17} L 13 ${y - 17} M -177 ${y + 19} L -89 ${y + 20}`,
      }),
    ]);
  });
  const resultCount = text('2 ürün', 22, {
    position: [-277, -73],
    offset: [-1, 0],
    fill: muted,
    opacity: 0,
  });
  const products = searchProducts.map((product, i) => {
    const row = new Layout({ position: [0, rowPositions[i] + 10], opacity: 0 });
    const fruit = banana();
    fruit.position([-229, 0]);
    fruit.scale(0.72);
    fruit.rotation(product.tilt);
    row.add([
      new Rect({ size: [554, 96], radius: 12, fill: '#151c24', stroke: '#2c3946', lineWidth: 1.2 }),
      new Rect({ position: [-229, 0], size: [64, 64], radius: 10, fill: '#202e3d' }),
      fruit,
      text(product.name, 29, { position: [-177, -17], offset: [-1, 0], fontWeight: 500 }),
      text('1 kg', 21, { position: [-177, 19], offset: [-1, 0], fill: muted }),
      text(product.price, 28, {
        position: [190, 0],
        offset: [1, 0],
        fontFamily: theme.fontFamily.mono,
      }),
      new Path({
        ...ink,
        stroke: accent,
        lineWidth: 2,
        fill: '#182638',
        position: [239, 0],
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
    ...products.map((row, i) =>
      all(row.opacity(1, 0.25), row.y(rowPositions[i], 0.3, easeOutCubic)),
    ),
  );
  yield* resultCount.opacity(1, 0.2);
  return root;
}
