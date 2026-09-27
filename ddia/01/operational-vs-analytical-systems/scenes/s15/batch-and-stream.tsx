import { Circle, Layout, Path, type Txt } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, foreground, heading, muted, paper, text } from '../shared/drawing';

export function* batchAndStream(stage: Layout, title: Txt) {
  const tray = paper(370, 350, '#101315');
  tray.root.position([-635, 95]);
  const mode = text('daily batch', 31, { position: [-635, -228], fill: accent });
  const clock = text('ertesi gün · 02:00', 29, {
    position: [0, -228],
    fontFamily: theme.fontFamily.mono,
    fill: muted,
  });
  const times = ['14:01:00', '14:01:10', '14:01:20'];
  const events = times.map((time, i) => {
    const row = new Layout({ position: [0, -112 + i * 112], opacity: 0 });
    const card = new Path({
      position: [-120, 0],
      data: 'M -28 -19 Q 0 -22 29 -18 L 27 19 Q 0 22 -28 18 Z M -27 -7 L 28 -8 M -17 9 L -5 9',
      stroke: foreground,
      fill: '#182638',
      lineWidth: 2.5,
      lineJoin: 'round',
    });
    row.add([
      card,
      text('reddedildi', 25, { position: [-55, -19], offset: [-1, 0] }),
      text(time, 23, {
        position: [-55, 22],
        offset: [-1, 0],
        fill: accent,
        fontFamily: theme.fontFamily.mono,
      }),
      new Path({
        position: [-96, 18],
        data: 'M -8 -8 L 8 8 M -8 8 L 8 -8',
        stroke: accent,
        lineWidth: 3,
        lineCap: 'round',
      }),
    ]);
    tray.root.add(row);
    return row;
  });
  const rule = paper(400, 300, '#101315');
  rule.root.position([0, 95]);
  const marks = [0, 1, 2].map((i) => {
    const mark = new Circle({
      position: [-70 + i * 70, 49],
      size: 42,
      stroke: muted,
      lineWidth: 2.5,
      fill: '#101315',
    });
    mark.add(text(String(i + 1), 24));
    rule.root.add(mark);
    return mark;
  });
  rule.root.add([
    text('30 sn içinde', 36, { y: -76, fill: accent }),
    text('3 başarısız ödeme', 29, { y: -20 }),
    text('incelemeye al', 27, { y: 112, fill: muted }),
  ]);
  const notice = paper(320, 248, '#101315');
  notice.root.position([650, 95]);
  const bell = new Path({
    position: [0, -55],
    data: 'M -25 17 Q -16 4 -16 -13 Q -15 -36 5 -35 Q 24 -32 21 -11 Q 18 7 30 19 Z M -4 27 Q 3 40 12 28 M 1 -42 L 3 -49 M -37 -22 L -47 -29 M 40 -20 L 51 -26',
    stroke: accent,
    lineWidth: 3,
    lineCap: 'round',
    lineJoin: 'round',
    opacity: 0,
  });
  const outcome = text('henüz sonuç yok', 27, { y: 26, fill: muted });
  const customer = text('customer #17', 25, {
    y: 81,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  notice.root.add([bell, outcome, customer]);
  const consume = cartoonArrow('s15-payment-attempts-to-rule', [-416, 95], [-241, 95], accent, 0);
  const emit = cartoonArrow('s15-review-notification', [242, 95], [450, 95], accent, 0);
  const delay = text('sonraki çalıştırmayı bekliyor', 26, {
    position: [-635, 335],
    fill: muted,
  });
  const resultTime = text('', 24, {
    position: [650, 285],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
  });
  stage.add([
    tray.root,
    mode,
    clock,
    rule.root,
    notice.root,
    consume.root,
    emit.root,
    delay,
    resultTime,
    text('customer #17', 28, {
      position: [-635, -132],
      fontFamily: theme.fontFamily.mono,
    }),
    text('örnek inceleme kuralı', 29, { position: [0, -132] }),
    text('inceleme kuyruğu', 29, { position: [650, -132] }),
  ]);
  stage.opacity(0);
  title.children(heading('aynı hesapta ', 'üç başarısız deneme.').children());
  yield* all(title.opacity(1, 0.3), stage.opacity(1, 0.5));
  for (const event of events) {
    yield* event.opacity(1, 0.3);
    yield* waitFor(0.5);
  }
  yield* waitUntil('batch-run');
  yield* title.opacity(0, 0.2);
  title.children(heading('günlük iş çalışınca ', 'fark ediyoruz.').children());
  yield* all(title.opacity(1, 0.3), delay.opacity(0, 0.2), clock.fill(accent, 0.2));
  yield* consume.reveal(1, 0.3);
  yield* consume.travel(0.7);
  yield* consume.arrive();
  for (const mark of marks) {
    yield* all(mark.fill('#234b73', 0.18), mark.stroke(accent, 0.18));
  }
  yield* emit.reveal(1, 0.3);
  yield* emit.travel(0.7);
  outcome.text('inceleme bekliyor');
  outcome.fill(accent);
  resultTime.text('ertesi gün · 02:00');
  yield* all(emit.arrive(), bell.opacity(1, 0.25), customer.opacity(1, 0.25));
  yield* waitUntil('stream');
  yield* all(title.opacity(0, 0.2), stage.opacity(0, 0.4));
  mode.text('event stream');
  clock.text(times[0]);
  clock.fill(muted);
  delay.text('aynı olaylar · aynı kural');
  delay.opacity(1);
  resultTime.text('');
  outcome.text('henüz sonuç yok');
  outcome.fill(muted);
  bell.opacity(0);
  customer.opacity(0);
  events.forEach((event) => event.opacity(0));
  marks.forEach((mark) => {
    mark.fill('#101315');
    mark.stroke(muted);
  });
  consume.reveal(0);
  emit.reveal(0);
  title.children(heading('denemeleri ', 'geldikçe değerlendirelim.').children());
  yield* all(title.opacity(1, 0.3), stage.opacity(1, 0.5));
  yield* consume.reveal(1, 0.3);
  for (let i = 0; i < events.length; i++) {
    clock.text(times[i]);
    yield* events[i].opacity(1, 0.25);
    yield* consume.travel(0.65);
    yield* all(consume.arrive(), marks[i].fill('#234b73', 0.2), marks[i].stroke(accent, 0.2));
    yield* waitFor(0.4);
  }
  yield* emit.reveal(1, 0.3);
  yield* emit.travel(0.7);
  clock.text('14:01:22');
  resultTime.text('14:01:22');
  outcome.text('inceleme bekliyor');
  outcome.fill(accent);
  yield* all(emit.arrive(), bell.opacity(1, 0.25), customer.opacity(1, 0.25));
  yield* waitUntil('timeliness');
  yield* title.opacity(0, 0.2);
  title.children(heading('incelemeye ', 'daha erken', ' başlayabiliyoruz.').children());
  const caution = text('bu sinyal inceleme içindir; dolandırıcılık kanıtı değil.', 29, {
    position: [0, 425],
    fill: muted,
    opacity: 0,
  });
  stage.add(caution);
  yield* all(title.opacity(1, 0.3), caution.opacity(1, 0.3));
  yield* waitUntil('latency');
  yield* title.opacity(0, 0.2);
  title.children(heading('bu da ', 'sıfır gecikme', ' demek değil.').children());
  delay.text('işleme ve aktarım zaman alır');
  resultTime.text('bu örnekte · +2 sn');
  yield* title.opacity(1, 0.3);
}
