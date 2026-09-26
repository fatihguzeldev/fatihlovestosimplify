import { Circle, Layout, Path } from '@motion-canvas/2d';
import { accent, background, foreground, ink, paper } from '../shared/drawing';

export function storefront() {
  const root = new Layout({});
  root.add([
    new Path({ ...ink, fill: '#17222d', data: 'M -37 -6 L -36 35 L 38 34 L 37 -7 Z' }),
    new Path({ ...ink, fill: background, data: 'M -40 -19 L -32 -38 L 32 -36 L 42 -18 Z' }),
    new Path({
      ...ink,
      fill: accent,
      data: 'M -40 -19 L -40 -7 Q -30 4 -20 -7 Q -10 4 0 -7 Q 10 4 21 -7 Q 31 4 42 -8 L 42 -18 Z',
    }),
    new Path({ ...ink, lineWidth: 2, data: 'M -20 -18 L -20 -7 M 0 -18 L 0 -7 M 21 -18 L 21 -7' }),
    new Path({
      ...ink,
      lineWidth: 2.3,
      fill: background,
      data: 'M -25 7 L -6 7 L -7 35 L -25 35 Z M 5 7 L 28 8 L 28 22 L 5 22 Z',
    }),
    new Path({
      ...ink,
      lineWidth: 2,
      stroke: accent,
      data: 'M 10 18 L 18 10 M 21 20 L 27 14 M -14 -29 Q 0 -32 14 -29',
    }),
    new Path({ ...ink, opacity: 0.4, lineWidth: 2, data: 'M -46 41 Q -8 39 46 41' }),
  ]);
  return root;
}

export function home() {
  const root = new Layout({});
  root.add([
    new Path({ ...ink, fill: '#17222d', data: 'M -32 -4 L -32 35 L 31 34 L 33 -7 Z' }),
    new Path({
      ...ink,
      fill: background,
      data: 'M 16 -27 L 16 -41 L 27 -40 L 27 -18 M -43 -8 L -2 -44 L 43 -8 L 34 0 L -2 -29 L -34 1 Z',
    }),
    new Path({
      ...ink,
      lineWidth: 2.3,
      fill: background,
      data: 'M -22 35 L -22 9 L -3 8 L -3 35 M 9 5 L 25 5 L 25 20 L 9 20 Z M 17 5 L 17 20 M 9 12 L 25 12',
    }),
    new Path({
      ...ink,
      stroke: accent,
      lineWidth: 2.4,
      data: 'M -29 -12 L -3 -34 M 6 -23 L 26 -7 M 10 29 L 18 22 M 22 30 L 29 24',
    }),
    new Circle({ position: [-8, 23], size: 3, fill: accent }),
    new Path({ ...ink, opacity: 0.4, lineWidth: 2, data: 'M -42 41 Q 0 38 44 40' }),
  ]);
  return root;
}

export function deliveryPair() {
  const root = new Layout({});
  const shop = storefront();
  const house = home();
  shop.position([-168, -3]);
  house.position([168, -3]);
  root.add([
    new Path({
      ...ink,
      opacity: 0.6,
      lineWidth: 2.5,
      lineDash: [6, 9],
      data: 'M -109 11 C -75 25 -67 -30 -32 -19 S 41 38 69 7 Q 87 -12 111 10',
    }),
    shop,
    house,
    new Path({
      ...ink,
      position: [3, -7],
      rotation: -8,
      fill: '#182638',
      data: 'M -21 -14 L 0 -24 L 22 -14 L 22 16 L 0 26 L -21 14 Z M -21 -14 L 0 -3 L 22 -14 M 0 -3 L 0 26 M -11 -19 L 11 -8 L 11 2',
    }),
    new Path({
      ...ink,
      stroke: accent,
      lineWidth: 2.5,
      data: 'M -39 -15 L -53 -14 M -37 -2 L -47 -1 M 32 27 L 43 28',
    }),
  ]);
  return root;
}

export function deliveryMap() {
  const map = paper(340, 300, '#101519');
  for (const [x, y, rotation] of [
    [-54, -42, -3],
    [57, -40, 2],
    [-52, 49, 2],
    [58, 51, -2],
  ]) {
    map.root.add(
      new Path({
        ...ink,
        position: [x, y],
        rotation,
        stroke: '#526170',
        fill: '#19232d',
        lineWidth: 1.6,
        data: 'M -34 -26 L 34 -25 L 33 27 L -33 26 Z M -24 -16 L 22 -16 M 23 -16 L 23 16',
      }),
    );
  }
  const path =
    'M -126 70 Q -131 -7 -127 -84 C -126 -109 -87 -103 -70 -104 L 105 -102 Q 129 -102 124 -81 L 125 70';
  map.root.add(new Path({ ...ink, stroke: '#28394b', lineWidth: 15, data: path }));
  const route = new Path({ ...ink, stroke: accent, lineWidth: 5, data: path, end: 0 });
  const shop = storefront();
  const house = home();
  shop.position([-125, 105]);
  house.position([125, 105]);
  shop.scale(0.65);
  house.scale(0.65);
  const traffic = new Layout({ opacity: 0 });
  [-57, 0, 57].forEach((x, index) => {
    const car = new Layout({ position: [x, -103], rotation: index === 1 ? -3 : 2 });
    car.add([
      new Path({
        ...ink,
        lineWidth: 1.8,
        fill: '#13191f',
        data: 'M -19 5 L -19 -4 L -11 -5 L -5 -14 L 7 -14 L 13 -5 L 21 -2 L 21 5 Z',
      }),
      new Path({
        stroke: accent,
        lineWidth: 2,
        data: 'M -8 -6 L -4 -11 L 5 -11 L 9 -6 M -14 0 L -3 0 M 3 0 L 15 0',
      }),
      ...[-11, 13].map(
        (wheel) =>
          new Circle({
            position: [wheel, 6],
            size: 8,
            fill: '#13191f',
            stroke: foreground,
            lineWidth: 1.8,
          }),
      ),
    ]);
    traffic.add(car);
  });
  map.root.add([route, shop, house, traffic]);
  return { root: map.root, route, traffic };
}
