import {Layout, makeScene2D, Path} from '@motion-canvas/2d';
import {all, waitUntil} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {theme} from '../../theme';
import {accent, background, foreground, heading, muted, paper, text} from '../shared/drawing';
import {recommendationSource} from '../shared/recommendation-source';
import {analysisInputs, dataFile} from '../shared/data-files';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('peki, ', 'ürün önerisi', ' hazırlasak?');
  const initial = recommendationSource();
  view.add([title, initial.root]);
  yield loadFonts();
  yield* waitUntil('items');
  yield* all(title.opacity(0, 0.2), initial.root.opacity(0, 0.4));
  title.children(heading('tutar ', 'tek başına yetmez.').children());
  const items = paper(590, 260, '#101315');
  items.root.position([435, 75]);
  items.root.opacity(0);
  const cells = new Layout({opacity: 0});
  cells.add(text('order_items', 29, {y: -86, fill: accent, fontFamily: theme.fontFamily.mono}));
  [['order_id', 'product', 'quantity'], ['1042', 'muz', '2 kg'], ['1042', 'süt', '1 litre']].forEach((row, i) => {
    row.forEach((value, j) => cells.add(text(value, 25, {position: [[-242, -55, 122][j], -28 + i * 54], offset: [-1, 0], fill: i === 0 ? muted : foreground, fontFamily: theme.fontFamily.mono})));
  });
  items.root.add(cells);
  initial.receipt.root.remove();
  initial.receipt.root.position([-535, 75]);
  initial.receipt.root.opacity(0);
  const itemFlow = cartoonArrow('s13-receipt-items', [-210, 75], [83, 75], accent, 0);
  const detail = text('öneri için ürün satırları da gerekiyor.', 33, {position: [0, 354], opacity: 0});
  view.add([initial.receipt.root, items.root, itemFlow.root, detail]);
  yield* all(title.opacity(1, 0.3), initial.receipt.root.opacity(1, 0.5), items.root.opacity(1, 0.5));
  yield* itemFlow.reveal(1, 0.35);
  yield* itemFlow.travel(0.8);
  yield* all(itemFlow.arrive(), cells.opacity(1, 0.3), detail.opacity(1, 0.3));
  yield* waitUntil('features');
  yield* all(title.opacity(0, 0.2), initial.receipt.root.opacity(0, 0.3), itemFlow.root.opacity(0, 0.3), detail.opacity(0, 0.3));
  yield* all(items.root.position([-495, 75], 0.65), items.root.scale(0.94, 0.65));
  title.children(heading('model için ', 'sayısal özellikler', ' üretiyoruz.').children());
  const features = paper(570, 260, '#17232f');
  features.root.position([495, 75]);
  features.root.opacity(0);
  const vector = new Layout({opacity: 0});
  vector.add([
    text('features · #1042', 27, {y: -84, fontFamily: theme.fontFamily.mono}),
    text('muz_kg', 24, {position: [-130, -13], fill: muted, fontFamily: theme.fontFamily.mono}),
    text('süt_litre', 24, {position: [130, -13], fill: muted, fontFamily: theme.fontFamily.mono}),
    text('2', 64, {position: [-130, 57], fill: accent, fontFamily: theme.fontFamily.mono}),
    text('1', 64, {position: [130, 57], fill: accent, fontFamily: theme.fontFamily.mono}),
    new Path({data: 'M -221 13 L -237 13 L -237 101 L -221 101 M 220 13 L 236 13 L 236 101 L 220 101', stroke: foreground, lineWidth: 2.5}),
  ]);
  features.root.add(vector);
  const encode = cartoonArrow('s13-named-feature-vector', [-172, 75], [169, 75], accent, 0);
  const featureLabel = text('feature engineering', 27, {position: [0, -15], fill: accent, fontStyle: 'italic', opacity: 0});
  view.add([features.root, encode.root, featureLabel]);
  yield* all(title.opacity(1, 0.3), features.root.opacity(1, 0.4));
  yield* all(encode.reveal(1, 0.4), featureLabel.opacity(1, 0.3));
  yield* encode.travel(0.8);
  yield* all(encode.arrive(), vector.opacity(1, 0.3));
  yield* waitUntil('training');
  yield* all(title.opacity(0, 0.2), items.root.opacity(0, 0.3), encode.root.opacity(0, 0.3), featureLabel.opacity(0, 0.3));
  yield* features.root.position([-490, 75], 0.65);
  title.children(heading('bunlar ', 'eğitime girdi', ' olacak.').children());
  const training = paper(350, 200, '#101315');
  training.root.position([490, 75]);
  training.root.opacity(0);
  training.root.add([text('train', 49, {y: -20, fill: accent, fontFamily: theme.fontFamily.mono}), text('öneri modeli', 26, {y: 49})]);
  const trainFlow = cartoonArrow('s13-features-to-training', [-157, 75], [270, 75], accent, 0);
  const illustrative = text('bu vektör, eğitim girdilerinden tek bir örnek.', 30, {position: [0, 358], fill: muted, opacity: 0});
  view.add([training.root, trainFlow.root, illustrative]);
  yield* all(title.opacity(1, 0.3), training.root.opacity(1, 0.4), illustrative.opacity(1, 0.3));
  yield* trainFlow.reveal(1, 0.35);
  yield* trainFlow.travel(0.8);
  yield* all(trainFlow.arrive(), training.face.stroke(accent, 0.15).to(foreground, 0.4));
  yield* waitUntil('review');
  yield* all(title.opacity(0, 0.2), features.root.opacity(0, 0.3), training.root.opacity(0, 0.3), trainFlow.root.opacity(0, 0.3), illustrative.opacity(0, 0.3));
  title.children(heading('yorumdan da ', 'bilgi çıkarabiliriz.').children());
  const processing = new Layout({opacity: 0});
  const review = dataFile('reviews.json', 'review');
  review.root.position([-610, 75]);
  const process = paper(280, 150, '#101315');
  process.root.position([0, 75]);
  const processName = text('NLP', 44, {fill: accent, fontFamily: theme.fontFamily.mono});
  process.root.add(processName);
  const output = paper(370, 210, '#17232f');
  output.root.position([635, 75]);
  const result = new Layout({opacity: 0});
  const resultTop = text('konu: ürün kalitesi', 27, {y: -38});
  const resultBottom = text('duygu: olumsuz', 27, {y: 34, fill: accent});
  result.add([resultTop, resultBottom]);
  output.root.add(result);
  const read = cartoonArrow('s13-text-processing-input', [-345, 75], [-183, 75], accent, 0);
  const write = cartoonArrow('s13-text-processing-output', [185, 75], [407, 75], accent, 0);
  processing.add([review.root, process.root, output.root, read.root, write.root]);
  view.add(processing);
  yield* all(title.opacity(1, 0.3), processing.opacity(1, 0.5));
  yield* read.reveal(1, 0.3);
  yield* read.travel(0.6);
  yield* read.arrive();
  yield* write.reveal(1, 0.3);
  yield* write.travel(0.6);
  yield* all(write.arrive(), result.opacity(1, 0.3));
  yield* waitUntil('image');
  yield* all(title.opacity(0, 0.2), review.root.opacity(0, 0.3), result.opacity(0, 0.3), processName.opacity(0, 0.2));
  const photo = dataFile('product.jpg', 'image');
  photo.root.position([-610, 75]);
  photo.root.opacity(0);
  processing.add(photo.root);
  processName.text('vision');
  processName.fontSize(38);
  resultTop.text('ürün: muz');
  resultBottom.text('görselden bilgi');
  title.children(heading('görsel için ', 'başka bir işlem.').children());
  yield* all(title.opacity(1, 0.3), photo.root.opacity(1, 0.4), processName.opacity(1, 0.3));
  yield* read.travel(0.65);
  yield* read.arrive();
  yield* write.travel(0.65);
  yield* all(write.arrive(), result.opacity(1, 0.3));
  yield* waitUntil('custom-code');
  yield* all(title.opacity(0, 0.2), processing.opacity(0, 0.4));
  processing.remove();
  title.children(heading('işe uygun ', 'araç ve temsil', ' seçiyoruz.').children());
  const code = paper(1190, 300, '#101315');
  code.root.position([0, 70]);
  code.root.opacity(0);
  code.root.add([
    text('SQL', 57, {position: [-398, -23], fill: accent, fontFamily: theme.fontFamily.mono}),
    text('Python / R', 49, {position: [191, -23], fontFamily: theme.fontFamily.mono}),
    text('sorgular', 27, {position: [-398, 63], fill: muted}),
    text('custom processing', 27, {position: [191, 63], fill: muted}),
    new Path({data: 'M -122 -95 Q -118 0 -123 100', stroke: muted, lineWidth: 1.5}),
  ]);
  const qualifier = text('SQL tarafında da ML araçları var.', 31, {position: [0, 344], fill: muted, opacity: 0});
  view.add([code.root, qualifier]);
  yield* all(title.opacity(1, 0.3), code.root.opacity(1, 0.5), qualifier.opacity(1, 0.3));
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.2), code.root.opacity(0, 0.4), qualifier.opacity(0, 0.3));
  title.children(heading('bu girdileri ', 'nasıl saklayacağız?').children());
  const inputs = analysisInputs();
  inputs.root.opacity(0);
  view.add(inputs.root);
  yield* all(title.opacity(1, 0.3), inputs.root.opacity(1, 0.5));
  yield* waitUntil('end');
});
