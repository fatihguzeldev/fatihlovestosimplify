import {Circle, Layout, Path} from '@motion-canvas/2d';
import {accent, background, foreground, ink, muted, text} from './drawing';

export function role(name: string, detail: string, style: number) {
  const root = new Layout({opacity: 0});
  const person = new Layout({position: [-145, -2]});
  person.add([
    new Circle({position: [0, -15], size: [43, 48], stroke: foreground, lineWidth: 2.4, fill: background}),
    new Path({...ink, stroke: accent, lineWidth: 2.6, data: 'M -37 38 Q -32 10 -4 13 Q 27 8 37 37 M -20 17 L -7 31 L 8 15'}),
    new Path({...ink, lineWidth: 1.8, data: 'M -10 -13 L -9 -10 M 9 -13 L 10 -10 M -4 1 Q 1 5 6 0'}),
    new Path({...ink, fill: '#182638', data: [
      'M -22 -21 L -22 -35 L -11 -42 L -6 -37 L 3 -44 L 17 -36 L 22 -20 L 13 -27 L 5 -22 L -3 -29 L -14 -22 Z',
      'M -22 -7 Q -34 -41 -5 -44 Q 29 -46 26 -11 L 18 -27 Q 0 -25 -11 -33 L -16 -9 Z',
      'M -23 -20 Q -34 -34 -19 -37 Q -20 -50 -8 -43 Q 2 -54 10 -42 Q 24 -47 24 -32 Q 34 -24 21 -16 L 14 -28 L 4 -23 L -6 -29 Z',
    ][style]}),
  ]);
  root.add([
    person,
    text(name, 25, {position: [-87, -17], offset: [-1, 0]}),
    text(detail, 21, {position: [-87, 20], offset: [-1, 0], fill: muted}),
  ]);
  return root;
}
