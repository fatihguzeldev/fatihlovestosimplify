import { makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  banana,
  cartoonArrow,
  foreground,
  heading,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('data lake: ', 'kaynak biçimini koru.');
  const lake = paper(900, 850);
  lake.root.position([0, 20]);
  lake.root.opacity(1);
  lake.root.add(text('data lake', 41, { y: -345, fill: accent }));
  const files = [
    ['sales.jsonl', '#1042 · 185₺'],
    ['clickstream.jsonl', 'view · muz · 14:00'],
    ['reviews.jsonl', '“muzlar ezilmiş”'],
    ['image.jpg', ''],
  ].map(([label, detail], i) => {
    const card = paper(365, 190);
    card.root.position([i % 2 ? 215 : -215, i < 2 ? -140 : 150]);
    card.root.opacity(1);
    card.root.add([text(label, 28, { y: -43, fill: muted }), text(detail, 29, { y: 25 })]);
    if (i === 3) {
      const image = banana();
      image.position([0, 24]);
      image.scale(1.2);
      card.root.add(image);
    }
    return card;
  });
  lake.root.add(files.map((file) => file.root));
  const records = paper(850, 390);
  records.root.position([0, -260]);
  records.root.opacity(0);
  const labels = [
    text('event', 30, { position: [-260, -100], fill: muted }),
    text('product', 30, { position: [0, -100], fill: muted }),
    text('time', 30, { position: [260, -100], fill: muted }),
  ];
  const times = ['14:00:00', '14:00:12', '14:00:30'].map((value, i) =>
    text(value, 31, { position: [260, -23 + i * 72] }),
  );
  const events = ['view', 'view', 'add_to_cart'].map((value, i) =>
    text(value, 30, { position: [-260, -23 + i * 72] }),
  );
  records.root.add([
    text('clickstream.jsonl', 33, { y: -153, fill: accent }),
    ...labels,
    ...events,
    ...times,
    ...['muz', 'süt', 'muz'].map((value, i) => text(value, 33, { position: [0, -23 + i * 72] })),
  ]);
  const schema = text('schema-on-read', 48, {
    y: 52,
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const report = paper(760, 225);
  report.root.position([0, 420]);
  report.root.opacity(0);
  const bananaCount = text('muz: 1', 43, { position: [-175, 36], fill: accent, opacity: 0 });
  const milkCount = text('süt: 1', 43, { position: [175, 36], fill: accent, opacity: 0 });
  report.root.add([text('görüntülenme raporu', 35, { y: -61 }), bananaCount, milkCount]);
  const read = cartoonArrow('schema-read-count', [0, 118], [0, 274], accent, 0);
  const meaning = paper(820, 235);
  meaning.root.position([0, 420]);
  meaning.root.opacity(0);
  const meaningValue = text('view', 48, { y: -25, fill: accent });
  const explanation = text('ürün sayfası görüntülendi', 36, { y: 58, opacity: 0 });
  meaning.root.add([meaningValue, explanation]);
  view.add([title, lake.root, records.root, schema, read.root, report.root, meaning.root]);
  yield loadFonts();

  for (const [index, cue] of ['files', 'event-file', 'review-file', 'image-file'].entries()) {
    yield* waitUntil(cue);
    if (index > 0) yield* files[index - 1].face.stroke(foreground, 0.15);
    yield* files[index].face.stroke(accent, 0.2);
  }
  yield* waitUntil('read');
  title.children(heading('kullanmadan önce,\n', 'alanları yorumluyoruz.').children());
  yield* all(lake.root.opacity(0, 0.5), records.root.opacity(1, 0.5));
  lake.root.remove();
  yield* waitUntil('fields');
  yield* all(...labels.map((label) => label.fill(accent, 0.3)));
  yield* waitUntil('interpret');
  yield* records.face.stroke(accent, 0.3).to(foreground, 0.4);
  yield* waitUntil('time');
  yield* all(...times.map((value) => value.fill(accent, 0.3)));
  yield* waitUntil('event');
  yield* all(
    ...times.map((value) => value.fill(foreground, 0.3)),
    ...events.map((value) => value.fill(accent, 0.3)),
  );
  yield* waitUntil('schema');
  title.children(heading('schema’yı\n', 'okurken uyguluyoruz.').children());
  yield* schema.opacity(1, 0.35);
  yield* waitUntil('report');
  yield* report.root.opacity(1, 0.35);
  yield* read.reveal(1, 0.3);
  yield* read.travel(0.8);
  yield* read.arrive();
  yield* waitUntil('banana-count');
  yield* bananaCount.opacity(1, 0.25);
  yield* waitUntil('milk-count');
  yield* milkCount.opacity(1, 0.25);
  yield* waitUntil('meaning');
  title.children(heading('peki, ', '“view” ne demek?').children());
  yield* all(report.root.opacity(0, 0.3), read.root.opacity(0, 0.3), meaning.root.opacity(1, 0.4));
  yield* waitUntil('view-meaning');
  yield* all(explanation.opacity(1, 0.35), meaning.root.y(400, 0.5, easeInOutCubic));
  yield* waitUntil('conclusion');
  title.children(heading('kaynağı sakladık.\n', 'anlamını yine bilmeliyiz.').children());
  yield* all(records.face.stroke(accent, 0.3), meaning.face.stroke(accent, 0.3));
  yield* waitUntil('end');
});
