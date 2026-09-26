import {Layout, makeScene2D, Path} from '@motion-canvas/2d';
import {all, waitUntil} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';
import {cartoonDatabase} from '../../../../../common/cartoon-system';
import {theme} from '../../theme';
import {accent, background, foreground, heading, muted, text} from '../shared/drawing';
import {createMarket} from '../shared/market';
import {salesReport} from './illustrations';
import {role} from '../shared/people';

export default makeScene2D(function* (view) {
  view.fill(background);
  const card = new Layout({});
  const first = text('aynı data,', 104, {position: [-806, -35], offset: [-1, 0]});
  const second = text('farklı işler.', 104, {position: () => [-806 + first.width() + 26, -35], offset: [-1, 0], fill: accent, fontStyle: 'italic', fontWeight: 500});
  const underline = new Path({
    position: () => second.position().addY(75),
    data: () => `M 2 2 Q ${second.width() * 0.32} 8 ${second.width() * 0.58} 1 T ${second.width() - 3} 4`,
    stroke: accent, lineWidth: 5, lineCap: 'round', end: 0,
  });
  card.add([
    text('part 1', 29, {position: [-800, -203], offset: [-1, 0], fontFamily: theme.fontFamily.mono, fill: muted}),
    first, second, underline,
    text('operational / analytical', 32, {position: [-800, 144], offset: [-1, 0], fontFamily: theme.fontFamily.serif, fontStyle: 'italic'}),
  ]);
  view.add(card);
  yield loadFonts();
  yield* underline.end(1, 0.65);
  yield* waitUntil('order');
  yield* card.opacity(0, 0.4);
  card.remove();

  const stage = new Layout({opacity: 0});
  const title = heading('siparişim ', 'ne durumda?');
  const market = createMarket();
  market.root.position([-620, 70]);
  market.root.scale(0.6);
  market.cart.remove();
  market.receipt.opacity(1);
  market.label.opacity(0);
  market.status.fontSize(38);
  market.status.text('…');
  const {root: database, top, caption} = cartoonDatabase('sales db', accent);
  database.position([0, 95]);
  database.scale(1.12);
  caption.fontSize(28 / 1.12);
  const record = text('#1042', 28, {y: -7, fontFamily: theme.fontFamily.mono});
  const state = text('created', 25, {y: 57, fill: accent, fontFamily: theme.fontFamily.mono});
  database.add([record, state]);
  const orderQuestion = text('siparişim ne durumda?', 31, {position: [-620, -124], opacity: 0});
  const reportQuestion = text('ocak satışları nasıl?', 31, {position: [620, -124], opacity: 0});
  const operational = text('operational work', 29, {position: [-620, 272], fill: accent, opacity: 0});
  const analytical = text('analytical work', 29, {position: [620, 272], fill: accent, opacity: 0});
  const engineer = role('backend engineer', 'servisi geliştirir', 0);
  engineer.position([-620, 402]);
  const analyst = role('business analyst', 'raporları hazırlar', 1);
  analyst.position([620, 402]);
  const scientist = role('data scientist', 'öneri modelini geliştirir', 2);
  scientist.position([620, 402]);
  const report = salesReport();
  report.root.position([620, 70]);
  report.root.opacity(0);
  const request = cartoonArrow('s04-order-question', [-385, 45], [-170, 45], accent, 0);
  const response = cartoonArrow('s04-order-answer', [-170, 175], [-385, 175], accent, 0);
  const query = cartoonArrow('s04-january-query', [375, 45], [170, 45], accent, 0);
  const result = cartoonArrow('s04-january-result', [170, 175], [375, 175], accent, 0);
  const readLabel = text('#1042', 23, {position: request.pointAt(0.5).addY(-75), fontFamily: theme.fontFamily.mono, opacity: 0});
  const queryLabel = text('ocak', 24, {position: query.pointAt(0.5).addY(-75), opacity: 0});
  stage.add([title, market.root, database, orderQuestion, reportQuestion, operational, analytical, engineer, analyst, scientist, report.root, request.root, response.root, query.root, result.root, readLabel, queryLabel]);
  view.add(stage);
  yield* stage.opacity(1, 0.5);
  yield* waitUntil('operational');
  yield* all(request.reveal(1, 0.4), readLabel.opacity(1, 0.3));
  yield* request.travel(0.6);
  yield* all(request.arrive(), top.stroke(accent, 0.12).to(foreground, 0.3));
  yield* response.reveal(1, 0.4);
  yield* response.travel(0.6);
  market.status.text('created');
  yield* all(response.arrive(), operational.opacity(1, 0.35), market.shell.stroke(accent, 0.12).to(foreground, 0.3));
  yield* waitUntil('engineer');
  yield* title.opacity(0, 0.2);
  title.children(heading('bu isteği ', 'bir servis', ' karşılar.').children());
  readLabel.text('getOrder(1042)');
  readLabel.fontSize(21);
  yield* all(title.opacity(1, 0.35), orderQuestion.opacity(1, 0.35), engineer.opacity(1, 0.4));

  yield* waitUntil('analytical');
  yield* all(title.opacity(0, 0.2), engineer.opacity(0.35, 0.25), market.root.opacity(0.4, 0.25), orderQuestion.opacity(0.4, 0.25), request.root.opacity(0.25, 0.25), response.root.opacity(0.25, 0.25), readLabel.opacity(0.25, 0.25), operational.opacity(0.4, 0.25));
  title.children(heading('ocak satışları ', 'nasıl?').children());
  yield* all(title.opacity(1, 0.35), record.opacity(0, 0.2), state.opacity(0, 0.2));
  record.text('orders');
  state.text('sales');
  yield* all(record.opacity(1, 0.3), state.opacity(1, 0.3), report.root.opacity(1, 0.45));
  yield* waitUntil('report');
  yield* all(query.reveal(1, 0.4), queryLabel.opacity(1, 0.3));
  yield* query.travel(0.6);
  yield* all(query.arrive(), top.stroke(accent, 0.12).to(foreground, 0.3));
  yield* result.reveal(1, 0.4);
  yield* result.travel(0.6);
  yield* all(result.arrive(), ...report.bars.map(({bar, amount}) => bar.height(amount * 0.37, 0.65)));
  yield* all(...report.bars.map(({value}) => value.opacity(1, 0.3)), analytical.opacity(1, 0.35), analyst.opacity(1, 0.4));
  yield* waitUntil('bi');
  yield* title.opacity(0, 0.2);
  title.children(heading('raporlar ', 'karar vermemize', ' yardımcı olur.').children());
  const bi = text('business intelligence · BI', 26, {position: [620, 318], fill: muted, opacity: 0});
  stage.add(bi);
  yield* all(title.opacity(1, 0.35), reportQuestion.opacity(1, 0.35), bi.opacity(1, 0.35));
  yield* waitUntil('compare');
  yield* title.opacity(0, 0.2);
  title.children(heading('aynı data, ', 'farklı işler.').children());
  yield* all(title.opacity(1, 0.35), bi.opacity(0, 0.25), market.root.opacity(1, 0.35), engineer.opacity(1, 0.35), orderQuestion.opacity(1, 0.35), operational.opacity(1, 0.35), request.root.opacity(1, 0.35), response.root.opacity(1, 0.35), readLabel.opacity(1, 0.35));

  yield* waitUntil('recommendation');
  yield* all(title.opacity(0, 0.2), report.chart.opacity(0, 0.25), report.period.opacity(0, 0.25), analyst.opacity(0, 0.25), bi.opacity(0, 0.25), reportQuestion.opacity(0, 0.25), query.root.opacity(0, 0.25), result.root.opacity(0, 0.25), queryLabel.opacity(0, 0.25), market.root.opacity(0.35, 0.25), engineer.opacity(0.35, 0.25), request.root.opacity(0.2, 0.25), response.root.opacity(0.2, 0.25), readLabel.opacity(0.2, 0.25), orderQuestion.opacity(0.35, 0.25), operational.opacity(0.35, 0.25));
  title.children(heading('hangi ürünü ', 'önerelim?').children());
  report.period.text('bir sonraki ürün');
  yield* all(title.opacity(1, 0.35), report.period.opacity(1, 0.35), report.suggestions.opacity(1, 0.4), scientist.opacity(1, 0.4));
  yield* report.suggest.travel(0.8);
  yield* waitUntil('return');
  yield* all(title.opacity(0, 0.25), report.root.opacity(0, 0.35), scientist.opacity(0, 0.3), engineer.opacity(0, 0.3), orderQuestion.opacity(0, 0.25), operational.opacity(0, 0.25), analytical.opacity(0, 0.25), request.root.opacity(0, 0.25), response.root.opacity(0, 0.25), readLabel.opacity(0, 0.25), record.opacity(0, 0.25), state.opacity(0, 0.25));
  title.children(heading('bu siparişe ', 'yakından bakalım.').children());
  record.text('sales db');
  record.fontSize(22);
  state.text('#1042 · created');
  state.fontSize(25 / 1.4);
  state.y(60);
  yield* all(market.root.opacity(1, 0.3), market.root.position([-470, 100], 0.75), market.root.scale(1, 0.75), market.status.fontSize(26, 0.75), database.position([550, 110], 0.75), database.scale(1.4, 0.75));
  market.label.text('application');
  caption.text('database');
  caption.fontSize(28 / 1.4);
  const closer = cartoonArrow('s04-return-to-order', [-108, 80], [354, 80], accent, 0);
  stage.add(closer.root);
  yield* all(title.opacity(1, 0.35), market.label.opacity(1, 0.35), record.opacity(1, 0.35), state.opacity(1, 0.35), closer.reveal(1, 0.5));
  yield* waitUntil('end');
});
