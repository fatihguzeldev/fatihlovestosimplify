import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { fileDrawing } from '../../../shared/drawing';
import { arrow, label, palette, panel, replace } from '../../shared/portrait';

function cartGraph(name: string) {
  const root = new Layout({});
  const arrayName = label('array', 0, -300, 44, palette.muted);
  const slots = [-130, 130].map((x) => {
    const face = panel(190, 90, x, -200);
    const value = label('cart', x, -200, 42, palette.ink, true);
    return { face, value };
  });
  const face = panel(650, 190, 0, 80);
  const cartName = label(name, 0, -65, 46);
  const price = label('price: 120', 0, 43, 44, palette.muted, true);
  const quantity = label('quantity: 3', 0, 115, 44, palette.ink, true);
  const paths = [-1, 1].map((side) =>
    arrow([
      [side * 130, -155],
      [side * 130, -110],
      [side * 220, -110],
      [side * 220, -15],
    ]),
  );
  root.add([
    ...paths,
    arrayName,
    ...slots.flatMap((slot) => [slot.face, slot.value]),
    face,
    cartName,
    price,
    quantity,
  ]);
  return { root, arrayName, slots, face, cartName, price, quantity, paths };
}

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(palette.paper);
  const original = cartGraph('cart');
  original.arrayName.opacity(0);
  original.slots.forEach((slot) => {
    slot.face.opacity(0);
    slot.value.opacity(0);
  });
  original.paths.forEach((path) => path.end(0));
  const copied = cartGraph('yeni cart');
  copied.root.y(310);
  copied.root.opacity(0);
  copied.arrayName.text('yeni array');
  copied.paths.forEach((path) => path.end(0));
  const command = label('history.replaceState(…)', 0, -700, 38, palette.accent, true);
  command.opacity(0);
  const operation = label('copied[0].quantity = 4', 0, 600, 38, palette.accent, true);
  operation.opacity(0);
  const history = new Layout({ y: 365, opacity: 0 });
  history.add([fileDrawing(640, 140, 0, 0), label('history kaydı', 0, 0, 44, palette.muted)]);
  const savePath = arrow([
    [0, 190],
    [0, 285],
  ]);
  savePath.opacity(0);
  view.add([original.root, copied.root, command, operation, savePath, history]);

  yield* waitUntil('array');
  yield* all(
    original.arrayName.opacity(1, 0.3),
    ...original.slots.flatMap((slot) => [slot.face.opacity(1, 0.3), slot.value.opacity(1, 0.3)]),
  );

  yield* waitUntil('same-cart');
  yield* all(
    original.face.stroke(palette.accent, 0.3),
    ...original.paths.flatMap((path) => [path.stroke(palette.accent, 0.3), path.end(1, 0.4)]),
  );

  yield* waitUntil('save-history');
  yield* all(command.opacity(1, 0.3), history.opacity(1, 0.3), savePath.opacity(1, 0.3));

  yield* waitUntil('read-history');
  yield* replace(command, 'history.state');
  yield* savePath.opacity(0, 0.15);
  yield* original.root.y(-300, 0.7);
  // Rename only once the same object has reached its new position.
  original.cartName.text('ilk cart');
  original.arrayName.text('ilk array');
  yield* all(
    original.face.stroke(palette.rule, 0.3),
    ...original.paths.map((path) => path.stroke(palette.muted, 0.3)),
  );

  yield* waitUntil('new-array');
  yield* history.opacity(0, 0.25);
  copied.face.opacity(0);
  copied.cartName.opacity(0);
  copied.price.opacity(0);
  copied.quantity.opacity(0);
  yield* copied.root.opacity(1, 0.35);

  yield* waitUntil('new-cart');
  yield* all(
    copied.face.opacity(1, 0.3),
    copied.cartName.opacity(1, 0.3),
    copied.price.opacity(1, 0.3),
    copied.quantity.opacity(1, 0.3),
  );

  yield* waitUntil('shared-copy');
  yield* all(...copied.paths.map((path) => path.end(1, 0.45)));

  yield* waitUntil('change-quantity');
  yield* all(
    operation.opacity(1, 0.25),
    copied.slots[0].face.stroke(palette.accent, 0.25),
    copied.paths[0].stroke(palette.accent, 0.25),
    copied.face.stroke(palette.accent, 0.25),
  );
  yield* replace(copied.quantity, 'quantity: 4');
  copied.quantity.fill(palette.accent);

  yield* waitUntil('read-second');
  yield* replace(operation, 'copied[1].quantity');
  yield* all(
    copied.slots[1].face.stroke(palette.accent, 0.25),
    copied.paths[1].stroke(palette.accent, 0.25),
  );
  yield* waitUntil('second-result');
  yield* replace(operation, 'copied[1].quantity → 4');

  yield* waitUntil('original-unchanged');
  yield* all(
    original.quantity.fill(palette.accent, 0.3),
    original.face.stroke(palette.accent, 0.3),
    command.opacity(0.35, 0.3),
  );
  yield* waitUntil('end');
});
