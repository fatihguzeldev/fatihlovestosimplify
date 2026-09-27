import { Layout, Line, makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
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
  view.add(aggregate.root);
  yield* all(title.opacity(1, 0.3), aggregate.root.opacity(1, 0.5));
  yield* aggregate.calculate.travel(0.9);
  yield* all(
    aggregate.calculate.arrive(),
    aggregate.stored.root.opacity(1, 0.3),
    ...aggregate.totals.map((value) => value.opacity(1, 0.3)),
  );
  yield* aggregate.note.opacity(1, 0.4);
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
  yield* waitUntil('cache');
  yield* all(title.opacity(0, 0.2), aggregate.root.opacity(0, 0.4));
  title.children(heading('sipariş durumu da ', 'cache’te tutulabilir.').children());
  const cacheExample = new Layout({ opacity: 0 });
  const order = paper(540, 250, '#101315');
  order.root.position([-485, 65]);
  order.root.add([
    text('orders · #1042', 31, { y: -73, fontFamily: theme.fontFamily.mono }),
    text('preparing', 44, { y: 12, fill: accent, fontFamily: theme.fontFamily.mono }),
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
  cache.root.add([
    text('cache · order:1042', 29, { y: -73, fontFamily: theme.fontFamily.mono }),
    cached,
  ]);
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
  yield* save.reveal(1, 0.3);
  yield* save.travel(0.8);
  yield* all(save.arrive(), cached.opacity(1, 0.3));
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
  yield* build.reveal(1, 0.3);
  yield* build.travel(0.8);
  index.wordLabel.text('muz');
  index.wordLabel.fill(accent);
  yield* build.arrive();
  yield* all(
    ...index.links.map((link) => link.end(1, 0.45)),
    ...index.documents.map((document) => document.root.opacity(1, 0.45)),
  );
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
  yield* enrich.reveal(1, 0.35);
  yield* enrich.travel(1);
  copiedRegion.text('Marmara');
  copiedRegion.fill(accent);
  yield* all(enrich.arrive(), sale.face.stroke(accent, 0.3));
  yield* waitFor(4.3);
  yield* all(title.opacity(0, 0.2), regionFlow.opacity(0.65, 0.3));
  title.children(heading('modeli de ', 'training data’dan ürettik.').children());
  yield* all(title.opacity(1, 0.3), trainingFlow.opacity(1, 0.4));
  yield* train.reveal(1, 0.35);
  yield* train.travel(1);
  yield* all(train.arrive(), model.root.opacity(1, 0.35));
  yield* regionFlow.opacity(1, 0.3);
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
  yield* waitUntil('rebuild');
  yield* all(title.opacity(0, 0.2), meaning.opacity(0, 0.4));
  meaning.remove();
  title.children(heading('kaynak duruyorsa ', 'yeniden üretebiliriz.').children());
  aggregate.rows.root.opacity(1);
  aggregate.calculate.root.opacity(1);
  aggregate.operation.text('SUM(amount)');
  aggregate.note.opacity(0);
  aggregate.totals.forEach((value) => value.text('—'));
  yield* all(title.opacity(1, 0.3), aggregate.root.opacity(1, 0.5));
  yield* aggregate.calculate.travel(1);
  aggregate.totals[0].text('400');
  aggregate.totals[1].text('300');
  yield* aggregate.calculate.arrive();
  aggregate.note.text('REFRESH MATERIALIZED VIEW monthly_totals;');
  aggregate.note.fontFamily(theme.fontFamily.mono);
  aggregate.note.fill(accent);
  aggregate.note.opacity(1);
  yield* waitUntil('limits');
  yield* all(title.opacity(0, 0.2), aggregate.root.opacity(0, 0.4));
  title.children(heading('ama gereken kaynakların ', 'korunması şart.').children());
  const limits = new Layout({ opacity: 0 });
  [
    ['kaynak + dönüşüm', 'toplamı yeniden hesaplayabiliriz.'],
    ['kayıp geçmiş', 'bugünkü kayıttan geri çıkaramayız.'],
    ['yeniden eğitim', 'aynı model dosyasını garanti etmez.'],
  ].forEach(([label, detail], i) => {
    const y = -100 + i * 165;
    limits.add([
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
  });
  view.add(limits);
  yield* all(title.opacity(1, 0.3), limits.opacity(1, 0.5));
  yield* waitUntil('roles');
  yield* all(title.opacity(0, 0.2), limits.opacity(0, 0.4));
  limits.remove();
  title.children(heading('işin türü başka, ', 'data’nın rolü', ' başka.').children());
  const roles = new Layout({ opacity: 0 });
  const left = paper(690, 330, '#101315');
  left.root.position([-420, 65]);
  const right = paper(690, 330, '#101315');
  right.root.position([420, 65]);
  left.root.add([
    text('operational', 39, { y: -108, fill: accent, fontStyle: 'italic' }),
    text('orders → system of record', 28, { y: -2, fontFamily: theme.fontFamily.mono }),
    text('cache → derived', 28, { y: 91, fontFamily: theme.fontFamily.mono }),
  ]);
  right.root.add([
    text('analytical', 39, { y: -108, fill: accent, fontStyle: 'italic' }),
    text('warehouse → derived', 28, { y: -2, fontFamily: theme.fontFamily.mono }),
    text('monthly_totals → derived', 28, { y: 91, fontFamily: theme.fontFamily.mono }),
  ]);
  roles.add([left.root, right.root]);
  view.add(roles);
  yield* all(title.opacity(1, 0.3), roles.opacity(1, 0.5));
  yield* waitUntil('return');
  yield* all(title.opacity(0, 0.2), roles.opacity(0, 0.4));
  roles.remove();
  title.children(heading('ana akışa ', 'dönelim.').children());
  yield* all(title.opacity(1, 0.3), chain.root.opacity(1, 0.5));
  yield* waitUntil('next');
  yield* title.opacity(0, 0.2);
  title.children(heading('kaynak değişince ', 'ne olacak?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
