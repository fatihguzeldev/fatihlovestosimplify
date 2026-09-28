import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
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
  comparison.chart.root.opacity(0);
  comparison.sql.opacity(0);
  view.add(comparison.root);
  title.children(heading('aynı kayıt, ', 'aynı tutar.').children());
  yield* all(title.opacity(1, 0.3), comparison.root.opacity(1, 0.5));
  yield* waitUntil('initial-total');
  yield* comparison.chart.root.opacity(1, 0.3);
  yield* waitUntil('correct');
  yield* title.opacity(0, 0.2);
  title.children(heading('kaynakta tutarı ', 'düzeltiyoruz.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('correct-value');
  comparison.cards[0].amount.text('165');
  yield* all(comparison.cards[0].face.stroke(accent, 0.3), comparison.pending.opacity(1, 0.4));
  yield* waitUntil('stale-query');
  yield* title.opacity(0, 0.2);
  title.children(heading('warehouse’u ', 'yeniden sorgulayalım.').children());
  yield* all(
    title.opacity(1, 0.3),
    comparison.chart.root.opacity(0, 0.3),
    comparison.sql.opacity(1, 0.3),
    comparison.sql.fill(accent, 0.2),
  );
  yield* comparison.cards[1].face.stroke(accent, 0.2);
  yield* waitUntil('stale-result');
  yield* title.opacity(0, 0.2);
  title.children(heading('aynı sorgu, ', 'yine 400.').children());
  yield* all(
    title.opacity(1, 0.3),
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
  yield* all(title.opacity(1, 0.3), chain.root.opacity(1, 0.5));
  yield* waitUntil('lake');
  yield* chain.copy.travel(1.1);
  yield* chain.copy.arrive();
  yield* waitUntil('lake-updated');
  chain.records[1].amount.text('165');
  yield* chain.records[1].face.stroke(accent, 0.3);
  yield* waitUntil('warehouse-stale');
  yield* title.opacity(0, 0.2);
  title.children(heading('lake güncellendi. ', 'warehouse henüz değil.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('load');
  yield* title.opacity(0, 0.2);
  title.children(heading('warehouse’da ', 'aynı kaydı', ' güncelliyoruz.').children());
  yield* title.opacity(1, 0.3);
  yield* chain.transform.travel(1.1);
  yield* chain.transform.arrive();
  yield* waitUntil('loaded');
  chain.records[2].amount.text('165');
  yield* chain.records[2].face.stroke(accent, 0.3);
  yield* waitUntil('new-query');
  yield* all(title.opacity(0, 0.2), chain.root.opacity(0, 0.4));
  comparison.cards[1].amount.text('165');
  comparison.transfer.text('son aktarım: t1');
  comparison.transfer.fill(muted);
  comparison.pending.opacity(0);
  comparison.chart.root.opacity(0);
  title.children(heading('şimdi yeniden ', 'hesaplayalım.').children());
  yield* all(title.opacity(1, 0.3), comparison.root.opacity(1, 0.5));
  yield* comparison.sql.fill(accent, 0.2);
  yield* waitUntil('new-result');
  const bar = comparison.chart.bars[0];
  bar.value.text('380₺');
  const math = text('60 + 165 + 155 = 380', 35, {
    position: [-435, 266],
    fill: accent,
    opacity: 0,
  });
  comparison.root.add(math);
  yield* all(
    comparison.chart.root.opacity(1, 0.3),
    bar.value.y(110 - 380 * 0.43 - 28, 0.45),
    bar.bar.height(380 * 0.43, 0.45),
    comparison.sql.fill(foreground, 0.3),
    math.opacity(1, 0.3),
  );
  yield* waitUntil('unchanged-b');
  yield* comparison.chart.bars[1].value.fill(accent, 0.2).to(foreground, 0.4);
  yield* waitUntil('lag');
  yield* title.opacity(0, 0.2);
  title.children(heading('değişiklik ', 'ne kadar sonra', ' yansıyacak?').children());
  yield* all(title.opacity(1, 0.3), comparison.transfer.fill(accent, 0.3));
  yield* waitUntil('materialized');
  yield* all(title.opacity(0, 0.2), comparison.root.opacity(0, 0.4));
  title.children(heading('aynı database içinde de ', 'güncelleme gerekiyor.').children());
  const aggregate = storedTotals();
  aggregate.root.opacity(0);
  view.add(aggregate.root);
  yield* all(title.opacity(1, 0.3), aggregate.root.opacity(1, 0.5));
  yield* waitUntil('materialized-correct');
  aggregate.values[1].text('165');
  yield* aggregate.values[1].fill(accent, 0.3);
  yield* waitUntil('materialized-stale');
  yield* aggregate.stored.face.stroke(accent, 0.3);
  yield* waitUntil('refresh');
  yield* title.opacity(0, 0.2);
  title.children(heading('saklanan toplamı ', 'refresh', ' edelim.').children());
  aggregate.operation.text('refresh');
  aggregate.note.text('REFRESH MATERIALIZED VIEW monthly_totals;');
  aggregate.note.fontFamily(theme.fontFamily.mono);
  yield* title.opacity(1, 0.3);
  yield* aggregate.calculate.travel(1);
  yield* aggregate.calculate.arrive();
  yield* waitUntil('refreshed');
  aggregate.totals[0].text('380');
  yield* aggregate.stored.face.stroke(accent, 0.3);
  yield* waitUntil('cache');
  yield* all(title.opacity(0, 0.2), aggregate.root.opacity(0, 0.4));
  const cacheStage = new Layout({ opacity: 0 });
  view.add(cacheStage);
  const { market } = yield* updateCache(cacheStage, title);
  yield* waitUntil('maintenance-copy');
  yield* all(title.opacity(0, 0.2), cacheStage.opacity(0, 0.4));
  title.children(heading('warehouse kopyasını ', 'aktarımla', ' güncelledik.').children());
  yield* all(title.opacity(1, 0.3), chain.root.opacity(1, 0.5));
  yield* waitUntil('maintenance-refresh');
  yield* all(title.opacity(0, 0.2), chain.root.opacity(0, 0.4));
  title.children(heading('toplamı ', 'refresh ile', ' yeniden hesapladık.').children());
  yield* all(title.opacity(1, 0.3), aggregate.root.opacity(1, 0.5));
  yield* waitUntil('maintenance-cache');
  yield* all(title.opacity(0, 0.2), aggregate.root.opacity(0, 0.4));
  title.children(heading('cache’i ', 'güncel kayıtla', ' tekrar doldurduk.').children());
  yield* all(title.opacity(1, 0.3), cacheStage.opacity(1, 0.5));
  yield* waitUntil('maintenance');
  yield* title.opacity(0, 0.2);
  title.children(heading('her temsilin ', 'bakımını da', ' tasarlıyoruz.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('closing');
  yield* all(title.opacity(0, 0.2), cacheStage.opacity(0, 0.4));
  market.root.remove();
  cacheStage.remove();
  market.root.position([-455, 75]);
  market.root.scale(0.95);
  const chart = monthlyChart();
  chart.root.position([455, 75]);
  chart.root.scale(0.95);
  chart.bars[0].value.text('380₺');
  chart.bars[0].value.y(110 - 380 * 0.43 - 28);
  chart.bars[0].bar.height(380 * 0.43);
  market.root.opacity(0);
  chart.root.opacity(0);
  const operational = text('operational', 34, {
    position: [-455, 372],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const analytical = text('analytical', 34, {
    position: [455, 372],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const finish = new Layout({});
  finish.add([market.root, chart.root, operational, analytical]);
  view.add(finish);
  title.children(heading('aynı işletme, ', 'farklı işler.').children());
  yield* all(title.opacity(1, 0.3), market.root.opacity(1, 0.5), operational.opacity(1, 0.4));
  yield* waitUntil('closing-analytical');
  yield* all(chart.root.opacity(1, 0.5), analytical.opacity(1, 0.4));
  yield* waitUntil('closing-operational');
  yield* market.status.opacity(0.45, 0.15).to(1, 0.3);
  yield* waitUntil('closing-analysis');
  yield* chart.bars[0].value.fill(accent, 0.3).to(foreground, 0.4);
  yield* waitUntil('tradeoff');
  yield* title.opacity(0, 0.2);
  title.children(heading('kazancı ve bakım işini ', 'birlikte düşünüyoruz.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('recap');
  yield* all(title.opacity(0, 0.2), finish.opacity(0, 0.4));
  title.children(heading('tasarlarken ', 'bunları birlikte', ' düşünüyoruz.').children());
  const recap = new Layout({ opacity: 0 });
  const questions = [
    ['hangi iş?', 'sipariş durumu · aylık satış'],
    ['hangi temsil?', 'kayıt · cache · analytical görünüm'],
    ['hangi kaynak?', 'asıl kayıt ve ona bağlı input’lar'],
    ['nasıl güncellenecek?', 'aktarım · refresh · invalidate'],
  ].map(([question, detail], i) => {
    const y = -141 + 147 * i;
    const row = new Layout({ opacity: 0 });
    row.add([
      text(question, 37, {
        position: [-706, y],
        offset: [-1, 0],
        fill: accent,
        fontStyle: 'italic',
      }),
      text(detail, 33, { position: [-188, y], offset: [-1, 0] }),
    ]);
    recap.add(row);
    return row;
  });
  view.add(recap);
  yield* all(title.opacity(1, 0.3), recap.opacity(1, 0.5));
  yield* waitUntil('question-work');
  yield* questions[0].opacity(1, 0.35);
  yield* waitUntil('question-representation');
  yield* questions[1].opacity(1, 0.35);
  yield* waitUntil('question-source');
  yield* questions[2].opacity(1, 0.35);
  yield* waitUntil('question-maintenance');
  yield* questions[3].opacity(1, 0.35);
  yield* waitUntil('end');
});
