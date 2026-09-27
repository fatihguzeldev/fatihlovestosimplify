import { Layout, Path } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, foreground, muted, paper, text } from './drawing';

export function lakeStorage() {
  const surface = paper(500, 460, '#101315');
  surface.root.add([
    text('data lake', 36, { position: [-206, -180], offset: [-1, 0], fill: accent }),
    text('kaynak kopyaları', 23, { position: [-206, -139], offset: [-1, 0], fill: muted }),
  ]);
  const files = [
    'sales.parquet',
    'clickstream.jsonl',
    'order_items.parquet',
    'reviews.json',
    'product.jpg',
    'readings.csv',
  ].map((name, i) => {
    const file = paper(202, 82);
    file.root.position([-116 + (i % 2) * 232, -67 + Math.floor(i / 2) * 112]);
    file.face.data('M -101 -39 Q 0 -42 76 -40 L 100 -16 L 99 41 Q 0 43 -100 40 Z');
    const [base, extension] = name.split('.');
    file.root.add([
      new Path({
        data: 'M 76 -40 L 75 -16 L 100 -16',
        stroke: foreground,
        lineWidth: 2,
        lineJoin: 'round',
      }),
      text(base, 20, { y: -11, fontFamily: theme.fontFamily.mono }),
      text(`.${extension}`, 18, { y: 19, fill: accent, fontFamily: theme.fontFamily.mono }),
    ]);
    surface.root.add(file.root);
    return file;
  });
  return { ...surface, files };
}

export function lakeConsumers() {
  const root = new Layout({});
  const lake = lakeStorage();
  lake.root.position([-540, 65]);
  const transform = paper(340, 140, '#101315');
  transform.root.position([115, -70]);
  transform.root.add(text('transform', 33, { fill: accent }));
  const features = paper(340, 140, '#101315');
  features.root.position([115, 254]);
  features.root.add(text('feature engineering', 27, { fill: accent }));
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([650, -70]);
  warehouse.root.scale(1.03);
  warehouse.root.add(text('sales', 28, { y: 15, fill: accent, fontFamily: theme.fontFamily.mono }));
  const train = paper(310, 140, '#101315');
  train.root.position([650, 254]);
  train.root.add(text('train', 36, { fontFamily: theme.fontFamily.mono }));
  const arrow = (name: string, from: [number, number], to: [number, number]) => {
    return cartoonArrow(name, from, to, accent);
  };
  const readSales = arrow('lake-sales-to-transform', [-251, -70], [-95, -70]);
  const load = arrow('lake-transformed-sales-to-warehouse', [329, -70], [488, -70]);
  const readFeatures = arrow('lake-inputs-to-features', [-251, 254], [-95, 254]);
  const training = arrow('lake-features-to-training', [329, 254], [454, 254]);
  root.add([
    lake.root,
    transform.root,
    features.root,
    warehouse.root,
    train.root,
    readSales.root,
    load.root,
    readFeatures.root,
    training.root,
  ]);
  return {
    root,
    lake,
    transform,
    features,
    warehouse,
    train,
    readSales,
    load,
    readFeatures,
    training,
  };
}
