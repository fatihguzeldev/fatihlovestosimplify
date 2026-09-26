import {Layout, makeScene2D} from '@motion-canvas/2d';
import {all, waitFor, waitUntil} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {theme} from '../../theme';
import {accent, background, foreground, heading, muted, paper, text} from '../shared/drawing';
import {role} from '../shared/people';
import {warehouseSystem} from '../shared/warehouse-system';
import {etlPipeline} from '../shared/etl-pipeline';
import {monthlyChart} from '../shared/workloads';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('peki, bu data ', 'buraya nasıl gelecek?');
  const landscape = warehouseSystem();
  view.add([title, landscape.root]);
  yield loadFonts();
  yield* waitUntil('sources');
  yield* all(title.opacity(0, 0.2), landscape.warehouse.root.opacity(0, 0.3));
  yield* all(...landscape.sources.map(source => source.root.y(270, 0.65)));
  title.children(heading('her kayıt, ', 'bir işin', ' parçası.').children());
  const actors = new Layout({opacity: 0});
  const applications = ['ecommerce', 'stock-keeping', 'route planner'];
  ['müşteri', 'depo çalışanı', 'sürücü'].forEach((name, i) => {
    const x = -570 + i * 570;
    const person = role(name, ['sipariş veriyor', 'stokları takip ediyor', 'rotasını planlıyor'][i], i);
    person.position([x + 25, -165]);
    person.opacity(1);
    const application = paper(340, 86, '#101315');
    application.root.position([x, -35]);
    application.root.add(text(applications[i], 27, {fontFamily: theme.fontFamily.mono}));
    const arrow = cartoonArrow(`s10-app-${i}-records`, [0, 0], [0, 210], accent, 0);
    arrow.root.position([x, 39]);
    arrow.root.scale(0.4);
    actors.add([person, application.root, arrow.root]);
    arrow.reveal(1);
  });
  view.add(actors);
  yield* all(title.opacity(1, 0.3), actors.opacity(1, 0.4));
  yield* waitUntil('extract');
  yield* all(title.opacity(0, 0.2), actors.opacity(0, 0.3), landscape.root.opacity(0, 0.4));
  actors.remove();
  landscape.root.remove();
  const pipeline = etlPipeline();
  pipeline.root.opacity(0);
  pipeline.extract.reveal(0);
  pipeline.load.reveal(0);
  pipeline.transform.root.opacity(0.25);
  pipeline.warehouse.root.opacity(0.25);
  title.children(heading('önce kaydın ', 'kopyasını alıyoruz.').children());
  view.add(pipeline.root);
  yield* all(title.opacity(1, 0.3), pipeline.root.opacity(1, 0.5));
  yield* pipeline.extract.reveal(1, 0.4);
  yield* pipeline.extract.travel(0.8);
  yield* all(pipeline.extract.arrive(), pipeline.transform.root.opacity(1, 0.3), pipeline.fields.opacity(1, 0.3));
  const retained = text('kaynak kayıt yerinde duruyor.', 29, {position: [-645, 352], fill: muted, opacity: 0});
  view.add(retained);
  yield* retained.opacity(1, 0.3);
  yield* waitUntil('transform');
  yield* all(title.opacity(0, 0.2), retained.opacity(0, 0.2));
  title.children(heading('satışı ', 'bölgesiyle', ' birlikte tutalım.').children());
  const lookup = paper(380, 94, '#17232f');
  lookup.root.position([0, -202]);
  lookup.root.opacity(0);
  lookup.root.add([
    text('store lookup', 21, {y: -22, fill: muted, fontFamily: theme.fontFamily.mono}),
    text('A → Marmara', 27, {y: 18, fill: accent, fontFamily: theme.fontFamily.mono}),
  ]);
  view.add(lookup.root);
  yield* title.opacity(1, 0.3);
  yield* lookup.root.opacity(1, 0.4);
  yield* waitFor(1.1);
  yield* all(pipeline.region.opacity(1, 0.45), pipeline.transform.face.stroke(accent, 0.2).to(foreground, 0.5));
  yield* waitUntil('schema');
  yield* title.opacity(0, 0.2);
  title.children(heading('alanların ve ilişkilerin düzeni: ', 'schema.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('load');
  yield* all(title.opacity(0, 0.2), lookup.root.opacity(0, 0.3));
  title.children(heading('hazırlanan kaydı ', 'warehouse’a yüklüyoruz.').children());
  yield* title.opacity(1, 0.3);
  yield* pipeline.load.reveal(1, 0.4);
  yield* pipeline.load.travel(0.8);
  yield* all(pipeline.load.arrive(), pipeline.warehouse.root.opacity(1, 0.3), pipeline.stored.opacity(1, 0.3));
  yield* waitUntil('other-sources');
  yield* all(title.opacity(0, 0.2), pipeline.root.opacity(0, 0.4));
  title.children(heading('diğer kaynaklar da ', 'kendi yolundan', ' geliyor.').children());
  const overview = warehouseSystem();
  overview.root.opacity(0);
  overview.warehouse.root.position([585, 35]);
  overview.warehouse.root.scale(1.42);
  const routes = overview.sources.map((source, i) => {
    const y = -195 + i * 235;
    source.root.position([-645, y]);
    source.root.scale(0.68);
    source.caption.fontSize(34);
    const transform = paper(260, 90, '#101315');
    transform.root.position([-85, y]);
    transform.root.add(text('transform', 26, {fill: accent}));
    const extract = cartoonArrow(`s10-source-${i}-extract`, [-531, y], [-259, y], accent, 0);
    const load = cartoonArrow(`s10-source-${i}-load`, [98, y], [385, -54 + i * 80], accent, 0);
    overview.root.add([transform.root, extract.root, load.root,
      text('extract', 23, {position: [-395, y - 70]}),
      text('load', 23, {position: [241, (y - 54 + i * 80) / 2 - 68]}),
    ]);
    const table = text(['sales', 'inventory', 'geo'][i], 27, {y: -12 + i * 41, fill: accent, fontFamily: theme.fontFamily.mono, opacity: 0});
    overview.warehouse.root.add(table);
    return {extract, load, table};
  });
  view.add(overview.root);
  yield* all(title.opacity(1, 0.3), overview.root.opacity(1, 0.5));
  for (const route of routes) {
    yield* all(route.extract.reveal(1, 0.3), route.load.reveal(1, 0.3));
    yield* route.extract.travel(0.55);
    yield* route.extract.arrive();
    yield* route.load.travel(0.55);
    yield* all(route.load.arrive(), route.table.opacity(1, 0.3));
  }
  yield* waitUntil('query');
  yield* all(title.opacity(0, 0.2), overview.root.opacity(0, 0.4));
  overview.root.remove();
  title.children(heading('analyst artık ', 'warehouse’u sorguluyor.').children());
  const analysis = new Layout({opacity: 0});
  pipeline.warehouse.root.remove();
  pipeline.warehouse.root.position([-505, 92]);
  pipeline.warehouse.root.scale(1.5);
  pipeline.stored.opacity(0);
  pipeline.warehouse.root.add([
    text('sales', 30, {y: 10, fill: accent, fontFamily: theme.fontFamily.mono}),
    text('kayıtlar', 23, {y: 59}),
  ]);
  const chart = monthlyChart();
  chart.root.position([465, 92]);
  chart.root.scale(0.86);
  chart.root.opacity(0.22);
  const analyst = role('analyst', 'ocak satışları', 1);
  analyst.position([498, -185]);
  analyst.opacity(1);
  const query = cartoonArrow('s10-warehouse-analysis-query', [141, 22], [-285, 22], accent, 0);
  const reply = cartoonArrow('s10-warehouse-analysis-result', [-285, 184], [141, 184], accent, 0);
  analysis.add([pipeline.warehouse.root, chart.root, analyst, query.root, reply.root,
    text('SUM(amount)', 26, {position: [-72, -59], fontFamily: theme.fontFamily.mono}),
    text('query result', 25, {position: [-72, 268], fill: muted}),
  ]);
  view.add(analysis);
  yield* all(title.opacity(1, 0.3), analysis.opacity(1, 0.5));
  yield* query.reveal(1, 0.4);
  yield* query.travel(0.9);
  yield* query.arrive();
  yield* reply.reveal(1, 0.4);
  yield* reply.travel(0.9);
  yield* all(reply.arrive(), chart.root.opacity(1, 0.3));
  yield* waitUntil('responsibility');
  yield* all(title.opacity(0, 0.2), analysis.opacity(0, 0.4));
  analysis.remove();
  pipeline.root.remove();
  const final = etlPipeline();
  final.fields.opacity(1);
  final.region.opacity(1);
  final.stored.opacity(1);
  final.root.opacity(0);
  view.add(final.root);
  title.children(heading('bu akışı ', 'kurup işletmek', ' gerekiyor.').children());
  const engineer = role('data engineer', 'entegrasyon ve işletim', 0);
  engineer.position([-448, 386]);
  const modeller = role('analytics engineer', 'analytical modelleme', 2);
  modeller.position([427, 386]);
  const note = text('roller örtüşebilir.', 22, {position: [0, 478], fill: muted, opacity: 0});
  view.add([engineer, modeller, note]);
  yield* all(title.opacity(1, 0.3), final.root.opacity(1, 0.5));
  yield* all(engineer.opacity(1, 0.4), modeller.opacity(1, 0.4), note.opacity(1, 0.4));
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.2), engineer.opacity(0, 0.3), modeller.opacity(0, 0.3), note.opacity(0, 0.3));
  title.children(heading('dönüşümü ', 'önce yapmak', ' şart mı?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
