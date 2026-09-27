import { Layout, makeScene2D, Rect } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { theme } from '../../theme';
import { accent, background, heading, muted, paper, text } from '../shared/drawing';
import { workloadExamples } from '../shared/workloads';
import { role } from '../shared/people';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('iki soru, ', 'iki erişim biçimi.');
  const examples = workloadExamples();
  view.add([title, examples.root]);
  yield loadFonts();
  yield* waitUntil('compare');
  yield* all(title.opacity(0, 0.2), ...examples.labels.map((label) => label.opacity(0, 0.2)));
  yield* all(
    examples.order.root.position([-460, -100], 0.75),
    examples.order.root.scale(0.58, 0.75),
    examples.chart.root.position([460, -100], 0.75),
    examples.chart.root.scale(0.58, 0.75),
  );
  const names = new Layout({ opacity: 0 });
  ['OLTP', 'OLAP'].forEach((name, i) => {
    const x = -460 + i * 920;
    names.add([
      text(name, 42, { position: [x, -292], fill: accent, fontStyle: 'italic', fontWeight: 500 }),
      text(i ? 'online analytical processing' : 'online transaction processing', 22, {
        position: [x, -244],
        fill: muted,
      }),
    ]);
  });
  const features = new Layout({ opacity: 0 });
  const left = text('', 43, { position: [-460, 115], fill: accent, fontStyle: 'italic' });
  const right = text('', 43, { position: [460, 115], fill: accent, fontStyle: 'italic' });
  const leftNote = text('', 28, { position: [-460, 184] });
  const rightNote = text('', 28, { position: [460, 184] });
  const drawings = new Layout({});
  features.add([left, right, leftNote, rightNote, drawings]);
  view.add([names, features]);
  yield* names.opacity(1, 0.4);
  function* show(
    before: string,
    emphasis: string,
    values: [string, string],
    notes: [string, string],
    size = 43,
  ) {
    yield* all(title.opacity(0, 0.2), features.opacity(0, 0.25));
    drawings.removeChildren();
    title.children(heading(before, emphasis).children());
    [left, right].forEach((node, i) => {
      node.text(values[i]);
      node.fontSize(size);
    });
    [leftNote, rightNote].forEach((node, i) => node.text(notes[i]));
    yield* all(title.opacity(1, 0.3), features.opacity(1, 0.4));
  }
  yield* show(
    'nasıl ',
    'okuyoruz?',
    ['point queries', 'aggregations'],
    ['belirli kayıtları getirir', 'çok sayıda kayıttan sonuç çıkarır'],
  );
  yield* waitUntil('write');
  yield* show(
    'data nasıl ',
    'yazılıyor?',
    ['record-level CRUD', 'bulk import (ETL) / event stream'],
    ['tek tek kayıtlar', 'toplu yükleme veya olay akışı'],
    35,
  );
  const writes = [-460, 460].map((x, side) => {
    const root = new Layout({ position: [x, 315], opacity: 0 });
    for (let i = 0; i < (side ? 4 : 1); i++) {
      const sheet = paper(158, 62, '#17232f');
      sheet.root.position([side ? -69 + i * 46 : 0, side ? -15 + i * 10 : 0]);
      if (!side || i === 3)
        sheet.root.add(text(side ? 'batch' : '#1042', 21, { fontFamily: theme.fontFamily.mono }));
      root.add(sheet.root);
    }
    drawings.add(root);
    return root;
  });
  yield* all(...writes.map((root) => root.opacity(1, 0.4)));
  yield* waitUntil('queries');
  yield* show(
    'hangi soruları ',
    'sorabiliyoruz?',
    ['predefined', 'ad hoc'],
    ['uygulamanın tanımladığı sorgular', 'ihtiyaca göre yeni sorular'],
  );
  const fixed = text('getOrder(id)', 31, {
    position: [-460, 318],
    fontFamily: theme.fontFamily.mono,
  });
  const question = text('hangi mağaza?', 31, { position: [460, 318] });
  drawings.add([fixed, question]);
  yield* waitFor(2.5);
  yield* question.opacity(0, 0.2);
  question.text('hangi ay?');
  yield* question.opacity(1, 0.3);
  yield* waitFor(2.5);
  yield* question.opacity(0, 0.2);
  question.text('hangi ürün?');
  yield* question.opacity(1, 0.3);
  yield* waitUntil('workload');
  yield* show(
    'kaç query, ',
    'ne kadar iş?',
    ['çok sayıda kısa query', 'az sayıda karmaşık query'],
    ['birkaç kayda dokunur', 'birçok kaydı işler'],
    34,
  );
  const requests = Array.from({ length: 6 }, (_, i) => {
    const ticket = paper(98, 54, '#17232f');
    ticket.root.position([-745 + i * 114, 320]);
    ticket.root.opacity(0);
    ticket.root.add(text(`#${1041 + i}`, 22, { fontFamily: theme.fontFamily.mono }));
    drawings.add(ticket.root);
    return ticket.root;
  });
  const reportQuery = paper(330, 90, '#17232f');
  reportQuery.root.position([460, 320]);
  reportQuery.root.opacity(0);
  reportQuery.root.add(text('GROUP BY store_id', 26, { fontFamily: theme.fontFamily.mono }));
  drawings.add(reportQuery.root);
  for (const ticket of requests) yield* ticket.opacity(1, 0.15);
  yield* reportQuery.root.opacity(1, 0.5);
  yield* waitUntil('people');
  yield* show('bu sistemleri ', 'kim kullanıyor?', ['', ''], ['', '']);
  const user = role('end user', 'siparişini takip eder', 0);
  const analyst = role('analyst', 'satışları inceler', 1);
  user.position([-415, 210]);
  analyst.position([505, 210]);
  user.scale(1.5);
  analyst.scale(1.5);
  drawings.add([user, analyst]);
  yield* all(user.opacity(1, 0.4), analyst.opacity(1, 0.4));
  yield* waitUntil('machines');
  yield* show(
    'yalnızca ',
    'insanlar kullanmıyor.',
    ['authorization', 'fraud detection'],
    ['bu işleme izin var mı?', 'hangi işlemler şüpheli?'],
    38,
  );
  const permission = paper(330, 90, '#17232f');
  permission.root.position([-460, 320]);
  permission.root.add(text('allow / deny', 27, { fontFamily: theme.fontFamily.mono }));
  const pattern = new Layout({ position: [460, 315] });
  [35, 43, 37, 40, 83, 38].forEach((height, i) =>
    pattern.add(
      new Rect({
        position: [-125 + i * 50, 50],
        offset: [0, 1],
        size: [25, height],
        fill: i === 4 ? accent : muted,
      }),
    ),
  );
  drawings.add([permission.root, pattern]);
  yield* waitUntil('time');
  yield* show(
    'data bize ',
    'hangi zamanı anlatıyor?',
    ['current state', 'history'],
    ['şu anki durum', 'zaman içinde olanlar'],
  );
  drawings.add([
    text('preparing', 34, {
      position: [-460, 320],
      fill: accent,
      fontFamily: theme.fontFamily.mono,
    }),
    ...['ocak', 'şubat', 'mart'].map((month, i) => {
      const page = paper(137, 70, '#101315');
      page.root.position([280 + i * 180, 320]);
      page.root.add(text(month, 27));
      return page.root;
    }),
  ]);
  yield* waitUntil('size');
  yield* show(
    'tipik ',
    'ölçekler?',
    ['GB–TB', 'TB–PB'],
    ['gigabyte → terabyte', 'terabyte → petabyte'],
    65,
  );
  const caveat = heading('boyut ', 'tek başına', ' ayırmaz.');
  caveat.position([-806, 404]);
  caveat.fontSize(38);
  caveat.opacity(0);
  drawings.add(caveat);
  yield* caveat.opacity(1, 0.4);
  yield* waitUntil('next');
  yield* all(features.opacity(0, 0.3), title.opacity(0, 0.2));
  title.children(heading('bu sonuca ', 'kullanıcı da', ' ihtiyaç duyarsa?').children());
  yield* all(examples.order.root.opacity(0, 0.3), names.opacity(0, 0.25));
  yield* all(examples.chart.root.position([0, 80], 0.7), examples.chart.root.scale(1.15, 0.7));
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
