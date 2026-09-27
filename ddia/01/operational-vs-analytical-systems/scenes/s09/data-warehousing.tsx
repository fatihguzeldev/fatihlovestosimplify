import { Layout, makeScene2D, Path } from '@motion-canvas/2d';
import { all, cancel, easeOutCubic, loop, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import {
  accent,
  background,
  foreground,
  heading,
  ink,
  muted,
  paper,
  text,
} from '../shared/drawing';
import { role } from '../shared/people';
import { workloadSystem } from '../shared/workload-system';
import { warehouseSystem } from '../shared/warehouse-system';
import { databaseWork } from './database-work';
import { bookContents } from '../shared/book-contents';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('bu işleri ', 'aynı database’e', ' yaptırırsak?');
  const system = workloadSystem();
  view.add([title, system.root]);
  yield loadFonts();
  yield* waitUntil('part');
  yield* all(title.opacity(0, 0.25), system.root.opacity(0, 0.4));
  yield* bookContents(view, 'transactions', 'warehousing');
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
  line.opacity(() => (line.end() > 0 ? 1 : 0));
  card.add([first, second, line]);
  view.add(card);
  yield* card.opacity(1, 0.4);
  yield* line.end(1, 0.65);
  yield* waitUntil('workloads');
  yield* card.opacity(0, 0.4);
  card.remove();
  title.children(heading('iki iş de ', 'aynı database’de.').children());
  yield* all(title.opacity(1, 0.3), system.root.opacity(1, 0.5));
  const orderReply = cartoonArrow('s09-order-result', [-170, 208], [-385, 208], accent, 0);
  view.add(orderReply.root);
  yield* waitUntil('read');
  title.children(heading('siparişin durumunu ', 'okuyoruz.').children());
  system.market.status.text('yanıt bekleniyor…');
  yield* system.orders.fill(accent, 0.15);
  yield* system.order.travel(0.55);
  yield* system.order.arrive();
  yield* orderReply.reveal(1, 0.25);
  yield* orderReply.travel(0.55);
  system.market.status.text('preparing');
  yield* all(orderReply.arrive(), system.orders.fill(foreground, 0.25));
  yield* waitUntil('scan');
  title.children(heading('rapor ', 'çok sayıda kaydı', ' tarıyor.').children());
  const waiting = text('yanıt bekleniyor…', 32, { y: 235, fill: accent, opacity: 0 });
  system.chart.root.add(waiting);
  yield* all(system.sales.fill(accent, 0.2), waiting.opacity(1, 0.2));
  yield* system.query.travel(0.7);
  yield* system.query.arrive();
  const work = databaseWork();
  work.root.scale(0.45);
  work.root.y(35);
  view.add(work.root);
  yield* all(
    system.context.opacity(0, 0.4),
    orderReply.root.opacity(0, 0.4),
    system.database.caption.opacity(0, 0.4),
    system.orders.opacity(0, 0.4),
    system.sales.opacity(0, 0.4),
    system.database.root.position([0, 35], 0.65),
    system.database.root.scale(2.5, 0.65),
  );
  const scanning = yield loop(() => work.sweep());
  yield* all(
    system.database.root.opacity(0, 0.4),
    work.root.opacity(1, 0.4),
    work.root.scale(1, 0.65),
    work.root.y(0, 0.65),
  );
  system.root.opacity(0);
  system.database.root.position([0, 75]);
  system.database.root.scale(1.12);
  system.database.root.opacity(1);
  system.database.caption.opacity(1);
  system.orders.opacity(1);
  system.sales.opacity(1);
  system.context.opacity(1);
  yield* waitUntil('resources');
  title.children(heading('iki iş de ', 'aynı kaynakları', ' kullanıyor.').children());
  yield* work.resources.opacity(1, 0.4);
  yield* waitUntil('contention');
  title.children(heading('bu sırada sipariş yanıtı ', 'gecikebilir.').children());
  work.status.text('yanıt bekleniyor…');
  yield* work.pulse.opacity(1, 0.3);
  const reading = yield loop(() => work.pulse.opacity(0.3, 0.55).to(1, 0.55));
  yield* waitUntil('order-response');
  cancel(reading);
  yield* work.pulse.opacity(0, 0.25);
  work.status.text('preparing');
  title.children(heading('sipariş yanıtı geldiğinde ', 'rapor hâlâ çalışıyor.').children());
  yield* waitUntil('report-response');
  cancel(scanning);
  title.children(heading('raporun sonucu da ', 'hazır.').children());
  work.activity.text('rapor tamamlandı');
  yield* work.scan.opacity(0, 0.25);
  yield* work.root.opacity(0, 0.4);
  work.root.remove();
  yield* system.root.opacity(1, 0.4);
  const reportReply = cartoonArrow('s09-report-result', [170, 208], [375, 208], accent, 0);
  view.add(reportReply.root);
  yield* reportReply.reveal(1, 0.3);
  yield* reportReply.travel(0.6);
  yield* all(
    reportReply.arrive(),
    waiting.opacity(0, 0.3),
    system.sales.fill(foreground, 0.3),
    ...system.chart.bars.flatMap(({ bar, value, height }) => [
      bar.height(height, 0.8, easeOutCubic),
      value.opacity(1, 0.2),
    ]),
  );
  yield* waitUntil('sources');
  yield* all(title.opacity(0, 0.3), system.root.opacity(0, 0.3), reportReply.root.opacity(0, 0.3));
  system.root.remove();
  title.children(heading('satış ve stokları ', 'bölgelere göre', ' inceleyelim.').children());
  const landscape = warehouseSystem();
  landscape.root.opacity(0);
  landscape.warehouse.root.opacity(0);
  view.add(landscape.root);
  const needed = new Layout({ opacity: 0 });
  ['satışlar', 'stoklar', 'mağazanın bölgesi'].forEach((label, i) => {
    needed.add(text(label, 29, { position: [-570 + i * 570, 67], fill: accent }));
  });
  const sourceNote = text('ihtiyacımız olan bilgiler farklı sistemlerde.', 36, { y: 254 });
  needed.add(sourceNote);
  view.add(needed);
  yield* all(title.opacity(1, 0.4), landscape.root.opacity(1, 0.4), needed.opacity(1, 0.4));
  yield* waitUntil('layouts');
  yield* all(title.opacity(0, 0.25), sourceNote.opacity(0, 0.25));
  title.children(heading('bu bilgileri ', 'birlikte sorgulamak', ' istiyoruz.').children());
  const schema = paper(1210, 144, '#17232f');
  schema.root.position([0, 310]);
  schema.root.opacity(0);
  schema.root.add([
    text('analize uygun bir görünüm', 26, { y: -37, fill: muted }),
    text('mağaza  ·  bölge  ·  satış  ·  stok', 36, {
      y: 24,
      fontFamily: theme.fontFamily.mono,
      fill: accent,
    }),
  ]);
  const links = new Layout({ opacity: 0 });
  const sourceLinks = [-570, 0, 570].map((x, i) => {
    const arrow = cartoonArrow(`s09-source-${i}-schema`, [0, 0], [(1 - i) * 130, 160], accent, 0);
    arrow.root.position([x, 110]);
    arrow.root.scale(0.65);
    links.add(arrow.root);
    return arrow;
  });
  view.add([links, schema.root]);
  yield* all(title.opacity(1, 0.3), schema.root.opacity(1, 0.4), links.opacity(1, 0.3));
  yield* all(...sourceLinks.map((arrow) => arrow.reveal(1, 0.65)));
  yield* waitUntil('access');
  yield* all(
    title.opacity(0, 0.3),
    needed.opacity(0, 0.3),
    schema.root.opacity(0, 0.3),
    links.opacity(0, 0.3),
  );
  title.children(heading('bu sistemlere ', 'herkes bağlanamaz.').children());
  const access = new Layout({ opacity: 0 });
  const boundary = new Path({
    ...ink,
    stroke: muted,
    lineWidth: 2,
    lineDash: [12, 11],
    data: 'M -812 -294 Q -825 -314 -797 -315 Q 15 -324 810 -313 Q 829 -312 825 -288 L 821 51 Q 820 70 792 67 Q -20 61 -797 71 Q -819 70 -817 47 Z',
  });
  const analyst = role('analyst', 'kaynakları sorgulamak istiyor', 1);
  analyst.position([-470, 271]);
  analyst.scale(1.2);
  analyst.opacity(1);
  const query = paper(540, 104, '#101315');
  query.root.position([205, 271]);
  query.root.add(text('satış · stok · bölge', 30, { fontFamily: theme.fontFamily.mono }));
  const blocked = new Path({
    ...ink,
    stroke: accent,
    lineWidth: 3,
    data: 'M 203 201 Q 193 158 201 114 M 193 121 L 201 112 L 209 120',
    end: 0,
  });
  const lock = new Path({
    ...ink,
    stroke: accent,
    fill: background,
    data: 'M 184 73 L 184 59 Q 185 40 201 41 Q 217 43 217 60 L 217 73 M 177 74 L 224 72 L 223 104 L 178 106 Z M 201 84 L 201 95',
  });
  access.add([
    boundary,
    analyst,
    query.root,
    blocked,
    lock,
    text('doğrudan erişim yok', 27, { position: [412, 94], fill: accent }),
  ]);
  view.add(access);
  yield* all(title.opacity(1, 0.4), access.opacity(1, 0.4));
  yield* blocked.end(1, 0.6);
  yield* waitUntil('warehouse');
  yield* all(title.opacity(0, 0.3), access.opacity(0, 0.3));
  access.remove();
  title.children(heading('analizi ', 'ayrı bir database’e', ' taşıyalım.').children());
  yield* all(title.opacity(1, 0.4), landscape.warehouse.root.opacity(1, 0.6));
  const purpose = new Layout({ opacity: 0 });
  purpose.add(text('operational sistemler çalışmaya devam eder', 29, { y: 63, fill: muted }));
  const operations = paper(340, 118, '#101315');
  operations.root.position([-590, 280]);
  operations.root.add([
    text('sipariş işlemleri', 28, { y: -24 }),
    text('getOrder(1042)', 25, { y: 24, fill: accent, fontFamily: theme.fontFamily.mono }),
  ]);
  const analytics = paper(340, 118, '#17232f');
  analytics.root.position([620, 280]);
  analytics.root.add([
    text('rapor sorgusu', 28, { y: -24 }),
    text('SUM(amount)', 25, { y: 24, fill: accent, fontFamily: theme.fontFamily.mono }),
  ]);
  const operationalRoute = cartoonArrow(
    's09-operational-route',
    [-590, 197],
    [-570, 44],
    accent,
    0,
  );
  const analyticalRoute = cartoonArrow('s09-analytical-route', [421, 280], [177, 280], accent, 0);
  purpose.add([operations.root, analytics.root, operationalRoute.root, analyticalRoute.root]);
  view.add(purpose);
  yield* waitUntil('placement');
  yield* purpose.opacity(1, 0.4);
  yield* all(operationalRoute.reveal(1, 0.5), analyticalRoute.reveal(1, 0.5));
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.3), purpose.opacity(0, 0.3));
  title.children(heading('peki bu data ', 'buraya nasıl gelecek?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
