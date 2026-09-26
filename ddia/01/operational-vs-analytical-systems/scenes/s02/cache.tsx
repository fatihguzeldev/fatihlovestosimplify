import {Circle, Layout, Path, Rect, type View2D} from '@motion-canvas/2d';
import {all, waitUntil} from '@motion-canvas/core';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {theme} from '../../theme';
import {accent, foreground, heading, ink, muted, paper, text} from '../shared/drawing';
import {createMarket} from '../shared/market';

export function* showCache(view: View2D) {
  const root = new Layout({opacity: 0});
  const title = heading('bu hesabı ', 'tekrar yapmayalım.');
  const market = createMarket();
  market.body.removeChildren();
  market.root.position([-600, 95]);
  market.root.scale(0.58);
  const estimate = text('—', 64, {position: [0, 86], fill: accent, opacity: 0});
  market.body.add([
    text('teslimat', 40, {y: -117}),
    text('A → B', 64, {y: -36, fontFamily: theme.fontFamily.mono}),
    estimate,
  ]);
  const calculation = new Layout({position: [0, 85]});
  const map = paper(310, 248);
  for (const [x, y] of [[-62, -39], [55, -39], [-62, 51], [55, 51]]) {
    map.root.add(new Rect({position: [x, y], size: [72, 53], radius: 5, stroke: foreground, lineWidth: 1.5, opacity: 0.2}));
  }
  const route = new Path({data: 'M -113 74 L -113 -83 Q -113 -95 -99 -95 L 106 -93 L 110 74', stroke: accent, lineWidth: 5, lineJoin: 'round', end: 0});
  const traffic = new Layout({opacity: 0});
  [-53, 1, 55].forEach((x, i) => {
    const car = new Layout({position: [x, -90], rotation: i === 1 ? -3 : 2});
    car.add([
      new Path({...ink, lineWidth: 1.8, fill: '#13191f', data: 'M -19 5 L -19 -4 L -11 -5 L -5 -14 L 7 -14 L 13 -5 L 21 -2 L 21 5 Z'}),
      new Path({stroke: accent, lineWidth: 2, data: 'M -8 -6 L -4 -11 L 5 -11 L 9 -6 M -14 0 L -3 0 M 3 0 L 15 0'}),
      ...[-11, 13].map(wheel => new Circle({position: [wheel, 6], size: 8, fill: '#13191f', stroke: foreground, lineWidth: 1.8})),
    ]);
    traffic.add(car);
  });
  map.root.add([
    route,
    traffic,
    ...[-113, 110].map(x => new Circle({position: [x, 74], size: 12, fill: accent})),
    text('A', 22, {position: [-113, 102], fontFamily: theme.fontFamily.mono}),
    text('B', 22, {position: [110, 102], fontFamily: theme.fontFamily.mono}),
  ]);
  calculation.add([map.root, text('calculateETA()', 24, {y: -168, fontFamily: theme.fontFamily.mono})]);
  const cache = paper(340, 242, '#13191f');
  cache.root.position([570, 85]);
  const cachedValue = text('—', 62, {y: 30, fill: muted});
  cache.root.add([
    text('cache', 36, {y: -166}),
    text('eta:A→B', 26, {y: -60, fontFamily: theme.fontFamily.mono, fill: accent}),
    new Path({...ink, opacity: 0.22, lineWidth: 1.5, data: 'M -141 -23 L 141 -23'}),
    cachedValue,
  ]);
  const compute = cartoonArrow('s02-calculate-route', [-386, 90], [-184, 90], accent, 0);
  const save = cartoonArrow('s02-cache-save', [192, 90], [368, 90], accent, 0);
  const computeLabel = text('A → B', 25, {position: compute.pointAt(0.5).addY(-88), fontFamily: theme.fontFamily.mono, opacity: 0});
  const saveLabel = text('set()', 25, {position: save.pointAt(0.5).addY(-88), fontFamily: theme.fontFamily.mono, opacity: 0});
  root.add([title, market.root, calculation, cache.root, compute.root, save.root, computeLabel, saveLabel]);
  view.add(root);
  yield* root.opacity(1, 0.5);
  yield* all(compute.reveal(1, 0.4), computeLabel.opacity(1, 0.3));
  yield* compute.travel(0.5);
  yield* all(compute.arrive(), route.end(1, 1.4));
  yield* waitUntil('cache-store');
  yield* all(save.reveal(1, 0.4), saveLabel.opacity(1, 0.3));
  yield* save.travel(0.5);
  cachedValue.text('18 dk');
  cachedValue.fill(accent);
  estimate.text('18 dk');
  yield* all(save.arrive(), estimate.opacity(1, 0.25), cache.face.stroke(accent, 0.15).to(foreground, 0.25));

  yield* waitUntil('cache-hit');
  yield* all(
    title.opacity(0, 0.2), calculation.opacity(0, 0.3), compute.root.opacity(0, 0.3), save.root.opacity(0, 0.3),
    computeLabel.opacity(0, 0.2), saveLabel.opacity(0, 0.2), estimate.opacity(0, 0.3),
  );
  title.children(heading('bu kez sonucu ', 'cache’ten', ' alalım.').children());
  yield* all(market.root.position([-480, 95], 0.65), market.root.scale(0.82, 0.65), cache.root.position([430, 95], 0.65));
  const lookup = cartoonArrow('s02-cache-lookup', [-180, 45], [220, 45], accent, 0);
  const hit = cartoonArrow('s02-cache-hit', [220, 195], [-180, 195], accent, 0);
  const lookupLabel = text('get("eta:A→B")', 25, {position: lookup.pointAt(0.5).addY(-65), fontFamily: theme.fontFamily.mono, opacity: 0});
  root.add([lookup.root, hit.root, lookupLabel]);
  yield* all(title.opacity(1, 0.3), lookup.reveal(1, 0.4), lookupLabel.opacity(1, 0.3));
  yield* lookup.travel(0.5);
  yield* all(lookup.arrive(), cache.face.stroke(accent, 0.1).to(foreground, 0.3), hit.reveal(1, 0.3));
  yield* hit.travel(0.5);
  yield* all(hit.arrive(), estimate.opacity(1, 0.25));
  return {root, title, market, calculation, route, traffic, cache, cachedValue, lookup, hit, lookupLabel};
}
