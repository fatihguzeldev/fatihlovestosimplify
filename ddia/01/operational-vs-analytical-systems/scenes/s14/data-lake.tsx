import { Layout, Path, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, paper, text } from '../shared/drawing';
import { analysisInputs } from '../shared/data-files';
import { browsingFeatures, browsingReport, clickstreamSource } from '../shared/analysis-story';
import { lakeConsumers } from '../shared/lake-system';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('kaynak veriyi ', 'nasıl saklayacağız?');
  const inputs = analysisInputs();
  const collection = new Layout({ y: 75 });
  const collectionOutline = new Path({
    data: 'M -860 -228 Q 0 -232 859 -228 L 857 228 Q 0 232 -858 228 Z',
    stroke: foreground,
    lineWidth: 2.6,
    lineCap: 'round',
    lineJoin: 'round',
    end: 0,
  });
  collectionOutline.opacity(() => (collectionOutline.end() > 0 ? 1 : 0));
  const collectionLabels = new Layout({ opacity: 0 });
  collectionLabels.add([
    text('data lake', 36, { position: [-790, -171], offset: [-1, 0], fill: accent }),
    text('kaynak biçimindeki kopyalar', 26, { position: [791, -171], offset: [1, 0], fill: muted }),
  ]);
  collection.add([collectionOutline, collectionLabels]);
  view.add([collection, inputs.root, title]);
  yield loadFonts();

  yield* waitUntil('files');
  yield* title.opacity(0, 0.2);
  title.children(heading('kaynak biçimini ', 'koruyarak saklıyoruz.').children());
  yield* all(
    title.opacity(1, 0.3),
    collectionOutline.end(1, 0.85, easeInOutCubic),
    ...inputs.files.map((file) => file.root.y(125, 0.6, easeInOutCubic)),
  );
  yield* collectionLabels.opacity(1, 0.3);

  yield* waitUntil('read');
  yield* all(title.opacity(0, 0.2), collection.opacity(0, 0.4), inputs.root.opacity(0, 0.4));
  collection.remove();
  inputs.root.remove();
  title.children(heading('şemayı ', 'kullanırken yorumluyoruz.').children());
  const reading = new Layout({ opacity: 0 });
  const boundary = paper(780, 580);
  boundary.root.position([-460, 60]);
  boundary.face.stroke(muted);
  boundary.root.add(
    text('data lake', 31, { position: [-339, -245], offset: [-1, 0], fill: accent }),
  );
  const source = clickstreamSource();
  source.root.position([-460, 95]);
  const lens = paper(610, 240, '#101315');
  lens.root.position([470, 80]);
  lens.root.add([
    text('event     product     time', 26, {
      y: -30,
      fill: accent,
      fontFamily: theme.fontFamily.mono,
    }),
    text('gereken alanları oku', 30, { y: 41 }),
  ]);
  const schema = text('schema-on-read', 33, {
    position: [470, -224],
    fill: accent,
    fontStyle: 'italic',
  });
  const interpretation = text('okurken yapıyı yorumla', 27, { position: [470, -178], fill: muted });
  reading.add([boundary.root, source.root, lens.root, schema, interpretation]);
  view.add(reading);
  yield* all(title.opacity(1, 0.3), reading.opacity(1, 0.5));
  yield* source.rows[0].highlight.opacity(1, 0.35);
  yield* source.rows[0].action.fill(accent, 0.35);

  yield* waitUntil('report');
  yield* all(title.opacity(0, 0.2), lens.root.opacity(0, 0.3));
  lens.root.remove();
  title.children(heading('rapor için ', 'tablo hazırlıyoruz.').children());
  const report = browsingReport();
  report.root.position([470, 80]);
  report.root.opacity(0);
  const toReport = cartoonArrow('s14-raw-events-to-report', [-28, 80], [114, 80], accent, 0);
  reading.add([report.root, toReport.root]);
  yield* all(title.opacity(1, 0.3), report.root.opacity(1, 0.4));
  yield* all(
    source.rows[1].highlight.opacity(1, 0.3),
    source.rows[1].action.fill(accent, 0.3),
    toReport.reveal(1, 0.35),
  );
  yield* toReport.travel(0.75);
  yield* all(toReport.arrive(), report.values.opacity(1, 0.35));

  yield* waitUntil('features');
  yield* all(
    title.opacity(0, 0.2),
    toReport.root.opacity(0, 0.25),
    interpretation.opacity(0, 0.25),
  );
  title.children(heading('model için ', 'farklı alanları', ' işliyoruz.').children());
  yield* all(
    report.root.position([470, -48], 0.65, easeInOutCubic),
    report.root.scale(0.8, 0.65),
    title.opacity(1, 0.3),
  );
  const reportRoute = cartoonArrow('s14-report-consumer', [-26, -48], [184, -48], accent, 0);
  const features = browsingFeatures();
  features.root.position([470, 298]);
  features.root.scale(0.8);
  features.root.opacity(0);
  const featureLabel = text('feature engineering', 27, {
    position: [470, 150],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const toFeatures = cartoonArrow('s14-raw-events-to-features', [-26, 236], [163, 298], accent, 0);
  reading.add([reportRoute.root, features.root, featureLabel, toFeatures.root]);
  yield* all(
    reportRoute.reveal(1, 0.3),
    features.root.opacity(1, 0.4),
    featureLabel.opacity(1, 0.3),
  );
  yield* all(
    source.rows[2].highlight.opacity(1, 0.3),
    source.rows[2].action.fill(accent, 0.3),
    ...source.rows.map((row) => row.stamp.fill(accent, 0.3)),
  );
  yield* toFeatures.reveal(1, 0.35);
  yield* toFeatures.travel(0.75);
  yield* all(toFeatures.arrive(), features.values.opacity(1, 0.35));

  yield* waitUntil('reuse');
  yield* title.opacity(0, 0.2);
  title.children(heading('yeni sorularla ', 'kaynağa dönebiliriz.').children());
  yield* title.opacity(1, 0.3);
  yield* all(
    ...source.rows.map((row) => row.highlight.opacity(0, 0.3)),
    source.face.stroke(accent, 0.3),
  );
  for (const row of source.rows) {
    yield* row.highlight.opacity(1, 0.25);
    yield* waitFor(0.25);
    yield* row.highlight.opacity(0, 0.25);
  }
  yield* source.face.stroke(foreground, 0.35);

  yield* waitUntil('consumers');
  yield* all(title.opacity(0, 0.2), reading.opacity(0, 0.4));
  reading.remove();
  title.children(heading('aynı kaynaklardan ', 'farklı yollar.').children());
  const consumers = lakeConsumers();
  consumers.root.opacity(0);
  consumers.features.root.opacity(0);
  consumers.train.root.opacity(0);
  consumers.readFeatures.reveal(0);
  consumers.training.reveal(0);
  consumers.readSales.reveal(0);
  consumers.load.reveal(0);
  consumers.warehouse.root.opacity(0.22);
  view.add(consumers.root);
  yield* all(title.opacity(1, 0.3), consumers.root.opacity(1, 0.5));
  yield* consumers.readSales.reveal(1, 0.3);
  yield* consumers.readSales.travel(0.6);
  yield* consumers.readSales.arrive();
  yield* consumers.load.reveal(1, 0.3);
  yield* consumers.load.travel(0.6);
  yield* all(consumers.load.arrive(), consumers.warehouse.root.opacity(1, 0.3));
  yield* all(consumers.features.root.opacity(1, 0.4), consumers.train.root.opacity(1, 0.4));
  yield* consumers.readFeatures.reveal(1, 0.3);
  yield* consumers.readFeatures.travel(0.6);
  yield* consumers.readFeatures.arrive();
  yield* consumers.training.reveal(1, 0.3);
  yield* consumers.training.travel(0.6);
  yield* consumers.training.arrive();

  yield* waitUntil('meaning');
  yield* title.opacity(0, 0.2);
  title.children(heading('alanların anlamını ', 'yine bilmeliyiz.').children());
  const meaning = text('view → ürün sayfası görüntülendi', 25, {
    position: [-540, 381],
    fill: muted,
    opacity: 0,
  });
  view.add(meaning);
  yield* all(
    title.opacity(1, 0.3),
    meaning.opacity(1, 0.3),
    consumers.lake.files[1].face.stroke(accent, 0.3),
  );
  yield* waitUntil('next');
  yield* all(
    title.opacity(0, 0.2),
    meaning.opacity(0, 0.2),
    consumers.lake.files[1].face.stroke(foreground, 0.3),
  );
  title.children(heading('peki, gelen kayıt ', 'eksikse?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
