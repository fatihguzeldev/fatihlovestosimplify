import { Line, Rect, makeScene2D } from '@motion-canvas/2d';
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
  const title = heading('her seferinde ', 'toplamasak?');
  const boundary = new Rect({
    position: [0, 145],
    size: [930, 1300],
    stroke: muted,
    lineWidth: 2,
    lineDash: [12, 14],
    radius: 14,
  });
  const databaseLabel = text('aynı database · PostgreSQL', 30, {
    position: [-420, -475],
    offset: [-1, 0],
    fill: muted,
  });
  const rows = paper(810, 360, '#101315');
  rows.root.position([0, -250]);
  rows.root.add([
    text('ocak satışları', 35, { position: [-350, -132], offset: [-1, 0] }),
    text('order', 26, { position: [-245, -75], fill: muted, fontFamily: 'IBM Plex Mono' }),
    text('store', 26, { position: [0, -75], fill: muted, fontFamily: 'IBM Plex Mono' }),
    text('amount', 26, { position: [240, -75], fill: muted, fontFamily: 'IBM Plex Mono' }),
  ]);
  const fixtures = [
    ['1041', 'A', '60'],
    ['1042', 'A', '185'],
    ['1043', 'B', '260'],
    ['1044', 'A', '155'],
    ['1045', 'B', '40'],
  ];
  const amounts = fixtures.map(([id, store, amount], index) => {
    const y = -25 + index * 41;
    const value = text(amount, 31, { position: [240, y], fontFamily: 'IBM Plex Mono' });
    rows.root.add([
      text(id, 31, { position: [-245, y], fontFamily: 'IBM Plex Mono' }),
      text(store, 31, { position: [0, y], fontFamily: 'IBM Plex Mono' }),
      value,
    ]);
    return value;
  });
  rows.root.add(
    new Line({
      points: [
        [-355, -55],
        [355, -55],
      ],
      stroke: muted,
      lineWidth: 1.5,
    }),
  );

  const stored = paper(810, 250, '#17232f');
  stored.root.position([0, 340]);
  stored.root.opacity(0.2);
  stored.root.add(text('monthly_totals', 33, { y: -78, fontFamily: 'IBM Plex Mono' }));
  const totals = ['A', 'B'].map((store, index) => {
    const x = -185 + index * 370;
    const value = text('—', 57, { position: [x, 20], fill: accent, fontFamily: 'IBM Plex Mono' });
    stored.root.add([text(`store ${store}`, 29, { position: [x, -28], fill: muted }), value]);
    return value;
  });
  const calculate = cartoonArrow('short-materialized-calculate', [0, -35], [0, 170], accent, 0);
  const operation = text('SUM(amount)', 31, {
    position: [-105, 75],
    offset: [1, 0],
    fontFamily: 'IBM Plex Mono',
    opacity: 0,
  });
  const ready = text('', 38, { position: [0, 610], fill: accent });
  const name = text('', 31, { position: [0, 690], fill: muted });
  view.add([
    title,
    boundary,
    databaseLabel,
    rows.root,
    stored.root,
    calculate.root,
    operation,
    ready,
    name,
  ]);
  yield loadFonts();

  yield* waitUntil('calculate');
  yield* all(calculate.reveal(1, 0.3), operation.opacity(1, 0.3));
  yield* calculate.travel(0.85);
  yield* calculate.arrive();
  yield* waitUntil('stored-a');
  totals[0].text('400₺');
  yield* stored.root.opacity(1, 0.3);
  yield* waitUntil('stored-b');
  totals[1].text('300₺');
  yield* waitUntil('read');
  title.children(heading('okurken ', 'hazır sonucu', ' alıyoruz.').children());
  ready.text('SELECT * FROM monthly_totals;');
  ready.fontFamily('IBM Plex Mono');
  ready.fontSize(31);
  yield* all(
    rows.root.opacity(0.5, 0.3),
    calculate.root.opacity(0.25, 0.3),
    operation.opacity(0.25, 0.3),
  );
  yield* waitUntil('name');
  name.text('materialized view');
  yield* waitUntil('same-database');
  yield* boundary.stroke(accent, 0.25).to(muted, 0.5);

  yield* waitUntil('return');
  title.children(heading('aynı database. ', 'kaynak değişiyor.').children());
  yield* all(rows.root.opacity(1, 0.3), calculate.root.opacity(0.25, 0.3), ready.opacity(0, 0.3));
  yield* waitUntil('correct');
  amounts[1].text('165');
  yield* amounts[1].fill(accent, 0.25);
  yield* waitUntil('stale');
  title.children(heading('saklanan toplam ', 'hâlâ 400.').children());
  yield* stored.face.stroke(accent, 0.25);
  yield* waitUntil('refresh');
  title.children(heading('sonucu ', 'refresh', ' edelim.').children());
  operation.text('refresh');
  name.text('REFRESH MATERIALIZED VIEW monthly_totals;');
  name.fontFamily('IBM Plex Mono');
  name.fontSize(28);
  yield* all(calculate.root.opacity(1, 0.25), operation.opacity(1, 0.25));
  yield* calculate.travel(0.85);
  yield* calculate.arrive();
  yield* waitUntil('refreshed');
  totals[0].text('380₺');
  yield* totals[0].scale(1.08, 0.2).to(1, 0.25);
  yield* waitUntil('conclusion');
  title.children(heading('bu örnekte sonuç ', 'kendiliğinden güncellenmiyor.').children());
  ready.text('kaynak değişti → sonuç yeniden hesaplandı');
  ready.fontFamily('IBM Plex Sans');
  ready.fontSize(33);
  yield* ready.opacity(1, 0.3);
  yield* waitUntil('end');
});
