import {Circle, Layout, Path, Txt} from '@motion-canvas/2d';
import {theme} from './theme';

const {background, foreground} = theme.colors;
const ink = {stroke: foreground, lineWidth: 3, lineCap: 'round' as const, lineJoin: 'round' as const};

export function cartoonService(label: string, accent: string) {
  const root = new Layout({});
  root.add(new Path({
    ...ink, fill: background,
    data: 'M -138 -106 L -122 -119 L 142 -113 L 142 95 L 128 110 L -140 116 L -144 -95 Q -143 -105 -138 -106 Z',
  }));
  root.add(new Path({
    ...ink,
    data: 'M -138 -106 L 122 -101 Q 134 -101 132 -86 L 128 110 M 132 -99 L 142 -113',
  }));
  const lights = [-89, -22, 45].map(y => {
    root.add(new Path({
      ...ink, lineWidth: 2,
      data: `M -127 ${y} L 114 ${y + 3} L 112 ${y + 47} L -124 ${y + 49} Z`,
    }));
    const light = new Circle({position: [-103, y + 24], size: [10, 9], fill: accent, opacity: 0.65});
    root.add([
      light,
      new Path({...ink, lineWidth: 1.7, opacity: 0.35, data: `M -79 ${y + 24} L 84 ${y + 26}`}),
    ]);
    return light;
  });
  for (const y of [-88, -60, -30, 1, 31, 61, 85]) {
    root.add(new Path({data: `M 134 ${y + 7} L 140 ${y - 3}`, stroke: accent, opacity: 0.65, lineWidth: 1.4, lineCap: 'round'}));
  }
  const caption = new Txt({text: label, y: 174, fontFamily: theme.fontFamily.sans, fontSize: 32, fill: foreground});
  root.add(caption);
  return {root, lights, caption};
}

export function cartoonDatabase(label: string, accent: string) {
  const root = new Layout({});
  root.add(new Path({
    ...ink, fill: background,
    data: 'M -115 -80 Q -117 2 -113 82 C -109 124 112 121 115 79 Q 117 -3 115 -78 Z',
  }));
  const top = new Path({
    ...ink, fill: background,
    data: 'M -115 -80 C -111 -119 109 -122 115 -78 C 120 -40 -116 -38 -115 -80 Z',
  });
  root.add(top);
  for (const y of [-28, -7, 15, 38, 61, 80]) {
    root.add(new Path({data: `M 96 ${y + 10} Q 103 ${y + 4} 108 ${y - 3}`, stroke: accent, opacity: 0.65, lineWidth: 1.8, lineCap: 'round'}));
  }
  const caption = new Txt({text: label, y: 153, fontFamily: theme.fontFamily.sans, fontSize: 28, fill: foreground});
  root.add(caption);
  return {root, top, caption};
}
