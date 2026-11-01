import { Layout, Line, Txt } from '@motion-canvas/2d';
import { record, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** The familiar cart stays a brace-shaped JavaScript object throughout the story. */
export function cartGraph(cart: Layout, arrayLabel: string) {
  const root = new Layout({ opacity: 0 });
  const arrayGroup = new Layout({ position: [-420, 0] });
  const array = record(160, 240, 0, 0);
  const arrayName = text(arrayLabel, 0, -185, 34, palette.muted, true);
  const fields = [-60, 60].map((y) => text('cart', 0, y, 36, palette.ink, true));
  const divider = new Line({
    points: [
      [-80, 0],
      [80, 0],
    ],
    stroke: palette.rule,
    lineWidth: 1.5,
  });
  arrayGroup.add([array, divider, arrayName, ...fields]);
  const paths = [-60, 60].map((y) => {
    const path = wire(
      [
        [-340, y],
        [-220, y],
        [-220, 0],
        [-125, 0],
      ],
      palette.muted,
      3,
      false,
    );
    path.radius(12);
    path.end(0);
    path.add(
      new Line({
        points: [
          [-10, -6],
          [0, 0],
          [-10, 6],
        ],
        position: () => path.getPointAtPercentage(path.end()).position,
        rotation: () => path.getPointAtPercentage(path.end()).normal.flipped.perpendicular.degrees,
        opacity: () => Math.min(1, path.end() * 10),
        stroke: () => path.stroke(),
        lineWidth: 3,
        radius: 2,
      }),
    );
    return path;
  });
  const cartName = cart.children()[0] as Txt;
  const objectTerm = cart.children()[1];
  cartName.position([335, -335]);
  cartName.fontSize(34);
  cartName.offset([0, 0]);
  objectTerm.opacity(0);
  cart.position([-175, 150]);
  root.add([arrayGroup, ...paths, cart]);
  return { root, arrayGroup, array, arrayName, fields, paths, cart, cartName };
}

export type CartGraph = ReturnType<typeof cartGraph>;
