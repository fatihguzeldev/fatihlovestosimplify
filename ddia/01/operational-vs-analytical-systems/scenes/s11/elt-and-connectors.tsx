import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, text } from '../shared/drawing';
import { etlPipeline } from '../shared/etl-pipeline';
import { crmPipeline } from './crm-pipeline';
import { eltExample } from './elt-example';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('dönüşümü ', 'önce yapmak', ' şart mı?');
  const pipeline = etlPipeline();
  pipeline.fields.opacity(1);
  pipeline.region.opacity(1);
  pipeline.stored.opacity(1);
  view.add([title, pipeline.root]);
  yield loadFonts();
  yield* waitUntil('etl');
  const letters = ['E', 'T', 'L'].map((letter, i) =>
    text(letter, 67, {
      position: [-60 + i * 60, -226],
      fill: i === 1 ? accent : foreground,
      fontFamily: theme.fontFamily.mono,
      opacity: 0,
    }),
  );
  view.add(letters);
  yield* all(...letters.map((letter) => letter.opacity(1, 0.3)));
  yield* waitUntil('elt');
  yield* all(title.opacity(0, 0.2), pipeline.root.opacity(0, 0.4));
  title.children(heading('önce iki kaynağın kayıtlarını ', 'yüklüyoruz.').children());
  yield* all(title.opacity(1, 0.3), letters[1].y(-263, 0.25), letters[2].y(-190, 0.25));
  yield* all(letters[1].x(60, 0.55), letters[2].x(0, 0.55));
  yield* all(letters[1].y(-226, 0.25), letters[2].y(-226, 0.25));
  const alternative = eltExample();
  view.add(alternative.root);
  yield* alternative.root.opacity(1, 0.5);
  for (const [i, record] of [alternative.sales, alternative.stores].entries()) {
    const load = alternative.loads[i];
    yield* load.reveal(1, 0.35);
    yield* load.travel(0.75);
    yield* all(load.arrive(), record.root.opacity(1, 0.3));
  }
  yield* alternative.pending.opacity(1, 0.3);
  yield* waitUntil('transform');
  yield* all(title.opacity(0, 0.2), alternative.pending.opacity(0, 0.2));
  title.children(heading('mağaza bilgisini ', 'warehouse içinde', ' ekliyoruz.').children());
  yield* all(
    title.opacity(1, 0.3),
    alternative.sales.cells[1].fill(accent, 0.3),
    alternative.stores.cells[0].fill(accent, 0.3),
    alternative.match.opacity(1, 0.3),
  );
  yield* all(...alternative.transforms.map((arrow) => arrow.reveal(1, 0.5)));
  yield* all(...alternative.transforms.map((arrow) => arrow.travel(0.85)));
  yield* all(
    ...alternative.transforms.map((arrow) => arrow.arrive()),
    alternative.result.root.opacity(1, 0.4),
  );
  yield* waitUntil('return');
  yield* all(
    title.opacity(0, 0.2),
    alternative.root.opacity(0, 0.4),
    ...letters.map((letter) => letter.opacity(0, 0.3)),
  );
  alternative.root.remove();
  title.children(heading('bizim örnekte ', 'ETL ile devam.').children());
  yield* all(title.opacity(1, 0.3), pipeline.root.opacity(1, 0.5));
  yield* waitUntil('crm');
  yield* all(title.opacity(0, 0.2), pipeline.root.opacity(0, 0.4));
  pipeline.root.remove();
  title.children(heading('bu kaynağa ', 'API üzerinden', ' erişiyoruz.').children());
  const crm = crmPipeline();
  crm.root.opacity(0);
  view.add(crm.root);
  yield* all(title.opacity(1, 0.3), crm.root.opacity(1, 0.5));
  yield* waitUntil('connector');
  yield* crm.request.reveal(1, 0.35);
  yield* crm.request.travel(0.7);
  yield* crm.request.arrive();
  yield* crm.response.reveal(1, 0.35);
  yield* crm.response.travel(0.7);
  yield* crm.response.arrive();
  yield* all(...crm.connector.lights.map((light) => light.opacity(1, 0.15).to(0.65, 0.3)));
  yield* crm.load.reveal(1, 0.35);
  yield* crm.load.travel(0.7);
  yield* all(crm.load.arrive(), crm.customers.opacity(1, 0.3));
  yield* waitUntil('own-analysis');
  yield* title.opacity(0, 0.2);
  title.children(heading('analizi ', 'kendi sistemimizde', ' yapabiliriz.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.2), crm.root.opacity(0, 0.4));
  crm.root.remove();
  const choice = new Layout({ opacity: 0 });
  const operational = cartoonDatabase('transactions', accent);
  operational.root.position([-400, 70]);
  operational.root.scale(1.6);
  const analytical = cartoonDatabase('analytics', accent);
  analytical.root.position([400, 70]);
  analytical.root.scale(1.6);
  const link = cartoonArrow('s11-workload-separation', [-170, 70], [170, 70], accent);
  choice.add([
    operational.root,
    analytical.root,
    link.root,
    text('ETL', 30, { y: -15, fill: muted, fontFamily: theme.fontFamily.mono }),
  ]);
  view.add(choice);
  title.children(heading('ikisini ', 'tek sistemde', ' çalıştırsak?').children());
  yield* all(title.opacity(1, 0.3), choice.opacity(1, 0.5));
  yield* waitUntil('end');
});
