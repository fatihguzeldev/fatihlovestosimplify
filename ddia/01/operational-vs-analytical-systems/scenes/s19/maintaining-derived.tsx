import { Layout, makeScene2D, Path } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, text } from '../shared/drawing';
import { recordChain } from '../shared/record-chain';
import { storedTotals } from '../shared/stored-totals';
import { monthlyChart } from '../shared/workloads';
import { report } from './report';
import { updateCache } from './cache-update';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('kaynak değişince ', 'ne olacak?');
  const chain = recordChain('record-lineage', true);
  view.add([title, chain.root]);
  yield loadFonts();
  yield* waitUntil('focus');
  yield* all(title.opacity(0, 0.2), chain.root.opacity(0, 0.4));
  const comparison = report();
  comparison.root.opacity(0);
  view.add(comparison.root);
  title.children(heading('aynı kayıt, ', 'aynı tutar.').children());
  yield* all(title.opacity(1, 0.3), comparison.root.opacity(1, 0.5));
  yield* waitUntil('correct');
  yield* title.opacity(0, 0.2);
  title.children(heading('kaynakta tutarı ', 'düzeltiyoruz.').children());
  yield* title.opacity(1, 0.3);
  comparison.cards[0].amount.text('165');
  yield* all(comparison.cards[0].face.stroke(accent, 0.3), comparison.pending.opacity(1, 0.4));
  yield* waitUntil('stale-query');
  yield* title.opacity(0, 0.2);
  title.children(heading('aynı sorgu, ', 'yine 400.').children());
  yield* all(
    title.opacity(1, 0.3),
    comparison.chart.root.opacity(0.18, 0.3),
    comparison.sql.fill(accent, 0.2),
  );
  yield* comparison.cards[1].face.stroke(accent, 0.2);
  yield* waitFor(0.7);
  yield* all(
    comparison.cards[1].face.stroke(foreground, 0.3),
    comparison.sql.fill(foreground, 0.3),
    comparison.chart.root.opacity(1, 0.3),
  );
  yield* waitUntil('diagnosis');
  yield* title.opacity(0, 0.2);
  title.children(heading('hesap doğru. ', 'data eski.').children());
  yield* all(
    title.opacity(1, 0.3),
    comparison.cards[1].amount.fill(accent, 0.2),
    comparison.transfer.fill(accent, 0.2),
  );
  yield* waitUntil('pipeline');
  yield* all(title.opacity(0, 0.2), comparison.root.opacity(0, 0.4));
  chain.records[0].amount.text('165');
  chain.records[0].face.stroke(accent);
  title.children(heading('düzeltmeyi ', 'akış boyunca', ' taşıyalım.').children());
  const note = text('bu örnekte aktarım asenkron.', 30, {
    position: [0, 449],
    fill: muted,
    opacity: 0,
  });
  view.add(note);
  yield* all(title.opacity(1, 0.3), chain.root.opacity(1, 0.5), note.opacity(1, 0.3));
  yield* waitUntil('lake');
  yield* chain.copy.travel(1.1);
  chain.records[1].amount.text('165');
  yield* all(chain.copy.arrive(), chain.records[1].face.stroke(accent, 0.3));
  yield* title.opacity(0, 0.2);
  title.children(heading('lake güncellendi. ', 'warehouse henüz değil.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('load');
  yield* title.opacity(0, 0.2);
  title.children(heading('warehouse’da ', 'aynı kaydı', ' güncelliyoruz.').children());
  note.text('yeni bir satış eklemiyoruz: id yine #1042.');
  yield* title.opacity(1, 0.3);
  yield* chain.transform.travel(1.1);
  chain.records[2].amount.text('165');
  yield* all(chain.transform.arrive(), chain.records[2].face.stroke(accent, 0.3));
  yield* waitUntil('new-query');
  yield* all(title.opacity(0, 0.2), chain.root.opacity(0, 0.4), note.opacity(0, 0.3));
  comparison.cards[1].amount.text('165');
  comparison.transfer.text('son aktarım: t1');
  comparison.transfer.fill(muted);
  comparison.pending.opacity(0);
  comparison.chart.root.opacity(0.18);
  title.children(heading('şimdi yeniden ', 'hesaplayalım.').children());
  yield* all(title.opacity(1, 0.3), comparison.root.opacity(1, 0.5));
  yield* comparison.sql.fill(accent, 0.2);
  yield* waitFor(0.7);
  const bar = comparison.chart.bars[0];
  bar.value.text('380 ₺');
  bar.value.y(110 - 380 * 0.43 - 28);
  bar.bar.height(380 * 0.43);
  const math = text('60 + 165 + 155 = 380', 35, {
    position: [-435, 266],
    fill: accent,
    opacity: 0,
  });
  comparison.root.add(math);
  yield* all(
    comparison.chart.root.opacity(1, 0.3),
    comparison.sql.fill(foreground, 0.3),
    math.opacity(1, 0.3),
  );
  yield* waitUntil('materialized');
  yield* all(title.opacity(0, 0.2), comparison.root.opacity(0, 0.4));
  title.children(heading('aynı database içinde de ', 'güncelleme gerekiyor.').children());
  const aggregate = storedTotals();
  aggregate.root.opacity(0);
  aggregate.values[1].text('165');
  aggregate.values[1].fill(accent);
  aggregate.note.text('başka bir seçenek · PostgreSQL materialized view');
  view.add(aggregate.root);
  yield* all(title.opacity(1, 0.3), aggregate.root.opacity(1, 0.5));
  yield* waitUntil('refresh');
  yield* title.opacity(0, 0.2);
  title.children(heading('saklanan toplamı ', 'refresh', ' edelim.').children());
  aggregate.operation.text('refresh');
  aggregate.note.text('REFRESH MATERIALIZED VIEW monthly_totals;');
  aggregate.note.fontFamily(theme.fontFamily.mono);
  yield* title.opacity(1, 0.3);
  yield* aggregate.calculate.travel(1);
  aggregate.totals[0].text('380');
  yield* all(aggregate.calculate.arrive(), aggregate.stored.face.stroke(accent, 0.3));
  yield* waitUntil('cache');
  yield* all(title.opacity(0, 0.2), aggregate.root.opacity(0, 0.4));
  aggregate.root.remove();
  const cacheStage = new Layout({ opacity: 0 });
  view.add(cacheStage);
  const { market } = yield* updateCache(cacheStage, title);
  yield* waitUntil('closing');
  yield* all(title.opacity(0, 0.2), cacheStage.opacity(0, 0.4));
  market.root.remove();
  cacheStage.remove();
  market.root.position([-455, 75]);
  market.root.scale(0.95);
  const chart = monthlyChart();
  chart.root.position([455, 75]);
  chart.root.scale(0.95);
  chart.bars[0].value.text('380 ₺');
  chart.bars[0].value.y(110 - 380 * 0.43 - 28);
  chart.bars[0].bar.height(380 * 0.43);
  const finish = new Layout({ opacity: 0 });
  finish.add([
    market.root,
    chart.root,
    text('operational', 34, { position: [-455, 372], fill: accent, fontStyle: 'italic' }),
    text('analytical', 34, { position: [455, 372], fill: accent, fontStyle: 'italic' }),
  ]);
  view.add(finish);
  title.children(heading('aynı işletme, ', 'farklı işler.').children());
  yield* all(title.opacity(1, 0.3), finish.opacity(1, 0.5));
  yield* waitUntil('recap');
  yield* all(title.opacity(0, 0.2), finish.opacity(0, 0.4));
  title.children(heading('tasarlarken ', 'bunları birlikte', ' düşünüyoruz.').children());
  const recap = new Layout({ opacity: 0 });
  [
    ['hangi iş?', 'sipariş durumu · aylık satış'],
    ['hangi temsil?', 'kayıt · cache · analytical görünüm'],
    ['hangi kaynak?', 'asıl kayıt ve ona bağlı girdiler'],
    ['nasıl güncellenecek?', 'aktarım · refresh · invalidate'],
  ].forEach(([question, detail], i) => {
    const y = -141 + 147 * i;
    recap.add([
      text(question, 37, {
        position: [-706, y],
        offset: [-1, 0],
        fill: accent,
        fontStyle: 'italic',
      }),
      text(detail, 33, { position: [-188, y], offset: [-1, 0] }),
    ]);
  });
  view.add(recap);
  yield* all(title.opacity(1, 0.3), recap.opacity(1, 0.5));
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.2), recap.opacity(0, 0.4));
  const end = new Layout({ opacity: 0 });
  end.add([
    text('bu sistemleri kim geliştiriyor?', 62, { position: [-806, -188], offset: [-1, 0] }),
    text('kim işletiyor?', 78, {
      position: [-806, -72],
      offset: [-1, 0],
      fill: accent,
      fontStyle: 'italic',
    }),
    new Path({
      data: 'M -800 30 Q -451 38 -120 31',
      stroke: accent,
      lineWidth: 4,
      lineCap: 'round',
    }),
    text('sonraki video', 26, { position: [-800, 180], offset: [-1, 0], fill: muted }),
    text('cloud vs. self-hosting', 46, { position: [-800, 250], offset: [-1, 0] }),
  ]);
  view.add(end);
  yield* end.opacity(1, 0.6);
  yield* waitUntil('end');
});
