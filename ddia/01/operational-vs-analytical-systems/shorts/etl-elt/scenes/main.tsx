import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  cartoonDatabase,
  heading,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';

function sale(width = 650) {
  const card = paper(width, 190);
  const region = text('bölge bilgisi yok', width < 400 ? 25 : 32, { y: 56, fill: muted });
  card.root.add([
    text('sales · #1042', 32, { y: -53, fill: muted }),
    text('store_id: A  ·  185₺', width < 400 ? 27 : 37, { y: -2 }),
    region,
  ]);
  return { ...card, region };
}

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('aynı satışa ', 'bölge ekleyelim.');
  const etl = new Layout({});
  const source = sale();
  source.root.position([0, -340]);
  const copy = sale();
  copy.root.position([0, -340]);
  copy.root.opacity(0);
  const store = paper(650, 130);
  store.root.position([0, 300]);
  store.root.opacity(0);
  store.root.add([
    text('store database', 29, { y: -29, fill: muted }),
    text('A → Marmara', 38, { y: 25, fill: accent }),
  ]);
  const warehouse = cartoonDatabase('warehouse', accent);
  warehouse.root.position([0, 610]);
  warehouse.root.scale(1.05);
  const reportQuestion = text('bölgelere göre satış raporu', 31, { y: 845, fill: muted });
  const extract = cartoonArrow('etl-portrait-extract', [0, -220], [0, -90], accent, 0);
  const lookup = cartoonArrow('etl-portrait-lookup', [0, 219], [0, 115], accent, 0);
  const load = cartoonArrow('etl-portrait-load', [0, 128], [0, 470], accent, 0);
  etl.add([
    source.root,
    warehouse.root,
    extract.root,
    lookup.root,
    load.root,
    store.root,
    copy.root,
  ]);
  etl.add(reportQuestion);
  view.add([title, etl]);
  yield loadFonts();

  yield* waitUntil('extract');
  yield* extract.reveal(1, 0.3);
  yield* all(copy.root.opacity(1, 0.2), copy.root.position([0, 10], 0.85, easeInOutCubic));
  yield* extract.travel(0.45);
  yield* extract.arrive();
  yield* waitUntil('retained');
  yield* source.face.stroke(accent, 0.25).to('#f5f5f5', 0.4);
  yield* waitUntil('transform');
  title.children(heading('önce dönüştür, ', 'sonra yükle.').children());
  yield* waitUntil('lookup');
  yield* store.root.opacity(1, 0.4);
  yield* waitUntil('enrich');
  yield* lookup.reveal(1, 0.3);
  yield* lookup.travel(0.55);
  copy.region.text('region: Marmara');
  copy.region.fontSize(35);
  yield* all(lookup.arrive(), copy.region.fill(accent, 0.3));
  yield* waitUntil('load');
  yield* all(store.root.opacity(0, 0.3), lookup.root.opacity(0, 0.3));
  yield* load.reveal(1, 0.35);
  yield* all(copy.root.position([0, 610], 0.9, easeInOutCubic), copy.root.scale(0.3, 0.9));
  yield* all(copy.root.opacity(0, 0.25), load.travel(0.4));
  yield* load.arrive();
  yield* waitUntil('etl');
  title.children(heading('extract → transform → load\n', 'ETL').children());

  yield* waitUntil('elt');
  yield* etl.opacity(0, 0.35);
  etl.remove();
  title.children(heading('bu kez önce yükle,\n', 'içeride dönüştür.').children());
  const elt = new Layout({});
  const sales = sale(370);
  sales.root.position([-220, -330]);
  const stores = paper(370, 190);
  stores.root.position([220, -330]);
  stores.root.add([
    text('stores · id: A', 28, { y: -43, fill: muted }),
    text('Marmara', 37, { y: 20, fill: accent }),
  ]);
  const inside = paper(850, 660);
  inside.root.position([0, 240]);
  inside.root.add(text('warehouse', 34, { y: -270, fill: muted }));
  const loadedSale = sale(370);
  loadedSale.root.position([-220, 90]);
  loadedSale.root.opacity(0);
  const loadedStore = stores.root.clone({ position: [220, 90], opacity: 0 });
  const saleLoad = cartoonArrow('elt-sale-load', [-220, -210], [-220, -100], accent, 0);
  const storeLoad = cartoonArrow('elt-store-load', [220, -210], [220, -100], accent, 0);
  const result = sale(650);
  result.region.text('region: Marmara');
  result.region.fill(accent);
  result.root.position([0, 390]);
  result.root.opacity(0);
  const left = cartoonArrow('elt-sales-transform', [-220, 205], [-110, 270], accent, 0);
  const right = cartoonArrow('elt-stores-transform', [220, 205], [110, 270], accent, 0);
  elt.add([
    inside.root,
    sales.root,
    stores.root,
    loadedSale.root,
    loadedStore,
    saleLoad.root,
    storeLoad.root,
    left.root,
    right.root,
    result.root,
  ]);
  view.add(elt);
  yield* waitUntil('load-sales');
  yield* saleLoad.reveal(1, 0.2);
  yield* saleLoad.travel(0.6);
  yield* all(saleLoad.arrive(), loadedSale.root.opacity(1, 0.3));
  yield* waitUntil('load-stores');
  yield* storeLoad.reveal(1, 0.2);
  yield* storeLoad.travel(0.6);
  yield* all(storeLoad.arrive(), loadedStore.opacity(1, 0.3));
  yield* waitUntil('inside-transform');
  yield* all(loadedSale.face.stroke(accent, 0.3), loadedStore.scale(1.04, 0.3));
  yield* waitUntil('match');
  yield* all(left.reveal(1, 0.3), right.reveal(1, 0.3));
  yield* all(left.travel(0.55), right.travel(0.55));
  yield* all(
    left.arrive(),
    right.arrive(),
    result.root.opacity(1, 0.3),
    result.region.opacity(1, 0.3),
  );
  yield* waitUntil('elt-name');
  title.children(heading('extract → load → transform\n', 'ELT').children());
  yield* waitUntil('end');
});
