import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, easeOutCubic, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, heading, muted, text } from '../shared/drawing';
import { warehouseSystem } from '../shared/warehouse-system';
import { salesReportSource } from '../shared/report-source';
import { htapLandscape, htapSystem } from './htap-system';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('ikisini ', 'tek sistemde', ' çalıştırsak?');
  const choice = new Layout({});
  const operational = cartoonDatabase('transactions', accent);
  operational.root.position([-400, 70]);
  operational.root.scale(1.6);
  const analytical = cartoonDatabase('analytics', accent);
  analytical.root.position([400, 70]);
  analytical.root.scale(1.6);
  const link = cartoonArrow('s11-workload-separation', [-170, 70], [170, 70], accent);
  choice.add([
    operational.root,
    analytical.root,
    link.root,
    text('ETL', 30, { y: -15, fill: muted, fontFamily: theme.fontFamily.mono }),
  ]);
  view.add([title, choice]);
  yield loadFonts();
  yield* waitUntil('htap');
  yield* all(title.opacity(0, 0.2), choice.opacity(0, 0.4));
  choice.remove();
  title.children(heading('aynı sistemde ', 'transactions ve analytics.').children());
  const system = htapSystem();
  system.application.root.opacity(0.2);
  system.expanded.opacity(0);
  system.operations.forEach((label) => label.opacity(0));
  view.add(system.root);
  yield* all(title.opacity(1, 0.3), system.root.opacity(1, 0.6));
  yield* waitUntil('expansion');
  yield* system.expanded.opacity(1, 0.4);
  yield* waitUntil('application');
  yield* title.opacity(0, 0.2);
  title.children(heading('ödemeler sürerken ', 'şüpheli işlemleri', ' arıyoruz.').children());
  yield* all(title.opacity(1, 0.3), system.application.root.opacity(1, 0.5));
  yield* waitUntil('payment-history');
  system.operations[0].text('write');
  yield* all(system.operations[0].opacity(1, 0.2), system.requests[0].reveal(1, 0.4));
  yield* system.requests[0].travel(0.7);
  yield* system.requests[0].arrive();
  yield* all(system.requests[0].root.opacity(0, 0.2), system.operations[0].opacity(0, 0.2));
  yield* system.responses[0].reveal(1, 0.35);
  yield* system.responses[0].travel(0.65);
  system.paymentResult.text('reddedildi');
  yield* all(system.paymentResult.fill(accent, 0.2), system.responses[0].arrive());
  yield* waitUntil('history-query');
  yield* all(system.operations[1].opacity(1, 0.2), system.requests[1].reveal(1, 0.4));
  yield* system.requests[1].travel(0.7);
  yield* system.requests[1].arrive();
  yield* all(system.requests[1].root.opacity(0, 0.2), system.operations[1].opacity(0, 0.2));
  yield* waitUntil('two-failures');
  yield* system.responses[1].reveal(1, 0.35);
  yield* system.responses[1].travel(0.65);
  system.riskResult.text('son 30 sn · 2 başarısız deneme');
  yield* all(system.riskResult.fill(accent, 0.2), system.responses[1].arrive());
  const ruleSummary = text('30 sn’de 3 başarısız ödeme → inceleme', 28, {
    y: -30,
    fill: accent,
    opacity: 0,
  });
  system.root.add(ruleSummary);
  yield* waitUntil('rule');
  yield* ruleSummary.opacity(1, 0.4);

  yield* waitUntil('inside');
  yield* all(title.opacity(0, 0.2), system.expanded.opacity(0, 0.2), ruleSummary.opacity(0, 0.2));
  ruleSummary.remove();
  title.children(heading('tek arayüzün altında ', 'iki ayrı yapı', ' olabilir.').children());
  system.oltp.selection.y(0);
  system.oltp.selection.opacity(1);
  yield* all(
    title.opacity(1, 0.3),
    system.name.position([-610, 88], 0.85, easeInOutCubic),
    system.name.fontSize(42, 0.85, easeInOutCubic),
  );
  system.internals.opacity(1);
  yield* all(
    ...system.doors.map((door) => door.width(0, 0.8, easeInOutCubic)),
    system.facade.opacity(1, 0.8),
  );
  yield* waitUntil('new-payment');
  yield* all(system.paymentResult.opacity(0, 0.2), system.responses[0].root.opacity(0, 0.2));
  system.payment.text('yeni deneme · 14:01:20');
  system.paymentResult.text('reddedildi · kaydediliyor…');
  system.paymentResult.fontSize(26);
  system.operations[0].text('write');
  system.requests[0].reveal(0);
  system.requests[0].root.opacity(1);
  yield* all(system.paymentResult.opacity(1, 0.2), system.operations[0].opacity(1, 0.2));
  yield* waitUntil('write');
  yield* system.requests[0].reveal(1, 0.3);
  yield* system.requests[0].travel(0.65);
  yield* all(system.requests[0].arrive(), system.oltp.selection.y(48, 0.3));
  yield* waitUntil('write-record');
  yield* system.oltp.rows[2].opacity(1, 0.25);
  yield* all(system.requests[0].root.opacity(0, 0.2), system.operations[0].opacity(0, 0.2));
  system.responses[0].reveal(0);
  system.responses[0].root.opacity(1);
  yield* waitUntil('write-response');
  yield* system.responses[0].reveal(1, 0.3);
  yield* system.responses[0].travel(0.55);
  system.paymentResult.text('reddedildi · kaydedildi');
  yield* system.responses[0].arrive();

  yield* waitUntil('sync');
  yield* system.transfer.reveal(1, 0.4);
  yield* system.transfer.travel(0.85);
  system.analytics.selection.y(48);
  yield* all(
    system.transfer.arrive(),
    system.analytics.selection.opacity(1, 0.2),
    system.analytics.rows[2].opacity(1, 0.2),
  );
  yield* waitUntil('analytical-query');
  yield* all(
    system.responses[1].root.opacity(0, 0.2),
    system.riskResult.opacity(0, 0.2),
    system.analytics.selection.opacity(0, 0.2),
  );
  system.riskResult.text('kontrol ediliyor…');
  system.riskResult.fill(muted);
  system.requests[1].reveal(0);
  system.requests[1].root.opacity(1);
  yield* all(system.riskResult.opacity(1, 0.2), system.operations[1].opacity(1, 0.2));
  yield* system.requests[1].reveal(1, 0.3);
  yield* system.requests[1].travel(0.65);
  yield* system.requests[1].arrive();
  system.analytics.selection.y(-48);
  yield* system.scanLabel.opacity(0, 0.15);
  yield* all(system.analytics.selection.opacity(1, 0.2), system.tally.opacity(1, 0.2));
  yield* waitFor(0.25);
  for (let index = 0; index < 3; index++) {
    if (index === 2) yield* waitUntil('three-failures');
    yield* system.analytics.selection.y(-48 + index * 48, 0.35);
    system.tally.text(`${index + 1} başarısız deneme`);
    yield* waitFor(0.4);
  }
  yield* all(
    system.requests[1].root.opacity(0, 0.25),
    system.operations[1].opacity(0, 0.25),
    system.analytics.selection.height(136, 0.25),
    system.analytics.selection.y(0, 0.25),
    system.rule.fill(accent, 0.25),
  );
  yield* waitUntil('analytical-response');
  system.responses[1].reveal(0);
  system.responses[1].root.opacity(1);
  yield* system.responses[1].reveal(1, 0.3);
  yield* system.responses[1].travel(0.6);
  yield* waitUntil('flag');
  system.riskResult.text('inceleme gerekli');
  yield* all(system.riskResult.fill(accent, 0.2), system.responses[1].arrive());
  yield* waitUntil('benefit');
  yield* title.opacity(0, 0.2);
  title.children(heading('içerideki veri aktarımını ', 'HTAP yönetiyor.').children());
  yield* title.opacity(1, 0.3);

  yield* waitUntil('other-sources');
  const landscape = htapLandscape();
  landscape.inventory.root.opacity(0.2);
  landscape.stores.root.opacity(0.2);
  landscape.labels[1].opacity(0.2);
  landscape.labels[2].opacity(0.2);
  view.add(landscape.root);
  yield* title.opacity(0, 0.2);
  title.children(heading('işletmenin ', 'diğer sistemleri', ' de var.').children());
  yield* all(
    system.root.scale(0.3, 0.8, easeInOutCubic),
    system.root.position([-570, -185], 0.8, easeInOutCubic),
    system.root.opacity(0, 0.8),
    landscape.root.opacity(1, 0.8),
    title.opacity(1, 0.3),
  );
  system.root.remove();
  yield* waitUntil('inventory');
  yield* all(landscape.inventory.root.opacity(1, 0.4), landscape.labels[1].opacity(1, 0.4));
  yield* waitUntil('stores');
  yield* all(landscape.stores.root.opacity(1, 0.4), landscape.labels[2].opacity(1, 0.4));

  yield* waitUntil('combine');
  yield* title.opacity(0, 0.2);
  title.children(heading('bu verileri ', 'birlikte sorgulamak', ' istiyoruz.').children());
  yield* all(title.opacity(1, 0.3), landscape.warehouse.root.opacity(1, 0.5));
  yield* all(...landscape.routes.map((arrow) => arrow.reveal(1, 0.5)));
  yield* all(...landscape.routes.map((arrow) => arrow.travel(0.9)));
  yield* all(...landscape.routes.map((arrow) => arrow.arrive()));
  yield* landscape.combined.opacity(1, 0.35);

  yield* waitUntil('return');
  yield* title.opacity(0, 0.2);
  title.children(heading('warehouse ', 'farklı kaynakları', ' bir araya getiriyor.').children());
  yield* all(title.opacity(1, 0.3), landscape.warehouse.top.stroke(accent, 0.4));

  yield* waitUntil('general-purpose');
  yield* all(title.opacity(0, 0.2), landscape.root.opacity(0, 0.4));
  landscape.root.remove();
  const general = cartoonDatabase('genel amaçlı database', accent);
  general.root.position([0, 75]);
  general.root.scale(1.6);
  general.root.opacity(0);
  general.root.add([
    text('transactions', 28, { y: -6, fontFamily: theme.fontFamily.mono }),
    text('analytics', 28, { y: 51, fill: accent, fontFamily: theme.fontFamily.mono }),
  ]);
  view.add(general.root);
  title.children(heading('ihtiyacı karşılıyorsa ', 'tek database yeterli.').children());
  yield* all(title.opacity(1, 0.3), general.root.opacity(1, 0.5));
  yield* waitUntil('specialization');
  yield* title.opacity(0, 0.2);
  title.children(heading('iş yükü büyüdükçe ', 'ihtiyaçlar değişebilir.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('main-architecture');
  yield* all(title.opacity(0, 0.2), general.root.opacity(0, 0.4));
  general.root.remove();
  const main = warehouseSystem();
  main.root.opacity(0);
  view.add(main.root);
  title.children(heading('bizim örnekte ', 'ayrı warehouse', ' ile devam.').children());
  yield* all(title.opacity(1, 0.3), main.root.opacity(1, 0.5));

  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.2), main.root.opacity(0, 0.4));
  main.root.remove();
  title.children(heading('bugünkü sorumuz: ', 'ne kadar sattık?').children());
  const report = salesReportSource();
  report.root.opacity(0);
  report.result.reveal(0);
  report.report.bars.forEach(({ bar, value }) => {
    bar.height(0);
    value.opacity(0);
    value.y(() => 110 - bar.height() - 28);
  });
  view.add(report.root);
  yield* all(title.opacity(1, 0.3), report.root.opacity(1, 0.5));
  yield* waitUntil('report-result');
  yield* report.result.reveal(1, 0.35);
  yield* report.result.travel(0.7);
  yield* all(
    report.result.arrive(),
    ...report.report.bars.flatMap(({ bar, value, height }) => [
      bar.height(height, 0.8, easeOutCubic),
      value.opacity(1, 0.2),
    ]),
  );
  yield* waitUntil('end');
});
