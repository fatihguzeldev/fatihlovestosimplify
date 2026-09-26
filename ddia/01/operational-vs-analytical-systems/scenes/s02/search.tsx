import {Layout, Line, Rect, type View2D} from '@motion-canvas/2d';
import {all, waitUntil} from '@motion-canvas/core';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {theme} from '../../theme';
import {accent, banana, foreground, heading, muted, paper, text} from '../shared/drawing';
import {createMarket} from '../shared/market';

export function* showSearch(view: View2D) {
  const root = new Layout({opacity: 0});
  const title = heading('aradığımız ürünü ', 'bulalım.');
  const market = createMarket();
  market.body.removeChildren();
  market.root.position([-490, 95]);
  market.root.scale(0.9);
  const query = text('', 34, {position: [-246, -96], offset: [-1, 0]});
  const searchBox = new Rect({position: [0, -96], size: [557, 66], radius: 9, stroke: accent, lineWidth: 2, fill: '#18232f'});
  market.body.add([searchBox, query]);
  const products = new Layout({opacity: 0});
  ['muz', 'yerli muz'].forEach((name, i) => {
    const fruit = banana();
    fruit.position([-236, 15 + i * 107]);
    products.add([
      fruit,
      text(name, 34, {position: [-173, 4 + i * 107], offset: [-1, 0]}),
      text(i === 0 ? 'p17' : 'p42', 21, {position: [-173, 43 + i * 107], offset: [-1, 0], fontFamily: theme.fontFamily.mono, fill: muted}),
    ]);
  });
  market.body.add(products);
  const index = paper(440, 330, '#13191f');
  index.root.position([535, 95]);
  const selected = new Rect({position: [0, 4], size: [390, 70], radius: 5, fill: '#1b2d43', opacity: 0});
  index.root.add([
    text('search index', 34, {y: -210}),
    selected,
    text('elma', 30, {position: [-185, -85], offset: [-1, 0], fill: muted}),
    text('p08', 25, {position: [35, -85], offset: [-1, 0], fontFamily: theme.fontFamily.mono, fill: muted}),
    text('muz', 32, {position: [-185, 4], offset: [-1, 0], fill: accent}),
    text('p17, p42', 25, {position: [35, 4], offset: [-1, 0], fontFamily: theme.fontFamily.mono}),
    text('süt', 30, {position: [-185, 93], offset: [-1, 0], fill: muted}),
    text('p23', 25, {position: [35, 93], offset: [-1, 0], fontFamily: theme.fontFamily.mono, fill: muted}),
    new Line({points: [[-7, -133], [-7, 133]], stroke: foreground, opacity: 0.2, lineWidth: 1.5}),
  ]);
  const request = cartoonArrow('s02-product-search', [-163, 35], [280, 35], accent, 0);
  const response = cartoonArrow('s02-search-results', [280, 205], [-163, 205], accent, 0);
  const requestLabel = text('search("muz")', 25, {position: request.pointAt(0.5).addY(-65), fontFamily: theme.fontFamily.mono, opacity: 0});
  const responseLabel = text('p17 · p42', 25, {position: response.pointAt(0.5).addY(66), fontFamily: theme.fontFamily.mono, fill: accent, opacity: 0});
  root.add([title, market.root, index.root, request.root, response.root, requestLabel, responseLabel]);
  view.add(root);
  yield* root.opacity(1, 0.5);
  yield* query.text('muz', 0.55);
  yield* waitUntil('search-results');
  yield* all(request.reveal(1, 0.4), requestLabel.opacity(1, 0.3));
  yield* request.travel(0.6);
  yield* all(request.arrive(), selected.opacity(1, 0.25));
  yield* all(response.reveal(1, 0.4), responseLabel.opacity(1, 0.3));
  yield* response.travel(0.6);
  yield* all(response.arrive(), products.opacity(1, 0.35));
  return root;
}
