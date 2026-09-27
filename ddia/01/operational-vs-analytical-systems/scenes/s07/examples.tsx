import { Circle, Layout, Path, Rect } from '@motion-canvas/2d';
import { all, easeOutCubic, waitFor } from '@motion-canvas/core';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { theme } from '../../theme';
import { accent, background, foreground, ink, muted, paper, text } from '../shared/drawing';
import { role } from '../shared/people';

const mono = theme.fontFamily.mono;
const bluePaper = '#17232f';

function pair() {
  const root = new Layout({ opacity: 0 });
  const left = new Layout({ position: [-460, -40] });
  const right = new Layout({ position: [460, -40] });
  root.add([left, right]);
  return { root, left, right };
}

function card(parent: Layout, width: number, height: number, x = 0, y = 0) {
  const sheet = paper(width, height, '#101315');
  sheet.root.position([x, y]);
  parent.add(sheet.root);
  return sheet.root;
}

function divider(parent: Layout, width: number, y: number) {
  parent.add(
    new Path({
      ...ink,
      data: `M ${-width / 2} ${y} Q 0 ${y + 2} ${width / 2} ${y}`,
      opacity: 0.2,
      lineWidth: 1.5,
    }),
  );
}

function tick(x = 0, y = 0) {
  return new Path({
    ...ink,
    position: [x, y],
    stroke: accent,
    data: 'M -12 0 L -3 9 L 14 -12',
    end: 0,
    opacity: 0,
  });
}

function cursor(x: number, y: number) {
  return new Path({
    ...ink,
    position: [x, y],
    fill: foreground,
    stroke: background,
    lineWidth: 2,
    data: 'M 0 0 L 0 29 L 8 22 L 15 35 L 21 32 L 14 19 L 25 17 Z',
  });
}

export function writeExample() {
  const { root, left, right } = pair();
  const record = card(left, 540, 220);
  record.add(
    text('orders / #1042', 29, { position: [-232, -73], offset: [-1, 0], fontFamily: mono }),
  );
  divider(record, 464, -35);
  record.add(
    text('status', 25, { position: [-232, 10], offset: [-1, 0], fill: muted, fontFamily: mono }),
  );
  const status = text('created', 33, { position: [35, 10], fill: accent, fontFamily: mono });
  const update = text('UPDATE → preparing', 24, { y: 74, fontFamily: mono, opacity: 0 });
  record.add([status, update]);
  const batch = new Layout({ position: [-222, -53] });
  right.add(batch);
  for (let i = 0; i < 3; i++) card(batch, 132, 62, i * 8, i * 8);
  batch.add(text('sales', 25, { position: [16, 16], fontFamily: mono }));
  const event = card(right, 140, 60, -206, 90);
  event.add(text('event', 24, { fontFamily: mono }));
  const target = card(right, 180, 205, 211, 10);
  target.add(text('analytics', 24, { y: -63 }));
  divider(target, 142, -32);
  const loaded = text('0 kayıt', 29, { y: 27, fill: accent });
  target.add(loaded);
  const batchArrow = cartoonArrow('s07-etl', [-110, -37], [102, -37], accent);
  const eventArrow = cartoonArrow('s07-events', [-110, 90], [102, 90], accent);
  batchArrow.root.scale(0.9);
  eventArrow.root.scale(0.9);
  right.add([
    batchArrow.root,
    eventArrow.root,
    text('ETL', 24, { position: [-10, -91], fontFamily: mono }),
  ]);
  function* animate() {
    yield* waitFor(0.45);
    yield* all(update.opacity(1, 0.3), batchArrow.travel(0.8));
    yield* status.opacity(0, 0.2);
    status.text('preparing');
    loaded.text('3 kayıt');
    yield* status.opacity(1, 0.3);
    yield* waitFor(0.7);
    yield* eventArrow.travel(0.8);
    loaded.text('4 kayıt');
  }
  return { root, animate };
}

export function queryExample() {
  const { root, left, right } = pair();
  const fixed = card(left, 540, 245);
  fixed.add(text('getOrder(id)', 34, { y: -77, fill: accent, fontFamily: mono }));
  divider(fixed, 460, -35);
  const id = text('id: 1042', 30, { y: 13, fontFamily: mono });
  fixed.add([id, text('aynı sorgu · farklı sipariş', 24, { y: 82, fill: muted })]);
  const notebook = card(right, 580, 245);
  const question = text('hangi mağaza ne kadar sattı?', 28, { y: -77 });
  const query = text('GROUP BY store_id', 29, { y: 13, fill: accent, fontFamily: mono });
  notebook.add([question, query, text('soruya göre sorgu da değişir', 24, { y: 82, fill: muted })]);
  divider(notebook, 500, -35);
  function* animate() {
    yield* waitFor(1.4);
    yield* all(id.opacity(0, 0.2), question.opacity(0, 0.2), query.opacity(0, 0.2));
    id.text('id: 1043');
    question.text('hangi üründen ne kadar sattık?');
    query.text('GROUP BY product_id');
    yield* all(id.opacity(1, 0.3), question.opacity(1, 0.3), query.opacity(1, 0.3));
  }
  return { root, animate };
}

export function workloadExample() {
  const { root, left, right } = pair();
  const tickets = Array.from({ length: 6 }, (_, i) => {
    const ticket = card(left, 164, 84, -192 + (i % 3) * 192, -57 + Math.floor(i / 3) * 118);
    ticket.opacity(0);
    ticket.add(text(`#${1041 + i}`, 27, { x: -12, fontFamily: mono }));
    const done = tick(60, 0);
    done.scale(0.7);
    ticket.add(done);
    return { ticket, done };
  });
  const query = card(right, 568, 68, 0, -91);
  query.add(text('SUM(amount) GROUP BY store_id', 25, { fontFamily: mono, fill: accent }));
  const rows = Array.from({ length: 36 }, (_, i) => {
    const row = new Path({
      ...ink,
      position: [-263 + (i % 9) * 64, -10 + Math.floor(i / 9) * 31],
      data: 'M 0 0 L 42 -1 L 41 17 L 0 18 Z',
      fill: bluePaper,
      stroke: muted,
      lineWidth: 1.3,
    });
    right.add(row);
    return row;
  });
  function* animate() {
    for (let i = 0; i < 6; i++) {
      yield* tickets[i].ticket.opacity(1, 0.16);
      tickets[i].done.opacity(1);
      yield* all(
        tickets[i].done.end(1, 0.18),
        ...rows.slice(i * 6, i * 6 + 6).map((row) => row.stroke(accent, 0.18)),
      );
    }
  }
  return { root, animate };
}

export function peopleExample() {
  const { root, left, right } = pair();
  [left, right].forEach((parent, i) => {
    const person = role('', '', i).children()[0];
    person.position([-244, 41]);
    person.scale(1.6);
    parent.add(person);
  });
  const app = card(left, 355, 258, 62);
  app.add(text('market', 27, { position: [-144, -97], offset: [-1, 0], fontWeight: 500 }));
  divider(app, 307, -62);
  const order = new Rect({
    y: -13,
    size: [305, 58],
    radius: 7,
    fill: bluePaper,
    stroke: accent,
    lineWidth: 1.5,
  });
  order.add(text('sipariş #1042', 28));
  const status = text('preparing', 31, { y: 72, fill: accent, fontFamily: mono, opacity: 0 });
  app.add([order, status]);
  const finger = cursor(118, 49);
  app.add(finger);
  const report = card(right, 390, 258, 70);
  const filter = new Rect({
    y: -91,
    size: [334, 43],
    radius: 6,
    fill: bluePaper,
    stroke: accent,
    lineWidth: 1.5,
  });
  const period = text('dönem seç  ▾', 25);
  filter.add(period);
  report.add(filter);
  const bars = [400, 300].map((amount, i) => {
    const x = -85 + i * 170;
    const bar = new Rect({ position: [x, 82], offset: [0, 1], width: 73, height: 0, fill: accent });
    const value = text(`${amount}₺`, 24, {
      x,
      y: () => 61 - bar.height(),
      fontFamily: mono,
      opacity: 0,
    });
    report.add([bar, value, text(`mağaza ${i ? 'b' : 'a'}`, 21, { position: [x, 106] })]);
    return { bar, value, amount };
  });
  const pointer = cursor(149, -41);
  report.add(pointer);
  function* animate() {
    yield* waitFor(0.4);
    yield* all(finger.position([104, -10], 0.5), pointer.position([115, -93], 0.5));
    yield* all(
      order.fill('#29425e', 0.15).to(bluePaper, 0.25),
      filter.fill('#29425e', 0.15).to(bluePaper, 0.25),
    );
    period.text('ocak 2026  ▾');
    yield* all(
      status.opacity(1, 0.35),
      ...bars.map(({ bar, value, amount }) =>
        all(bar.height(amount * 0.26, 0.65, easeOutCubic), value.opacity(1, 0.35)),
      ),
    );
    yield* all(finger.opacity(0, 0.3), pointer.opacity(0, 0.3));
  }
  return { root, animate };
}

export function machineExample() {
  const { root, left, right } = pair();
  const permission = card(left, 558, 268);
  permission.add([
    text("#1042'yi iptal et", 29, { position: [-239, -94], offset: [-1, 0] }),
    text('isteği yapan', 27, { position: [-239, -30], offset: [-1, 0] }),
    text('siparişin sahibi', 27, { position: [-239, 21], offset: [-1, 0] }),
    text('#42', 30, { position: [185, -30], offset: [1, 0], fontFamily: mono }),
    text('#42', 30, { position: [185, 21], offset: [1, 0], fontFamily: mono }),
  ]);
  divider(permission, 478, -61);
  const decision = text('izin verildi', 27, {
    position: [-199, 90],
    offset: [-1, 0],
    fill: accent,
    opacity: 0,
  });
  const check = tick(-232, 90);
  const match = new Path({
    ...ink,
    stroke: accent,
    data: 'M 130 -8 Q 155 -5 185 -8 M 130 44 Q 155 47 185 44',
    opacity: 0,
  });
  permission.add([decision, check, match]);
  const log = card(right, 584, 268);
  log.add(text('giriş denemeleri · hesap #42', 27, { y: -94 }));
  divider(log, 510, -61);
  const attempts = ['10:01:02', '10:01:03', '10:01:04'].map((time, i) => {
    const row = new Layout({ y: -26 + i * 43, opacity: 0 });
    row.add([
      text(time, 25, { position: [-248, 0], offset: [-1, 0], fontFamily: mono, fill: muted }),
      text('başarısız', 26, { position: [30, 0], fill: accent }),
    ]);
    log.add(row);
    return row;
  });
  const lens = new Layout({ position: [232, 16], opacity: 0 });
  lens.add([
    new Circle({ size: 64, stroke: accent, lineWidth: 3 }),
    new Path({ ...ink, stroke: accent, data: 'M 23 25 L 49 51' }),
    text('!', 36, { fill: accent, fontWeight: 500 }),
  ]);
  const detected = text('şüpheli girişler', 25, { y: 109, fill: accent, opacity: 0 });
  log.add([lens, detected]);
  function* animate() {
    yield* waitFor(0.4);
    yield* all(match.opacity(1, 0.3), attempts[0].opacity(1, 0.3));
    check.opacity(1);
    yield* all(check.end(1, 0.4), decision.opacity(1, 0.4), attempts[1].opacity(1, 0.4));
    yield* waitFor(0.5);
    yield* attempts[2].opacity(1, 0.3);
    yield* all(lens.opacity(1, 0.35), detected.opacity(1, 0.35));
  }
  return { root, animate };
}

export function historyExample() {
  const { root, left, right } = pair();
  const current = card(left, 540, 258);
  current.add(text('sipariş #1042', 30, { y: -90 }));
  divider(current, 462, -53);
  const status = text('created', 44, { y: 6, fill: accent, fontFamily: mono });
  const updated = text('10:00', 25, { y: 84, fill: muted, fontFamily: mono });
  current.add([status, updated]);
  const history = card(right, 580, 258);
  history.add(text('sipariş #1042', 30, { y: -90 }));
  divider(history, 502, -53);
  const states = ['created', 'preparing', 'shipped'];
  const times = ['10:00', '10:04', '10:18'];
  const rows = states.map((state, i) => {
    const row = new Layout({ y: -18 + i * 51, opacity: i ? 0 : 1 });
    row.add([
      new Circle({ position: [-233, 0], size: 9, fill: accent }),
      text(times[i], 25, { position: [-204, 0], offset: [-1, 0], fill: muted, fontFamily: mono }),
      text(state, 30, { position: [-58, 0], offset: [-1, 0], fill: accent, fontFamily: mono }),
    ]);
    history.add(row);
    return row;
  });
  function* animate() {
    for (let i = 1; i < states.length; i++) {
      yield* waitFor(1.4);
      yield* status.opacity(0, 0.2);
      status.text(states[i]);
      updated.text(times[i]);
      yield* all(status.opacity(1, 0.35), rows[i].opacity(1, 0.35));
    }
  }
  return { root, animate };
}

export function sizeExample() {
  const { root, left, right } = pair();
  const ranges = [left, right].map((parent, side) => {
    const x = side ? 0 : -210;
    parent.add(new Path({ ...ink, stroke: muted, lineWidth: 2, data: 'M -210 20 Q 0 24 210 20' }));
    const range = new Path({
      stroke: accent,
      lineCap: 'round',
      lineWidth: 12,
      data: `M ${x} 20 Q ${x + 100} 22 ${x + 210} 20`,
      end: 0,
      opacity: 0,
    });
    parent.add(range);
    ['GB', 'TB', 'PB'].forEach((unit, i) => {
      const active = i === side || i === side + 1;
      parent.add([
        new Path({
          ...ink,
          stroke: active ? accent : muted,
          lineWidth: 2,
          data: `M ${-210 + i * 210} 5 L ${-209 + i * 210} 37`,
        }),
        text(unit, 32, {
          position: [-210 + i * 210, 76],
          fill: active ? foreground : muted,
          fontFamily: mono,
        }),
      ]);
    });
    const stack = new Layout({ position: [side ? 105 : -105, -60] });
    parent.add(stack);
    for (let i = 2; i >= 0; i--) {
      const page = card(stack, 115, 47, i * 7, -i * 13);
      page.add(
        new Path({
          ...ink,
          stroke: accent,
          lineWidth: 1.6,
          data: 'M -33 3 L -20 -9 M -13 3 L 0 -9 M 7 3 L 20 -9 M 27 3 L 40 -9',
        }),
      );
    }
    return range;
  });
  function* animate() {
    yield* waitFor(0.3);
    ranges.forEach((range) => range.opacity(1));
    yield* all(...ranges.map((range) => range.end(1, 0.75, easeOutCubic)));
  }
  return { root, animate };
}
