import { Layout } from '@motion-canvas/2d';
import { record, text, wire } from '../../shared/drawing';
import { addressTarget } from './address-visuals';
import { palette } from '../../shared/theme';

export function pageObject() {
  const root = new Layout({});
  const pageLabel = text('JavaScript', -580, -315, 32, palette.muted);
  const request = text('cart.price', -580, -80, 33, palette.ink, true);
  const object = record(440, 250, 0, -80);
  const objectName = text('cart', 0, -260, 35, palette.ink, true);
  const field = text('price: 120', 0, -145, 31, palette.muted, true);
  const value = text('quantity: 3', 0, -75, 31, palette.ink, true);
  const path = wire(
    [
      [-430, -80],
      [-220, -80],
    ],
    palette.accent,
    2.5,
  );
  const resultPath = wire(
    [
      [220, -80],
      [450, -80],
    ],
    palette.muted,
    2.2,
  );
  const result = text('120', 610, -80, 42, palette.ink, true);
  root.add([pageLabel, request, object, objectName, field, value, path, resultPath, result]);
  return {
    root,
    pageLabel,
    request,
    object,
    objectName,
    field,
    value,
    path,
    resultPath,
    result,
  };
}

export function addressKnowledge() {
  const target = addressTarget();
  target.prepared.opacity(0);
  target.targetPath.opacity(0);
  target.under.opacity(0);
  target.address.text('adres: A');
  target.address.fill(palette.accent);
  target.address.opacity(1);
  const name = text('adres', -585, -180, 30, palette.muted);
  const address = text('A', -585, -45, 44, palette.accent, true);
  const path = wire(
    [
      [-495, -45],
      [-205, -45],
    ],
    palette.accent,
    2,
  );
  target.root.add([name, address, path]);
  return {
    root: target.root,
    object: target.face,
    objectName: target.name,
    address,
    path,
  };
}
