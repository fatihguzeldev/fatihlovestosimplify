import { Layout, type Txt } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonService } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, heading, muted, paper, text } from '../shared/drawing';

export function* batchAndStream(stage: Layout, title: Txt) {
  const tray = paper(520, 235, '#101315');
  tray.root.position([-535, 80]);
  const mode = text('daily batch', 36, { position: [-535, -100], fill: accent });
  const wait = text('sonraki çalıştırmayı bekliyor', 25, { position: [-535, 267], fill: muted });
  const events = ['14:01', '14:02', '14:03'].map((time, i) => {
    const card = paper(128, 118, '#182638');
    card.root.position([-159 + i * 159, 0]);
    card.root.opacity(0);
    card.root.add([
      text(`event ${i + 1}`, 21, { y: -23 }),
      text(time, 23, { y: 28, fill: accent, fontFamily: theme.fontFamily.mono }),
    ]);
    tray.root.add(card.root);
    return card;
  });
  const processing = cartoonService('processing', accent);
  processing.root.position([75, 80]);
  const schedule = text('ertesi gün · 02:00', 29, {
    position: [75, -123],
    fill: muted,
    fontFamily: theme.fontFamily.mono,
  });
  const result = paper(350, 210, '#101315');
  result.root.position([650, 80]);
  const count = text('0', 65, { y: -22, fill: accent, fontFamily: theme.fontFamily.mono });
  result.root.add([count, text('event işlendi', 28, { y: 60 })]);
  const consume = cartoonArrow('s15-event-processing', [0, 0], [300, 0], accent, 0);
  consume.root.position([-230, 80]);
  consume.root.scale(124 / 300);
  const emit = cartoonArrow('s15-processing-result', [0, 0], [300, 0], accent, 0);
  emit.root.position([268, 80]);
  emit.root.scale(165 / 300);
  stage.add([
    tray.root,
    mode,
    wait,
    processing.root,
    schedule,
    result.root,
    consume.root,
    emit.root,
  ]);
  stage.opacity(0);
  title.children(heading('event’ler ', 'birikiyor.').children());
  yield* all(title.opacity(1, 0.3), stage.opacity(1, 0.5));
  for (const event of events) {
    yield* event.root.opacity(1, 0.3);
    yield* waitFor(0.5);
  }
  yield* waitUntil('batch-run');
  yield* title.opacity(0, 0.2);
  title.children(heading('günlük çalıştırmada ', 'topluca işleniyor.').children());
  yield* all(title.opacity(1, 0.3), wait.opacity(0, 0.2), schedule.fill(accent, 0.2));
  yield* consume.reveal(1, 0.3);
  yield* consume.travel(0.7);
  yield* consume.arrive();
  yield* all(...processing.lights.map((light) => light.opacity(1, 0.2).to(0.65, 0.3)));
  yield* emit.reveal(1, 0.3);
  yield* emit.travel(0.7);
  count.text('3');
  yield* emit.arrive();
  yield* waitUntil('stream');
  yield* all(title.opacity(0, 0.2), stage.opacity(0, 0.4));
  mode.text('event stream');
  count.text('0');
  schedule.text('14:01');
  schedule.fill(muted);
  wait.text('event geldikçe');
  wait.opacity(1);
  events.forEach((event) => event.root.opacity(0));
  consume.reveal(0);
  emit.reveal(0);
  title.children(heading('geldikçe de ', 'işleyebiliriz.').children());
  yield* all(title.opacity(1, 0.3), stage.opacity(1, 0.5));
  yield* all(consume.reveal(1, 0.3), emit.reveal(1, 0.3));
  for (let i = 0; i < events.length; i++) {
    schedule.text(`14:0${i + 1}`);
    yield* events[i].root.opacity(1, 0.25);
    yield* consume.travel(0.6);
    yield* consume.arrive();
    yield* all(...processing.lights.map((light) => light.opacity(1, 0.1).to(0.65, 0.2)));
    yield* emit.travel(0.6);
    count.text(`${i + 1}`);
    yield* emit.arrive();
    yield* waitFor(0.5);
  }
  yield* waitUntil('timeliness');
  yield* title.opacity(0, 0.2);
  title.children(heading('şüpheli işleme ', 'daha erken', ' tepki verebiliriz.').children());
  const signal = text('risk sinyali', 29, { position: [650, 292], fill: accent, opacity: 0 });
  stage.add(signal);
  yield* all(title.opacity(1, 0.3), signal.opacity(1, 0.3));
  yield* waitUntil('latency');
  yield* title.opacity(0, 0.2);
  title.children(heading('bu da ', 'sıfır gecikme', ' demek değil.').children());
  wait.text('işleme ve aktarım zaman alır');
  yield* title.opacity(1, 0.3);
}
