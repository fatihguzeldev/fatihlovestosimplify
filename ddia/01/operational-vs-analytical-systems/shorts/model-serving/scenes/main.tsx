import { Line, Path, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  banana,
  cartoonArrow,
  cartoonService,
  foreground,
  heading,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('eğitimden ', 'çalışan özelliğe.');
  const training = paper(810, 220, '#101315');
  training.root.position([0, -340]);
  training.root.add([
    text('training data', 30, { y: -73, fill: muted }),
    text('geçmiş satışlar', 39, { y: -8 }),
    text('+ gezinme kayıtları', 35, { y: 54, fill: accent }),
  ]);
  const artifact = paper(360, 150, '#17232f');
  artifact.root.position([0, 20]);
  artifact.root.opacity(0);
  artifact.root.add([
    text('model v1', 43, { y: -25, fill: accent, fontFamily: 'IBM Plex Mono' }),
    text('öneri modeli', 28, { y: 37 }),
  ]);
  const train = cartoonArrow('short-serving-train-model', [0, -195], [0, -100], accent, 0);
  const trainLabel = text('train', 30, {
    position: [-95, -145],
    offset: [1, 0],
    fill: accent,
    opacity: 0,
  });
  const service = cartoonService('öneri servisi', accent);
  service.root.position([0, 450]);
  service.root.scale(1.25);
  service.root.opacity(0.3);
  const badge = paper(180, 57, '#17232f');
  badge.root.position([0, 35]);
  badge.root.opacity(0);
  badge.root.add(text('model v1', 27, { fill: accent, fontFamily: 'IBM Plex Mono' }));
  service.root.add(badge.root);
  const deploy = cartoonArrow('short-serving-deploy-model', [0, 130], [0, 285], accent, 0);
  const deployLabel = text('deploy', 30, {
    position: [-100, 205],
    offset: [1, 0],
    fill: accent,
    opacity: 0,
  });

  const app = paper(820, 430, '#101315');
  app.root.position([0, 545]);
  app.root.opacity(0);
  app.root.add([
    text('market · muz', 31, { position: [-350, -158], offset: [-1, 0] }),
    new Line({
      points: [
        [-355, -112],
        [355, -112],
      ],
      stroke: muted,
      lineWidth: 2,
    }),
    text('muz', 40, { position: [-200, 48] }),
  ]);
  const fruit = banana();
  fruit.position([-200, -22]);
  fruit.scale(1.35);
  app.root.add(fruit);
  const suggested = paper(340, 175, '#17232f');
  suggested.root.position([170, 25]);
  suggested.root.opacity(0);
  suggested.root.add([
    text('önerilen ürün', 25, { y: -56, fill: muted }),
    new Path({
      position: [-90, 25],
      data: 'M -24 -25 L -15 -45 L 15 -45 L 24 -25 L 24 43 L -24 43 Z M -24 -25 L 24 -25 M -15 -45 L -15 -58 L 15 -58 L 15 -45 M -13 2 L 13 2 M -13 10 L 13 10',
      stroke: foreground,
      lineWidth: 2.5,
      lineJoin: 'round',
      lineCap: 'round',
    }),
    text('süt', 40, { position: [40, 24], fill: accent }),
  ]);
  app.root.add(suggested.root);
  const request = cartoonArrow(
    'short-serving-inference-request',
    [-120, 300],
    [-120, 110],
    accent,
    0,
  );
  const response = cartoonArrow(
    'short-serving-inference-response',
    [120, 110],
    [120, 300],
    accent,
    0,
  );
  const requestLabel = text('öneri isteği', 28, { position: [-270, 208], opacity: 0 });
  const responseLabel = text('süt önerisi', 28, {
    position: [270, 208],
    fill: accent,
    opacity: 0,
  });
  const summary = text('', 39, { position: [0, 825], fill: accent });
  view.add([
    title,
    training.root,
    artifact.root,
    train.root,
    trainLabel,
    service.root,
    deploy.root,
    deployLabel,
    app.root,
    request.root,
    response.root,
    requestLabel,
    responseLabel,
    summary,
  ]);
  yield loadFonts();

  yield* waitUntil('model');
  yield* all(train.reveal(1, 0.25), trainLabel.opacity(1, 0.25));
  yield* train.travel(0.6);
  yield* all(train.arrive(), artifact.root.opacity(1, 0.3));
  yield* waitUntil('deploy');
  title.children(heading('hazır modeli ', 'servise yerleştiriyoruz.').children());
  const copy = paper(180, 57, '#17232f');
  copy.root.position([0, 20]);
  copy.root.add(text('model v1', 27, { fill: accent, fontFamily: 'IBM Plex Mono' }));
  view.add(copy.root);
  yield* all(deploy.reveal(1, 0.25), deployLabel.opacity(1, 0.25), service.root.opacity(1, 0.25));
  yield* all(deploy.travel(0.9), copy.root.position([0, 495], 0.9));
  yield* all(deploy.arrive(), badge.root.opacity(1, 0.25), copy.root.opacity(0, 0.25));
  copy.root.remove();

  yield* waitUntil('inference');
  title.children(heading('muz sayfası ', 'öneri istiyor.').children());
  yield* all(
    training.root.opacity(0, 0.3),
    artifact.root.opacity(0, 0.3),
    train.root.opacity(0, 0.3),
    trainLabel.opacity(0, 0.3),
    deploy.root.opacity(0, 0.3),
    deployLabel.opacity(0, 0.3),
  );
  service.caption.y(-155);
  yield* all(service.root.position([0, -70], 0.8), app.root.opacity(1, 0.5));
  yield* waitUntil('request');
  yield* all(request.reveal(1, 0.25), requestLabel.opacity(1, 0.25));
  yield* request.travel(1.1);
  yield* request.arrive();
  yield* waitUntil('use-model');
  title.children(heading('servis ', 'önceden eğitilmiş modeli', ' kullanıyor.').children());
  yield* badge.face.stroke(accent, 0.3);
  yield* waitUntil('response');
  yield* all(response.reveal(1, 0.25), responseLabel.opacity(1, 0.25));
  yield* response.travel(1.1);
  yield* response.arrive();
  yield* waitUntil('result');
  yield* suggested.root.opacity(1, 0.3);
  yield* waitUntil('conclusion');
  title.children(heading('hazır model, ', 'uygulamadaki öneriye', ' dönüştü.').children());
  summary.text('eğitim → deployment → kullanım');
  yield* waitUntil('end');
});
