import {Layout, Line, makeScene2D, Rect, Txt, type TxtProps} from '@motion-canvas/2d';
import {
  all,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  fadeTransition,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {theme} from '../../theme';
import {showCompute} from './compute';
import {createBubble, createPhone} from './phone';

const {background, foreground, accent} = theme.colors;
const left = -960 + 1920 * theme.spacing.xl / 100;
const width = -left * 2;
const maskPadding = 16;

function text(value: string, fontSize: number, props: TxtProps = {}) {
  return new Txt({
    text: value,
    fontSize,
    fontFamily: theme.fontFamily.sans,
    fontWeight: 400,
    fill: foreground,
    textAlign: 'left',
    textWrap: false,
    offset: [-1, 0],
    ...props,
  });
}

function* replaceText(node: Txt, value: string) {
  yield* node.opacity(0, 0.2);
  node.text(value);
  yield* node.opacity(1, 0.3);
}

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill(background);

  const opening = new Layout({position: [left, 0]});
  const wipe = createSignal(0);
  const englishMask = new Rect({
    clip: true,
    width: () => width + maskPadding * 2 - wipe(),
    height: 260,
    x: () => (width + wipe()) / 2,
  });
  const english = new Txt({
    x: () => -(width + wipe()) / 2,
    offset: [-1, 0],
    fontSize: 164,
    fontFamily: theme.fontFamily.sans,
    fontWeight: 500,
    letterSpacing: -4,
    fill: foreground,
    textWrap: false,
    children: [
      text('data', 164, {fontStyle: 'italic', fontWeight: 500, fill: accent}),
      text('-intensive', 164, {fontWeight: 500}),
    ],
  });
  englishMask.add(english);

  const turkishMask = new Rect({
    clip: true,
    width: wipe,
    height: 260,
    x: () => wipe() / 2 - maskPadding,
  });
  const turkish = new Layout({x: () => maskPadding - wipe() / 2});
  const dataWord = text('veri', 164, {fontStyle: 'italic', fontWeight: 500, fill: accent});
  const intensiveWord = text('yoğun', 164, {x: 322, fontWeight: 500});
  turkish.add([dataWord, intensiveWord]);
  turkishMask.add(turkish);

  const underline = new Line({
    points: [[2, 108], [95, 112], [186, 109], [273, 111]],
    stroke: accent,
    lineWidth: 1920 * theme.underlineThickness / 100,
    lineCap: 'round',
    end: 0,
  });
  opening.add([englishMask, turkishMask]);
  view.add(opening);

  yield* fadeTransition(0.7);
  yield* waitUntil('translate');
  yield* wipe(width + maskPadding * 2, 1.15, easeInOutCubic);
  englishMask.remove();

  yield* waitUntil('focus-data');
  opening.add(underline);
  turkishMask.clip(false);
  yield* all(
    intensiveWord.opacity(0, 0.5),
    intensiveWord.x(355, 0.65, easeOutCubic),
    underline.end(1, 0.7, easeOutCubic),
  );

  const traces = new Layout({});
  const fragments = [
    {kind: 'mesaj', value: 'birazdan oradayım.', x: 20, y: -190},
    {kind: 'konum', value: '41.01, 28.98', x: 210, y: 20},
    {kind: 'ölçüm', value: '22°C', x: 55, y: 230},
  ].map(({kind, value, x, y}) => {
    const group = new Layout({position: [x, y + 18], opacity: 0});
    const label = text(kind, 30, {y: -52, fill: accent});
    const content = text(value, 55, {
      fontFamily: kind === 'konum' ? theme.fontFamily.mono : theme.fontFamily.sans,
    });
    group.add([label, content]);
    traces.add(group);
    return {group, label, content, y};
  });
  view.add(traces);

  for (const [index, fragment] of fragments.entries()) {
    yield* waitUntil(['message', 'location', 'measurement'][index]);
    yield* all(
      fragment.group.opacity(1, 0.5),
      fragment.group.y(fragment.y, 0.65, easeOutCubic),
    );
  }

  yield* waitUntil('read-data');
  const phone = createPhone('deniz');
  phone.root.position([440, 75]);
  phone.root.rotation(-5);
  phone.root.opacity(0);
  const incoming = createBubble('birazdan oradayım.', false);
  incoming.root.position([-25, -125]);
  incoming.root.opacity(0);
  phone.chat.add(incoming.root);
  view.add(phone.root);
  yield* all(
    traces.opacity(0, 0.45), phone.root.opacity(1, 0.65),
    phone.root.y(10, 0.95, easeOutCubic), phone.root.rotation(-3, 0.95),
  );
  traces.remove();
  incoming.root.scale(0.88);
  yield* all(
    incoming.root.opacity(1, 0.25), incoming.root.y(-140, 0.6, easeOutCubic),
    incoming.root.scale(1, 0.6, easeOutCubic),
  );

  yield* waitUntil('produce-data');
  const outgoing = createBubble('tamam, bekliyorum.', true);
  outgoing.root.position([25, 145]);
  outgoing.root.opacity(0);
  outgoing.checks.opacity(0);
  phone.chat.add(outgoing.root);
  yield* all(phone.composer.y(120, 0.55), phone.send.y(120, 0.55), phone.keyboard.opacity(1, 0.55));
  yield* phone.input.text('tamam, bekliyorum.', 1.15);
  yield* phone.send.scale(0.84, 0.12).to(1, 0.22);
  phone.input.text('');
  yield* all(
    outgoing.root.opacity(1, 0.25), outgoing.root.y(5, 0.7, easeOutCubic),
    phone.composer.y(335, 0.7), phone.send.y(335, 0.7), phone.keyboard.opacity(0, 0.45),
    phone.root.rotation(0, 0.8),
  );
  yield* outgoing.checks.opacity(1, 0.35);

  yield* waitUntil('intensive-question');
  yield* all(
    underline.opacity(0, 0.4),
    intensiveWord.x(322, 0.65, easeOutCubic), intensiveWord.opacity(1, 0.65),
    opening.y(-340, 0.8, easeInOutCubic), opening.scale(0.6, 0.8),
    phone.root.position([430, 65], 0.8), phone.root.scale(0.82, 0.8),
  );
  const question = text('peki, ne zaman\ndata-intensive diyoruz?', 50, {
    position: [left, -85], lineHeight: '125%', opacity: 0,
  });
  view.add(question);
  yield* question.opacity(1, 0.5);

  yield* waitUntil('volume');
  yield* replaceText(question, 'çok fazla data\nbiriktiğinde mi?');
  const historyCount = text('2 mesaj', 38, {position: [left, 90], fill: accent, opacity: 0});
  view.add(historyCount);
  yield* all(
    incoming.root.y(-153, 0.65), incoming.body.height(74, 0.65),
    incoming.text.fontSize(25, 0.65), incoming.stamp.y(15, 0.65),
    outgoing.root.y(-71, 0.65), outgoing.body.height(74, 0.65),
    outgoing.text.fontSize(25, 0.65), outgoing.stamp.y(15, 0.65),
    outgoing.checks.y(14, 0.65), historyCount.opacity(1, 0.5),
  );
  const extraMessages = [
    'konumu paylaştım.', 'gördüm, teşekkürler.', 'ana girişteyim.', 'yaklaşınca haber veririm.',
  ].map((value, index) => {
    const bubble = createBubble(value, index % 2 === 0);
    bubble.root.position([index % 2 === 0 ? 25 : -25, 11 + index * 82 + 18]);
    bubble.root.opacity(0);
    bubble.body.height(74);
    bubble.text.fontSize(25);
    phone.chat.add(bubble.root);
    return bubble;
  });
  for (const [index, bubble] of extraMessages.entries()) {
    yield* all(bubble.root.opacity(1, 0.3), bubble.root.y(11 + index * 82, 0.4, easeOutCubic));
    historyCount.text(`${index + 3} mesaj`);
  }

  yield* waitUntil('query-rate');
  yield* replaceText(question, 'saniyede daha çok\nistek gelirse?');
  const requests = new Layout({opacity: 0});
  const requestPath = new Line({
    points: [[-420, 240], [190, 160]],
    stroke: accent, lineWidth: 3, endArrow: true, arrowSize: 14,
  });
  const requestLabel = text('read', 30, {position: [-420, 185], fill: accent});
  const pulse = new Rect({position: [-420, 240], size: [22, 12], radius: 4, fill: foreground, opacity: 0});
  requests.add([requestPath, requestLabel, pulse]);
  view.add(requests);
  yield* requests.opacity(1, 0.4);
  for (const pause of [0.8, 0.45, 0.15, 0, 0]) {
    yield* waitFor(pause);
    pulse.position([-420, 240]);
    pulse.opacity(1);
    yield* pulse.position([190, 160], 0.5);
    pulse.opacity(0);
    yield* phone.screen.stroke(accent, 0.12).to(foreground, 0.12);
  }

  yield* waitUntil('changes');
  yield* replaceText(question, 'bu arada data\ndeğişmeye devam ediyor.');
  yield* all(
    requests.opacity(0, 0.4), historyCount.opacity(0, 0.4),
    ...extraMessages.map(bubble => bubble.root.opacity(0, 0.4)), outgoing.root.opacity(0, 0.4),
    incoming.root.y(-75, 0.7), incoming.body.height(108, 0.7),
    incoming.text.fontSize(30, 0.7), incoming.stamp.y(35, 0.7),
  );
  requests.remove();
  historyCount.remove();
  for (const bubble of extraMessages) bubble.root.remove();
  yield* incoming.text.text('on dakika gecikeceğim.', 0.95);
  incoming.stamp.text('düzenlendi · 14:33');

  yield* waitUntil('concurrency');
  yield* question.opacity(0, 0.2);
  question.text('biri değiştirirken diğeri açarsa?');
  question.y(-285);
  const writer = createPhone('sen');
  writer.root.position([-420, 165]);
  writer.root.scale(0.64);
  writer.root.opacity(0);
  const edited = createBubble('on dakika gecikeceğim.', true);
  edited.root.position([25, -75]);
  writer.chat.add(edited.root);
  const names = new Layout({opacity: 0});
  names.add([
    text('deniz', 30, {position: [-420, -195], offset: [0, 0], fontFamily: theme.fontFamily.serif, fontStyle: 'italic'}),
    text('sen', 30, {position: [430, -195], offset: [0, 0], fontFamily: theme.fontFamily.serif, fontStyle: 'italic'}),
  ]);
  view.add([writer.root, names]);
  yield* all(
    question.opacity(1, 0.4), opening.y(-405, 0.8), opening.scale(0.45, 0.8),
    phone.root.position([430, 145], 0.8), phone.root.scale(0.64, 0.8),
    writer.root.opacity(1, 0.6), writer.root.y(145, 0.8), names.opacity(1, 0.6),
  );
  edited.stamp.text('düzenleniyor…');
  edited.checks.opacity(0);
  yield* all(edited.text.text('beş dakika gecikeceğim.', 1.1), incoming.root.opacity(0.55, 1.1));
  edited.stamp.text('düzenlendi · 14:33');
  const unresolved = text('hangisi?', 38, {position: [0, 80], offset: [0, 0], fill: accent, opacity: 0});
  phone.chat.add(unresolved);
  yield* unresolved.opacity(1, 0.4);

  yield* waitUntil('failures');
  yield* replaceText(question, 'yanıt gelmedi. mesaj kaydedildi mi?');
  yield* all(phone.root.opacity(0, 0.4), names.opacity(0, 0.4));
  phone.root.remove();
  names.remove();
  writer.contact.text('deniz');
  writer.status.text('çevrimiçi');
  edited.text.text('tamam, haber ver.');
  edited.stamp.text('14:34');
  edited.checks.opacity(0);
  const service = new Layout({position: [455, 130], opacity: 0});
  service.add(text('mesaj servisi', 30, {position: [0, -190], offset: [0, 0]}));
  for (let index = 0; index < 3; index++) {
    const rack = new Rect({position: [0, -85 + index * 78], size: [280, 64], radius: 13, stroke: foreground, lineWidth: 3, fill: background});
    rack.add([
      new Rect({position: [-104, 0], size: 9, radius: 4.5, fill: accent}),
      new Line({points: [[-65, 0], [95, 0]], stroke: foreground, lineWidth: 3, opacity: 0.45}),
    ]);
    service.add(rack);
  }
  const delivery = new Layout({opacity: 0});
  const sendPath = new Line({points: [[-210, 90], [295, 90]], stroke: accent, lineWidth: 3, endArrow: true, arrowSize: 16});
  const returnPath = new Line({points: [[295, 190], [-210, 190]], stroke: foreground, lineWidth: 3, endArrow: true, arrowSize: 16});
  const sendLabel = text('write', 26, {position: [10, 45], fill: accent});
  const returnLabel = text('yanıt', 26, {position: [20, 235]});
  const packet = new Rect({position: [-210, 90], size: [24, 12], radius: 4, fill: accent});
  const interruption = text('×', 56, {position: [25, 190], offset: [0, 0], fill: accent, opacity: 0});
  delivery.add([sendPath, returnPath, sendLabel, returnLabel, packet, interruption]);
  view.add([service, delivery]);
  yield* all(service.opacity(1, 0.5), delivery.opacity(1, 0.5));
  yield* packet.x(295, 0.85);
  packet.position([295, 190]);
  yield* packet.x(45, 0.65);
  yield* all(packet.opacity(0, 0.2), interruption.opacity(1, 0.25), returnPath.opacity(0.25, 0.25));
  returnLabel.text('yanıt ulaşmadı');
  returnLabel.x(-40);

  yield* waitUntil('availability');
  yield* replaceText(question, 'peki, konuşmaya ulaşabiliyor muyuz?');
  yield* edited.root.opacity(0, 0.4);
  writer.status.text('bağlanıyor…');
  const reconnecting = text('bağlanıyor…', 30, {offset: [0, 0], opacity: 0});
  writer.chat.add(reconnecting);
  sendLabel.text('read');
  interruption.position([25, 90]);
  interruption.opacity(0);
  returnLabel.opacity(0);
  returnPath.opacity(0);
  packet.position([-210, 90]);
  packet.opacity(1);
  yield* all(packet.x(0, 0.85), service.opacity(0.35, 0.85), reconnecting.opacity(1, 0.5));
  yield* all(packet.opacity(0, 0.2), interruption.opacity(1, 0.25), sendPath.opacity(0.25, 0.25));

  yield* waitUntil('compute-intensive');
  yield* all(
    writer.root.opacity(0, 0.6), service.opacity(0, 0.6), delivery.opacity(0, 0.6),
    opening.opacity(0, 0.6), question.opacity(0, 0.45),
  );
  writer.root.remove();
  service.remove();
  delivery.remove();
  opening.remove();
  question.remove();

  const comparison = yield* showCompute(view);

  yield* waitUntil('data-management');
  yield* comparison.opacity(0, 0.55);
  comparison.remove();

  const closing = new Layout({position: [left, -60], opacity: 0});
  const closingTitle = new Txt({
    offset: [-1, 0], fontFamily: theme.fontFamily.sans, fontSize: 140,
    fontWeight: 500, fill: foreground, textWrap: false, letterSpacing: -3,
    children: [
      text('data', 140, {fontStyle: 'italic', fontWeight: 500, fill: accent}),
      text('-intensive', 140, {fontWeight: 500}),
    ],
  });
  const closingData = new Txt({text: 'data', fill: foreground});
  const closingCaption = new Txt({
    y: 160, offset: [-1, 0], fontFamily: theme.fontFamily.sans,
    fontSize: 68, fontWeight: 400, fill: foreground, textWrap: false,
    children: [closingData, new Txt({text: '’yı yönetmek.'})],
  });
  const closingUnderline = new Line({
    points: [[0, 213], [170, 211], [354, 215], [550, 210]],
    stroke: accent, lineWidth: 6, lineCap: 'round', end: 0,
  });
  const nextQuestion = text('peki, nasıl?', 48, {
    y: 145, fontFamily: theme.fontFamily.serif, fontStyle: 'italic', opacity: 0,
  });
  closing.add([closingTitle, closingCaption, nextQuestion]);
  view.add(closing);
  yield* closing.opacity(1, 0.7);
  closing.add(closingUnderline);
  yield* closingUnderline.end(1, 0.75);

  yield* waitUntil('building-blocks');
  yield* all(
    closingTitle.opacity(0, 0.5), closingUnderline.opacity(0, 0.5),
    closingCaption.y(0, 0.8, easeInOutCubic), closingCaption.fontSize(86, 0.8),
    closingData.fill(accent, 0.8),
  );
  yield* all(nextQuestion.opacity(1, 0.6), nextQuestion.y(130, 0.6, easeOutCubic));
  yield* waitUntil('end');
});
