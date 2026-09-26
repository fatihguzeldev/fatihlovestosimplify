import { Layout, makeScene2D, Path, Rect } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, paper, text } from '../shared/drawing';
import { role } from '../shared/people';
import { workloadSystem } from '../shared/workload-system';
import { warehouseSystem } from '../shared/warehouse-system';
import { storedResult } from './stored-result';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('bu işleri ', 'nerede çalıştıracağız?');
  const system = workloadSystem();
  view.add([title, system.root]);
  yield loadFonts();
  yield* waitUntil('part');
  yield* all(title.opacity(0, 0.25), system.root.opacity(0, 0.4));
  const card = new Layout({ opacity: 0 });
  const first = text('data’nın ', 104, { position: [-806, -35], offset: [-1, 0] });
  const second = text('yolculuğu.', 104, {
    position: () => [-806 + first.width() + 26, -35],
    offset: [-1, 0],
    fill: accent,
    fontStyle: 'italic',
    fontWeight: 500,
  });
  const line = new Path({
    data: () => `M 2 0 Q ${second.width() * 0.45} 10 ${second.width() - 4} 1`,
    position: () => second.position().addY(78),
    stroke: accent,
    lineWidth: 5,
    lineCap: 'round',
    end: 0,
  });
  card.add([
    first,
    second,
    line,
    text('part 2', 29, {
      position: [-800, -203],
      offset: [-1, 0],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    text('data warehousing', 32, {
      position: [-800, 144],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.serif,
      fontStyle: 'italic',
    }),
  ]);
  view.add(card);
  yield* card.opacity(1, 0.4);
  yield* line.end(1, 0.65);
  yield* waitUntil('workloads');
  yield* card.opacity(0, 0.4);
  card.remove();
  title.children(heading('aynı database, ', 'iki farklı iş.').children());
  yield* all(title.opacity(1, 0.3), system.root.opacity(1, 0.5));
  const reply = cartoonArrow('s09-recomputed-result', [170, 208], [375, 208], accent, 0);
  view.add(reply.root);
  yield* waitUntil('recompute');
  yield* system.chart.root.opacity(0.25, 0.3);
  yield* system.query.travel(0.65);
  yield* all(system.query.arrive(), system.database.top.stroke(accent, 0.1).to(foreground, 0.35));
  yield* reply.reveal(1, 0.35);
  yield* reply.travel(0.65);
  yield* all(reply.arrive(), system.chart.root.opacity(1, 0.3));
  yield* waitUntil('stored');
  yield* all(title.opacity(0, 0.2), system.root.opacity(0, 0.4), reply.root.opacity(0, 0.3));
  const alternative = new Layout({ opacity: 0 });
  view.add(alternative);
  yield* storedResult(alternative);
  yield* waitUntil('return');
  yield* alternative.opacity(0, 0.4);
  alternative.remove();
  title.children(heading('ana örneğe ', 'dönelim.').children());
  const transient = text('sonuç sorgu sırasında hesaplanıyor', 32, {
    position: [0, 406],
    fill: muted,
    opacity: 0,
  });
  view.add(transient);
  yield* all(title.opacity(1, 0.3), system.root.opacity(1, 0.5), transient.opacity(1, 0.4));
  yield* waitUntil('contention');
  yield* all(title.opacity(0, 0.2), transient.opacity(0, 0.2));
  title.children(heading('', 'aynı kaynakları', ' paylaşıyorlar.').children());
  const busy = text('analytical query çalışıyor', 31, {
    position: [0, 352],
    fill: accent,
    opacity: 0,
  });
  view.add(busy);
  yield* title.opacity(1, 0.3);
  yield* system.query.travel(0.8);
  yield* all(
    system.query.arrive(),
    system.database.top.stroke(accent, 0.2),
    busy.opacity(1, 0.3),
    system.chart.root.opacity(0.3, 0.3),
  );
  system.market.status.text('yanıt bekleniyor…');
  system.market.status.fontSize(31);
  yield* system.order.travel(0.6);
  yield* system.order.arrive();
  yield* waitFor(0.8);
  yield* title.opacity(0, 0.2);
  title.children(heading('sipariş isteği de ', 'bekleyebilir.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('release');
  reply.reveal(0);
  reply.root.opacity(1);
  yield* reply.reveal(1, 0.3);
  yield* reply.travel(0.6);
  yield* all(
    reply.arrive(),
    busy.opacity(0, 0.25),
    system.chart.root.opacity(1, 0.25),
    system.database.top.stroke(foreground, 0.25),
  );
  const orderReply = cartoonArrow('s09-waited-order-result', [-170, 208], [-385, 208], accent, 0);
  view.add(orderReply.root);
  yield* orderReply.reveal(1, 0.3);
  yield* orderReply.travel(0.6);
  system.market.status.text('preparing');
  system.market.status.fontSize(38);
  yield* orderReply.arrive();
  yield* waitUntil('sources');
  yield* all(
    title.opacity(0, 0.2),
    system.root.opacity(0, 0.4),
    reply.root.opacity(0, 0.3),
    orderReply.root.opacity(0, 0.3),
  );
  title.children(heading('satış, stok ve mağaza bilgileri ', 'farklı yerlerde.').children());
  const landscape = warehouseSystem();
  landscape.root.opacity(0);
  landscape.warehouse.root.opacity(0);
  view.add(landscape.root);
  const question = text('bölgelere göre satış ve stok nasıl?', 42, {
    position: [0, 252],
    opacity: 0,
  });
  view.add(question);
  yield* all(title.opacity(1, 0.3), landscape.root.opacity(1, 0.5));
  yield* question.opacity(1, 0.4);
  yield* waitUntil('layouts');
  yield* all(title.opacity(0, 0.2), question.opacity(0, 0.25));
  title.children(heading('analizde ', 'başka bir görünüm', ' gerekiyor.').children());
  const schemas = new Layout({ opacity: 0 });
  const operational = paper(520, 120, '#101315');
  operational.root.position([-400, 245]);
  operational.root.add([
    text('kayıt', 24, { y: -24, fill: muted }),
    text('id · store_id · amount', 27, { y: 23, fontFamily: theme.fontFamily.mono }),
  ]);
  const analytical = paper(520, 120, '#17232f');
  analytical.root.position([400, 245]);
  analytical.root.add([
    text('analiz', 24, { y: -24, fill: muted }),
    text('region · SUM(amount)', 27, { y: 23, fontFamily: theme.fontFamily.mono, fill: accent }),
  ]);
  const reshape = cartoonArrow('s09-analytical-layout', [-107, 245], [107, 245], accent, 0);
  schemas.add([operational.root, analytical.root, reshape.root]);
  view.add(schemas);
  yield* all(title.opacity(1, 0.3), schemas.opacity(1, 0.4));
  yield* reshape.reveal(1, 0.4);
  yield* reshape.travel(0.6);
  yield* waitUntil('access');
  yield* all(title.opacity(0, 0.2), schemas.opacity(0, 0.3));
  title.children(heading('her kaynağa ', 'doğrudan erişim', ' yok.').children());
  const access = new Layout({ opacity: 0 });
  const boundary = new Rect({
    position: [0, -143],
    size: [1660, 340],
    radius: 25,
    stroke: muted,
    lineWidth: 1.6,
    lineDash: [10, 12],
    opacity: 0.65,
  });
  const analyst = role('analyst', 'analiz yapmak istiyor', 1);
  analyst.position([75, 290]);
  analyst.scale(1.4);
  analyst.opacity(1);
  const blocked = cartoonArrow('s09-direct-access-boundary', [0, 0], [0, -212], accent, 0);
  blocked.root.position([0, 172]);
  blocked.root.scale(0.5);
  const stop = new Path({
    data: 'M -13 35 L 13 59 M 13 35 L -13 59',
    stroke: accent,
    lineWidth: 4,
    lineCap: 'round',
  });
  access.add([
    boundary,
    analyst,
    blocked.root,
    stop,
    text('operational network', 23, {
      position: [-780, -288],
      offset: [-1, 0],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
  ]);
  view.add(access);
  yield* all(title.opacity(1, 0.3), access.opacity(1, 0.4));
  yield* blocked.reveal(1, 0.4);
  yield* blocked.travel(0.7, 0.8);
  yield* waitUntil('warehouse');
  yield* all(title.opacity(0, 0.2), access.opacity(0, 0.4));
  access.remove();
  title.children(heading('analiz için ', 'ayrı bir database.').children());
  yield* all(title.opacity(1, 0.3), landscape.warehouse.root.opacity(1, 0.6));
  yield* waitUntil('decisions');
  const decisions = new Layout({ opacity: 0 });
  decisions.add([
    text('neyi hazır tutuyoruz?', 30, { position: [-550, 239], fill: accent, fontStyle: 'italic' }),
    text('ek temsiller', 27, { position: [-550, 290] }),
    text('nerede çalıştırıyoruz?', 30, { position: [550, 239], fill: accent, fontStyle: 'italic' }),
    text('ayrı sistem', 27, { position: [550, 290] }),
  ]);
  view.add(decisions);
  yield* decisions.opacity(1, 0.4);
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.2), decisions.opacity(0, 0.25));
  title.children(heading('peki, bu data ', 'buraya nasıl gelecek?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
