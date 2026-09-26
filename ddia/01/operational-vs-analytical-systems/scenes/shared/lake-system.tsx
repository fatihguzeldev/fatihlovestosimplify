import {Layout} from '@motion-canvas/2d';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {cartoonDatabase} from '../../../../../common/cartoon-system';
import {theme} from '../../theme';
import {accent, muted, paper, text} from './drawing';

export function lakeStorage() {
  const surface = paper(500, 460, '#101315');
  surface.root.add([
    text('data lake', 36, {position: [-206, -180], offset: [-1, 0], fill: accent}),
    text('kaynak kopyaları', 23, {position: [-206, -139], offset: [-1, 0], fill: muted}),
  ]);
  const files = ['sales.parquet', 'reviews.json', 'product.jpg', 'order_items.parquet'].map((name, i) => {
    const file = paper(202, 96);
    file.root.position([-116 + (i % 2) * 232, -42 + Math.floor(i / 2) * 144]);
    if (i === 3) {
      file.root.add([text('order_items', 20, {y: -15, fontFamily: theme.fontFamily.mono}), text('.parquet', 18, {y: 18, fill: muted, fontFamily: theme.fontFamily.mono})]);
    } else {
      file.root.add(text(name, 20, {fontFamily: theme.fontFamily.mono}));
    }
    surface.root.add(file.root);
    return file;
  });
  return {...surface, files};
}

export function lakeConsumers() {
  const root = new Layout({});
  const lake = lakeStorage();
  lake.root.position([-540, 65]);
  const transform = paper(340, 140, '#101315');
  transform.root.position([115, -70]);
  transform.root.add(text('transform', 33, {fill: accent}));
  const features = paper(340, 140, '#101315');
  features.root.position([115, 254]);
  features.root.add(text('feature engineering', 27, {fill: accent}));
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([650, -70]);
  warehouse.root.scale(1.03);
  warehouse.root.add(text('sales', 28, {y: 15, fill: accent, fontFamily: theme.fontFamily.mono}));
  const train = paper(310, 140, '#101315');
  train.root.position([650, 254]);
  train.root.add(text('train', 36, {fontFamily: theme.fontFamily.mono}));
  const arrow = (name: string, from: [number, number], to: [number, number]) => {
    const flow = cartoonArrow(name, [0, 0], [300, 0], accent);
    flow.root.position(from);
    flow.root.scale((to[0] - from[0]) / 300);
    return flow;
  };
  const readSales = arrow('lake-sales-to-transform', [-251, -70], [-95, -70]);
  const load = arrow('lake-transformed-sales-to-warehouse', [329, -70], [488, -70]);
  const readFeatures = arrow('lake-inputs-to-features', [-251, 254], [-95, 254]);
  const training = arrow('lake-features-to-training', [329, 254], [454, 254]);
  root.add([lake.root, transform.root, features.root, warehouse.root, train.root, readSales.root, load.root, readFeatures.root, training.root]);
  return {root, lake, transform, features, warehouse, train, readSales, load, readFeatures, training};
}
