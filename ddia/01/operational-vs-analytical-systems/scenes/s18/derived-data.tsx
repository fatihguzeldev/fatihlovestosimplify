import { Layout, Line, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, background, banana, heading, muted, paper, text } from '../shared/drawing';
import { searchIndex, searchProducts } from '../s02/search-index';
import { recordChain } from '../shared/record-chain';
import { storedTotals } from '../shared/stored-totals';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('bu kayıttan ', 'neler türetiyoruz?');
  const chain = recordChain('record-lineage');
  view.add([title, chain.root]);
  yield loadFonts();
  yield* waitUntil('derived');
  yield* title.opacity(0, 0.2);
  title.children(heading('bu temsiller ', 'derived data.').children());
  yield* all(
    title.opacity(1, 0.3),
    chain.records[1].role.opacity(1, 0.4),
    chain.records[2].role.opacity(1, 0.4),
  );
  yield* waitUntil('stored');
  yield* all(title.opacity(0, 0.2), chain.root.opacity(0, 0.4));
  title.children(heading('hesapladığımız toplamı ', 'saklasak?').children());
  const aggregate = storedTotals();
  aggregate.root.opacity(0);
  aggregate.stored.root.opacity(0.15);
  aggregate.totals.forEach((value) => value.opacity(0));
  aggregate.note.opacity(0);
  aggregate.calculate.reveal(0);
  aggregate.operation.opacity(0);
  view.add(aggregate.root);
  yield* all(title.opacity(1, 0.3), aggregate.root.opacity(1, 0.5));
  yield* waitUntil('aggregate-calculate');
  yield* all(aggregate.calculate.reveal(1, 0.3), aggregate.operation.opacity(1, 0.3));
  yield* aggregate.calculate.travel(0.9);
  yield* aggregate.calculate.arrive();
  yield* waitUntil('stored-a');
  yield* all(aggregate.stored.root.opacity(1, 0.3), aggregate.totals[0].opacity(1, 0.3));
  yield* waitUntil('stored-b');
  yield* aggregate.totals[1].opacity(1, 0.3);
  yield* waitUntil('read');
  yield* title.opacity(0, 0.2);
  title.children(heading('okurken ', 'hazır sonucu', ' alıyoruz.').children());
  aggregate.operation.text('');
  yield* all(
    title.opacity(1, 0.3),
    aggregate.calculate.root.opacity(0.2, 0.3),
    aggregate.rows.root.opacity(0.3, 0.3),
    aggregate.stored.face.stroke(accent, 0.3),
  );
  aggregate.note.text('SELECT * FROM monthly_totals;');
  aggregate.note.fontFamily(theme.fontFamily.mono);
  yield* aggregate.note.opacity(1, 0.3);
  yield* waitUntil('materialized-view');
  yield* aggregate.note.opacity(0, 0.2);
  aggregate.note.text('PostgreSQL · materialized view');
  aggregate.note.fontFamily(theme.fontFamily.sans);
  yield* aggregate.note.opacity(1, 0.3);
  yield* waitUntil('same-database');
  yield* aggregate.boundary.face.stroke(accent, 0.3).to(muted, 0.5);
  yield* waitUntil('cache');
  yield* all(title.opacity(0, 0.2), aggregate.root.opacity(0, 0.4));
  title.children(heading('sipariş durumu da ', 'cache’te tutulabilir.').children());
  const cacheExample = new Layout({ opacity: 0 });
  const order = paper(540, 250, '#101315');
  order.root.position([-485, 65]);
  const orderStatus = text('preparing', 44, {
    y: 12,
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  order.root.add([
    text('orders · #1042', 31, { y: -73, fontFamily: theme.fontFamily.mono }),
    orderStatus,
    text('asıl kayıt', 26, { y: 84, fill: muted }),
  ]);
  const cache = paper(540, 250, '#17232f');
  cache.root.position([485, 65]);
  const cached = text('preparing', 44, {
    y: 24,
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const cacheKey = text('cache · order:1042', 29, {
    y: -73,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  cache.root.add([cacheKey, cached]);
  const save = cartoonArrow('s18-order-status-cache', [-167, 65], [171, 65], accent, 0);
  cacheExample.add([
    order.root,
    cache.root,
    save.root,
    text('set()', 29, {
      position: [0, -32],
      fontFamily: theme.fontFamily.mono,
      opacity: () => save.reveal(),
    }),
  ]);
  view.add(cacheExample);
  yield* all(title.opacity(1, 0.3), cacheExample.opacity(1, 0.5));
  yield* waitUntil('order-status');
  yield* orderStatus.opacity(1, 0.3);
  yield* waitUntil('cache-key');
  yield* cacheKey.opacity(1, 0.3);
  yield* waitUntil('cache-write');
  yield* save.reveal(1, 0.3);
  yield* save.travel(0.8);
  yield* save.arrive();
  yield* waitUntil('cache-result');
  yield* cached.opacity(1, 0.3);
  yield* waitUntil('cache-read');
  yield* all(order.root.opacity(0.45, 0.3), cache.face.stroke(accent, 0.3));
  yield* waitUntil('index');
  yield* all(title.opacity(0, 0.2), cacheExample.opacity(0, 0.4));
  cacheExample.remove();
  title.children(heading('index ise ', 'başka bir erişim yolu.').children());
  const search = new Layout({ opacity: 0 });
  const products = paper(540, 290, '#101315');
  products.root.position([-485, 65]);
  products.root.add(text('products', 30, { y: -246, fontFamily: theme.fontFamily.mono }));
  searchProducts.forEach((product, i) => {
    const y = -64 + i * 128;
    const fruit = banana();
    fruit.position([-193, y]);
    fruit.rotation(product.tilt);
    products.root.add([
      fruit,
      text(product.name, 33, { position: [-110, y], offset: [-1, 0] }),
      text(product.id, 27, { position: [191, y], fontFamily: theme.fontFamily.mono, fill: muted }),
    ]);
  });
  const index = searchIndex();
  index.root.position([485, 65]);
  index.documents.forEach((document) => document.root.opacity(0));
  index.wordLabel.text('…');
  const build = cartoonArrow('s18-product-index-build', [-167, 65], [191, 65], accent, 0);
  search.add([
    products.root,
    index.root,
    build.root,
    text('index', 29, { position: [0, -32], opacity: () => build.reveal() }),
  ]);
  view.add(search);
  yield* all(title.opacity(1, 0.3), search.opacity(1, 0.5));
  yield* waitUntil('index-build');
  yield* build.reveal(1, 0.3);
  yield* build.travel(0.8);
  yield* build.arrive();
  yield* waitUntil('index-mappings');
  index.wordLabel.text('muz');
  index.wordLabel.fill(accent);
  yield* all(
    ...index.links.map((link) => link.end(1, 0.45)),
    ...index.documents.map((document) => document.root.opacity(1, 0.45)),
  );
  yield* waitUntil('index-search');
  yield* index.word.face.stroke(accent, 0.3);
  yield* all(...index.documents.map((document) => document.face.stroke(accent, 0.3)));
  yield* waitUntil('other');
  yield* all(title.opacity(0, 0.2), search.opacity(0, 0.4));
  search.remove();
  title.children(heading('mağazanın bölgesini ', 'satış kaydına ekledik.').children());
  const examples = new Layout({ opacity: 0 });
  const regionFlow = new Layout({});
  const store = paper(620, 250, '#101315');
  store.root.position([-510, -85]);
  store.root.add([
    text('store database', 29, { y: -84 }),
    text('store_id', 25, {
      position: [-157, -13],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    text('region', 25, {
      position: [115, -13],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    text('A', 34, { position: [-157, 50], fontFamily: theme.fontFamily.mono }),
    text('Marmara', 34, { position: [115, 50], fill: accent }),
  ]);
  const sale = paper(620, 250, '#101315');
  sale.root.position([510, -85]);
  const copiedRegion = text('—', 34, { position: [95, 50], fill: muted });
  sale.root.add([
    text('warehouse · sales', 29, { y: -84 }),
    text('#1042 · store_id: A', 27, { y: -13, fontFamily: theme.fontFamily.mono }),
    text('region', 25, {
      position: [-150, 50],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    copiedRegion,
  ]);
  const enrich = cartoonArrow('s18-region-copy', [-164, -35], [160, -35], accent, 0);
  regionFlow.add([
    store.root,
    sale.root,
    enrich.root,
    text('eşleştir', 28, { position: [0, -127], opacity: () => enrich.reveal() }),
  ]);
  const trainingFlow = new Layout({ opacity: 0 });
  const trainingData = paper(620, 230, '#101315');
  trainingData.root.position([-510, 265]);
  trainingData.root.add([
    text('training data', 29, { y: -74, fill: muted }),
    text('geçmiş satışlar', 32, { y: -2 }),
    text('+ clickstream', 30, { y: 58, fill: accent }),
  ]);
  const model = paper(300, 165, '#17232f');
  model.root.position([510, 265]);
  model.root.opacity(0);
  model.root.add([
    text('model v1', 40, { y: -25, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('öneri modeli', 26, { y: 38 }),
  ]);
  const train = cartoonArrow('s18-model-training', [-164, 265], [319, 265], accent, 0);
  trainingFlow.add([
    trainingData.root,
    train.root,
    model.root,
    text('train', 31, {
      position: [78, 178],
      fontFamily: theme.fontFamily.mono,
      opacity: () => train.reveal(),
    }),
  ]);
  examples.add([regionFlow, trainingFlow]);
  view.add(examples);
  yield* all(title.opacity(1, 0.3), examples.opacity(1, 0.5));
  yield* waitUntil('region-copy');
  yield* enrich.reveal(1, 0.35);
  yield* enrich.travel(1);
  yield* enrich.arrive();
  yield* waitUntil('region-result');
  copiedRegion.text('Marmara');
  copiedRegion.fill(accent);
  yield* sale.face.stroke(accent, 0.3);
  yield* waitUntil('training');
  yield* all(title.opacity(0, 0.2), regionFlow.opacity(0.65, 0.3));
  title.children(heading('modeli de ', 'training data’dan ürettik.').children());
  yield* all(title.opacity(1, 0.3), trainingFlow.opacity(1, 0.4));
  yield* waitUntil('train');
  yield* train.reveal(1, 0.35);
  yield* train.travel(1);
  yield* train.arrive();
  yield* waitUntil('trained-model');
  yield* all(model.root.opacity(1, 0.35), regionFlow.opacity(1, 0.3));
  yield* waitUntil('redundant');
  yield* all(title.opacity(0, 0.2), examples.opacity(0, 0.4));
  examples.remove();
  title.children(heading('aynı bilgiden ', 'başka bir temsil.').children());
  const meaning = new Layout({ opacity: 0 });
  meaning.add([
    text('redundant', 114, {
      position: [-5, 10],
      fill: accent,
      fontStyle: 'italic',
      fontWeight: 500,
    }),
  ]);
  view.add(meaning);
  yield* all(title.opacity(1, 0.3), meaning.opacity(1, 0.5));
  yield* waitUntil('redundant-example');
  yield* all(title.opacity(0, 0.2), meaning.opacity(0, 0.4));
  meaning.remove();
  title.children(heading('aynı satışları ', 'farklı biçimde', ' tutuyoruz.').children());
  aggregate.rows.root.opacity(1);
  aggregate.calculate.root.opacity(1);
  aggregate.operation.text('SUM(amount)');
  aggregate.note.opacity(0);
  yield* all(title.opacity(1, 0.3), aggregate.root.opacity(1, 0.5));
  yield* waitUntil('rebuild');
  yield* title.opacity(0, 0.2);
  title.children(heading('kayıtlar ve sorgu duruyorsa ', 'yeniden üretebiliriz.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('rebuild-remove');
  yield* all(...aggregate.totals.map((value) => value.opacity(0, 0.2)));
  aggregate.totals.forEach((value) => {
    value.text('—');
    value.fill(muted);
  });
  yield* all(...aggregate.totals.map((value) => value.opacity(1, 0.2)));
  yield* waitUntil('recalculate');
  aggregate.note.text('REFRESH MATERIALIZED VIEW monthly_totals;');
  aggregate.note.fontFamily(theme.fontFamily.mono);
  aggregate.note.fill(accent);
  yield* all(aggregate.note.opacity(1, 0.3), aggregate.calculate.travel(1));
  yield* aggregate.calculate.arrive();
  yield* waitUntil('rebuilt-a');
  aggregate.totals[0].text('400');
  yield* aggregate.totals[0].fill(accent, 0.25);
  yield* waitUntil('rebuilt-b');
  aggregate.totals[1].text('300');
  yield* aggregate.totals[1].fill(accent, 0.25);
  yield* waitUntil('limits');
  yield* all(title.opacity(0, 0.2), aggregate.root.opacity(0, 0.4));
  title.children(heading('her şeyi ', 'yeniden üretebilir miyiz?').children());
  const limits = new Layout({ opacity: 0 });
  const limitRows = [
    ['satış toplamı', 'kayıtlar ve sorgu duruyorsa tekrar hesaplarız.'],
    ['gezinme geçmişi', 'tıklamalar silindiyse sipariş kaydı yeterli olmaz.'],
    ['öneri modeli', 'aynı data ile yeniden train etsek de model değişebilir.'],
  ].map(([label, detail], i) => {
    const y = -100 + i * 165;
    const row = new Layout({ opacity: 0 });
    row.add([
      text(label, 36, { position: [-680, y], offset: [-1, 0], fill: accent }),
      text(detail, 34, { position: [-172, y], offset: [-1, 0] }),
      new Line({
        points: [
          [-680, y + 65],
          [745, y + 65],
        ],
        stroke: muted,
        opacity: 0.25,
        lineWidth: 1.5,
      }),
    ]);
    limits.add(row);
    return row;
  });
  view.add(limits);
  yield* all(title.opacity(1, 0.3), limits.opacity(1, 0.5), limitRows[0].opacity(1, 0.5));
  yield* waitUntil('limits-history');
  yield* limitRows[1].opacity(1, 0.4);
  yield* waitUntil('limits-model');
  yield* limitRows[2].opacity(1, 0.4);
  yield* waitUntil('roles');
  yield* all(title.opacity(0, 0.2), limits.opacity(0, 0.4));
  limits.remove();
  title.children(heading('işin türü başka, ', 'data’nın rolü', ' başka.').children());
  const roles = new Layout({ opacity: 0 });
  const left = paper(690, 330, '#101315');
  left.root.position([-420, 65]);
  const right = paper(690, 330, '#101315');
  right.root.position([420, 65]);
  const kindLabels = [
    text('operational', 39, { y: -108, fill: accent, fontStyle: 'italic', opacity: 0 }),
    text('analytical', 39, { y: -108, fill: accent, fontStyle: 'italic', opacity: 0 }),
  ];
  const roleExamples = [
    text('orders → system of record', 28, { y: -2, fontFamily: theme.fontFamily.mono, opacity: 0 }),
    text('cache → derived', 28, { y: 91, fontFamily: theme.fontFamily.mono, opacity: 0 }),
    text('warehouse → derived', 28, { y: -2, fontFamily: theme.fontFamily.mono, opacity: 0 }),
    text('monthly_totals → derived', 28, { y: 91, fontFamily: theme.fontFamily.mono, opacity: 0 }),
  ];
  left.root.add([kindLabels[0], roleExamples[0], roleExamples[1]]);
  right.root.add([kindLabels[1], roleExamples[2], roleExamples[3]]);
  roles.add([left.root, right.root]);
  view.add(roles);
  yield* all(title.opacity(1, 0.3), roles.opacity(1, 0.5));
  yield* waitUntil('roles-kind');
  yield* all(...kindLabels.map((label) => label.opacity(1, 0.3)));
  yield* waitUntil('roles-data');
  yield* title.opacity(0, 0.2);
  title.children(
    heading('system of record ve derived ', 'verinin rolünü', ' anlatıyor.').children(),
  );
  yield* title.opacity(1, 0.3);
  yield* waitUntil('operational-record');
  yield* roleExamples[0].opacity(1, 0.3);
  yield* waitUntil('operational-cache');
  yield* roleExamples[1].opacity(1, 0.3);
  yield* waitUntil('analytical-warehouse');
  yield* roleExamples[2].opacity(1, 0.3);
  yield* waitUntil('analytical-totals');
  yield* roleExamples[3].opacity(1, 0.3);
  yield* waitUntil('roles-summary');
  yield* all(...roleExamples.slice(1).map((label) => label.fill(accent, 0.3)));
  yield* waitUntil('return');
  yield* all(title.opacity(0, 0.2), roles.opacity(0, 0.4));
  roles.remove();
  title.children(heading('ana akışa ', 'dönelim.').children());
  yield* all(title.opacity(1, 0.3), chain.root.opacity(1, 0.5));
  yield* waitUntil('lineage-copy');
  yield* chain.copy.travel(0.65);
  yield* chain.copy.arrive();
  yield* waitUntil('lineage-load');
  yield* chain.transform.travel(0.65);
  yield* chain.transform.arrive();
  yield* waitUntil('next');
  yield* title.opacity(0, 0.2);
  title.children(heading('kaynak değişince ', 'ne olacak?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
