import { Txt, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { finalCartPose } from '../01-cart-javascript/cart-visuals';
import { text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import { cartGraph } from './cart-graph';
import { historyIntro } from './history-intro';
import { referenceJourney } from './reference-journey';

export default makeScene2D(function* (view) {
  view.fill(palette.surface);
  const page = finalCartPose();
  view.add(page.browser);
  yield loadFonts();

  const intro = historyIntro();
  const history = intro.history;
  view.add([intro.overview, history]);
  page.frame.root.add(intro.navigation);

  yield* waitUntil('browser-navigation');
  yield* intro.navigation.opacity(1, 0.25);

  yield* waitUntil('browser-navigation-end');
  yield* intro.navigation.opacity(0, 0.6);

  // Preserve the preceding pose, then focus on the browser's existing history.
  yield* waitUntil('history-api');
  yield* all(
    page.cart.opacity(0, 0.4),
    page.object.opacity(0, 0.4),
    page.jsName.opacity(0, 0.4),
    page.expression.opacity(0, 0.4),
    page.numericPrice.opacity(0, 0.4),
    page.numericMultiply.opacity(0, 0.4),
    page.numericQuantity.opacity(0, 0.4),
    page.numericResult.opacity(0, 0.4),
    intro.navigation.opacity(0, 0.4),
  );
  yield* intro.show();

  yield* waitUntil('history-list');
  yield* intro.showEntries();

  yield* waitUntil('history-data');
  yield* intro.attachData();

  yield* waitUntil('history-cart');
  yield* all(
    intro.focusCart(),
    page.cart.opacity(1, 0.6),
    page.object.opacity(1, 0.6),
    page.jsName.opacity(1, 0.6),
  );

  yield* waitUntil('copy-question');
  yield* all(
    page.cart.opacity(0, 0.6),
    page.expression.opacity(0, 0.6),
    page.numericPrice.opacity(0, 0.6),
    page.numericMultiply.opacity(0, 0.6),
    page.numericQuantity.opacity(0, 0.6),
    page.numericResult.opacity(0, 0.6),
    page.frame.root.opacity(0, 0.6),
    page.jsName.opacity(0, 0.6),
  );
  const originalCart = page.object;
  originalCart.reparent(view);
  const originalPosition = originalCart.position();
  const cartName = originalCart.children()[0] as Txt;
  const originalNamePosition = cartName.position();
  const originalNameOffset = cartName.offset();
  const originalNameFontSize = cartName.fontSize();
  const objectTerm = originalCart.children()[1];
  const originalTermOpacity = objectTerm.opacity();
  const source = cartGraph(originalCart, '[cart, cart]');
  source.root.opacity(1);
  source.arrayGroup.opacity(0);
  // Adopt the graph's final pose without changing the visible cart between frames.
  originalCart.position(originalPosition);
  cartName.position(originalNamePosition);
  cartName.offset(originalNameOffset);
  cartName.fontSize(originalNameFontSize);
  objectTerm.opacity(originalTermOpacity);
  view.add(source.root);
  yield* all(
    originalCart.position([-175, 150], 1),
    source.root.position([30, 0], 1),
    source.root.scale(1.2, 1),
    history.position([0, 270], 1),
    cartName.position([335, -335], 1),
    cartName.fontSize(34, 1),
    cartName.offset([0, 0], 1),
    objectTerm.opacity(0, 0.35),
    (originalCart.children()[2] as Txt).x(80, 1),
    (originalCart.children()[2] as Txt).fontSize(140, 1),
    (originalCart.children()[3] as Txt).x(530, 1),
    (originalCart.children()[3] as Txt).fontSize(140, 1),
    page.priceProperty.position([180, -210], 1),
    page.priceProperty.fontSize(36, 1),
    page.priceValue.position([410, -210], 1),
    page.priceValue.fontSize(36, 1),
    page.quantityProperty.position([180, -90], 1),
    page.quantityProperty.fontSize(36, 1),
    page.objectQuantity.position([410, -90], 1),
    page.objectQuantity.fontSize(36, 1),
  );
  const copiedCart = originalCart.clone();
  const copy = cartGraph(copiedCart, 'copied');
  copy.cartName.text('yeni cart');
  const copyQuantity = copiedCart.children()[7] as Txt;
  view.add(copy.root);

  yield* waitUntil('show-array');
  yield* source.arrayGroup.opacity(1, 0.5);

  yield* waitUntil('first-link');
  yield* all(source.fields[0].fill(palette.accent, 0.2), source.paths[0].end(1, 0.6));
  yield* source.fields[0].fill(palette.ink, 0.25);

  yield* waitUntil('two-links');
  yield* all(source.fields[1].fill(palette.accent, 0.2), source.paths[1].end(1, 0.6));
  yield* source.fields[1].fill(palette.ink, 0.25);

  const api = text('', 0, -350, 32, palette.accent, true);
  const writing = wire(
    [
      [-411, 86],
      [-411, 270],
      [-160, 270],
    ],
    palette.accent,
    3,
  );
  writing.radius(12);
  writing.end(0);
  const reading = wire(
    [
      [0, 200],
      [0, 128],
    ],
    palette.accent,
    3,
  );
  reading.radius(12);
  reading.end(0);
  view.add([writing, reading, api]);

  yield* waitUntil('write-history');
  api.text('history.replaceState([cart, cart], "")');
  yield* all(source.root.position([30, -40], 0.8), source.root.scale(1.05, 0.8), intro.writeCart());
  yield* writing.end(1, 0.9);
  yield* writing.opacity(0, 0.5);

  yield* waitUntil('read-history');
  api.text('const copied = history.state');

  yield* waitUntil('isolate-original');
  yield* all(
    source.arrayGroup.opacity(0, 0.5),
    ...source.paths.map((path) => path.opacity(0, 0.5)),
  );
  yield* all(source.root.position([-702, 0], 0.8), source.root.scale(0.95, 0.8));
  cartName.text('ilk cart');
  // The comparison uses one heading baseline, body centerline, and cart scale.
  copy.root.position([399, 0]);
  copy.root.scale(0.95);
  copy.arrayName.fill(palette.ink);
  copy.cart.opacity(0);
  copy.fields.forEach((field) => field.text(''));

  yield* waitUntil('copy-array');
  yield* all(reading.end(1, 0.6), copy.root.opacity(1, 0.45));

  yield* waitUntil('copy-cart');
  yield* copy.cart.opacity(1, 0.5);

  yield* waitUntil('copy-first-link');
  copy.fields[0].text('cart');
  yield* copy.paths[0].end(1, 0.6);

  yield* waitUntil('copy-shared');
  copy.fields[1].text('cart');
  yield* copy.paths[1].end(1, 0.6);
  yield* all(reading.opacity(0, 0.4), api.opacity(0, 0.4), history.opacity(0, 0.4));

  yield* waitUntil('mutate-copy');
  api.text('copied[0].quantity = 4');
  // Highlight the existing connection above the other path, keeping the same beat.
  copy.paths[0].zIndex(1);
  yield* all(
    copy.fields[0].fill(palette.accent, 0.3),
    copy.paths[0].stroke(palette.accent, 0.3),
    api.opacity(1, 0.3),
  );

  yield* waitUntil('mutate-quantity');
  copyQuantity.text('4');
  yield* copyQuantity.fill(palette.accent, 0.3);

  yield* waitUntil('copy-second');
  copy.paths[0].zIndex(0);
  copy.paths[1].zIndex(1);
  api.text('copied[1].quantity → 4');
  yield* all(
    copy.fields[0].fill(palette.ink, 0.3),
    copy.paths[0].stroke(palette.muted, 0.3),
    copy.fields[1].fill(palette.accent, 0.3),
    copy.paths[1].stroke(palette.accent, 0.3),
  );

  yield* waitUntil('source-unchanged');
  api.text('cart.quantity → 3');
  yield* all(
    copy.fields[1].fill(palette.ink, 0.3),
    copy.paths[1].stroke(palette.muted, 0.3),
    page.objectQuantity.fill(palette.accent, 0.5),
    copyQuantity.fill(palette.accent, 0.5),
  );
  copy.paths[1].zIndex(0);

  yield* waitUntil('tracking-question');
  yield* all(copy.root.opacity(0, 0.6), api.opacity(0, 0.4));
  copy.arrayName.fill(palette.muted);
  yield* all(
    source.root.position([30, 0], 0.9),
    source.root.scale(1.2, 0.9),
    page.objectQuantity.fill(palette.ink, 0.4),
  );
  yield* all(
    source.arrayGroup.opacity(1, 0.6),
    ...source.paths.map((path) => path.opacity(1, 0.6)),
  );
  const journey = referenceJourney(view, source, copy);

  yield* waitUntil('first-shared-link');
  yield* journey.showNeed();
  yield* waitUntil('same-object-again');
  yield* journey.sameObjectAgain();
  yield* waitUntil('remember-cart');
  yield* journey.focusArrayObject();
  yield* waitUntil('writer-list');
  yield* journey.writerList();
  yield* waitUntil('writer-array');
  yield* journey.writerArray();
  yield* waitUntil('writer-array-number');
  yield* journey.writerArrayNumber();
  yield* waitUntil('writer-first-element');
  yield* journey.writerFirstElement();
  yield* waitUntil('writer-cart');
  yield* journey.writerCart();
  yield* waitUntil('writer-cart-number');
  yield* journey.writerCartNumber();
  yield* waitUntil('writer-repeat');
  yield* journey.writerRepeat();
  yield* waitUntil('write-reference');
  yield* journey.writeReference();
  yield* waitUntil('reader-list');
  yield* journey.readerList();
  yield* waitUntil('reader-empty-list');
  yield* journey.readerEmptyList();
  yield* waitUntil('reader-array');
  yield* journey.readerArray();
  yield* waitUntil('reader-array-row');
  yield* journey.readerArrayRow();
  yield* waitUntil('reader-array-number');
  yield* journey.readerArrayNumber();
  yield* waitUntil('reader-cart');
  yield* journey.readerCart();
  yield* waitUntil('reader-cart-row');
  yield* journey.readerCartRow();
  yield* waitUntil('reader-cart-number');
  yield* journey.readerCartNumber();
  yield* waitUntil('read-reference');
  yield* journey.readReference();
  yield* waitUntil('lookup-reference');
  yield* journey.lookupReference();
  yield* waitUntil('reuse-cart');
  yield* journey.reuseCart();
  yield* waitUntil('reader-second-link');
  yield* journey.readSecondLink();
  yield* waitUntil('compare-lists');
  yield* journey.compareLists();
  yield* waitUntil('compare-array');
  yield* journey.compareRow(0);
  yield* waitUntil('compare-cart');
  yield* journey.compareRow(1);
  yield* waitUntil('compare-original');
  yield* journey.compareCart(0);
  yield* waitUntil('compare-new');
  yield* journey.compareCart(1);
  yield* waitUntil('same-ordinals');
  yield* journey.sameOrdinals();
  yield* waitUntil('settle-lists');
  yield* journey.settle();
  yield* waitUntil('end');
});
