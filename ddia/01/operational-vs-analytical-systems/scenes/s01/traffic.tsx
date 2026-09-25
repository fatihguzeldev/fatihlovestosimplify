import {Circle, Layout, Line, Path, Rect, Txt, View2D} from '@motion-canvas/2d';
import {all, delay, linear, waitFor} from '@motion-canvas/core';
import {theme} from '../../theme';

const {accent, foreground, background} = theme.colors;

export function* showRequestRate(view: View2D) {
  const root = new Layout({opacity: 0});
  const service = new Layout({position: [530, 150]});
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

  root.add(new Line({points: [[-455, 90], [386, 90]], stroke: foreground, opacity: 0.28, lineWidth: 2, endArrow: true, arrowSize: 12}));
  root.add(new Txt({text: 'mesajları getir', position: [-15, 40], fontFamily: theme.fontFamily.sans, fontSize: 30, fill: foreground}));
  const rate = new Txt({text: '1 request/s', position: [-15, -43], fontFamily: theme.fontFamily.mono, fontSize: 50, fill: accent});
  root.add(rate);

  root.add(new Line({points: [[-255, 249], [-255, 235], [225, 235], [225, 249]], stroke: foreground, opacity: 0.4, lineWidth: 2}));
  root.add(new Txt({text: '1 saniye', position: [-15, 286], fontFamily: theme.fontFamily.sans, fontSize: 27, fill: foreground}));
  const progress = new Line({points: [[-255, 235], [225, 235]], stroke: accent, lineWidth: 4, end: 0});
  root.add(progress);
  view.add(root);
  yield* root.opacity(1, 0.4);

  function* request(index: number) {
    const packet = new Rect({position: [-455, 90], size: [27, 12], radius: 3, fill: accent});
    root.add(packet);
    yield* packet.x(386, 0.4, linear);
    packet.remove();
    yield* lights[index % lights.length].opacity(1, 0.05).to(0.35, 0.15);
  }

  yield* all(progress.end(1, 1, linear), request(0));
  yield* waitFor(0.45);
  yield* rate.opacity(0, 0.15);
  rate.text('4 request/s');
  progress.end(0);
  yield* rate.opacity(1, 0.15);
  yield* all(
    progress.end(1, 1, linear),
    ...[0, 0.25, 0.5, 0.75].map((offset, i) => delay(offset, request(i))),
  );
  yield* waitFor(0.5);
  return {root, service};
}
