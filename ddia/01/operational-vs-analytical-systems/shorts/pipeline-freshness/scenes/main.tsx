import { makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
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

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('aynı satış. ', 'kaynak ve kopyası.');
  const source = cartoonDatabase('sales database · asıl kayıt', accent);
  source.root.position([-245, -270]);
  source.root.scale(1.2);
  source.caption.fontSize(24);
  source.root.add(text('#1042', 25, { y: -8, fill: muted, fontFamily: 'IBM Plex Mono' }));
  const canonical = text('185₺', 42, { y: 51, fontFamily: 'IBM Plex Mono' });
  source.root.add(canonical);

  const lake = paper(370, 200, '#101315');
  lake.root.position([225, 110]);
  lake.root.add([
    text('data lake · kopya', 27, { y: -57 }),
    text('#1042', 26, { y: -10, fill: muted, fontFamily: 'IBM Plex Mono' }),
  ]);
  const lakeAmount = text('185₺', 42, { y: 48, fontFamily: 'IBM Plex Mono' });
  lake.root.add(lakeAmount);

  const warehouse = cartoonDatabase('warehouse · kopya', accent);
  warehouse.root.position([-245, 510]);
  warehouse.root.scale(1.25);
  warehouse.caption.fontSize(26);
  warehouse.root.add(text('#1042', 25, { y: -8, fill: muted, fontFamily: 'IBM Plex Mono' }));
  const warehouseAmount = text('185₺', 42, { y: 51, fontFamily: 'IBM Plex Mono' });
  warehouse.root.add(warehouseAmount);
  const extract = cartoonArrow('short-freshness-source-to-lake', [-60, -130], [65, 40], accent, 1);
  const load = cartoonArrow('short-freshness-lake-to-warehouse', [60, 240], [-60, 385], accent, 1);
  const transferLabel = text('son aktarım', 29, { position: [170, 330], fill: muted });
  const query = text('', 28, { position: [170, 545], fontFamily: 'IBM Plex Mono', fill: accent });
  const totalLabel = text('ocak toplamı', 29, { position: [0, 752], fill: muted, opacity: 0 });
  const total = text('A: 400₺    B: 300₺', 40, {
    position: [0, 813],
    fontFamily: 'IBM Plex Mono',
    opacity: 0,
  });
  view.add([
    title,
    source.root,
    lake.root,
    warehouse.root,
    extract.root,
    load.root,
    transferLabel,
    query,
    totalLabel,
    total,
  ]);
  yield loadFonts();

  yield* waitUntil('initial-total');
  yield* all(totalLabel.opacity(1, 0.25), total.opacity(1, 0.25));
  yield* waitUntil('correct');
  title.children(heading('asıl kayıttaki tutarı ', 'düzeltiyoruz.').children());
  yield* waitUntil('correct-value');
  canonical.text('165₺');
  yield* canonical.fill(accent, 0.25);
  yield* waitUntil('query');
  title.children(heading('warehouse’u ', 'yeniden sorgulayalım.').children());
  query.text('SUM(amount)');
  yield* all(warehouse.top.stroke(accent, 0.25), total.opacity(0, 0.2));
  yield* waitUntil('old-result');
  yield* total.opacity(1, 0.3);
  yield* waitUntil('diagnosis');
  title.children(heading('hesap doğru. ', 'data eski.').children());
  yield* warehouseAmount.fill(accent, 0.25);

  yield* waitUntil('pipeline');
  title.children(heading('düzeltmeyi ', 'akış boyunca', ' taşıyalım.').children());
  query.text('');
  yield* waitUntil('lake');
  yield* extract.travel(0.85);
  yield* extract.arrive();
  yield* waitUntil('lake-updated');
  lakeAmount.text('165₺');
  yield* lakeAmount.fill(accent, 0.25);
  yield* waitUntil('warehouse-stale');
  title.children(heading('lake güncel. ', 'warehouse henüz değil.').children());
  yield* warehouse.top.stroke(accent, 0.2).to(muted, 0.3);
  yield* waitUntil('load');
  transferLabel.text('transform + load');
  transferLabel.fill(accent);
  yield* load.travel(0.9);
  yield* load.arrive();
  yield* waitUntil('loaded');
  warehouseAmount.text('165₺');
  yield* warehouseAmount.fill(accent, 0.25);
  yield* waitUntil('new-query');
  title.children(heading('şimdi ', 'yeniden hesaplayalım.').children());
  query.text('SUM(amount)');
  yield* total.opacity(0, 0.2);
  yield* waitUntil('new-result');
  total.text('A: 380₺    B: 300₺');
  total.fill(accent);
  yield* total.opacity(1, 0.3);
  yield* waitUntil('unchanged');
  title.children(heading('20₺ düzeltme ', 'yalnız A’ya', ' yansıdı.').children());
  yield* waitUntil('end');
});
