import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  heading,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('ödemeyi kaydet.\n', 'örüntüyü de bul.');
  const application = paper(760, 165);
  application.root.position([0, -400]);
  const paymentStatus = text('ödeme denemeleri · customer #17', 34, { y: 22 });
  application.root.add([text('market uygulaması', 29, { y: -44, fill: muted }), paymentStatus]);
  const system = paper(900, 920);
  system.root.position([0, 170]);
  const systemName = text('aynı sistem', 32, { position: [-285, -235], fill: muted });
  const oltp = paper(720, 235);
  oltp.root.position([0, -85]);
  const analytical = paper(720, 290);
  analytical.root.position([0, 320]);
  const entries = ['14:01:00', '14:01:10', '14:01:20'];
  const operationalRows = entries.map((time, i) =>
    text(`${time}   reddedildi`, 30, { y: -15 + i * 50, opacity: i === 2 ? 0 : 1 }),
  );
  const analyticalRows = entries.map((time, i) =>
    text(`${time}   reddedildi`, 30, { y: -35 + i * 52, opacity: i === 2 ? 0 : 1 }),
  );
  oltp.root.add([text('tekil ödeme kayıtları', 31, { y: -75, fill: muted }), ...operationalRows]);
  analytical.root.add([
    text('son 30 saniyedeki denemeler', 30, { y: -103, fill: muted }),
    ...analyticalRows,
  ]);
  const tally = text('2 başarısız deneme', 34, { y: 117, fill: accent });
  analytical.root.add(tally);
  const write = cartoonArrow('htap-portrait-write', [0, -293], [0, -230], accent, 0);
  const sync = cartoonArrow('htap-portrait-sync', [0, 62], [0, 138], accent, 0);
  const response = cartoonArrow('htap-portrait-response', [440, 340], [410, -400], accent, 0);
  const rule = text('örnek kural: 30 sn’de 3 başarısız deneme', 30, {
    y: 710,
    fill: muted,
    opacity: 0,
  });
  const flag = paper(710, 92, '#182638');
  flag.root.position([0, 610]);
  flag.root.opacity(0);
  flag.root.add(text('customer #17 · inceleme gerekli', 34, { fill: accent }));
  const drawing = new Layout({});
  drawing.add([
    system.root,
    systemName,
    oltp.root,
    analytical.root,
    write.root,
    sync.root,
    response.root,
    flag.root,
    rule,
  ]);
  view.add([title, application.root, drawing]);
  yield loadFonts();

  yield* waitUntil('payment');
  yield* write.reveal(1, 0.25);
  yield* write.travel(0.5);
  yield* write.arrive();
  yield* waitUntil('two-failures');
  yield* analytical.face.stroke(accent, 0.25).to('#f5f5f5', 0.4);
  yield* waitUntil('rule');
  yield* rule.opacity(1, 0.35);
  yield* waitUntil('inside');
  title.children(heading('tek sistemin içinde\n', 'farklı yapılar olabilir.').children());
  yield* all(oltp.face.stroke(accent, 0.3), analytical.face.stroke(accent, 0.3));
  yield* waitUntil('new-payment');
  paymentStatus.text('yeni deneme · reddedildi');
  yield* paymentStatus.fill(accent, 0.3);
  yield* waitUntil('write');
  yield* write.travel(0.65);
  yield* write.arrive();
  yield* waitUntil('write-record');
  yield* operationalRows[2].opacity(1, 0.3);
  yield* waitUntil('sync');
  yield* sync.reveal(1, 0.25);
  yield* sync.travel(0.7);
  yield* all(sync.arrive(), analyticalRows[2].opacity(1, 0.3));
  yield* waitUntil('query');
  title.children(heading('yeni kayıt,\n', 'geçmişle birlikte okunuyor.').children());
  for (const row of analyticalRows) {
    yield* row.fill(accent, 0.3);
  }
  yield* waitUntil('three-failures');
  tally.text('3 başarısız deneme');
  yield* tally.scale(1.08, 0.15).to(1, 0.2);
  yield* waitUntil('response');
  yield* response.reveal(1, 0.25);
  yield* response.travel(0.65);
  yield* response.arrive();
  yield* waitUntil('flag');
  paymentStatus.text('inceleme gerekli');
  yield* flag.root.opacity(1, 0.3);
  yield* waitUntil('both');
  title.children(heading('bir kayıt yazdık.\n', 'bir örüntü aradık.').children());
  yield* waitUntil('htap-name');
  systemName.text('HTAP');
  systemName.fontSize(40);
  yield* systemName.fill(accent, 0.3);
  yield* waitUntil('expansion');
  title.children(heading('hybrid transactional\nand analytical processing\n', 'HTAP').children());
  title.fontSize(55);
  title.lineHeight(69);
  yield* waitUntil('managed');
  title.children(heading('içerideki aktarımı\n', 'sistem yönetiyor.').children());
  title.fontSize(66);
  title.lineHeight(82);
  yield* sync.travel(0.8);
  yield* sync.arrive();
  yield* waitUntil('end');
});
