import { Layout, Path, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, paper, text } from '../shared/drawing';
import { analysisInputs } from '../shared/data-files';
import { browsingFeatures, browsingReport, clickstreamSource } from '../shared/analysis-story';
import { lakeConsumers } from '../shared/lake-system';
import { missingRecordIntro } from '../shared/missing-record';

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

  yield* waitUntil('lake');
  yield* title.opacity(0, 0.2);
  title.children(heading('kaynak kopyalarını ', 'data lake’te', ' topluyoruz.').children());
  yield* all(
    title.opacity(1, 0.3),
    collectionOutline.end(1, 0.85, easeInOutCubic),
    ...inputs.files.map((file) => file.root.y(125, 0.6, easeInOutCubic)),
  );
  yield* collectionLabels.opacity(1, 0.3);

  yield* waitUntil('files');
  yield* title.opacity(0, 0.2);
  title.children(heading('kaynak biçimini ', 'koruyarak saklıyoruz.').children());
  yield* all(title.opacity(1, 0.3), inputs.files[0].face.stroke(accent, 0.3));
  yield* waitUntil('clickstream-file');
  yield* all(
    inputs.files[0].face.stroke(foreground, 0.25),
    inputs.files[1].face.stroke(accent, 0.25),
  );
  yield* waitUntil('review-file');
  yield* all(
    inputs.files[1].face.stroke(foreground, 0.25),
    inputs.files[2].face.stroke(accent, 0.25),
  );
  yield* waitUntil('image-file');
  yield* all(
    inputs.files[2].face.stroke(foreground, 0.25),
    inputs.files[3].face.stroke(accent, 0.25),
  );
  yield* waitUntil('formats');
  yield* inputs.files[3].face.stroke(foreground, 0.35);

  yield* waitUntil('prepare');
  yield* title.opacity(0, 0.2);
  title.children(heading('kullanacağımız işe göre ', 'hazırlıyoruz.').children());
  yield* title.opacity(1, 0.3);

  yield* waitUntil('read');
  yield* all(title.opacity(0, 0.2), collection.opacity(0, 0.4), inputs.root.opacity(0, 0.4));
  collection.remove();
  inputs.root.remove();
  title.children(heading('kayıtların zaten ', 'bir yapısı var.').children());
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
  lens.root.opacity(0);
  const field = text('event · product · time', 29, {
    y: -30,
    fill: accent,
    fontFamily: theme.fontFamily.mono,
  });
  const value = text('kaydın alanları', 30, { y: 41 });
  lens.root.add([field, value]);
  const schema = text('schema-on-read', 33, {
    position: [470, -224],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const interpretation = text('alanları okurken yorumla', 27, {
    position: [470, -178],
    fill: muted,
    opacity: 0,
  });
  reading.add([boundary.root, source.root, lens.root, schema, interpretation]);
  view.add(reading);
  yield* all(title.opacity(1, 0.3), reading.opacity(1, 0.5));

  yield* waitUntil('fields');
  yield* all(lens.root.opacity(1, 0.4), source.rows[0].highlight.opacity(1, 0.35));
  yield* waitUntil('interpret');
  yield* title.opacity(0, 0.2);
  title.children(heading('alanları ', 'okurken yorumluyoruz.').children());
  yield* all(title.opacity(1, 0.3), interpretation.opacity(1, 0.3));

  yield* waitUntil('time-field');
  yield* all(field.opacity(0, 0.15), value.opacity(0, 0.15));
  field.text('time');
  value.text('"14:00:00" → zaman');
  yield* all(
    field.opacity(1, 0.25),
    value.opacity(1, 0.25),
    source.rows[0].stamp.fill(accent, 0.25),
  );

  yield* waitUntil('event-field');
  yield* all(field.opacity(0, 0.15), value.opacity(0, 0.15));
  field.text('event');
  value.text('"view" → hareket türü');
  yield* all(
    field.opacity(1, 0.25),
    value.opacity(1, 0.25),
    source.rows[0].stamp.fill(foreground, 0.25),
    source.rows[0].action.fill(accent, 0.25),
  );
  yield* waitUntil('schema-on-read');
  yield* schema.opacity(1, 0.4);

  yield* waitUntil('report');
  yield* all(title.opacity(0, 0.2), lens.root.opacity(0, 0.3), interpretation.opacity(0, 0.3));
  lens.root.remove();
  title.children(heading('rapor için ', 'tablo hazırlıyoruz.').children());
  const report = browsingReport();
  report.root.position([470, 80]);
  report.root.opacity(0);
  const reportCells = report.values.children();
  reportCells.forEach((cell) => cell.opacity(0));
  report.values.opacity(1);
  const toReport = cartoonArrow('s14-raw-events-to-report', [-28, 80], [114, 80], accent, 0);
  reading.add([report.root, toReport.root]);
  yield* all(title.opacity(1, 0.3), report.root.opacity(1, 0.4));
  yield* waitUntil('report-fields');
  yield* all(source.rows[1].highlight.opacity(1, 0.3), source.rows[1].action.fill(accent, 0.3));
  yield* waitUntil('report-count');
  yield* toReport.reveal(1, 0.35);
  yield* toReport.travel(0.75);
  yield* toReport.arrive();
  yield* waitUntil('banana-count');
  yield* all(...reportCells.slice(0, 2).map((cell) => cell.opacity(1, 0.3)));
  yield* waitUntil('milk-count');
  yield* all(...reportCells.slice(2, 4).map((cell) => cell.opacity(1, 0.3)));

  yield* waitUntil('features');
  yield* all(title.opacity(0, 0.2), toReport.root.opacity(0, 0.25), schema.opacity(0, 0.25));
  title.children(heading('model için ', 'kaynağı yeniden', ' okuyoruz.').children());
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
  yield* waitUntil('feature-source');
  yield* all(source.face.stroke(accent, 0.3), toFeatures.reveal(1, 0.35));
  yield* waitUntil('cart-event');
  yield* all(source.rows[2].highlight.opacity(1, 0.3), source.rows[2].action.fill(accent, 0.3));
  yield* waitUntil('event-times');
  yield* all(...source.rows.map((row) => row.stamp.fill(accent, 0.3)));
  yield* toFeatures.travel(0.75);
  yield* all(toFeatures.arrive(), features.values.opacity(1, 0.35));

  yield* waitUntil('two-outputs');
  yield* title.opacity(0, 0.2);
  title.children(heading('aynı kaynaktan ', 'iki farklı çıktı.').children());
  yield* all(
    title.opacity(1, 0.3),
    report.face.stroke(accent, 0.3),
    features.face.stroke(accent, 0.3),
  );
  yield* waitUntil('model-source');
  yield* all(report.root.opacity(0.3, 0.35), reportRoute.root.opacity(0.3, 0.35));
  yield* toFeatures.travel(0.8);
  yield* toFeatures.arrive();
  yield* waitUntil('reuse');
  yield* title.opacity(0, 0.2);
  title.children(heading('kaynak kayıtlar ', 'yerinde duruyor.').children());
  yield* all(
    title.opacity(1, 0.3),
    report.root.opacity(1, 0.35),
    reportRoute.root.opacity(1, 0.35),
    report.face.stroke(foreground, 0.3),
    features.face.stroke(foreground, 0.3),
    ...source.rows.map((row) => row.highlight.opacity(0, 0.3)),
    ...source.rows.map((row) => row.stamp.fill(foreground, 0.3)),
  );
  yield* waitUntil('preserved-times');
  yield* all(...source.rows.map((row) => row.stamp.fill(accent, 0.3)));
  yield* waitUntil('preserved-cart');
  yield* source.rows[2].highlight.opacity(1, 0.3);
  yield* waitUntil('new-question');
  yield* title.opacity(0, 0.2);
  title.children(heading('yeni sorularla ', 'kaynağa dönebiliriz.').children());
  yield* all(title.opacity(1, 0.3), source.rows[2].highlight.opacity(0, 0.3));
  yield* all(reportRoute.travel(0.85), toFeatures.travel(0.85));
  yield* all(reportRoute.arrive(), toFeatures.arrive(), source.face.stroke(foreground, 0.3));

  yield* waitUntil('consumers');
  yield* all(title.opacity(0, 0.2), reading.opacity(0, 0.4));
  reading.remove();
  title.children(heading('aynı kaynaklardan ', 'farklı yollar.').children());
  const consumers = lakeConsumers();
  consumers.root.opacity(0);
  consumers.transform.root.opacity(0.22);
  consumers.features.root.opacity(0);
  consumers.train.root.opacity(0);
  consumers.readFeatures.reveal(0);
  consumers.training.reveal(0);
  consumers.readSales.reveal(0);
  consumers.load.reveal(0);
  consumers.warehouse.root.opacity(0.22);
  view.add(consumers.root);
  yield* all(title.opacity(1, 0.3), consumers.root.opacity(1, 0.5));
  yield* waitUntil('warehouse-read');
  yield* all(consumers.lake.files[0].face.stroke(accent, 0.3), consumers.readSales.reveal(1, 0.3));
  yield* consumers.readSales.travel(0.6);
  yield* all(consumers.readSales.arrive(), consumers.transform.root.opacity(1, 0.3));
  yield* waitUntil('warehouse-load');
  yield* consumers.load.reveal(1, 0.3);
  yield* consumers.load.travel(0.6);
  yield* all(consumers.load.arrive(), consumers.warehouse.root.opacity(1, 0.3));
  yield* waitUntil('training-source');
  yield* all(consumers.features.root.opacity(0.22, 0.35), consumers.train.root.opacity(0.22, 0.35));
  yield* waitUntil('training-features');
  yield* consumers.readFeatures.reveal(1, 0.3);
  yield* consumers.readFeatures.travel(0.6);
  yield* all(consumers.readFeatures.arrive(), consumers.features.root.opacity(1, 0.3));
  yield* waitUntil('training-output');
  yield* consumers.training.reveal(1, 0.3);
  yield* consumers.training.travel(0.6);
  yield* all(consumers.training.arrive(), consumers.train.root.opacity(1, 0.3));
  yield* waitUntil('shared-sources');
  yield* consumers.lake.face.stroke(accent, 0.35).to(foreground, 0.6);
  yield* consumers.lake.files[0].face.stroke(foreground, 0.3);

  yield* waitUntil('meaning');
  yield* title.opacity(0, 0.2);
  title.children(heading('alanların anlamını ', 'bilmeliyiz.').children());
  const meaning = text('view → ürün sayfası görüntülendi', 25, {
    position: [-540, 381],
    fill: muted,
    opacity: 0,
  });
  view.add(meaning);
  yield* title.opacity(1, 0.3);
  yield* waitUntil('meaning-view');
  yield* all(meaning.opacity(1, 0.3), consumers.lake.files[1].face.stroke(accent, 0.3));
  yield* waitUntil('quality');
  yield* title.opacity(0, 0.2);
  title.children(heading('gereken bilgiler ', 'kaydın içinde mi?').children());
  yield* title.opacity(1, 0.3);

  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.35), meaning.opacity(0, 0.35), consumers.root.opacity(0, 0.35));
  title.remove();
  meaning.remove();
  consumers.root.remove();
  const intro = missingRecordIntro();
  intro.title.opacity(0);
  intro.record.root.opacity(0);
  intro.record.root.y(155);
  intro.missing.opacity(0);
  view.add([intro.title, intro.record.root]);
  yield* intro.title.opacity(1, 0.4);
  yield* waitUntil('missing-record');
  yield* all(intro.record.root.opacity(1, 0.4), intro.record.root.y(100, 0.65, easeInOutCubic));
  yield* waitUntil('missing-store');
  yield* all(
    intro.missing.opacity(1, 0.25),
    intro.record.face.stroke(accent, 0.25).to(foreground, 0.35),
  );
  yield* waitUntil('store-question');
  yield* intro.missing.scale(1.16, 0.3).to(1, 0.4);
  yield* waitUntil('end');
});
