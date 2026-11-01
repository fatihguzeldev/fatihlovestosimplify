import { Circle, Layout, Line, Path, Rect, Txt } from '@motion-canvas/2d';
import { createSignal } from '@motion-canvas/core';
import { createBrowserFrame } from '../../shared/browser-frame';

const color = {
  dark: '#202225',
  toolbar: '#303b44',
  ink: '#ece9e1',
  accent: '#ff563f',
  slate: '#526e80',
  pale: '#8299a5',
};
const pen = {
  stroke: color.ink,
  lineWidth: 2.6,
  lineCap: 'round' as const,
  lineJoin: 'round' as const,
};
function drawing(data: string, fill?: string, stroke = color.ink, width = 2.6) {
  return new Path({ ...pen, data, fill, stroke, lineWidth: width });
}
function label(value: string, x: number, y: number, size: number, fill = color.ink, mono = false) {
  return new Txt({
    text: value,
    position: [x, y],
    fontSize: size,
    fontFamily: mono ? 'IBM Plex Mono' : 'IBM Plex Sans',
    fontWeight: 400,
    fill,
    offset: [-1, 0],
    letterSpacing: mono ? 0 : -0.5,
  });
}
export function cartCup() {
  const root = new Layout({ position: [-440, -40] });
  root.add([
    drawing('M 57 -59 C 132 -71 140 32 75 43', undefined, color.pale, 12),
    drawing('M 59 -59 C 116 -67 122 24 74 29', undefined, color.ink, 2.5),
    drawing('M -73 -88 Q -4 -102 74 -87 L 63 64 Q 2 92 -66 65 Z', color.toolbar),
    drawing('M -74 -87 Q -3 -70 74 -87 Q 3 -110 -74 -87 Z', color.slate),
    drawing('M -54 -44 Q -55 0 -50 37', undefined, color.pale, 3),
    drawing('M -91 95 Q 5 111 102 93', undefined, color.pale, 2),
  ]);
  return root;
}

export function createCartScene() {
  const browser = new Layout({});
  const frame = createBrowserFrame();
  const viewport = new Layout({ scale: 2.04, position: [0, 274] });
  viewport.add(frame.root);
  browser.add(viewport);

  const panelWidth = createSignal(1320);
  const cart = new Layout({ position: [0, 30], opacity: 0 });
  const cartFace = new Path({
    ...pen,
    data: () => {
      const half = panelWidth() / 2;
      return `M ${-half + 12} -286 Q 0 -292 ${half - 8} -283 Q ${half + 1} -281 ${half} -267 L ${half - 4} 332 Q ${half - 5} 346 ${half - 22} 345 Q 0 351 ${-half + 12} 342 Q ${-half - 2} 341 ${-half} 326 L ${-half - 2} -267 Q ${-half - 1} -282 ${-half + 12} -286 Z`;
    },
    fill: color.dark,
    stroke: color.pale,
    lineWidth: 1.8,
  });
  const title = label('sepetim', -570, -230, 43);
  const product = cartCup();
  const productName = label('seramik kupa', -240, -125, 40);
  const unitPrice = label('120 ₺ / adet', -240, -55, 34, color.pale);
  const quantity = new Layout({ position: [230, -10] });
  const quantityTitle = label('adet', 198, -104, 30, color.pale);
  const minusFace = new Rect({
    position: [-65, 0],
    size: [56, 65],
    radius: [15, 9, 12, 10],
    stroke: color.pale,
    lineWidth: 2,
  });
  const plusFace = new Rect({
    position: [65, 0],
    size: [56, 65],
    radius: [9, 14, 10, 13],
    stroke: color.ink,
    lineWidth: 2,
  });
  const minusGlyph = new Txt({
    text: '−',
    position: [-65, -1],
    fontFamily: 'IBM Plex Sans',
    fontSize: 36,
    fill: color.pale,
  });
  const plusGlyph = new Txt({
    text: '+',
    position: [65, -1],
    fontFamily: 'IBM Plex Sans',
    fontSize: 36,
    fill: color.ink,
  });
  const quantityValue = new Txt({
    text: '2',
    position: [0, -1],
    fontFamily: 'IBM Plex Sans',
    fontSize: 38,
    fill: color.ink,
  });
  const clickRing = new Circle({
    position: [65, 0],
    size: 80,
    stroke: color.accent,
    lineWidth: 2.4,
    opacity: 0,
  });
  quantity.add([minusFace, plusFace, minusGlyph, plusGlyph, quantityValue, clickRing]);
  const divider = new Line({
    points: [
      [-570, 150],
      [570, 154],
    ],
    ...pen,
    stroke: color.slate,
    lineWidth: 1.7,
  });
  const totalName = label('toplam', 160, 234, 33, color.pale);
  const totalValue = label('240', 396, 234, 47);
  const currency = label('₺', 484, 234, 41, color.pale);
  cart.add([
    cartFace,
    title,
    product,
    productName,
    unitPrice,
    quantityTitle,
    quantity,
    divider,
    totalName,
    totalValue,
    currency,
  ]);
  browser.add(cart);

  const pointer = drawing(
    'M 0 0 L 4 33 L 13 24 L 23 40 L 32 35 L 22 20 L 35 18 Z',
    color.ink,
    color.dark,
    1.8,
  );
  pointer.position([360, 83]);
  pointer.opacity(0);
  browser.add(pointer);

  const javascript = new Layout({});
  const jsName = label('JavaScript', 55, -325, 35, color.pale);
  jsName.opacity(0);
  const object = new Layout({ opacity: 0 });
  const objectName = label('cart', 116, -235, 32, color.ink, true);
  const objectTerm = label('object', 230, -235, 28, color.pale);
  const leftBrace = label('{', 70, -159, 88, color.slate, true);
  const rightBrace = label('}', 650, -159, 88, color.slate, true);
  const priceProperty = label('price:', 151, -180, 31, color.pale, true);
  const priceValue = label('120,', 400, -180, 31, color.ink, true);
  const quantityProperty = label('quantity:', 151, -120, 31, color.pale, true);
  // The first click has already finished. Keep its result while revealing the data.
  const objectQuantity = label('3', 400, -120, 31, color.ink, true);
  const propertyName = label('property', 537, -120, 28, color.pale);
  propertyName.opacity(0);
  object.add([
    objectName,
    objectTerm,
    leftBrace,
    rightBrace,
    priceProperty,
    priceValue,
    quantityProperty,
    objectQuantity,
    propertyName,
  ]);

  const expression = new Layout({ opacity: 0 });
  const readPrice = label('cart.price', 57, 25, 31, color.ink, true);
  const multiply = label('*', 270, 25, 31, color.pale, true);
  const readQuantity = label('cart.quantity', 325, 25, 31, color.ink, true);
  expression.add([readPrice, multiply, readQuantity]);

  const numericPrice = label('120', 102, 115, 38, color.ink, true);
  const numericMultiply = label('×', 270, 115, 38, color.pale, true);
  const numericQuantity = label('3', 375, 115, 38, color.ink, true);
  const numericResult = label('= 360', 480, 115, 38, color.accent, true);
  for (const value of [numericPrice, numericMultiply, numericQuantity, numericResult])
    value.opacity(0);
  javascript.add([
    jsName,
    object,
    expression,
    numericPrice,
    numericMultiply,
    numericQuantity,
    numericResult,
  ]);
  browser.add(javascript);

  return {
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
  };
}
export function finalCartPose() {
  const scene = createCartScene();
  scene.frame.address.text('alisveris.com/cart');
  scene.frame.title.opacity(0);
  scene.cart.opacity(1);
  scene.cart.position([-470, 30]);
  scene.panelWidth(760);
  scene.title.x(-320);
  scene.product.position([-230, -70]);
  scene.product.scale(0.72);
  scene.productName.position([-110, -125]);
  scene.productName.fontSize(34);
  scene.unitPrice.position([-110, -60]);
  scene.unitPrice.fontSize(30);
  scene.quantity.position([-100, 82]);
  scene.quantityTitle.position([-132, 5]);
  scene.quantityValue.text('3');
  scene.divider.points([
    [-320, 160],
    [320, 163],
  ]);
  scene.totalName.position([-135, 234]);
  scene.totalValue.position([158, 234]);
  scene.totalValue.fontSize(43);
  scene.totalValue.text('360');
  scene.currency.position([245, 234]);
  scene.jsName.opacity(1);
  scene.object.opacity(1);
  scene.expression.opacity(1);
  for (const value of [
    scene.numericPrice,
    scene.numericMultiply,
    scene.numericQuantity,
    scene.numericResult,
  ])
    value.opacity(1);
  scene.numericResult.fill(color.ink);
  return scene;
}
