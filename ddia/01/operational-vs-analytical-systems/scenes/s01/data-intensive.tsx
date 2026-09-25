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
  const conversation = new Layout({position: [350, 40]});
  const frame = new Rect({size: [840, 530], radius: 16, stroke: foreground, lineWidth: 2, opacity: 0});
  const chatTitle = text('deniz ile konuşma', 30, {position: [-375, -220], opacity: 0});
  const incoming = new Rect({position: [-40, -95], size: [660, 106], radius: 12, stroke: foreground, lineWidth: 2, opacity: 0});
  const composer = new Rect({position: [0, 170], size: [750, 76], radius: 10, stroke: foreground, lineWidth: 2, opacity: 0});
  const sendButton = new Rect({position: [295, 170], size: [136, 56], radius: 6, fill: accent, opacity: 0});
  sendButton.add(text('gönder', 26, {offset: [0, 0], fill: background}));
  conversation.add([frame, chatTitle, incoming, composer, sendButton]);
  view.add(conversation);
  const message = fragments[0];
  message.group.remove();
  message.group.position([-330, -230]);
  conversation.add(message.group);
  const action = text('mesajı açıyorsun.', 46, {position: [left, 190], opacity: 0});
  view.add(action);
  yield* all(
    fragments[1].group.opacity(0, 0.45), fragments[2].group.opacity(0, 0.45),
    frame.opacity(0.45, 0.6), chatTitle.opacity(1, 0.6), incoming.opacity(0.65, 0.6),
    message.group.position([-340, -95], 0.85, easeInOutCubic),
    message.content.fontSize(44, 0.85), message.label.opacity(0, 0.4),
    action.opacity(1, 0.6),
  );
  traces.remove();

  yield* waitUntil('produce-data');
  yield* replaceText(action, 'cevap yazıp\ngönderiyorsun.');
  const reply = text('', 40, {position: [-340, 170]});
  const outgoing = new Rect({position: [40, 55], size: [660, 100], radius: 12, stroke: accent, lineWidth: 2, opacity: 0});
  const sent = text('gönderildi', 25, {position: [190, 125], fill: accent, opacity: 0});
  conversation.add([outgoing, reply, sent]);
  yield* all(composer.opacity(0.5, 0.4), sendButton.opacity(1, 0.4));
  yield* reply.text('tamam, bekliyorum.', 1.1);
  yield* sendButton.opacity(0.55, 0.15);
  yield* all(
    sendButton.opacity(1, 0.2), outgoing.opacity(1, 0.5),
    reply.position([-250, 55], 0.8, easeInOutCubic),
  );
  yield* all(sent.opacity(1, 0.35), composer.opacity(0, 0.35), sendButton.opacity(0, 0.35));

  yield* waitUntil('intensive-question');
  yield* all(
    action.opacity(0, 0.4), underline.opacity(0, 0.4),
    intensiveWord.x(322, 0.65, easeOutCubic), intensiveWord.opacity(1, 0.65),
    opening.y(-340, 0.8, easeInOutCubic), opening.scale(0.6, 0.8),
    conversation.position([350, 90], 0.8), conversation.scale(0.87, 0.8),
  );
  action.remove();
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
    composer.opacity(0, 0.3), sendButton.opacity(0, 0.3), sent.opacity(0, 0.3),
    incoming.position([0, -150], 0.7), incoming.size([750, 60], 0.7),
    message.group.position([-340, -150], 0.7), message.content.fontSize(34, 0.7),
    outgoing.position([0, -80], 0.7), outgoing.size([750, 60], 0.7),
    reply.position([-340, -80], 0.7), reply.fontSize(34, 0.7), historyCount.opacity(1, 0.5),
  );
  chatTitle.text('mesaj geçmişi');
  const extraMessages = [
    'konumu paylaştım.', 'gördüm, teşekkürler.', 'ana girişteyim.', 'yaklaşınca haber veririm.',
  ].map((value, index) => {
    const row = new Rect({
      position: [0, index * 70 + 4], size: [750, 60], radius: 10,
      stroke: index % 2 === 0 ? accent : foreground, lineWidth: 2, opacity: 0,
    });
    row.add(text(value, 34, {x: -340}));
    conversation.add(row);
    return row;
  });
  for (const [index, row] of extraMessages.entries()) {
    yield* all(row.opacity(0.8, 0.35), row.y(index * 70 - 10, 0.35, easeOutCubic));
    historyCount.text(`${index + 3} mesaj`);
  }

  yield* waitUntil('query-rate');
  yield* replaceText(question, 'saniyede daha çok\nistek gelirse?');
  const requests = new Layout({opacity: 0});
  const app = new Rect({position: [-590, 235], size: [360, 140], radius: 12, stroke: foreground, lineWidth: 2});
  app.add(text('konuşmayı aç', 34, {offset: [0, 0]}));
  const requestLabel = text('istek', 27, {position: [-330, 185], fill: accent});
  const requestPath = new Line({points: [[-405, 235], [-35, 235]], stroke: accent, lineWidth: 2, endArrow: true});
  const pulse = new Rect({position: [-395, 235], size: [24, 12], radius: 3, fill: accent, opacity: 0});
  requests.add([app, requestPath, requestLabel, pulse]);
  view.add(requests);
  yield* requests.opacity(1, 0.4);
  for (const pause of [0.8, 0.45, 0.15, 0, 0]) {
    yield* waitFor(pause);
    pulse.position([-395, 235]);
    pulse.opacity(1);
    yield* pulse.x(-40, 0.5);
    pulse.opacity(0);
    yield* frame.opacity(0.75, 0.12).to(0.45, 0.12);
  }

  yield* waitUntil('changes');
  yield* replaceText(question, 'bu arada data\ndeğişmeye devam ediyor.');
  yield* all(
    requests.opacity(0, 0.4), historyCount.opacity(0, 0.4),
    ...extraMessages.map(row => row.opacity(0, 0.4)),
    outgoing.opacity(0, 0.4), reply.opacity(0, 0.4),
    incoming.position([0, -50], 0.7), incoming.size([750, 110], 0.7),
    message.group.position([-340, -50], 0.7), message.content.fontSize(42, 0.7),
  );
  requests.remove();
  historyCount.remove();
  for (const row of extraMessages) row.remove();
  chatTitle.text('deniz aynı mesajı düzenliyor');
  const editStatus = text('düzenleniyor…', 26, {position: [-340, 40], fill: accent});
  conversation.add(editStatus);
  yield* all(message.content.text('on dakika gecikeceğim.', 0.95), incoming.stroke(accent, 0.5));
  editStatus.text('düzenlendi');

  yield* waitUntil('concurrency');
  yield* question.opacity(0, 0.2);
  question.text('biri değiştirirken diğeri açarsa?');
  question.y(-185);
  const otherView = new Layout({position: [435, 135], opacity: 0});
  const otherFrame = new Rect({size: [700, 350], radius: 14, stroke: foreground, lineWidth: 2, opacity: 0.45});
  const otherTitle = text('sen konuşmayı açıyorsun', 28, {position: [-305, -130]});
  const otherMessage = text('mesaj getiriliyor…', 38, {position: [-305, 0], lineHeight: '130%'});
  const otherStatus = text('read', 26, {position: [-305, 120], fill: accent});
  otherView.add([otherFrame, otherTitle, otherMessage, otherStatus]);
  view.add(otherView);
  yield* all(
    question.opacity(1, 0.4), conversation.position([-390, 135], 0.85, easeInOutCubic),
    conversation.scale(0.82, 0.85), frame.height(427, 0.85), chatTitle.y(-158, 0.85),
    otherView.opacity(1, 0.7),
  );
  chatTitle.text('deniz mesajı düzenliyor');
  editStatus.text('write');
  editStatus.y(146);
  yield* all(
    message.content.text('beş dakika gecikeceğim.', 1.1),
    otherFrame.stroke(accent, 1.1),
  );
  yield* replaceText(otherMessage, 'önceki hâli mi,\nyeni hâli mi?');

  yield* waitUntil('failures');
  yield* replaceText(question, 'yanıt gelmedi. mesaj kaydedildi mi?');
  yield* all(
    conversation.position([-515, 135], 0.8), conversation.scale(0.68, 0.8),
    otherView.position([515, 135], 0.8), otherView.scale(0.81, 0.8),
    incoming.opacity(0, 0.35), message.group.opacity(0, 0.35), editStatus.opacity(0, 0.35),
  );
  chatTitle.text('sen mesaj gönderiyorsun');
  outgoing.position([0, -35]);
  outgoing.size([750, 110]);
  reply.position([-340, -35]);
  reply.fontSize(44);
  reply.text('tamam, haber ver.');
  sent.position([-340, 100]);
  sent.text('gönderiliyor…');
  otherTitle.text('mesaj servisi');
  otherMessage.text('tamam, haber ver.');
  otherMessage.fontSize(36);
  otherStatus.text('write isteği');
  otherFrame.stroke(foreground);
  const delivery = new Layout({opacity: 0});
  const sendPath = new Line({points: [[-220, 70], [215, 70]], stroke: accent, lineWidth: 2, endArrow: true});
  const returnPath = new Line({points: [[220, 180], [-215, 180]], stroke: foreground, lineWidth: 2, endArrow: true});
  const sendLabel = text('gönder', 26, {position: [-45, 30], fill: accent});
  const returnLabel = text('yanıt', 26, {position: [-30, 225]});
  const packet = new Rect({position: [-215, 70], size: [26, 14], radius: 3, fill: accent});
  const interruption = text('×', 56, {position: [0, 180], offset: [0, 0], fill: accent, opacity: 0});
  delivery.add([sendPath, returnPath, sendLabel, returnLabel, packet, interruption]);
  view.add(delivery);
  yield* all(outgoing.opacity(1, 0.4), reply.opacity(1, 0.4), sent.opacity(1, 0.4), delivery.opacity(1, 0.4));
  yield* packet.x(215, 0.85);
  packet.position([215, 180]);
  yield* packet.x(20, 0.65);
  yield* all(packet.opacity(0, 0.2), interruption.opacity(1, 0.25), returnPath.opacity(0.25, 0.25));
  sent.text('yanıt alınamadı');
  returnLabel.text('yanıt ulaşmadı');
  returnLabel.x(-85);

  yield* waitUntil('availability');
  yield* replaceText(question, 'peki, konuşmayı açabiliyor muyuz?');
  chatTitle.text('sen konuşmayı açıyorsun');
  reply.text('konuşma yükleniyor…');
  reply.fontSize(42);
  sent.text('bekleniyor…');
  otherMessage.text('cevap yok');
  otherStatus.text('hizmete ulaşılamıyor');
  sendLabel.text('aç');
  sendLabel.x(-15);
  interruption.position([0, 70]);
  interruption.opacity(0);
  returnLabel.opacity(0);
  returnPath.opacity(0);
  packet.position([-215, 70]);
  packet.opacity(1);
  yield* all(packet.x(-20, 0.85), otherView.opacity(0.5, 0.85));
  yield* all(packet.opacity(0, 0.2), interruption.opacity(1, 0.25), sendPath.opacity(0.25, 0.25));
  reply.text('konuşma yüklenemedi.');
  sent.text('şu an cevap alamıyoruz');

  yield* waitUntil('compute-intensive');
  yield* all(
    conversation.opacity(0, 0.6), otherView.opacity(0, 0.6), delivery.opacity(0, 0.6),
    opening.opacity(0, 0.6), question.opacity(0, 0.45),
  );
  conversation.remove();
  otherView.remove();
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
