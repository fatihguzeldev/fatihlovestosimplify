import { makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { createCartScene } from './cart-visuals';

const color = { dark: '#202225', ink: '#ece9e1', accent: '#ff563f', pale: '#8299a5' };

export default makeScene2D(function* (view) {
  view.fill(color.dark);
  yield loadFonts();

  const {
    browser,
    frame,
    panelWidth,
    cart,
    title,
    product,
    productName,
    unitPrice,
    quantity,
    quantityTitle,
    divider,
    totalName,
    totalValue,
    currency,
    pointer,
    plusFace,
    plusGlyph,
    clickRing,
    quantityValue,
    jsName,
    object,
    expression,
    priceProperty,
    priceValue,
    quantityProperty,
    objectQuantity,
    propertyName,
    readPrice,
    readQuantity,
    numericPrice,
    numericMultiply,
    numericQuantity,
    numericResult,
  } = createCartScene();
  const [, multiply] = expression.children();
  multiply.opacity(0);
  readQuantity.opacity(0);
  view.add(browser);

  // Keep the previous scene's last image, then navigate inside its fixed frame.
  yield* waitFor(0.15);
  yield* all(
    frame.address.text('alisveris.com/cart', 0.45),
    frame.title.opacity(0, 0.35),
    cart.opacity(1, 0.65),
  );

  yield* waitUntil('notice-price');
  yield* unitPrice.fill(color.accent, 0.25);

  yield* waitUntil('notice-quantity');
  yield* all(unitPrice.fill(color.pale, 0.25), quantityValue.fill(color.accent, 0.25));

  yield* waitUntil('notice-total');
  yield* all(quantityValue.fill(color.ink, 0.25), totalValue.fill(color.accent, 0.25));

  yield* waitUntil('notice-cart');
  yield* pointer.opacity(1, 0.2);
  yield* pointer.position([295, 20], 0.65, easeInOutCubic);

  yield* waitUntil('ordinary-plus');
  yield* all(
    plusFace.fill(color.accent, 0.14),
    plusFace.stroke(color.accent, 0.14),
    plusGlyph.fill(color.dark, 0.14),
    clickRing.opacity(1, 0.14),
  );
  yield* quantityValue.text('3', 0.25);
  yield* all(
    plusFace.fill(color.dark, 0.2),
    plusFace.stroke(color.ink, 0.2),
    plusGlyph.fill(color.ink, 0.2),
    clickRing.opacity(0, 0.3),
  );

  yield* waitUntil('ordinary-total');
  yield* all(totalValue.opacity(0, 0.12), pointer.opacity(0, 0.12));
  totalValue.text('360');
  yield* all(totalValue.opacity(1, 0.23), totalValue.fill(color.accent, 0.23));

  yield* waitUntil('look-inside-click');
  // Finish the whole reflow before any JavaScript drawing becomes visible.
  yield* all(
    totalValue.fill(color.ink, 0.25),
    cart.position([-470, 30], 1.1, easeInOutCubic),
    panelWidth(760, 1.1, easeInOutCubic),
    title.x(-320, 1.1),
    product.position([-230, -70], 1.1),
    product.scale(0.72, 1.1),
    productName.position([-110, -125], 1.1),
    productName.fontSize(34, 1.1),
    unitPrice.position([-110, -60], 1.1),
    unitPrice.fontSize(30, 1.1),
    quantity.position([-100, 82], 1.1),
    quantityTitle.position([-132, 5], 1.1),
    divider.points(
      [
        [-320, 160],
        [320, 163],
      ],
      1.1,
    ),
    totalName.position([-135, 234], 1.1),
    totalValue.position([158, 234], 1.1),
    totalValue.fontSize(43, 1.1),
    currency.position([245, 234], 1.1),
  );
  yield* waitFor(0.2);

  yield* waitUntil('reveal-javascript');
  yield* jsName.opacity(1, 0.25);

  yield* waitUntil('reveal-object');
  yield* object.opacity(1, 0.45);

  yield* waitUntil('screen-price');
  yield* unitPrice.fill(color.accent, 0.25);

  yield* waitUntil('match-price');
  propertyName.y(-180);
  yield* all(
    priceProperty.fill(color.accent, 0.3),
    priceValue.fill(color.accent, 0.3),
    propertyName.opacity(1, 0.3),
  );

  yield* waitUntil('screen-quantity');
  yield* all(
    unitPrice.fill(color.pale, 0.3),
    priceProperty.fill(color.pale, 0.3),
    priceValue.fill(color.ink, 0.3),
    quantityValue.fill(color.accent, 0.3),
    propertyName.opacity(0, 0.2),
  );

  yield* waitUntil('match-quantity');
  propertyName.y(-120);
  yield* all(
    quantityProperty.fill(color.accent, 0.3),
    objectQuantity.fill(color.accent, 0.3),
    propertyName.opacity(1, 0.3),
  );

  yield* waitUntil('read-expression');
  yield* all(
    quantityValue.fill(color.ink, 0.3),
    quantityProperty.fill(color.pale, 0.3),
    objectQuantity.fill(color.ink, 0.3),
    propertyName.opacity(0, 0.3),
    expression.opacity(1, 0.3),
    priceProperty.fill(color.accent, 0.3),
    priceValue.fill(color.accent, 0.3),
    readPrice.fill(color.accent, 0.3),
  );

  yield* waitUntil('read-price');
  yield* numericPrice.opacity(1, 0.25);

  yield* waitUntil('read-quantity');
  yield* all(
    priceProperty.fill(color.pale, 0.3),
    priceValue.fill(color.ink, 0.3),
    readPrice.fill(color.ink, 0.3),
    quantityProperty.fill(color.accent, 0.3),
    objectQuantity.fill(color.accent, 0.3),
    readQuantity.fill(color.accent, 0.3),
    readQuantity.opacity(1, 0.3),
  );

  yield* waitUntil('read-quantity-value');
  yield* numericQuantity.opacity(1, 0.25);

  yield* waitUntil('finish-reads');
  yield* all(
    quantityProperty.fill(color.pale, 0.2),
    objectQuantity.fill(color.ink, 0.2),
    readQuantity.fill(color.ink, 0.2),
  );

  yield* waitUntil('multiply-values');
  yield* all(multiply.opacity(1, 0.2), numericMultiply.opacity(1, 0.2));

  yield* waitUntil('calculate-total');
  yield* numericResult.opacity(1, 0.35);

  yield* waitUntil('screen-total');
  yield* all(numericResult.fill(color.ink, 0.3), totalValue.fill(color.accent, 0.3));

  yield* waitUntil('read-result');
  yield* totalValue.fill(color.ink, 0.3);
  yield* waitUntil('end');
});
