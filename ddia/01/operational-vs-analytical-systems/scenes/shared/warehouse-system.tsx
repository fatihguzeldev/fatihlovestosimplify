import { Layout } from '@motion-canvas/2d';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, text } from './drawing';

export function warehouseSystem() {
  const root = new Layout({});
  const sources = ['sales database', 'inventory database', 'store database'].map((name, i) => {
    const database = cartoonDatabase(name, accent);
    database.root.position([-570 + i * 570, -150]);
    database.root.scale(0.95);
    const first = text(['#1042', 'stock', 'store A'][i], 27, {
      y: -4,
      fontFamily: theme.fontFamily.mono,
    });
    const second = text(['store A', 'store A', 'Marmara'][i], 23, {
      y: 56,
      fill: accent,
      fontFamily: theme.fontFamily.mono,
    });
    database.root.add([first, second]);
    root.add(database.root);
    return { ...database, first, second };
  });
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([0, 265]);
  warehouse.root.scale(1.22);
  warehouse.caption.fontSize(30 / 1.22);
  root.add(warehouse.root);
  return { root, sources, warehouse };
}
