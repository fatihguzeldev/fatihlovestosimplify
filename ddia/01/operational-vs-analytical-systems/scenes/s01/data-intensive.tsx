import {Layout, Line, makeScene2D, Rect, Txt, type TxtProps} from '@motion-canvas/2d';
import {
  all,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  fadeTransition,
  waitUntil,
} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {theme} from '../../theme';
import {showCompute} from './compute';
import {createBubble, createPhone} from './phone';
import {showQueryRate} from './traffic';
import {cartoonArrow} from '../../../../../common/cartoon-arrow';

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

function questionParts(before: string, emphasis: string, after = '') {
  return [
    new Txt({text: before}),
    new Txt({text: emphasis, fill: accent, fontStyle: 'italic', fontWeight: 500}),
    new Txt({text: after}),
  ];
}

function* replaceQuestion(node: Txt, before: string, emphasis: string, after = '') {
  yield* node.opacity(0, 0.2);
  node.children(questionParts(before, emphasis, after));
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
  const incoming = createBubble('birazdan oradayım.', false, '14:32');
  incoming.root.position([-25, -135]);
  incoming.root.opacity(0);
  phone.chat.add(incoming.root);
  view.add(phone.root);
  yield* traces.opacity(0, 0.35);
  traces.remove();
  yield* all(
    phone.root.opacity(1, 0.65),
    phone.root.y(10, 0.95, easeOutCubic), phone.root.rotation(-3, 0.95),
  );
  incoming.root.scale(0.88);
  yield* all(
    incoming.root.opacity(1, 0.25), incoming.root.y(-153, 0.6, easeOutCubic),
    incoming.root.scale(1, 0.6, easeOutCubic),
  );

  yield* waitUntil('produce-data');
  const outgoing = createBubble('tamam, bekliyorum.', true, '14:33');
  phone.clock.text('14:33');
  outgoing.root.position([25, 145]);
  outgoing.root.opacity(0);
  outgoing.checks.opacity(0);
  phone.chat.add(outgoing.root);
  yield* phone.keyboardProgress(1, 0.55, easeInOutCubic);
  yield* phone.input.text('tamam, bekliyorum.', 1.15);
  yield* phone.send.scale(0.84, 0.12).to(1, 0.22);
  phone.input.text('');
  yield* all(
    outgoing.root.opacity(1, 0.25), outgoing.root.y(-71, 0.7, easeOutCubic),
    phone.keyboardProgress(0, 0.7, easeInOutCubic),
    phone.root.rotation(0, 0.8),
  );
  yield* outgoing.checks.opacity(1, 0.35);

  yield* waitUntil('intensive-question');
  underline.opacity(0);
  yield* all(
    intensiveWord.x(322, 0.65, easeOutCubic), intensiveWord.opacity(1, 0.65),
    opening.y(-340, 0.8, easeInOutCubic), opening.scale(0.6, 0.8),
    phone.root.position([430, 65], 0.8), phone.root.scale(0.82, 0.8),
  );
  const question = new Txt({
    position: [left, -85], offset: [-1, 0], fontFamily: theme.fontFamily.sans,
    fontSize: 50, fontWeight: 400, fill: foreground, textWrap: false,
    lineHeight: '125%', opacity: 0,
    children: questionParts('peki, ne zaman ', 'data-intensive', ' diyoruz?'),
  });
  view.add(question);
  yield* question.opacity(1, 0.5);

  yield* waitUntil('volume');
  yield* replaceQuestion(question, 'mesaj ', 'sayısı', ' arttığında mı?');
  const historyCount = text('2 mesaj', 38, {position: [0, 480], offset: [0, 0], fill: accent, opacity: 0});
  phone.root.add(historyCount);
  yield* historyCount.opacity(1, 0.5);
  const extraMessages = [
    'konumu paylaştım.', 'gördüm, teşekkürler.', 'ana girişteyim.', 'yaklaşınca haber veririm.',
  ].map((value, index) => {
    const bubble = createBubble(value, index % 2 === 0, `14:${34 + index}`);
    bubble.root.position([index % 2 === 0 ? 25 : -25, 11 + index * 82 + 18]);
    bubble.root.opacity(0);
    phone.chat.add(bubble.root);
    return bubble;
  });
  for (const [index, bubble] of extraMessages.entries()) {
    yield* all(bubble.root.opacity(1, 0.3), bubble.root.y(11 + index * 82, 0.4, easeOutCubic));
    historyCount.text(`${index + 3} mesaj`);
    phone.clock.text(`14:${34 + index}`);
  }

  yield* waitUntil('query-rate');
  yield* all(question.opacity(0, 0.2), historyCount.opacity(0, 0.3));
  historyCount.remove();
  question.children(questionParts('', 'query rate', ' arttığında mı?'));
  question.y(-285);
  yield* all(
    opening.y(-405, 0.8), opening.scale(0.45, 0.8),
    phone.root.position([-620, 145], 0.8), phone.root.scale(0.64, 0.8),
  );
  yield* question.opacity(1, 0.4);
  const traffic = yield* showQueryRate(view);
  const service = traffic.service;

  yield* waitUntil('changes');
  yield* all(traffic.root.opacity(0, 0.35), question.opacity(0, 0.2));
  service.remove();
  service.opacity(0);
  service.position([0, -15]);
  service.scale(0.47);
  view.add(service);
  traffic.root.remove();
  question.children(questionParts('gönderdiğimiz mesajı ', 'değiştirirsek?'));
  const writer = createPhone('fatih');
  writer.root.position([-620, 165]);
  writer.root.scale(0.64);
  writer.root.opacity(0);
  writer.clock.text('14:38');
  const edited = createBubble('birazdan oradayım.', true, '14:32');
  edited.root.position([25, -75]);
  writer.chat.add(edited.root);
  const editMode = text('mesajı düzenle', 23, {position: [-207, 277], fill: accent, opacity: 0});
  writer.screen.add(editMode);
  const names = new Layout({opacity: 0});
  names.add([
    text('deniz', 30, {position: [-620, -195], offset: [0, 0], fontFamily: theme.fontFamily.serif, fontStyle: 'italic'}),
    text('fatih', 30, {position: [620, -195], offset: [0, 0], fontFamily: theme.fontFamily.serif, fontStyle: 'italic'}),
  ]);
  const shared = new Layout({position: [0, 235], opacity: 0});
  const record = new Rect({size: [350, 150], radius: 20, fill: '#2a2e33', stroke: accent, lineWidth: 0});
  const storedText = text('birazdan\noradayım.', 32, {offset: [0, 0], y: -8, lineHeight: '115%'});
  const recordId = text('mesaj #42', 25, {offset: [0, 0], y: -105, fontFamily: theme.fontFamily.mono, fill: accent});
  const recordStamp = text('14:32', 18, {position: [145, 52], offset: [1, 0], fill: theme.colors.muted});
  shared.add([record, recordId, storedText, recordStamp]);
  const operations = new Layout({opacity: 0});
  const editPath = cartoonArrow('s01-edit', [-424, 95], [-207, 205], accent, 0);
  const editLabel = text('edit', 28, {position: [-340, 79], offset: [0, 0], fill: accent, opacity: 0});
  const readPath = cartoonArrow('s01-concurrent-read', [424, 95], [207, 205], accent, 0);
  const readLabel = text('read', 28, {position: [340, 79], offset: [0, 0], opacity: 0});
  operations.add([editPath.root, editLabel, readPath.root, readLabel]);
  view.add([writer.root, names, shared, operations]);
  yield* all(
    phone.root.position([620, 145], 0.8),
    ...extraMessages.map(bubble => bubble.root.opacity(0, 0.4)), outgoing.root.opacity(0, 0.4),
    incoming.root.y(-75, 0.7),
  );
  for (const bubble of extraMessages) bubble.root.remove();
  yield* all(writer.root.opacity(1, 0.45), writer.root.y(145, 0.45), phone.root.opacity(0.6, 0.45));
  yield* question.opacity(1, 0.3);
  yield* all(names.opacity(1, 0.3), service.opacity(1, 0.35), shared.opacity(1, 0.35), operations.opacity(1, 0.35));
  yield* editMode.opacity(1, 0.2);
  yield* writer.input.text('on dakika gecikeceğim.', 0.8);
  yield* writer.send.scale(0.84, 0.12).to(1, 0.18);
  writer.input.text('');
  yield* all(editPath.reveal(1, 0.3), editLabel.opacity(1, 0.3));
  yield* editPath.travel(0.55);
  storedText.text('on dakika\ngecikeceğim.');
  recordStamp.text('14:38');
  edited.text.text('on dakika gecikeceğim.');
  edited.stamp.text('düzenlendi · 14:38');
  yield* all(editPath.arrive(), record.lineWidth(3, 0.15).to(0, 0.3), editMode.opacity(0, 0.3));
  incoming.text.text('on dakika gecikeceğim.');
  incoming.stamp.text('düzenlendi · 14:38');
  phone.clock.text('14:38');
  yield* phone.root.opacity(1, 0.4);

  yield* waitUntil('concurrency');
  yield* replaceQuestion(question, 'fatih ', 'hangi halini', ' görecek?');
  writer.clock.text('14:39');
  phone.clock.text('14:39');
  yield* editMode.opacity(1, 0.15);
  yield* writer.input.text('beş dakika gecikeceğim.', 0.65);
  const readerLoading = text('yükleniyor…', 30, {position: [0, -75], offset: [0, 0], opacity: 0});
  phone.chat.add(readerLoading);
  yield* all(
    writer.send.scale(0.84, 0.12).to(1, 0.18),
    incoming.root.opacity(0, 0.2),
  );
  yield* all(
    readerLoading.opacity(1, 0.3),
    readPath.reveal(1, 0.3), readLabel.opacity(1, 0.3),
  );
  editMode.text('kaydediliyor…');
  yield* all(editPath.travel(0.7), readPath.travel(0.7));
  yield* all(editPath.arrive(), readPath.arrive(), record.height(230, 0.4), record.lineWidth(3, 0.4), storedText.y(-53, 0.4), recordId.y(-145, 0.4), recordStamp.y(95, 0.4));
  const pendingLabel = text('edit isteği', 20, {offset: [0, 0], y: 5, fill: accent, opacity: 0});
  const pendingText = text('beş dakika\ngecikeceğim.', 31, {offset: [0, 0], y: 53, lineHeight: '115%', fill: accent, opacity: 0});
  shared.add([pendingLabel, pendingText]);
  yield* all(pendingLabel.opacity(1, 0.4), pendingText.opacity(1, 0.4));

  yield* waitUntil('failures');
  yield* all(
    question.opacity(0, 0.2), service.opacity(0, 0.4),
    writer.root.opacity(0, 0.4), names.opacity(0, 0.4), shared.opacity(0, 0.4),
    operations.opacity(0, 0.4), readerLoading.opacity(0, 0.4),
  );
  question.children(questionParts('yanıt gelmedi. mesaj ', 'kaydedildi mi?'));
  readerLoading.remove();
  writer.root.remove();
  names.remove();
  shared.remove();
  operations.remove();
  service.position([530, 150]);
  service.scale(1);
  yield* all(phone.root.position([-620, 145], 0.8), incoming.root.opacity(0, 0.3));
  phone.clock.text('14:40');
  outgoing.root.position([25, -75]);
  outgoing.text.text('tamam, haber ver.');
  outgoing.stamp.text('14:40');
  outgoing.checks.opacity(0);
  yield* outgoing.root.opacity(1, 0.3);
  const delivery = new Layout({opacity: 0});
  const sendPath = cartoonArrow('s01-write', [-424, 90], [356, 90], accent);
  const returnPath = cartoonArrow('s01-response', [356, 215], [-424, 215], accent);
  const sendLabel = text('write', 26, {position: [10, 37], fill: accent});
  const returnLabel = text('yanıt', 26, {position: [20, 271]});
  const interruption = text('×', 56, {position: returnPath.pointAt(0.43), offset: [0, 0], fill: accent, opacity: 0});
  delivery.add([sendPath.root, returnPath.root, sendLabel, returnLabel, interruption]);
  view.add(delivery);
  yield* all(service.opacity(1, 0.5), delivery.opacity(1, 0.5));
  yield* sendPath.travel(0.85);
  yield* all(sendPath.arrive(), returnPath.travel(0.65, 0.43));
  yield* all(interruption.opacity(1, 0.25), returnPath.root.opacity(0.25, 0.25));
  returnLabel.text('yanıt ulaşmadı');
  returnLabel.x(-40);
  yield* question.opacity(1, 0.3);

  yield* waitUntil('availability');
  yield* all(question.opacity(0, 0.2), outgoing.root.opacity(0, 0.4));
  question.children(questionParts('sohbeti ', 'açamıyoruz.'));
  phone.status.text('bağlanıyor…');
  const reconnecting = text('bağlanıyor…', 30, {offset: [0, 0], opacity: 0});
  phone.chat.add(reconnecting);
  sendLabel.text('read');
  interruption.position(sendPath.pointAt(0.57));
  interruption.opacity(0);
  returnLabel.opacity(0);
  returnPath.root.opacity(0);
  yield* all(sendPath.travel(0.85, 0.57), service.opacity(0.35, 0.85), reconnecting.opacity(1, 0.5));
  yield* all(interruption.opacity(1, 0.25), sendPath.root.opacity(0.25, 0.25));
  yield* question.opacity(1, 0.3);

  yield* waitUntil('compute-intensive');
  yield* all(
    phone.root.opacity(0, 0.6), service.opacity(0, 0.6), delivery.opacity(0, 0.6),
    opening.opacity(0, 0.6), question.opacity(0, 0.45),
  );
  phone.root.remove();
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
  yield* all(closingTitle.opacity(0, 0.35), closingUnderline.opacity(0, 0.35));
  yield* all(
    closingCaption.y(0, 0.8, easeInOutCubic), closingCaption.fontSize(86, 0.8),
    closingData.fill(accent, 0.8),
  );
  yield* all(nextQuestion.opacity(1, 0.6), nextQuestion.y(130, 0.6, easeOutCubic));
  yield* waitUntil('end');
});
