import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitFor, waitUntil } from '@motion-canvas/core';
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
  title.children(heading('ödemeler sürerken ', 'şüpheli işlemleri', ' arıyoruz.').children());
  const system = htapSystem();
  view.add(system.root);
  yield* all(title.opacity(1, 0.3), system.root.opacity(1, 0.6));
  yield* waitFor(0.45);
  yield* all(...system.requests.map((arrow) => arrow.reveal(1, 0.4)));
  yield* all(...system.requests.map((arrow) => arrow.travel(0.7)));
  yield* all(...system.requests.map((arrow) => arrow.arrive()));
  yield* waitFor(0.6);
  yield* all(
    ...system.requests.map((arrow) => arrow.root.opacity(0, 0.2)),
    ...system.operations.map((label) => label.opacity(0, 0.2)),
  );
  yield* all(...system.responses.map((arrow) => arrow.reveal(1, 0.35)));
  yield* all(...system.responses.map((arrow) => arrow.travel(0.65)));
  system.paymentResult.text('reddedildi');
  system.riskResult.text('son 30 sn · 2 başarısız deneme');
  yield* all(
    system.paymentResult.fill(accent, 0.2),
    system.riskResult.fill(accent, 0.2),
    ...system.responses.map((arrow) => arrow.arrive()),
  );

  yield* waitUntil('inside');
  yield* all(title.opacity(0, 0.2), system.expanded.opacity(0, 0.2));
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
  yield* all(system.paymentResult.opacity(0, 0.2), system.responses[0].root.opacity(0, 0.2));
  system.payment.text('yeni deneme · 14:01:20');
  system.paymentResult.text('reddedildi · kaydediliyor…');
  system.paymentResult.fontSize(26);
  system.operations[0].text('write');
  system.requests[0].reveal(0);
  system.requests[0].root.opacity(1);
  yield* all(system.paymentResult.opacity(1, 0.2), system.operations[0].opacity(1, 0.2));
  yield* system.requests[0].reveal(1, 0.3);
  yield* system.requests[0].travel(0.65);
  yield* all(system.requests[0].arrive(), system.oltp.selection.y(48, 0.3));
  yield* system.oltp.rows[2].opacity(1, 0.25);
  yield* all(system.requests[0].root.opacity(0, 0.2), system.operations[0].opacity(0, 0.2));
  system.responses[0].reveal(0);
  system.responses[0].root.opacity(1);
  yield* system.responses[0].reveal(1, 0.3);
  yield* system.responses[0].travel(0.55);
  system.paymentResult.text('reddedildi · kaydedildi');
  yield* system.responses[0].arrive();

  yield* system.transfer.reveal(1, 0.4);
  yield* system.transfer.travel(0.85);
  system.analytics.selection.y(48);
  yield* all(
    system.transfer.arrive(),
    system.analytics.selection.opacity(1, 0.2),
    system.analytics.rows[2].opacity(1, 0.2),
  );
  yield* waitFor(0.4);
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
  system.responses[1].reveal(0);
  system.responses[1].root.opacity(1);
  yield* system.responses[1].reveal(1, 0.3);
  yield* system.responses[1].travel(0.6);
  system.riskResult.text('inceleme gerekli');
  yield* all(system.riskResult.fill(accent, 0.2), system.responses[1].arrive());

  yield* waitUntil('other-sources');
  const landscape = htapLandscape();
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

  yield* waitUntil('specialization');
  yield* all(title.opacity(0, 0.2), landscape.root.opacity(0, 0.4));
  landscape.root.remove();
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
  view.add(report.root);
  yield* all(title.opacity(1, 0.3), report.root.opacity(1, 0.5));
  yield* waitUntil('end');
});
