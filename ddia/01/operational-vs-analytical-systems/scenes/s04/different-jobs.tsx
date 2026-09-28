import { Layout, makeScene2D, Path, Rect } from '@motion-canvas/2d';
import { all, createSignal, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, text } from '../shared/drawing';
import { createMarket } from '../shared/market';
import { salesReport } from './illustrations';
import { role } from '../shared/people';
import { bookContents } from '../shared/book-contents';

export default makeScene2D(function* (view) {
  view.fill(background);
  yield loadFonts();
  yield* bookContents(view, 'introduction', 'systems');
  const card = new Layout({ opacity: 0 });
  const first = text('aynı data,', 104, { position: [-806, -35], offset: [-1, 0] });
  const second = text('farklı işler.', 104, {
    position: () => [-806 + first.width() + 26, -35],
    offset: [-1, 0],
    fill: accent,
    fontStyle: 'italic',
    fontWeight: 500,
  });
  const underline = new Path({
    position: () => second.position().addY(75),
    data: () =>
      `M 2 2 Q ${second.width() * 0.32} 8 ${second.width() * 0.58} 1 T ${second.width() - 3} 4`,
    stroke: accent,
    lineWidth: 5,
    lineCap: 'round',
    end: 0,
  });
  underline.opacity(() => (underline.end() > 0 ? 1 : 0));
  card.add([first, second, underline]);
  view.add(card);
  yield* card.opacity(1, 0.35);
  yield* underline.end(1, 0.65);
  yield* waitUntil('order');
  yield* card.opacity(0, 0.4);
  card.remove();

  const stage = new Layout({ opacity: 0 });
  const title = heading('siparişim ', 'ne durumda?');
  const orderFlow = new Layout({ position: [404, -30], scale: 1.2 });
  const market = createMarket();
  market.root.position([-620, 70]);
  market.root.scale(0.66);
  market.cart.remove();
  market.label.opacity(0);
  market.status.text('…');
  const detail = createSignal(0);
  const overview = new Layout({});
  const overviewDetails = new Layout({ opacity: 0 });
  const overviewStatus = text('…', 42, {
    fontSize: () => 42 - detail() * 10,
    position: () => [-249 - detail() * 4, -8 - detail() * 24],
    offset: [-1, 0],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
  });
  overviewStatus.text(() => market.status.text());
  overviewDetails.add([
    new Path({
      data: () =>
        `M -269 ${61 - detail() * 39} Q 0 ${64 - detail() * 40} 269 ${61 - detail() * 39}`,
      stroke: foreground,
      lineWidth: 1.5,
      opacity: () => 0.2 - detail() * 0.04,
    }),
    text('muz · süt', 36, {
      fontSize: () => 36 - detail() * 2,
      position: () => [-269, 118 - detail() * 64],
      offset: [-1, 0],
      fontWeight: 500,
    }),
    text('185₺', 38, {
      fontSize: () => 38 - detail() * 2,
      position: () => [269, 118 - detail() * 20],
      offset: [1, 0],
      fontFamily: theme.fontFamily.mono,
    }),
  ]);
  overview.add([
    text('sipariş', 32, {
      fontSize: () => 32 - detail() * 6,
      position: () => [-269, -132 - detail() * 14],
      offset: [-1, 0],
      fill: muted,
    }),
    text('#1042', 48, {
      fontSize: () => 48 - detail() * 4,
      position: () => [-269, -83 - detail() * 20],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
      fontWeight: 500,
    }),
    new Rect({
      position: () => [-269, -8 - detail() * 24],
      offset: [-1, 0],
      width: () => overviewStatus.width() + 40 - detail() * 8,
      height: () => 66 - detail() * 14,
      radius: 7,
      fill: '#182638',
    }),
    overviewStatus,
    overviewDetails,
  ]);
  market.body.add(overview);
  const { root: database, top, caption } = cartoonDatabase('sales database', accent);
  database.position([0, 70]);
  database.scale(1.4);
  for (const path of database.children()) {
    if (path instanceof Path) path.lineWidth(path.lineWidth() * 0.7);
  }
  caption.fontSize(28 / 1.4);
  caption.y((275 - 70) / 1.4);
  const record = text('#1042', 23, { y: -7, fontFamily: theme.fontFamily.mono });
  const state = text('created', 20, { y: 57, fill: accent, fontFamily: theme.fontFamily.mono });
  database.add([record, state]);
  const orderQuestion = text('siparişim ne durumda?', 31, { position: [-620, -124], opacity: 0 });
  const reportQuestion = text('ocak satışları nasıl?', 31, { position: [620, -124], opacity: 0 });
  const operational = text('operational work', 29, {
    position: [-620, 275],
    fill: accent,
    opacity: 0,
  });
  const analytical = text('analytical work', 29, {
    position: [620, 275],
    fill: accent,
    opacity: 0,
  });
  const engineer = role('backend engineer', 'servisi geliştirir', 0);
  engineer.position([-620, 402]);
  const analyst = role('business analyst', 'raporları hazırlar', 1);
  analyst.position([620, 402]);
  const scientist = role('data scientist', 'öneri modelini geliştirir', 2);
  scientist.position([620, 402]);
  const report = salesReport();
  report.root.position([620, 70]);
  report.root.opacity(0);
  const request = cartoonArrow('s04-order-question', [-373, 20], [-193, 20], accent, 0);
  const response = cartoonArrow('s04-order-answer', [-193, 125], [-373, 125], accent, 0);
  const query = cartoonArrow('s04-january-query', [375, 20], [193, 20], accent, 0);
  const result = cartoonArrow('s04-january-result', [193, 125], [375, 125], accent, 0);
  const readLabel = text('#1042', 24, {
    position: request.pointAt(0.5).addY(-54),
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const responseLabel = text('created', 24, {
    position: response.pointAt(0.5).addY(65),
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  const queryLabel = text('ocak', 24, { position: query.pointAt(0.5).addY(-54), opacity: 0 });
  orderFlow.add([
    market.root,
    database,
    orderQuestion,
    operational,
    engineer,
    request.root,
    response.root,
    readLabel,
    responseLabel,
  ]);
  stage.add([
    title,
    orderFlow,
    reportQuestion,
    analytical,
    analyst,
    scientist,
    report.root,
    query.root,
    result.root,
    queryLabel,
  ]);
  view.add(stage);
  yield* stage.opacity(1, 0.5);
  // The chapter map and title card finish before the voiceover begins.
  yield* waitUntil('narration-start');
  yield* waitUntil('operational');
  yield* all(request.reveal(1, 0.4), readLabel.opacity(1, 0.3));
  yield* request.travel(0.6);
  yield* all(request.arrive(), top.stroke(accent, 0.12).to(foreground, 0.3));
  yield* waitUntil('order-response');
  yield* all(response.reveal(1, 0.4), responseLabel.opacity(1, 0.3));
  yield* response.travel(0.6);
  market.status.text('created');
  yield* all(
    response.arrive(),
    overviewDetails.opacity(1, 0.3),
    market.shell.stroke(accent, 0.12).to(foreground, 0.3),
  );
  yield* waitUntil('operational-label');
  yield* operational.opacity(1, 0.35);
  yield* waitUntil('engineer');
  yield* title.opacity(0, 0.2);
  title.children(heading('bu isteği ', 'bir servis', ' karşılar.').children());
  readLabel.text('getOrder(1042)');
  readLabel.fontSize(21);
  readLabel.position(request.pointAt(0.5).addY(-64));
  yield* all(title.opacity(1, 0.35), orderQuestion.opacity(1, 0.35), engineer.opacity(1, 0.4));

  yield* waitUntil('analytical');
  yield* all(
    title.opacity(0, 0.2),
    orderFlow.position([0, 0], 0.75),
    orderFlow.scale(1, 0.75),
    engineer.opacity(0.35, 0.25),
    market.root.opacity(0.4, 0.25),
    orderQuestion.opacity(0.4, 0.25),
    request.root.opacity(0.25, 0.25),
    response.root.opacity(0.25, 0.25),
    readLabel.opacity(0.25, 0.25),
    responseLabel.opacity(0.25, 0.25),
    operational.opacity(0.4, 0.25),
  );
  title.children(heading('ocak satışları ', 'nasıl?').children());
  yield* all(title.opacity(1, 0.35), record.opacity(0, 0.2), state.opacity(0, 0.2));
  record.text('orders');
  state.text('sales');
  yield* all(record.opacity(1, 0.3), state.opacity(1, 0.3), report.root.opacity(1, 0.45));
  yield* waitUntil('report');
  yield* all(query.reveal(1, 0.4), queryLabel.opacity(1, 0.3));
  yield* query.travel(0.6);
  yield* all(query.arrive(), top.stroke(accent, 0.12).to(foreground, 0.3));
  yield* waitUntil('report-result');
  yield* result.reveal(1, 0.4);
  yield* result.travel(0.6);
  yield* result.arrive();
  yield* waitUntil('report-store-a');
  yield* report.bars[0].bar.height(report.bars[0].amount * 0.37, 0.65);
  yield* report.bars[0].value.opacity(1, 0.3);
  yield* waitUntil('report-store-b');
  yield* report.bars[1].bar.height(report.bars[1].amount * 0.37, 0.65);
  yield* report.bars[1].value.opacity(1, 0.3);
  yield* waitUntil('analytical-label');
  yield* analytical.opacity(1, 0.35);
  yield* waitUntil('business-analyst');
  yield* analyst.opacity(1, 0.4);
  yield* waitUntil('bi');
  yield* title.opacity(0, 0.2);
  title.children(heading('raporlar ', 'karar vermemize', ' yardımcı olur.').children());
  const bi = text('business intelligence · BI', 26, {
    position: [620, 318],
    fill: muted,
    opacity: 0,
  });
  stage.add(bi);
  yield* all(title.opacity(1, 0.35), reportQuestion.opacity(1, 0.35));
  yield* waitUntil('bi-label');
  yield* bi.opacity(1, 0.35);
  yield* waitUntil('compare');
  yield* title.opacity(0, 0.2);
  title.children(heading('aynı data, ', 'farklı işler.').children());
  yield* all(
    title.opacity(1, 0.35),
    bi.opacity(0, 0.25),
    market.root.opacity(1, 0.35),
    engineer.opacity(1, 0.35),
    orderQuestion.opacity(1, 0.35),
    operational.opacity(1, 0.35),
    request.root.opacity(1, 0.35),
    response.root.opacity(1, 0.35),
    readLabel.opacity(1, 0.35),
    responseLabel.opacity(1, 0.35),
  );

  yield* waitUntil('recommendation');
  yield* all(
    title.opacity(0, 0.2),
    report.chart.opacity(0, 0.25),
    report.period.opacity(0, 0.25),
    analyst.opacity(0, 0.25),
    bi.opacity(0, 0.25),
    reportQuestion.opacity(0, 0.25),
    query.root.opacity(0, 0.25),
    result.root.opacity(0, 0.25),
    queryLabel.opacity(0, 0.25),
    market.root.opacity(0.35, 0.25),
    engineer.opacity(0.35, 0.25),
    request.root.opacity(0.2, 0.25),
    response.root.opacity(0.2, 0.25),
    readLabel.opacity(0.2, 0.25),
    responseLabel.opacity(0.2, 0.25),
    orderQuestion.opacity(0.35, 0.25),
    operational.opacity(0.35, 0.25),
  );
  title.children(heading('hangi ürünü ', 'önerelim?').children());
  report.period.text('bir sonraki ürün');
  yield* all(
    title.opacity(1, 0.35),
    report.period.opacity(1, 0.35),
    report.suggestions.opacity(1, 0.4),
  );
  yield* waitUntil('recommendation-query');
  yield* report.suggest.travel(0.8);
  yield* waitUntil('data-scientist');
  yield* scientist.opacity(1, 0.4);
  yield* waitUntil('return');
  yield* all(
    overviewDetails.opacity(0, 0.25),
    title.opacity(0, 0.25),
    report.root.opacity(0, 0.35),
    scientist.opacity(0, 0.3),
    engineer.opacity(0, 0.3),
    orderQuestion.opacity(0, 0.25),
    operational.opacity(0, 0.25),
    analytical.opacity(0, 0.25),
    request.root.opacity(0, 0.25),
    response.root.opacity(0, 0.25),
    readLabel.opacity(0, 0.25),
    responseLabel.opacity(0, 0.25),
    record.opacity(0, 0.25),
    state.opacity(0, 0.25),
  );
  title.children(heading('bu siparişe ', 'yakından bakalım.').children());
  yield* all(
    market.root.opacity(1, 0.3),
    market.root.position([-470, 100], 0.75),
    market.root.scale(1, 0.75),
    detail(1, 0.75),
    database.position([550, 110], 0.75),
    database.scale(1.4, 0.75),
    caption.y(153, 0.75),
  );
  market.status.text('yükleniyor…');
  market.receiptDetails.opacity(0);
  overview.remove();
  market.receipt.opacity(1);
  market.label.text('application');
  caption.text('sales database');
  caption.fontSize(28 / 1.4);
  const closer = cartoonArrow('s04-return-to-order', [-108, 80], [354, 80], accent, 0);
  stage.add(closer.root);
  yield* all(title.opacity(1, 0.35), market.label.opacity(1, 0.35), closer.reveal(1, 0.5));
  yield* waitUntil('end');
});
