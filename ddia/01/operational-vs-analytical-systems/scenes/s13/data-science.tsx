import { makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, background, heading, muted, paper, text } from '../shared/drawing';
import { salesReportSource } from '../shared/report-source';
import { analysisInputs } from '../shared/data-files';
import {
  browsingFeatures,
  browsingJourney,
  browsingReport,
  clickstreamSource,
} from '../shared/analysis-story';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('bugünkü sorumuz: ', 'ne kadar sattık?');
  const initial = salesReportSource();
  view.add([title, initial.root]);
  yield loadFonts();

  yield* waitUntil('question');
  yield* all(
    title.opacity(0, 0.2),
    initial.warehouse.root.opacity(0, 0.4),
    initial.result.root.opacity(0, 0.4),
  );
  title.children(heading('satın almadan önce ', 'neye baktı?').children());
  yield* all(
    initial.report.root.position([-470, 65], 0.8, easeInOutCubic),
    initial.caption.position([-470, 318], 0.8, easeInOutCubic),
    title.opacity(1, 0.3),
  );
  const journey = browsingJourney();
  journey.root.position([440, 65]);
  journey.root.opacity(0);
  const origin = text('uygulamadaki hareketler · clickstream', 27, {
    position: [440, 318],
    fill: accent,
    opacity: 0,
  });
  view.add([journey.root, origin]);
  yield* all(journey.root.opacity(1, 0.4), origin.opacity(1, 0.4));
  for (const row of journey.rows) {
    yield* row.opacity(1, 0.3);
    yield* waitFor(0.45);
  }
  const missing = text('bu raporda gezinme geçmişi yok.', 31, {
    position: [-470, 400],
    fill: muted,
    opacity: 0,
  });
  view.add(missing);
  yield* missing.opacity(1, 0.35);

  yield* waitUntil('events');
  yield* all(
    title.opacity(0, 0.2),
    initial.root.opacity(0, 0.4),
    origin.opacity(0, 0.3),
    missing.opacity(0, 0.3),
  );
  initial.root.remove();
  title.children(heading('hareketler ', 'event olarak', ' kaydediliyor.').children());
  yield* all(
    journey.root.position([-460, 65], 0.7, easeInOutCubic),
    journey.root.scale(0.93, 0.7),
    title.opacity(1, 0.3),
  );
  const source = clickstreamSource();
  source.root.position([450, 65]);
  source.root.opacity(0);
  source.rows.forEach((row) => row.root.opacity(0));
  const capture = cartoonArrow('s13-capture-events', [-113, 65], [60, 65], accent, 0);
  view.add([source.root, capture.root]);
  yield* source.root.opacity(1, 0.4);
  yield* capture.reveal(1, 0.35);
  for (const row of source.rows) {
    yield* capture.travel(0.5);
    yield* all(capture.arrive(), row.root.opacity(1, 0.25));
  }

  yield* waitUntil('schema');
  yield* all(title.opacity(0, 0.2), journey.root.opacity(0, 0.4), capture.root.opacity(0, 0.3));
  journey.root.remove();
  capture.root.remove();
  title.children(heading('bu rapor için ', 'önce şemayı', ' belirliyoruz.').children());
  yield* source.root.position([-450, 65], 0.8, easeInOutCubic);
  const report = browsingReport();
  report.root.position([480, 65]);
  report.root.opacity(0);
  const schema = text('schema-on-write', 32, {
    position: [480, 298],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const prepare = cartoonArrow('s13-source-to-report', [-69, 65], [125, 65], accent, 0);
  const operation = text('view → say', 23, {
    position: [29, -20],
    fontFamily: theme.fontFamily.mono,
    fill: muted,
    opacity: 0,
  });
  view.add([report.root, schema, prepare.root, operation]);
  yield* all(title.opacity(1, 0.3), report.root.opacity(1, 0.45));
  yield* schema.opacity(1, 0.3);

  yield* waitUntil('report');
  yield* title.opacity(0, 0.2);
  title.children(heading('hangi ürün ', 'kaç kez görüntülendi?').children());
  yield* all(title.opacity(1, 0.3), operation.opacity(1, 0.3), prepare.reveal(1, 0.35));
  for (const row of source.rows.slice(0, 2)) {
    yield* all(row.highlight.opacity(1, 0.25), row.action.fill(accent, 0.25));
    yield* waitFor(0.3);
  }
  yield* prepare.travel(0.8);
  yield* all(prepare.arrive(), report.values.opacity(1, 0.35));

  yield* waitUntil('features');
  yield* all(
    title.opacity(0, 0.2),
    report.root.opacity(0, 0.35),
    schema.opacity(0, 0.3),
    prepare.root.opacity(0, 0.3),
    operation.opacity(0, 0.3),
  );
  title.children(heading('öneri modeli için ', 'başka bir temsil.').children());
  const features = browsingFeatures();
  features.root.position([470, -15]);
  features.root.opacity(0);
  const encode = cartoonArrow('s13-source-to-features', [-64, 45], [112, -15], accent, 0);
  const featureLabel = text('feature engineering', 28, {
    position: [470, -190],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const training = paper(310, 115, '#101315');
  training.root.position([470, 338]);
  training.root.opacity(0);
  training.root.add([
    text('train', 35, { y: -17, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('öneri modeli', 23, { y: 28 }),
  ]);
  const train = cartoonArrow('s13-feature-training', [0, 0], [0, 128], accent, 0);
  train.root.position([470, 139]);
  view.add([features.root, encode.root, featureLabel, training.root, train.root]);
  yield* all(title.opacity(1, 0.3), features.root.opacity(1, 0.4), featureLabel.opacity(1, 0.3));
  yield* all(
    ...source.rows.map((row) => row.highlight.opacity(1, 0.3)),
    ...source.rows.map((row) => row.stamp.fill(accent, 0.3)),
    source.rows[2].action.fill(accent, 0.3),
  );
  yield* encode.reveal(1, 0.3);
  yield* encode.travel(0.8);
  yield* all(encode.arrive(), features.values.opacity(1, 0.35));
  yield* waitFor(0.6);
  yield* training.root.opacity(1, 0.35);
  yield* train.reveal(1, 0.35);
  yield* train.travel(0.7);
  yield* train.arrive();

  yield* waitUntil('preserve');
  yield* all(
    title.opacity(0, 0.2),
    features.root.opacity(0, 0.35),
    featureLabel.opacity(0, 0.3),
    encode.root.opacity(0, 0.3),
    training.root.opacity(0, 0.35),
    train.root.opacity(0, 0.3),
  );
  title.children(heading('yarının bütün sorularını ', 'bugünden bilmiyoruz.').children());
  const inputs = analysisInputs();
  inputs.files.forEach((file) => file.root.opacity(0));
  view.add(inputs.root);
  yield* all(
    source.root.position([-220, 90], 0.9, easeInOutCubic),
    source.root.scale((440 * 0.82) / 690, 0.9, easeInOutCubic),
    ...source.rows.map((row) => row.highlight.opacity(0, 0.3)),
    title.opacity(1, 0.3),
  );
  yield* all(source.root.opacity(0, 0.25), inputs.files[1].root.opacity(1, 0.25));
  source.root.remove();
  for (const index of [0, 2, 3]) {
    yield* inputs.files[index].root.opacity(1, 0.35);
    yield* waitFor(0.2);
  }
  yield* waitUntil('next');
  yield* title.opacity(0, 0.2);
  title.children(heading('kaynak veriyi ', 'nasıl saklayacağız?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
