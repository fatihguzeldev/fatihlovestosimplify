import {Circle, Layout, Line, Path, Rect, Txt, View2D} from '@motion-canvas/2d';
import {all, delay, linear, waitFor} from '@motion-canvas/core';
import {theme} from '../../theme';

const {accent, foreground, background} = theme.colors;

export function* showQueryRate(view: View2D) {
  const root = new Layout({opacity: 0});
  const service = new Layout({position: [0, 150], scale: 0.88});
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
  service.add(new Txt({text: 'mesaj servisi', y: 153, fontFamily: theme.fontFamily.sans, fontSize: 30, fill: foreground}));
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
    new Txt({text: 'mesaj veritabanı', y: 153, fontFamily: theme.fontFamily.sans, fontSize: 28, fill: foreground}),
  ]);
  root.add(database);

  root.add(new Line({points: [[-455, 110], [-145, 110]], stroke: foreground, opacity: 0.4, lineWidth: 2, endArrow: true, arrowSize: 12}));
  root.add(new Txt({text: 'request', position: [-300, 63], fontFamily: theme.fontFamily.mono, fontSize: 27, fill: foreground}));
  root.add(new Txt({text: 'mesajları getir', position: [-300, 164], fontFamily: theme.fontFamily.sans, fontSize: 25, fill: foreground}));
  root.add(new Line({points: [[145, 110], [498, 110]], stroke: accent, opacity: 0.5, lineWidth: 2, endArrow: true, arrowSize: 12}));
  root.add(new Txt({text: 'query', position: [320, 63], fontFamily: theme.fontFamily.mono, fontSize: 27, fill: accent}));

  const rate = new Txt({text: '1 QPS', position: [320, -70], fontFamily: theme.fontFamily.mono, fontSize: 50, fill: accent});
  root.add([
    rate,
    new Txt({text: 'queries / second', position: [320, -23], fontFamily: theme.fontFamily.sans, fontSize: 23, fill: foreground}),
    new Line({points: [[150, 244], [150, 230], [490, 230], [490, 244]], stroke: foreground, opacity: 0.4, lineWidth: 2}),
    new Txt({text: '1 saniye', position: [320, 281], fontFamily: theme.fontFamily.sans, fontSize: 27, fill: foreground}),
  ]);
  const progress = new Line({points: [[150, 230], [490, 230]], stroke: accent, lineWidth: 4, end: 0});
  root.add(progress);
  view.add(root);
  yield* root.opacity(1, 0.4);

  const requestTravel = 0.22;
  const queryTravel = 0.38;
  const arrivalsBegin = requestTravel + queryTravel;

  function* fetchMessages(index: number) {
    const request = new Rect({position: [-455, 110], size: [24, 12], radius: 3, fill: foreground});
    root.add(request);
    yield* request.x(-145, requestTravel, linear);
    request.remove();
    const query = new Circle({position: [145, 110], size: 16, fill: accent});
    root.add(query);
    yield* all(
      lights[index % lights.length].opacity(1, 0.05).to(0.35, 0.15),
      query.x(498, queryTravel, linear),
    );
    query.remove();
    yield* databaseTop.stroke(accent, 0.04).to(foreground, 0.16);
  }

  yield* all(delay(arrivalsBegin, progress.end(1, 1, linear)), fetchMessages(0));
  yield* waitFor(0.65);
  yield* rate.opacity(0, 0.15);
  rate.text('4 QPS');
  progress.end(0);
  yield* rate.opacity(1, 0.15);
  yield* all(
    delay(arrivalsBegin, progress.end(1, 1, linear)),
    ...[0, 0.25, 0.5, 0.75].map((offset, i) => delay(offset, fetchMessages(i))),
  );
  yield* waitFor(0.5);
  return {root, service};
}
