import { Layout } from '@motion-canvas/2d';
import { memory, record, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** The ordinary read is a familiar action before any engine internals appear. */
export function getterStory() {
  const root = new Layout({ opacity: 0 });
  const request = text('cart.total', -450, -300, 40, palette.ink, true);
  const cart = new Layout({ position: [-450, 0] });
  const cartName = text('cart', 0, -125, 38, palette.ink, true);
  const total = text('get total()', 0, 90, 34, palette.accent, true);
  const cartFace = record(440, 340, 0, 0);
  const price = text('price: 120', 0, -45, 34, palette.muted, true);
  const quantity = text('quantity: 3', 0, 20, 34, palette.ink, true);
  const thisValue = text('this = cart', 0, 225, 30, palette.accent, true);
  thisValue.opacity(0);
  cart.add([cartFace, cartName, price, quantity, total, thisValue]);
  const readPath = wire([
    [-450, -260],
    [-450, -185],
  ]);
  const functionRoot = new Layout({ position: [350, 90], opacity: 0 });
  const functionName = text('getter', 0, -170, 34, palette.accent, true);
  functionName.opacity(0);
  const arithmetic = text('120 × 3', 0, 0, 52, palette.ink, true);
  functionRoot.add([record(650, 210, 0, 0), functionName, arithmetic]);
  const functionPath = wire([
    [-215, 90],
    [10, 90],
  ]);
  functionPath.end(0);
  const resultPath = wire([
    [350, 210],
    [350, 270],
  ]);
  resultPath.end(0);
  const result = text('360', 350, 350, 58, palette.accent, true);
  result.opacity(0);
  root.add([request, cart, readPath, functionRoot, functionPath, resultPath, result]);
  return {
    root,
    request,
    cart,
    cartName,
    cartFace,
    price,
    quantity,
    total,
    thisValue,
    readPath,
    functionRoot,
    functionName,
    functionPath,
    resultPath,
    result,
  };
}

/** The same receiver field changes; a raw scope is not a normal return value. */
export function proxyStory() {
  const root = new Layout({ opacity: 0 });
  const name = text('Proxy', 0, -190, 38, palette.accent, true);
  name.opacity(0);
  const property = text('property: total', 0, -40, 31, palette.ink, true);
  const receiver = text('receiver: cart', 0, 35, 31, palette.ink, true);
  const input = wire([
    [-500, 0],
    [-220, 0],
  ]);
  input.end(0);
  const onward = wire([
    [220, 0],
    [335, 0],
  ]);
  onward.end(0);
  const scopePath = wire([
    [335, 0],
    [220, 0],
  ]);
  scopePath.end(0);
  const returnValue = text('return receiver', 0, 190, 30, palette.accent, true);
  returnValue.opacity(0);
  root.add([
    record(420, 240, 0, 0),
    name,
    property,
    receiver,
    input,
    onward,
    scopePath,
    returnValue,
  ]);
  return { root, name, property, receiver, input, onward, scopePath, returnValue };
}

export function scopeStory() {
  const root = new Layout({ opacity: 0 });
  const functionRoot = new Layout({ position: [-430, 0] });
  functionRoot.add([
    text('getter', 0, -180, 36, palette.ink, true),
    record(700, 230, 0, 0),
    text('cart.price × cart.quantity', 0, 0, 32, palette.ink, true),
  ]);
  const binding = new Layout({ position: [530, 0] });
  const name = text('scope', 0, -180, 36, palette.accent, true);
  name.opacity(0);
  const value = text('cart → object', 0, 0, 32, palette.ink, true);
  const face = record(390, 230, 0, 0);
  binding.add([face, name, value]);
  const path = wire([
    [-65, 0],
    [320, 0],
  ]);
  path.end(0);
  const objectPath = wire(
    [
      [530, 130],
      [530, 175],
    ],
    palette.muted,
    2,
  );
  objectPath.end(0);
  root.add([functionRoot, binding, path, objectPath]);
  return { root, functionRoot, binding, face, name, value, path, objectPath };
}

/** Separate the getter cell, its function, and the object whose address we need. */
export function internalStory() {
  const root = new Layout({ opacity: 0 });
  // A new actor: the actual leaked scope is not the earlier lexical-scope example.
  const scope = new Layout({ position: [530, 0], opacity: 0 });
  const scopeFace = record(390, 230, 0, 0);
  const scopeName = text('internal scope', 0, -180, 32, palette.accent, true);
  const scopeValue = text('motorun iç kaydı', 0, 0, 28, palette.muted);
  scope.add([scopeFace, scopeName, scopeValue]);
  const origin = text('motor', 530, -315, 28, palette.muted);
  const access = text('scope.g', -630, -300, 32, palette.accent, true);
  access.opacity(0);
  const returned = text('okumanın sonucu', -100, -300, 26, palette.accent);
  returned.opacity(0);
  const accessPath = wire([
    [-455, 0],
    [-285, 0],
  ]);
  accessPath.end(0);
  const cell = new Layout({ position: [-100, 0], opacity: 0 });
  const cellFace = record(340, 240, 0, 0, palette.accent);
  const cellName = text('getter kaydı', 0, -190, 32, palette.accent);
  const getter = text('getter', 0, -45, 32, palette.ink, true);
  const setter = text('setter', 0, 45, 32, palette.muted, true);
  cell.add([cellFace, cellName, getter, setter]);
  const carrier = new Layout({ position: [500, 0], opacity: 0 });
  const carrierFace = record(340, 240, 0, 0);
  const carrierName = text('getter fonksiyonu', 0, -190, 30);
  const carrierCode = text('return 7', 0, -45, 30, palette.muted, true);
  const carrierReference = text('[0]: referans', 0, 45, 30, palette.accent, true);
  carrierReference.opacity(0);
  carrier.add([carrierFace, carrierName, carrierCode, carrierReference]);
  const host = new Layout({ position: [650, 0], opacity: 0 });
  const hostName = text('hazırlanan object', 0, -190, 30);
  const hostFace = record(320, 240, 0, 0, palette.rule);
  const hostField = record(260, 100, 0, 20, palette.accent);
  const hostView = text('sahte view', 0, 20, 28, palette.accent);
  host.add([hostFace, hostField, hostName, hostView]);
  const getterPath = wire(
    [
      [85, -45],
      [315, -45],
    ],
    palette.muted,
    2,
  );
  const hostPath = wire(
    [
      [275, 45],
      [475, 45],
    ],
    palette.accent,
    2,
  );
  getterPath.end(0);
  hostPath.end(0);
  root.add([
    scope,
    origin,
    access,
    returned,
    accessPath,
    cell,
    carrier,
    host,
    getterPath,
    hostPath,
  ]);
  return {
    root,
    scope,
    scopeFace,
    scopeName,
    scopeValue,
    origin,
    access,
    returned,
    accessPath,
    cell,
    cellName,
    cellFace,
    getter,
    setter,
    carrier,
    carrierFace,
    carrierName,
    carrierCode,
    carrierReference,
    host,
    hostName,
    hostFace,
    hostField,
    hostView,
    getterPath,
    hostPath,
  };
}

/** Object() boxes the same non-Symbol record; the subsequent string read is a separate step. */
export function conversionStory() {
  const root = new Layout({ opacity: 0 });
  const wrapper = new Layout({ position: [-520, -80] });
  const wrapperFace = record(480, 330, 0, 0, palette.accent, 'transparent');
  const wrapperName = text('Symbol wrapper', 0, -200, 30, palette.accent, true);
  const expression = text('Object(scope.g)', 0, -285, 30, palette.ink, true);
  // Only the new wrapper decorations fade in; the carried record stays visible.
  for (const node of [wrapperFace, wrapperName, expression]) node.opacity(0);
  wrapper.add([wrapperFace, wrapperName, expression]);
  const symbol = new Layout({ position: [-520, -150], opacity: 0 });
  const symbolDescription = text('description: etiket', 0, 0, 29, palette.ink, true);
  symbolDescription.opacity(0);
  symbol.add([
    record(400, 220, 0, 0),
    text('Symbol', 0, -190, 34, palette.ink, true),
    symbolDescription,
  ]);
  const call = new Layout({ position: [270, -150], opacity: 0 });
  const assumption = text('içeride beklenen: Symbol', 0, -200, 28, palette.muted);
  call.add([
    record(640, 180, 0, 0),
    text('Symbol.prototype.toString', 0, 0, 29, palette.ink, true),
    assumption,
  ]);
  const path = wire(
    [
      [-265, -150],
      [-65, -150],
    ],
    palette.muted,
    2,
  );
  const resultPath = wire(
    [
      [270, -40],
      [270, 40],
    ],
    palette.muted,
    2,
  );
  path.end(0);
  resultPath.end(0);
  const result = text('"Symbol(etiket)"', 270, 100, 38, palette.ink, true);
  result.opacity(0);
  const leakOutput = new Layout({ opacity: 0 });
  // The selected string characters become a numeric address before it is named H.
  const h = text('…', 270, 100, 40, palette.accent, true);
  const addressName = text('hazırlanan object’in adresi', -80, 215, 24, palette.muted);
  addressName.opacity(0);
  leakOutput.add([
    text('"…', 130, 100, 40, palette.muted, true),
    h,
    text('…"', 410, 100, 40, palette.muted, true),
  ]);
  root.add([wrapper, symbol, call, path, resultPath, result, leakOutput, addressName]);
  return {
    root,
    wrapper,
    wrapperFace,
    wrapperName,
    expression,
    symbol,
    symbolDescription,
    call,
    assumption,
    path,
    resultPath,
    result,
    leakOutput,
    h,
    addressName,
  };
}

/** H is the object start; F is the prepared field inside the same object. */
export function hostStory() {
  const root = new Layout({ opacity: 0 });
  const details = new Layout({ opacity: 0 });
  const f = text('F', -290, -95, 48, palette.accent, true);
  f.opacity(0);
  const offset = new Layout({ opacity: 0 });
  offset.add([
    text('offset', -440, -300, 30, palette.muted),
    wire([
      [-590, -235],
      [-290, -235],
    ]),
  ]);
  const fMarker = wire(
    [
      [-290, -50],
      [-290, 0],
    ],
    palette.accent,
    2,
    false,
  );
  fMarker.end(0);
  const field = memory(880, 240, 150, 120, palette.accent, palette.surface);
  details.add([text('header', -440, 120, 31, palette.muted, true), field, f, fMarker, offset]);
  const formula = new Layout({ position: [0, 370], opacity: 0 });
  const formulaH = text('H', -250, 0, 46, palette.accent, true);
  const formulaOffset = text('+ offset', 0, 0, 33, palette.muted, true);
  const formulaF = text('= F', 300, 0, 46, palette.accent, true);
  formulaOffset.opacity(0);
  formulaF.opacity(0);
  formula.add([formulaH, formulaOffset, formulaF]);
  details.add(formula);
  root.add(details);
  return { root, details, field, f, offset, fMarker, formula, formulaOffset, formulaF };
}
