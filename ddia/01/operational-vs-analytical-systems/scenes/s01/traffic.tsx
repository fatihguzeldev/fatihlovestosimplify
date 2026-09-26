import {Circle, Layout, Line, Path, Rect, Txt, View2D} from '@motion-canvas/2d';
import {all, delay, linear, tween, waitFor} from '@motion-canvas/core';
import {theme} from '../../theme';
import {sketchArrow} from './arrow';

const {accent, foreground, background} = theme.colors;

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
  const service = new Layout({position: [serviceLeft + 142 * serviceScale, 150], scale: serviceScale});
  service.add(new Path({
    data: 'M -139 -108 L 128 -110 Q 144 -110 143 -95 L 141 96 Q 141 110 127 111 L -129 109 Q -142 109 -141 95 Z',
    fill: background,
    stroke: foreground,
    lineWidth: 3,
    lineJoin: 'round',
  }));
  const lights = [-66, 0, 66].map(y => {
    service.add(new Rect({position: [0, y], size: [250, 51], radius: 4, stroke: foreground, lineWidth: 1.5}));
    const light = new Circle({position: [-99, y], size: 9, fill: accent, opacity: 0.35});
    service.add(light);
    service.add(new Line({points: [[-74, y], [76, y]], stroke: foreground, opacity: 0.3, lineWidth: 2}));
    return light;
  });
  service.add(new Txt({text: 'mesaj servisi', y: 153 / serviceScale, fontFamily: theme.fontFamily.sans, fontSize: 28 / serviceScale, fill: foreground}));
  root.add(service);

  const database = new Layout({position: [620, 150]});
  database.add(new Path({
    data: 'M -115 -80 L -115 80 C -115 122 115 122 115 80 L 115 -80 Z',
    fill: background,
    stroke: foreground,
    lineWidth: 3,
  }));
  const databaseTop = new Circle({position: [0, -80], size: [230, 60], fill: background, stroke: foreground, lineWidth: 3});
  database.add([
    databaseTop,
    new Txt({text: 'database', y: 153, fontFamily: theme.fontFamily.sans, fontSize: 28, fill: foreground}),
  ]);
  root.add(database);

  const requestArrow = sketchArrow([phoneRight + arrowInset, 110], [serviceLeft - arrowInset, 110], foreground);
  const queryArrow = sketchArrow([serviceRight + arrowInset, 110], [databaseLeft - arrowInset, 110], accent);
  requestArrow.root.opacity(0.7);
  queryArrow.root.opacity(0.8);
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
    const request = new Rect({position: requestArrow.pointAt(0), size: [24, 12], radius: 3, fill: foreground});
    root.add(request);
    yield* tween(requestTravel, value => request.position(requestArrow.pointAt(value)));
    request.remove();
    const query = new Circle({position: queryArrow.pointAt(0), size: 16, fill: accent});
    root.add(query);
    yield* all(
      lights[index % lights.length].opacity(1, 0.05).to(0.35, 0.15),
      tween(queryTravel, value => query.position(queryArrow.pointAt(value))),
    );
    query.remove();
    arrivals.add(new Circle({position: progress.getPointAtPercentage(offset).position.scale(1.28), size: 8, fill: accent}));
    yield* databaseTop.stroke(accent, 0.04).to(foreground, 0.16);
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
