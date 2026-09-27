import { Layout } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonService } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, muted, paper, text } from './drawing';

export function recordAndModel(existingService?: ReturnType<typeof cartoonService>) {
  const root = new Layout({});
  const records = new Layout({});
  const cards = ['sales database', 'warehouse'].map((name, i) => {
    const card = paper(400, 250, '#101315');
    card.root.position([-595 + i * 595, 10]);
    card.root.add([
      text(name, 29, { y: -80, fill: muted }),
      text('#1042', 46, { y: -3, fill: accent, fontFamily: theme.fontFamily.mono }),
      text('amount: 185', 29, { y: 74, fontFamily: theme.fontFamily.mono }),
    ]);
    records.add(card.root);
    return card;
  });
  const copy = cartoonArrow('record-model-copy', [-360, 10], [-235, 10], accent);
  records.add([copy.root, text('kopya', 25, { position: [-297, -76], fill: muted })]);

  const service = existingService ?? cartoonService('recommendation service', accent);
  service.root.position([595, 10]);
  service.root.scale(0.95);
  service.caption.fontSize(25);
  if (!existingService) {
    const badge = paper(108, 52, '#17232f');
    badge.root.position([26, -65]);
    badge.root.add(text('v1', 29, { fill: accent, fontFamily: theme.fontFamily.mono }));
    service.root.add(badge.root);
  }
  const training = new Layout({});
  const sources = paper(710, 100, '#101315');
  sources.root.position([-250, 300]);
  sources.root.add(text('çok sayıda satış + clickstream', 29));
  const train = cartoonArrow('record-model-training', [145, 300], [418, 80], accent);
  training.add([
    sources.root,
    train.root,
    text('eğitim', 27, { position: [160, 190], fill: accent }),
  ]);
  const modelBranch = new Layout({});
  modelBranch.add([training, service.root]);
  root.add([records, modelBranch]);
  return { root, cards, records, copy, training, modelBranch, service };
}
