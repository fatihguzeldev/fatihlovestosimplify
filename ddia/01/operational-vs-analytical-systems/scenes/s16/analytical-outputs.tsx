import { Layout, makeScene2D, Path, Rect } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase, cartoonService } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import {
  accent,
  background,
  banana,
  foreground,
  heading,
  muted,
  paper,
  text,
} from '../shared/drawing';
import { createMarket } from '../shared/market';
import { recordAndModel } from '../shared/record-and-model';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('sonuç ', 'üründe kullanılacaksa?');
  const result = paper(600, 260, '#17232f');
  result.root.position([0, 75]);
  result.root.add([
    text('inceleme bekliyor', 43, { y: -24, fill: accent }),
    text('customer #17 · 3 başarısız deneme', 25, {
      y: 56,
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
  ]);
  view.add([title, result.root]);
  yield loadFonts();
  yield* waitUntil('sync');
  yield* all(title.opacity(0, 0.2), result.root.opacity(0, 0.4));
  result.root.remove();
  title.children(heading('bu uyarıyı ', 'CRM’e taşıyalım.').children());
  const sync = new Layout({ opacity: 0 });
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([-645, 90]);
  warehouse.root.scale(1.35);
  warehouse.root.add(
    text('review_flags', 24, { y: 15, fill: accent, fontFamily: theme.fontFamily.mono }),
  );
  const flag = paper(380, 220, '#17232f');
  flag.root.position([0, 90]);
  const flagValue = text('review_required', 29, {
    y: 55,
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  flag.root.add([
    text('customer #17', 29, { y: -62, fontFamily: theme.fontFamily.mono }),
    text('30 sn · 3 başarısız ödeme', 22, {
      y: -5,
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    flagValue,
  ]);
  const crm = paper(360, 270, '#101315');
  crm.root.position([645, 90]);
  const crmValue = text('—', 26, { y: 66, fill: accent });
  crm.root.add([
    text('CRM · #17', 33, { y: -82 }),
    text('inceleme durumu', 25, { y: -9, fill: muted, fontFamily: theme.fontFamily.mono }),
    crmValue,
  ]);
  const readFlag = cartoonArrow('s16-read-review-flag', [-445, 90], [-235, 90], accent, 0);
  const transfer = cartoonArrow('s16-crm-review-sync', [235, 90], [418, 90], accent, 0);
  sync.add([
    warehouse.root,
    flag.root,
    crm.root,
    readFlag.root,
    transfer.root,
    text('oku', 27, { position: [-340, 6], opacity: () => readFlag.reveal() }),
    text('sync', 27, { position: [326, 6], fill: accent, opacity: () => transfer.reveal() }),
    text('reverse ETL', 34, { position: [0, 358], fill: accent, fontStyle: 'italic' }),
  ]);
  view.add(sync);
  yield* all(title.opacity(1, 0.3), sync.opacity(1, 0.5));
  yield* readFlag.reveal(1, 0.3);
  yield* readFlag.travel(0.7);
  yield* all(readFlag.arrive(), flagValue.opacity(1, 0.3));
  yield* transfer.reveal(1, 0.3);
  yield* transfer.travel(0.7);
  crmValue.text('inceleme bekliyor');
  yield* transfer.arrive();
  yield* waitUntil('model');
  yield* all(title.opacity(0, 0.2), sync.opacity(0, 0.4));
  sync.remove();
  title.children(heading('modelde ise ', 'eğitimin çıktısını', ' dağıtıyoruz.').children());
  const deployment = new Layout({ opacity: 0 });
  const train = paper(340, 230, '#101315');
  train.root.position([-645, 90]);
  train.root.add([
    text('train', 47, { y: -39, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('training data', 26, { y: 44 }),
  ]);
  const artifact = paper(340, 230, '#17232f');
  artifact.root.position([0, 90]);
  const modelName = text('model v1', 43, {
    y: -28,
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  artifact.root.add([modelName, text('artifact', 26, { y: 47, fill: muted })]);
  const service = cartoonService('recommendation service', accent);
  service.root.position([645, 90]);
  service.root.scale(1.1);
  service.caption.fontSize(27);
  const modelTag = new Rect({ position: [27, -64], size: [89, 38], fill: background, opacity: 0 });
  modelTag.add(text('v1', 26, { fill: accent, fontFamily: theme.fontFamily.mono }));
  service.root.add(modelTag);
  const output = cartoonArrow('s16-trained-model-artifact', [-428, 90], [-213, 90], accent, 0);
  const deploy = cartoonArrow('s16-model-deployment', [214, 90], [439, 90], accent, 0);
  deployment.add([
    train.root,
    artifact.root,
    service.root,
    output.root,
    deploy.root,
    text('deploy', 28, { position: [326, 6], fill: accent, opacity: () => deploy.reveal() }),
  ]);
  view.add(deployment);
  yield* all(title.opacity(1, 0.3), deployment.opacity(1, 0.5));
  yield* output.reveal(1, 0.3);
  yield* output.travel(0.8);
  yield* all(output.arrive(), modelName.opacity(1, 0.3));
  yield* waitUntil('deploy');
  yield* deploy.reveal(1, 0.3);
  yield* deploy.travel(0.8);
  yield* all(deploy.arrive(), modelTag.opacity(1, 0.3));
  yield* waitUntil('inference');
  yield* all(title.opacity(0, 0.2), deployment.opacity(0, 0.4));
  service.root.remove();
  deployment.remove();
  service.root.position([585, 90]);
  service.root.opacity(0);
  const app = createMarket();
  app.cart.remove();
  app.root.position([-535, 90]);
  app.root.scale(0.9);
  app.root.opacity(0);
  const fruit = banana();
  fruit.position([-234, -77]);
  fruit.scale(1.6);
  const suggested = paper(550, 146, '#182638');
  suggested.root.position([0, 92]);
  suggested.root.opacity(0);
  suggested.root.add([
    text('birlikte alınanlar', 25, { position: [-225, -40], offset: [-1, 0], fill: muted }),
    text('süt', 37, { position: [-160, 26], offset: [-1, 0] }),
    new Path({
      position: [-215, 25],
      data: 'M -18 -20 L -7 -31 L 17 -31 L 23 -18 L 23 27 L -18 28 Z M -18 -20 L 23 -18 M -7 -31 L -6 -18 L -6 27',
      stroke: foreground,
      fill: '#101315',
      lineWidth: 2.5,
      lineJoin: 'round',
    }),
  ]);
  app.body.add([
    fruit,
    text('muz', 43, { position: [-147, -90], offset: [-1, 0] }),
    text('2 kg', 26, { position: [-147, -43], offset: [-1, 0], fill: muted }),
    suggested.root,
  ]);
  const request = cartoonArrow('s16-recommendation-request', [-195, 13], [367, 13], accent, 0);
  const response = cartoonArrow('s16-recommendation-response', [367, 199], [-195, 199], accent, 0);
  const inference = new Layout({});
  inference.add([
    app.root,
    service.root,
    request.root,
    response.root,
    text('getRecommendations()', 26, {
      position: [86, -77],
      fontFamily: theme.fontFamily.mono,
      opacity: () => request.reveal(),
    }),
    text('recommendations', 27, {
      position: [86, 286],
      fill: accent,
      opacity: () => response.reveal(),
    }),
  ]);
  view.add(inference);
  title.children(heading('kullanıcı ', 'öneri istediğinde…').children());
  yield* all(title.opacity(1, 0.3), app.root.opacity(1, 0.5), service.root.opacity(1, 0.5));
  yield* request.reveal(1, 0.3);
  yield* request.travel(0.9);
  yield* request.arrive();
  yield* modelTag.opacity(0.35, 0.12).to(1, 0.25);
  yield* response.reveal(1, 0.3);
  yield* response.travel(0.9);
  yield* all(response.arrive(), suggested.root.opacity(1, 0.3));
  yield* waitUntil('serving');
  yield* title.opacity(0, 0.2);
  title.children(heading('servis, ', 'hazır modeli', ' kullanıyor.').children());
  yield* title.opacity(1, 0.3);
  yield* request.travel(0.75);
  yield* request.arrive();
  yield* response.travel(0.75);
  yield* response.arrive();
  yield* waitUntil('outputs');
  yield* all(title.opacity(0, 0.2), inference.opacity(0, 0.4));
  inference.remove();
  const relations = recordAndModel();
  relations.root.opacity(0);
  view.add(relations.root);
  title.children(heading('farklı işler için ', 'temsiller ürettik.').children());
  yield* all(title.opacity(1, 0.3), relations.root.opacity(1, 0.5));
  yield* waitUntil('next');
  yield* title.opacity(0, 0.2);
  title.children(heading('hangisi ', 'asıl kayıt?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
