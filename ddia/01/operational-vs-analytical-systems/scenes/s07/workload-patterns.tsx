import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { accent, background, heading, muted, text } from '../shared/drawing';
import { workloadExamples } from '../shared/workloads';
import {
  historyExample,
  machineExample,
  peopleExample,
  queryExample,
  sizeExample,
  workloadExample,
  writeExample,
} from './examples';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('iki soru, ', 'iki erişim biçimi.');
  const examples = workloadExamples();
  view.add([title, examples.root]);
  yield loadFonts();
  yield* waitUntil('compare');
  yield* all(title.opacity(0, 0.2), ...examples.labels.map((label) => label.opacity(0, 0.2)));
  yield* all(
    examples.order.root.position([-460, -48], 0.75),
    examples.order.root.scale(0.78, 0.75),
    examples.chart.root.position([460, -48], 0.75),
    examples.chart.root.scale(0.78, 0.75),
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
  const left = text('', 43, { position: [-460, 170], fill: accent, fontStyle: 'italic' });
  const right = text('', 43, { position: [460, 170], fill: accent, fontStyle: 'italic' });
  const leftNote = text('', 28, { position: [-460, 235] });
  const rightNote = text('', 28, { position: [460, 235] });
  features.add([left, right, leftNote, rightNote]);
  view.add([names, features]);
  yield* names.opacity(1, 0.4);
  let visual = examples.root;
  function* show(
    before: string,
    emphasis: string,
    values: [string, string],
    notes: [string, string],
    demonstration?: ReturnType<typeof writeExample>,
    size = 43,
  ) {
    yield* all(
      title.opacity(0, 0.2),
      features.opacity(0, 0.25),
      ...(demonstration ? [visual.opacity(0, 0.25)] : []),
    );
    if (demonstration) {
      if (visual !== examples.root) visual.remove();
      visual = demonstration.root;
      view.add(visual);
    }
    title.children(heading(before, emphasis).children());
    [left, right].forEach((node, i) => {
      node.text(values[i]);
      node.fontSize(size);
    });
    [leftNote, rightNote].forEach((node, i) => node.text(notes[i]));
    yield* all(title.opacity(1, 0.3), features.opacity(1, 0.4), visual.opacity(1, 0.4));
    if (demonstration) yield* demonstration.animate();
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
    writeExample(),
    35,
  );
  yield* waitUntil('queries');
  yield* show(
    'hangi soruları ',
    'sorabiliyoruz?',
    ['predefined', 'ad hoc'],
    ['uygulamanın tanımladığı sorgular', 'ihtiyaca göre yeni sorular'],
    queryExample(),
  );
  yield* waitUntil('workload');
  yield* show(
    'kaç sorgu ',
    'ne kadar iş?',
    ['çok sayıda kısa sorgu', 'az sayıda kapsamlı sorgu'],
    ['her biri birkaç kayda dokunur', 'her biri çok sayıda kaydı işler'],
    workloadExample(),
    35,
  );
  yield* waitUntil('people');
  yield* show(
    'bu sistemleri ',
    'kim kullanıyor?',
    ['end user', 'analyst'],
    ['siparişini takip eder', 'satışları inceleyip karar verir'],
    peopleExample(),
  );
  yield* waitUntil('machines');
  yield* show(
    'kullanıcı her zaman ',
    'insan olmak zorunda değil.',
    ['authorization', 'fraud / abuse detection'],
    ['bu siparişi iptal edebilir mi?', 'bu giriş denemeleri şüpheli mi?'],
    machineExample(),
    37,
  );
  yield* waitUntil('time');
  yield* show(
    'veri ',
    'neyi gösteriyor?',
    ['current state', 'history'],
    ['sipariş şu an hangi durumda?', 'hangi aşamalardan geçti?'],
    historyExample(),
  );
  yield* waitUntil('size');
  yield* show(
    'ne kadar ',
    'veri tutuyoruz?',
    ['GB–TB', 'TB–PB'],
    ['gigabyte – terabyte', 'terabyte – petabyte'],
    sizeExample(),
    60,
  );
  yield* waitUntil('next');
  yield* all(
    features.opacity(0, 0.3),
    title.opacity(0, 0.3),
    visual.opacity(0, 0.3),
    names.opacity(0, 0.3),
  );
  visual.remove();
  title.children(heading('bu sonuca ', 'kullanıcı da', ' ihtiyaç duyarsa?').children());
  examples.order.root.opacity(0);
  examples.chart.root.opacity(0);
  examples.root.opacity(1);
  yield* all(
    examples.chart.root.opacity(1, 0.5),
    examples.chart.root.position([0, 80], 0.7),
    examples.chart.root.scale(1.15, 0.7),
  );
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
