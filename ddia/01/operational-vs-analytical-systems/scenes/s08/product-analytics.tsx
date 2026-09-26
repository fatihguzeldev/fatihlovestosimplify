import { Layout, Line, makeScene2D, Rect } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, paper, text } from '../shared/drawing';
import { createMarket } from '../shared/market';
import { monthlyChart } from '../shared/workloads';
import { workloadSystem } from '../shared/workload-system';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('bu sonuca ', 'kullanıcı da', ' ihtiyaç duyarsa?');
  const previous = monthlyChart();
  previous.root.position([0, 80]);
  previous.root.scale(1.15);
  view.add([title, previous.root]);
  yield loadFonts();
  yield* waitUntil('product');
  yield* all(title.opacity(0, 0.2), previous.root.opacity(0, 0.35));
  previous.root.remove();
  title.children(heading('satıcı, ', 'son beş dakikayı', ' izliyor.').children());
  const stage = new Layout({ opacity: 0 });
  const market = createMarket();
  market.root.position([465, 65]);
  market.root.scale(1.12);
  market.label.text('satıcı ekranı');
  market.body.removeChildren();
  const count = text('20 sipariş', 43, { y: -85, fill: accent, fontFamily: theme.fontFamily.mono });
  const stamp = text('14:00:00 < t ≤ 14:05:00', 21, {
    y: 165,
    fill: muted,
    fontFamily: theme.fontFamily.mono,
  });
  const bars = [10, 10].map((value, i) => {
    const bar = new Rect({
      position: [-132 + i * 264, 92],
      offset: [0, 1],
      size: [82, value * 10],
      fill: accent,
    });
    const amount = text(String(value), 25, {
      position: [-132 + i * 264, -30],
      fontFamily: theme.fontFamily.mono,
    });
    market.body.add([
      bar,
      amount,
      text(`mağaza ${i ? 'b' : 'a'}`, 22, { position: [-132 + i * 264, 118] }),
    ]);
    return { bar, amount };
  });
  market.body.add([
    text('son 5 dakika', 27, { y: -139 }),
    count,
    stamp,
    new Line({
      points: [
        [-250, 93],
        [250, 93],
      ],
      stroke: muted,
      lineWidth: 1.5,
    }),
  ]);
  const database = cartoonDatabase('sales database', accent);
  database.root.position([-540, 100]);
  database.root.scale(1.4);
  database.caption.fontSize(28 / 1.4);
  const record = text('#2000', 31, { y: 2, fontFamily: theme.fontFamily.mono });
  const writtenAt = text('14:05:00', 23, {
    y: 55,
    fill: accent,
    fontFamily: theme.fontFamily.mono,
  });
  database.root.add([record, writtenAt]);
  const request = cartoonArrow('s08-live-count-query', [35, 55], [-332, 55], accent, 0);
  const response = cartoonArrow('s08-live-count-result', [-332, 198], [35, 198], accent, 0);
  const queryLabel = text('countOrders(last5min)', 25, {
    position: request.pointAt(0.5).addY(-85),
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const resultLabel = text('11 + 9 = 20', 28, {
    position: response.pointAt(0.5).addY(83),
    fill: accent,
    opacity: 0,
  });
  stage.add([database.root, market.root, request.root, response.root, queryLabel, resultLabel]);
  view.add(stage);
  yield* all(stage.opacity(1, 0.5), title.opacity(1, 0.3));
  yield* waitUntil('fresh');
  yield* title.opacity(0, 0.2);
  title.children(heading('zaman ilerledikçe ', 'pencere de kayıyor.').children());
  const event = paper(310, 96, '#17232f');
  event.root.position([-540, -155]);
  event.root.opacity(0);
  event.root.add([
    text('yeni sipariş · #2001', 24, { y: -19 }),
    text('mağaza a · 14:05:20', 21, { y: 21, fill: accent }),
  ]);
  const expired = paper(340, 100, '#101315');
  expired.root.position([-540, 424]);
  expired.root.opacity(0);
  expired.root.add([
    text('#1981 · mağaza b', 24, { y: -22 }),
    text('14:00:10 · aralığın dışında', 21, { y: 23, fill: muted }),
  ]);
  stage.add([event.root, expired.root]);
  yield* all(title.opacity(1, 0.3), event.root.opacity(1, 0.3));
  yield* waitFor(1.2);
  yield* all(event.root.position([-540, -25], 0.7), event.root.scale(0.6, 0.7));
  yield* event.root.opacity(0, 0.15);
  record.text('#2001');
  writtenAt.text('14:05:20');
  yield* database.top.stroke(accent, 0.12).to(foreground, 0.3);
  yield* expired.root.opacity(1, 0.4);
  yield* waitUntil('read');
  yield* all(request.reveal(1, 0.4), queryLabel.opacity(1, 0.3));
  yield* request.travel(0.7);
  yield* request.arrive();
  yield* all(response.reveal(1, 0.4), resultLabel.opacity(1, 0.3));
  yield* response.travel(0.7);
  count.text('20 sipariş');
  stamp.text('14:00:20 < t ≤ 14:05:20');
  bars[0].amount.text('11');
  bars[1].amount.text('9');
  yield* all(
    response.arrive(),
    bars[0].bar.height(110, 0.35),
    bars[0].amount.y(-40, 0.35),
    bars[1].bar.height(90, 0.35),
    bars[1].amount.y(-20, 0.35),
    stamp.fill(accent, 0.25),
  );
  yield* waitUntil('latency');
  yield* title.opacity(0, 0.2);
  title.children(heading('sonucu ', 'bekletmeden', ' göstermeliyiz.').children());
  count.text('yükleniyor…');
  count.fontSize(36);
  yield* title.opacity(1, 0.3);
  yield* request.travel(0.6);
  yield* request.arrive();
  yield* waitFor(0.25);
  yield* response.travel(0.6);
  count.text('20 sipariş');
  count.fontSize(43);
  yield* response.arrive();
  yield* waitUntil('dimensions');
  yield* all(
    title.opacity(0, 0.2),
    request.root.opacity(0.25, 0.3),
    response.root.opacity(0.25, 0.3),
    queryLabel.opacity(0, 0.2),
    resultLabel.opacity(0, 0.2),
    expired.root.opacity(0, 0.3),
  );
  title.children(heading('iki ayrı ihtiyaç: ', 'güncellik ve hız.').children());
  const fresh = text('fresh data', 38, {
    position: [-540, 398],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const fast = text('low response time', 38, {
    position: [465, 398],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  stage.add([fresh, fast]);
  yield* all(title.opacity(1, 0.3), fresh.opacity(1, 0.35), fast.opacity(1, 0.35));
  yield* waitUntil('name');
  yield* title.opacity(0, 0.2);
  title.children(heading('', 'product / real-time analytics').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.2), stage.opacity(0, 0.4));
  title.children(heading('bu işleri ', 'nerede çalıştıracağız?').children());
  const system = workloadSystem();
  system.root.opacity(0);
  view.add(system.root);
  yield* all(title.opacity(1, 0.3), system.root.opacity(1, 0.5));
  yield* waitUntil('end');
});
