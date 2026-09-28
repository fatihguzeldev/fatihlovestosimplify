import { Layout, makeScene2D, Path, Txt } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonService } from '../../../../../common/cartoon-system';
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
import { reviewOutput } from '../shared/review-output';

export default makeScene2D(function* (view) {
  view.fill(background);
  const { title, result } = reviewOutput();
  view.add([title, result.root]);
  yield loadFonts();

  yield* waitUntil('store');
  yield* title.opacity(0, 0.2);
  title.children(heading('uyarıyı ', 'warehouse’a kaydediyoruz.').children());
  const sync = new Layout({});
  const warehouse = paper(630, 380, '#101315');
  warehouse.root.position([-500, 75]);
  warehouse.root.opacity(0);
  warehouse.root.add([
    text('warehouse', 29, { y: -141, fill: muted }),
    text('review_flags', 27, { y: -93, fill: accent, fontFamily: theme.fontFamily.mono }),
  ]);
  result.root.remove();
  sync.add([warehouse.root, result.root]);
  view.add(sync);
  yield* all(
    title.opacity(1, 0.3),
    result.root.position([-500, 115], 0.9, easeInOutCubic),
    result.root.scale(0.83, 0.9, easeInOutCubic),
  );
  yield* warehouse.root.opacity(1, 0.4);
  yield* warehouse.face.stroke(accent, 0.2).to(foreground, 0.3);

  yield* waitUntil('sync');
  yield* title.opacity(0, 0.2);
  title.children(heading('inceleme ekibi ', 'CRM’i kullanıyor.').children());
  const crm = paper(530, 380, '#101315');
  crm.root.position([535, 75]);
  crm.root.opacity(0);
  const crmValue = text('—', 36, { y: 21, fill: accent });
  const action = paper(315, 58, '#182638');
  action.root.position([0, 116]);
  action.root.opacity(0);
  action.root.add(text('incelemeyi aç', 27, { fill: accent }));
  crm.root.add([
    text('CRM · customer #17', 30, { y: -135 }),
    new Path({ data: 'M -222 -87 L 222 -87', stroke: muted, lineWidth: 1.5, opacity: 0.5 }),
    text('inceleme durumu', 27, { y: -37, fill: muted }),
    crmValue,
    action.root,
  ]);
  const transfer = cartoonArrow('s16-review-to-crm', [-145, 75], [230, 75], accent, 0);
  const syncLabel = text('reverse ETL', 31, {
    position: [38, -13],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  sync.add([crm.root, transfer.root, syncLabel]);
  yield* all(title.opacity(1, 0.3), crm.root.opacity(1, 0.4));
  yield* waitUntil('crm-transfer');
  yield* transfer.reveal(1, 0.4);
  yield* transfer.travel(1);
  yield* transfer.arrive();
  yield* waitUntil('crm-result');
  crmValue.text('inceleme bekliyor');
  yield* crm.face.stroke(accent, 0.2).to(foreground, 0.3);
  yield* waitUntil('crm-action');
  yield* action.root.opacity(1, 0.35);
  yield* waitUntil('reverse-etl');
  yield* title.opacity(0, 0.2);
  title.children(heading('hazırladığımız veriyi ', 'uygulamaya taşıyoruz.').children());
  yield* all(title.opacity(1, 0.3), syncLabel.opacity(1, 0.35));

  yield* waitUntil('model');
  yield* title.opacity(0, 0.2);
  title.children(heading('eğittiğimiz model de ', 'uygulamaya dönecek.').children());
  yield* all(
    title.opacity(1, 0.3),
    sync.scale(0.47, 0.9, easeInOutCubic),
    sync.position([0, -212], 0.9, easeInOutCubic),
    sync.opacity(0.65, 0.6),
  );
  const deployment = new Layout({ y: 225, opacity: 0 });
  const train = paper(410, 210, '#101315');
  train.root.position([-595, 0]);
  train.root.add([
    text('train', 44, { y: -49, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('geçmiş satışlar', 27, { y: 11 }),
    text('+ clickstream', 27, { y: 55, fill: muted }),
  ]);
  const artifact = paper(300, 165, '#17232f');
  artifact.root.position([0, 0]);
  artifact.root.opacity(0);
  artifact.root.add([
    text('model v1', 40, { y: -25, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('öneri modeli', 26, { y: 38 }),
  ]);
  const service = cartoonService('recommendation service', accent);
  service.root.position([595, 0]);
  service.root.scale(0.95);
  service.caption.fontSize(25);
  service.root.opacity(0.28);
  const badge = paper(108, 52, '#17232f');
  badge.root.position([26, -65]);
  badge.root.opacity(0);
  badge.root.add(text('v1', 29, { fill: accent, fontFamily: theme.fontFamily.mono }));
  service.root.add(badge.root);
  const output = cartoonArrow('s16-training-output', [-348, 0], [-192, 0], accent, 0);
  const deploy = cartoonArrow('s16-deploy-model', [196, 0], [417, 0], accent, 0);
  const deployLabel = text('deploy', 28, {
    position: [308, -86],
    fill: accent,
    opacity: () => deploy.reveal(),
  });
  deployment.add([train.root, artifact.root, service.root, output.root, deploy.root, deployLabel]);
  view.add(deployment);
  yield* deployment.opacity(1, 0.4);
  yield* waitUntil('training-output');
  yield* output.reveal(1, 0.35);
  yield* output.travel(0.8);
  yield* output.arrive();
  yield* waitUntil('trained-model');
  yield* artifact.root.opacity(1, 0.35);

  yield* waitUntil('deploy');
  yield* title.opacity(0, 0.2);
  title.children(heading('modeli ', 'öneri servisine', ' yerleştiriyoruz.').children());
  yield* all(title.opacity(1, 0.3), service.root.opacity(1, 0.3), deploy.reveal(1, 0.35));
  const packageCopy = paper(146, 64, '#17232f');
  packageCopy.root.position([0, 0]);
  packageCopy.root.add(text('model v1', 24, { fill: accent, fontFamily: theme.fontFamily.mono }));
  deployment.add(packageCopy.root);
  yield* all(
    deploy.travel(1.1),
    packageCopy.root.position([620, -62], 1.1, easeInOutCubic),
    packageCopy.root.scale(0.65, 1.1),
  );
  yield* all(deploy.arrive(), badge.root.opacity(1, 0.2), packageCopy.root.opacity(0, 0.2));
  packageCopy.root.remove();

  yield* waitUntil('inference');
  yield* title.opacity(0, 0.2);
  title.children(heading('müşteri ', 'muz sayfasını', ' açıyor.').children());
  service.root.remove();
  service.root.position([595, 225]);
  view.add(service.root);
  yield* all(
    sync.opacity(0, 0.4),
    deployment.opacity(0, 0.4),
    service.root.position([-560, 75], 1.1, easeInOutCubic),
    service.root.scale(1.35, 1.1, easeInOutCubic),
  );
  sync.remove();
  deployment.remove();
  const app = createMarket();
  app.cart.remove();
  app.label.text('müşterinin ekranı');
  app.root.position([530, 75]);
  app.root.scale(0.92);
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
  const request = cartoonArrow('s16-serving-request', [190, -5], [-322, -5], accent, 0);
  const response = cartoonArrow('s16-serving-result', [-322, 164], [190, 164], accent, 0);
  const inference = new Layout({});
  inference.add([
    app.root,
    request.root,
    response.root,
    text('getRecommendations()', 25, {
      position: [-65, -89],
      fontFamily: theme.fontFamily.mono,
      opacity: () => request.reveal(),
    }),
    text('recommendations', 27, {
      position: [-65, 250],
      fill: accent,
      opacity: () => response.reveal(),
    }),
  ]);
  view.add(inference);
  yield* all(title.opacity(1, 0.3), app.root.opacity(1, 0.4));
  yield* waitUntil('recommendation-request');
  yield* request.reveal(1, 0.35);
  yield* request.travel(0.9);
  yield* request.arrive();
  yield* waitUntil('model-use');
  yield* badge.face.stroke(accent, 0.25);
  yield* badge.root.scale(1.1, 0.25).to(1, 0.35);
  yield* waitUntil('recommendation-response');
  yield* response.reveal(1, 0.35);
  yield* response.travel(0.9);
  yield* response.arrive();
  yield* waitUntil('recommendation-result');
  yield* all(
    title.opacity(0, 0.2),
    suggested.root.opacity(1, 0.35),
    badge.face.stroke(foreground, 0.3),
  );
  title.children(heading('muz sayfasında ', 'süt önerisi', ' beliriyor.').children());
  yield* title.opacity(1, 0.3);

  yield* waitUntil('serving');
  yield* title.opacity(0, 0.2);
  title.children(heading('analizde ürettik, ', 'uygulamada kullanıyoruz.').children());
  const recap = new Layout({ opacity: 0, y: -232 });
  const crmRecap = text('uyarı → CRM', 29, { x: -475, fill: muted, opacity: 0 });
  const modelRecap = text('model → öneri servisi', 29, { x: 395, fill: accent, opacity: 0 });
  recap.add([crmRecap, modelRecap]);
  view.add(recap);
  yield* all(title.opacity(1, 0.3), recap.opacity(1, 0.4));
  yield* waitUntil('recap-crm');
  yield* crmRecap.opacity(1, 0.35);
  yield* waitUntil('recap-model');
  yield* modelRecap.opacity(1, 0.35);

  yield* waitUntil('outputs');
  yield* all(title.opacity(0, 0.2), inference.opacity(0, 0.4), recap.opacity(0, 0.3));
  inference.remove();
  recap.remove();
  title.children(heading('bu çıktıları ', 'kayıtlardan ürettik.').children());
  yield* all(
    title.opacity(1, 0.3),
    service.root.position([595, 10], 1, easeInOutCubic),
    service.root.scale(0.95, 1, easeInOutCubic),
  );
  const relations = recordAndModel(service);
  relations.records.opacity(0);
  relations.training.opacity(0);
  relations.copy.reveal(0);
  const recordValues = relations.cards.map((card) =>
    card.root
      .children()
      .filter(
        (node) => node instanceof Txt && (node.text() === '#1042' || node.text() === 'amount: 185'),
      ),
  );
  recordValues.flat().forEach((node) => node.opacity(0));
  view.add(relations.root);
  yield* relations.records.opacity(1, 0.45);
  yield* waitUntil('training-recap');
  yield* relations.training.opacity(1, 0.45);
  yield* waitUntil('record-focus');
  yield* title.opacity(0, 0.2);
  title.children(heading('1042 numaralı ', 'satışa dönelim.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('source-record');
  yield* all(...recordValues[0].map((node) => node.opacity(1, 0.35)));
  yield* waitUntil('copy-record');
  yield* relations.copy.reveal(1, 0.3);
  yield* relations.copy.travel(0.65);
  yield* all(relations.copy.arrive(), ...recordValues[1].map((node) => node.opacity(1, 0.35)));

  yield* waitUntil('next');
  yield* title.opacity(0, 0.2);
  title.children(heading('satışın ', 'asıl kaydı hangisi?').children());
  yield* all(title.opacity(1, 0.3), relations.modelBranch.opacity(0.3, 0.5));
  yield* waitUntil('end');
});
