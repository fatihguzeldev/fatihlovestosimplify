import {Layout, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {
  all,
  Color,
  createSignal,
  easeInOutCubic,
  linear,
  waitUntil,
} from '@motion-canvas/core';
import {theme} from '../../theme';

const {background, foreground, accent} = theme.colors;
const left = -960 + 1920 * theme.spacing.xl / 100;

export function* showCompute(view: View2D) {
  const comparison = new Layout({opacity: 0});
  const title = new Txt({
    position: [left, -330],
    offset: [-1, 0],
    fontFamily: theme.fontFamily.sans,
    fontSize: 100,
    fontWeight: 500,
    letterSpacing: -2,
    fill: foreground,
    textWrap: false,
    children: [
      new Txt({text: 'compute', fill: accent, fontStyle: 'italic'}),
      new Txt({text: '-intensive'}),
    ],
  });
  const caption = new Txt({
    text: 'bir görüntü\noluşturalım.',
    position: [left, -75],
    offset: [-1, 0],
    fontFamily: theme.fontFamily.sans,
    fontSize: 58,
    lineHeight: '125%',
    fill: foreground,
    textWrap: false,
  });
  const detail = new Txt({
    text: 'her pikselin rengini hesaplıyoruz.',
    position: [left, 110],
    offset: [-1, 0],
    fontFamily: theme.fontFamily.sans,
    fontSize: 34,
    fill: accent,
    textWrap: false,
  });
  const image = new Layout({position: [430, 50]});
  const side = 28;
  const half = side / 2;
  const pixelSize = 20;
  const tileSize = half * pixelSize;
  const serial = createSignal(0);
  const uncalculated = Color.lerp(background, foreground, 0.065);
  const imageBackground = Color.lerp(background, foreground, 0.025);
  const frame = new Rect({
    size: side * pixelSize + 8,
    stroke: foreground,
    lineWidth: 1,
    opacity: 0.25,
  });
  image.add(frame);

  const regions = Array.from({length: 4}, (_, regionIndex) => {
    const column = regionIndex % 2;
    const row = Math.floor(regionIndex / 2);
    const x = (column - 0.5) * tileSize;
    const y = (row - 0.5) * tileSize;
    const tile = new Layout({position: [x, y]});
    const progress = createSignal(0);
    const border = new Rect({
      size: tileSize + 6,
      stroke: accent,
      lineWidth: 2,
      opacity: 0,
    });

    for (let index = 0; index < half * half; index++) {
      const pixelColumn = index % half;
      const pixelRow = Math.floor(index / half);
      const globalColumn = column * half + pixelColumn;
      const globalRow = row * half + pixelRow;
      const nx = ((globalColumn + 0.5) / side * 2 - 1) / 0.83;
      const ny = ((globalRow + 0.5) / side * 2 - 1 + 0.08) / 0.83;
      const radiusSquared = nx * nx + ny * ny;
      let color = imageBackground;

      if (radiusSquared <= 1) {
        const nz = Math.sqrt(1 - radiusSquared);
        const diffuse = Math.max(0, -0.6 * nx - 0.6 * ny + 0.529 * nz);
        const highlight = Math.pow(Math.max(0, -0.343 * nx - 0.343 * ny + 0.875 * nz), 28);
        color = Color.lerp(background, accent, 0.12 + 0.82 * diffuse)
          .lerp(foreground, 0.5 * highlight);
      }

      tile.add(new Rect({
        position: [
          (pixelColumn - (half - 1) / 2) * pixelSize,
          (pixelRow - (half - 1) / 2) * pixelSize,
        ],
        size: pixelSize - 0.5,
        fill: () => globalRow * side + globalColumn < serial() || index < progress()
          ? color
          : uncalculated,
      }));
    }

    tile.add(border);
    image.add(tile);
    return {tile, border, progress, x, y, row};
  });

  comparison.add([title, caption, detail, image]);
  view.add(comparison);
  yield* comparison.opacity(1, 0.6);
  yield* serial(side * 9, 2.2, linear);

  yield* waitUntil('parallel-computation');
  yield* all(caption.opacity(0, 0.2), detail.opacity(0, 0.2));
  caption.text('farklı bölgeleri\naynı anda hesaplayabiliriz.');
  caption.fontSize(48);
  detail.text('bu görüntünün her bölgesi bağımsız.');
  detail.fontSize(30);
  for (const region of regions) {
    region.progress(region.row === 0 ? half * 9 : 0);
  }
  yield* all(
    frame.opacity(0, 0.3),
    ...regions.map(({tile, border, x, y}) => all(
      tile.position([x + Math.sign(x) * 18, y + Math.sign(y) * 18], 0.65, easeInOutCubic),
      border.opacity(0.75, 0.5),
    )),
  );
  yield* all(caption.opacity(1, 0.4), detail.opacity(1, 0.4));
  yield* all(...regions.map(({progress}) => progress(half * half, 3, linear)));
  yield* all(
    ...regions.map(({tile, border, x, y}) => all(
      tile.position([x, y], 0.85, easeInOutCubic),
      border.opacity(0, 0.65),
    )),
    frame.opacity(0.25, 0.85),
  );
  return comparison;
}
