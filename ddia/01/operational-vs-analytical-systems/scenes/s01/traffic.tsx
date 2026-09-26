import {Circle, Layout, Path, Txt, View2D} from '@motion-canvas/2d';
import {all, delay, linear, waitFor} from '@motion-canvas/core';
import {theme} from '../../theme';
import {cartoonArrow} from './arrow';
import {cartoonDatabase, cartoonService} from './cartoon-system';

const {accent, foreground} = theme.colors;

export function* showQueryRate(view: View2D) {
  const root = new Layout({opacity: 0});
  const serviceScale = 0.88;
  const phoneRight = -456;
  const databaseLeft = 505;
  const serviceWidth = 286 * serviceScale;
  const gap = (databaseLeft - phoneRight - serviceWidth) / 2;
  const serviceLeft = phoneRight + gap;
  const serviceRight = serviceLeft + serviceWidth;
  const arrowInset = 32;
  const requestCenter = (phoneRight + serviceLeft) / 2;
  const queryCenter = (serviceRight + databaseLeft) / 2;
  const {root: service, lights, caption} = cartoonService('mesaj servisi', accent);
  service.position([serviceLeft + 144 * serviceScale, 150]);
  service.scale(serviceScale);
  caption.y(153 / serviceScale);
  caption.fontSize(28 / serviceScale);
  root.add(service);

  const {root: database, top: databaseTop} = cartoonDatabase('database', accent);
  database.position([620, 150]);
  root.add(database);

  const requestArrow = cartoonArrow('s01-request', [phoneRight + arrowInset, 110], [serviceLeft - arrowInset, 110], accent);
  const queryArrow = cartoonArrow('s01-query', [serviceRight + arrowInset, 110], [databaseLeft - arrowInset, 110], accent);
  root.add([
    requestArrow.root, queryArrow.root,
    new Txt({text: 'request', position: [requestCenter, 63], fontFamily: theme.fontFamily.sans, fontSize: 27, fill: foreground}),
    new Txt({text: 'getMessages()', position: [requestCenter, 169], fontFamily: theme.fontFamily.mono, fontSize: 26, fill: foreground}),
    new Txt({text: 'query', position: [queryCenter, 63], fontFamily: theme.fontFamily.sans, fontSize: 27, fill: accent}),
  ]);

  const meter = new Layout({position: [queryCenter, -67]});
  const clock = new Layout({x: -102});
  const ring = 'M 0 -36 C 20 -38 38 -21 37 0 C 39 20 20 37 0 36 C -21 38 -38 20 -36 0 C -38 -20 -20 -38 0 -36';
  clock.add(new Path({data: ring, stroke: foreground, opacity: 0.2, lineWidth: 2, lineCap: 'round'}));
  const progress = new Path({data: ring, stroke: accent, lineWidth: 3, lineCap: 'round', end: 0});
  progress.opacity(() => progress.end() > 0 ? 1 : 0);
  const arrivals = new Layout({});
  clock.add([
    progress,
    new Txt({text: '1s', fontFamily: theme.fontFamily.mono, fontSize: 22, fill: foreground}),
    arrivals,
  ]);
  const rate = new Txt({text: '1', fontFamily: theme.fontFamily.mono, fontSize: 58, fill: accent});
  const value = new Layout({layout: true, gap: 8, alignItems: 'baseline', position: [31, -9]});
  value.add([rate, new Txt({text: 'QPS', fontFamily: theme.fontFamily.sans, fontSize: 32, fill: accent})]);
  meter.add([
    clock, value,
    new Txt({text: 'queries / second', position: [31, 39], fontFamily: theme.fontFamily.sans, fontSize: 21, fill: foreground}),
  ]);
  root.add(meter);
  view.add(root);
  yield* root.opacity(1, 0.4);

  const requestTravel = 0.22;
  const queryTravel = 0.38;
  const arrivalsBegin = requestTravel + queryTravel;

  function* fetchMessages(index: number, offset: number) {
    yield* requestArrow.travel(requestTravel);
    yield* all(
      requestArrow.arrive(),
      lights[index % lights.length].opacity(1, 0.05).to(0.65, 0.15),
      queryArrow.travel(queryTravel),
    );
    arrivals.add(new Circle({position: progress.getPointAtPercentage(offset).position.scale(1.28), size: 8, fill: accent}));
    yield* all(queryArrow.arrive(), databaseTop.stroke(accent, 0.04).to(foreground, 0.16));
  }

  yield* all(delay(arrivalsBegin, progress.end(1, 1, linear)), fetchMessages(0, 0));
  yield* waitFor(0.65);
  yield* meter.opacity(0, 0.15);
  rate.text('4');
  progress.end(0);
  arrivals.removeChildren();
  yield* meter.opacity(1, 0.15);
  yield* all(
    delay(arrivalsBegin, progress.end(1, 1, linear)),
    ...[0, 0.25, 0.5, 0.75].map((offset, i) => delay(offset, fetchMessages(i, offset))),
  );
  yield* waitFor(0.5);
  return {root, service};
}
