import { Layout, Path, type View2D } from '@motion-canvas/2d';
import { all, easeOutCubic, waitUntil } from '@motion-canvas/core';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, foreground, heading, ink, muted, paper, text } from '../shared/drawing';
import { createMarket } from '../shared/market';
import { deliveryMap, deliveryPair, home, storefront } from './delivery';

export function* showCache(view: View2D) {
  const root = new Layout({ opacity: 0 });
  const title = heading('bir daha sorulursa, cevabımız ', 'hazır olsun.');
  const market = createMarket();
  market.body.removeChildren();
  market.root.position([-600, 85]);
  market.root.scale(0.66);
  market.label.fontSize(() => 28 / market.root.scale.x());
  market.label.position(() => [0, -235 - 40 / market.root.scale.x()]);
  market.label.offset([0, 0]);
  market.label.fill(foreground);
  const delivery = deliveryPair();
  delivery.y(-51);
  const estimate = text('18 dk', 62, { position: [0, 123], fill: accent, opacity: 0 });
  market.body.add([
    text('teslimat', 31, { position: [-270, -147], offset: [-1, 0], fontWeight: 500 }),
    delivery,
    text('market', 28, { position: [-168, 8] }),
    text('ev', 28, { position: [168, 8] }),
    new Path({ ...ink, opacity: 0.2, lineWidth: 1.5, data: 'M -266 48 L 266 47' }),
    text('tahmini süre', 27, { y: 78, fill: muted }),
    estimate,
  ]);
  const calculation = new Layout({ position: [0, 85] });
  const map = deliveryMap();
  const { route, traffic } = map;
  const calculationResult = text('18 dk', 36, {
    y: 196,
    fontFamily: theme.fontFamily.mono,
    fill: accent,
    opacity: 0,
  });
  calculation.add([
    map.root,
    text('calculateETA()', 28, { y: -195, fontFamily: theme.fontFamily.mono }),
    calculationResult,
  ]);
  const cache = paper(350, 300, '#101519');
  cache.root.position([590, 85]);
  const cacheLabel = text('cache', 30, { y: -195 });
  cacheLabel.fontSize(() => 30 / cache.root.scale.x());
  cache.face.data(
    'M -175 -147 L -73 -147 L -59 -165 L 36 -163 L 50 -147 L 175 -147 L 173 150 Q 0 153 -174 149 Z',
  );
  const slot = new Path({
    ...ink,
    opacity: 0.22,
    lineWidth: 2,
    lineDash: [7, 9],
    data: 'M -140 -117 L 138 -116 L 139 116 L -138 118 Z',
  });
  const ticket = new Layout({ opacity: 0, y: -22, rotation: -4 });
  const cachedValue = text('18 dk', 50, {
    position: [26, 43],
    fontFamily: theme.fontFamily.mono,
    fill: accent,
  });
  const cacheShop = storefront();
  const cacheHome = home();
  cacheShop.position([-86, -67]);
  cacheHome.position([86, -67]);
  cacheShop.scale(0.52);
  cacheHome.scale(0.52);
  ticket.add([
    new Path({
      ...ink,
      fill: '#17222d',
      lineWidth: 2.3,
      data: 'M -145 -123 L 108 -126 L 143 -90 L 140 121 L 121 114 L 103 123 L 83 115 L 63 124 L 44 117 L 23 125 L 2 117 L -18 124 L -39 117 L -60 125 L -81 118 L -103 125 L -124 117 L -143 123 Z M 108 -126 L 107 -88 L 143 -90',
    }),
    cacheShop,
    cacheHome,
    new Path({
      ...ink,
      stroke: accent,
      opacity: 0.7,
      lineWidth: 2,
      lineDash: [4, 6],
      data: 'M -47 -65 Q -22 -79 0 -65 T 48 -65',
    }),
    text('market', 21, { position: [-86, -26] }),
    text('ev', 21, { position: [86, -26] }),
    new Path({ ...ink, opacity: 0.2, lineWidth: 1.5, data: 'M -120 -5 L 121 -6' }),
    new Path({
      ...ink,
      stroke: accent,
      lineWidth: 2.5,
      x: -15,
      data: 'M -82 18 C -117 13 -119 67 -83 68 C -48 69 -45 15 -82 18 M -83 28 L -83 45 L -70 49 M -91 11 L -77 10',
    }),
    cachedValue,
    new Path({
      ...ink,
      stroke: accent,
      lineWidth: 2,
      opacity: 0.6,
      data: 'M 94 91 L 105 78 M 108 93 L 120 79 M 122 93 L 132 81',
    }),
  ]);
  cache.root.add([
    cacheLabel,
    slot,
    ticket,
    new Path({
      ...ink,
      fill: '#101519',
      lineWidth: 2.3,
      data: 'M -175 112 L -48 116 L -34 135 L 37 133 L 50 114 L 173 111 L 173 150 Q 0 153 -174 149 Z',
    }),
  ]);
  const compute = cartoonArrow('s02-calculate-route', [-354, 90], [-205, 90], accent, 0);
  const save = cartoonArrow('s02-cache-save', [211, 90], [385, 90], accent, 0);
  const computeLabel = text('kaç dakika?', 25, {
    position: compute.pointAt(0.5).addY(-86),
    opacity: 0,
  });
  const saveLabel = text('set()', 25, {
    position: save.pointAt(0.5).addY(-86),
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  root.add([
    title,
    market.root,
    calculation,
    cache.root,
    compute.root,
    save.root,
    computeLabel,
    saveLabel,
  ]);
  view.add(root);
  yield* root.opacity(1, 0.5);
  yield* all(compute.reveal(1, 0.4), computeLabel.opacity(1, 0.3));
  yield* compute.travel(0.5);
  yield* all(compute.arrive(), route.end(1, 1.4));
  yield* calculationResult.opacity(1, 0.25);
  yield* waitUntil('cache-store');
  yield* all(save.reveal(1, 0.4), saveLabel.opacity(1, 0.3));
  yield* save.travel(0.5);
  slot.opacity(0);
  yield* all(
    save.arrive(),
    ticket.opacity(1, 0.15),
    ticket.y(0, 0.4, easeOutCubic),
    ticket.rotation(-1, 0.4, easeOutCubic),
    estimate.opacity(1, 0.25),
    cache.face.stroke(accent, 0.15).to(foreground, 0.25),
  );

  yield* waitUntil('cache-hit');
  yield* all(
    title.opacity(0, 0.2),
    calculation.opacity(0, 0.3),
    compute.root.opacity(0, 0.3),
    save.root.opacity(0, 0.3),
    computeLabel.opacity(0, 0.2),
    saveLabel.opacity(0, 0.2),
    estimate.opacity(0, 0.3),
  );
  title.children(heading('bu kez sonucu ', 'cache’ten', ' alalım.').children());
  yield* all(
    market.root.position([-480, 95], 0.65),
    market.root.scale(0.82, 0.65),
    cache.root.position([430, 95], 0.65),
    cache.root.scale(1.2, 0.65),
  );
  const lookup = cartoonArrow('s02-cache-lookup', [-180, 45], [185, 45], accent, 0);
  const hit = cartoonArrow('s02-cache-hit', [185, 195], [-180, 195], accent, 0);
  const lookupLabel = text('get()', 25, {
    position: lookup.pointAt(0.5).addY(-65),
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  root.add([lookup.root, hit.root, lookupLabel]);
  yield* all(title.opacity(1, 0.3), lookup.reveal(1, 0.4), lookupLabel.opacity(1, 0.3));
  yield* lookup.travel(0.5);
  yield* all(
    lookup.arrive(),
    cache.face.stroke(accent, 0.1).to(foreground, 0.3),
    ticket.y(-9, 0.16).to(0, 0.2),
    hit.reveal(1, 0.3),
  );
  yield* hit.travel(0.5);
  yield* all(hit.arrive(), estimate.opacity(1, 0.25));
  return {
    root,
    title,
    market,
    calculation,
    calculationResult,
    route,
    traffic,
    cache,
    cachedValue,
    lookup,
    hit,
    lookupLabel,
  };
}
