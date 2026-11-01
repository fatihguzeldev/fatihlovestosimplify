import { Circle, makeScene2D } from '@motion-canvas/2d';
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
  const title = heading('aynı hesapta ', 'üç başarısız ödeme.');
  const customer = text('market uygulaması · customer #17', 30, {
    position: [0, -475],
    fontFamily: 'IBM Plex Mono',
    fill: muted,
  });
  const times = ['14:01:00', '14:01:10', '14:01:20'];
  const events = times.map((time, index) => {
    const item = paper(780, 110, '#101315');
    item.root.position([0, -365 + index * 150]);
    item.root.opacity(0);
    item.root.add([
      text(time, 37, { position: [-210, 0], fontFamily: 'IBM Plex Mono', fill: accent }),
      text('reddedildi', 35, { position: [165, 0] }),
    ]);
    return item;
  });
  const rule = paper(780, 180, '#101315');
  rule.root.position([0, 220]);
  rule.root.opacity(0);
  rule.root.add(text('30 sn içinde 3 başarısız deneme', 35, { y: -43 }));
  const marks = [0, 1, 2].map((index) => {
    const mark = new Circle({
      position: [-75 + index * 75, 35],
      size: 44,
      stroke: muted,
      lineWidth: 3,
      fill: background,
    });
    mark.add(text(String(index + 1), 26));
    rule.root.add(mark);
    return mark;
  });
  const result = paper(780, 200, '#17232f');
  result.root.position([0, 630]);
  result.root.add(text('inceleme kuyruğu', 30, { y: -57, fill: muted }));
  const outcome = text('henüz uyarı yok', 40, { y: 7 });
  result.root.add(outcome);
  const resultTime = text('', 31, { y: 65, fill: accent, fontFamily: 'IBM Plex Mono' });
  result.root.add(resultTime);
  const consume = cartoonArrow('short-payment-events-to-rule', [0, 15], [0, 120], accent, 0);
  const emit = cartoonArrow('short-payment-rule-to-notice', [0, 330], [0, 495], accent, 0);
  const clock = text('', 31, { position: [-100, 415], offset: [1, 0], fill: accent });
  const latency = text('', 30, { position: [0, 800], fill: muted });
  view.add([
    title,
    customer,
    ...events.map((event) => event.root),
    rule.root,
    result.root,
    consume.root,
    emit.root,
    clock,
    latency,
  ]);
  yield loadFonts();

  yield* waitUntil('two-events');
  yield* all(events[0].root.opacity(1, 0.25), events[1].root.opacity(1, 0.25));
  yield* waitUntil('rule');
  yield* rule.root.opacity(1, 0.35);
  yield* waitUntil('third-event');
  yield* events[2].root.opacity(1, 0.25);
  yield* waitUntil('batch');
  title.children(heading('kontrol ', 'her gece 02:00’de.').children());
  clock.text('daily batch');
  yield* waitUntil('batch-run');
  clock.text('ertesi gün\n02:00');
  yield* consume.reveal(1, 0.25);
  yield* consume.travel(0.6);
  yield* consume.arrive();
  yield* waitUntil('batch-match');
  for (const mark of marks) yield* all(mark.fill('#234b73', 0.2), mark.stroke(accent, 0.2));
  yield* waitUntil('batch-result');
  yield* emit.reveal(1, 0.25);
  yield* emit.travel(0.7);
  yield* emit.arrive();
  outcome.text('inceleme bekliyor');
  outcome.fill(accent);
  resultTime.text('ertesi gün · 02:00');

  yield* waitUntil('stream');
  title.children(heading('aynı olaylar. ', 'bu kez geldikçe işleyelim.').children());
  yield* all(
    ...events.map((event) => event.root.opacity(0, 0.3)),
    consume.root.opacity(0, 0.3),
    emit.root.opacity(0, 0.3),
    clock.opacity(0, 0.3),
  );
  marks.forEach((mark) => {
    mark.fill(background);
    mark.stroke(muted);
  });
  outcome.text('henüz uyarı yok');
  outcome.fill(muted);
  resultTime.text('');
  consume.reveal(0);
  consume.root.opacity(1);
  emit.reveal(0);
  emit.root.opacity(1);
  clock.text('event stream');
  yield* clock.opacity(1, 0.3);
  function* processEvent(index: number) {
    yield* events[index].root.opacity(1, 0.22);
    yield* consume.reveal(1, 0.15);
    yield* consume.travel(0.4);
    yield* all(
      consume.arrive(),
      marks[index].fill('#234b73', 0.2),
      marks[index].stroke(accent, 0.2),
    );
  }
  yield* waitUntil('first');
  yield* processEvent(0);
  yield* waitUntil('second');
  yield* processEvent(1);
  yield* waitUntil('third');
  yield* processEvent(2);
  yield* waitUntil('stream-result');
  yield* emit.reveal(1, 0.25);
  yield* emit.travel(0.7);
  yield* emit.arrive();
  outcome.text('inceleme bekliyor');
  outcome.fill(accent);
  resultTime.text('14:01:22');
  yield* waitUntil('latency');
  latency.text('işleme + aktarım · bu örnekte 2 sn');
  yield* waitUntil('nonzero');
  title.children(heading('stream kullanmak ', 'sıfır gecikme', ' demek değil.').children());
  yield* waitUntil('end');
});
