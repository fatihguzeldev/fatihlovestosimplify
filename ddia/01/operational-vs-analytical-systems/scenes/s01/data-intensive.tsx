import {Layout, Line, makeScene2D, Rect, Txt, type TxtProps} from '@motion-canvas/2d';
import {
  all,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  fadeTransition,
  sequence,
  waitUntil,
} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {theme} from '../../theme';

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
  opening.add([englishMask, turkishMask, underline]);
  view.add(opening);

  yield* fadeTransition(0.7);
  yield* waitUntil('translate');
  yield* wipe(width + maskPadding * 2, 1.15, easeInOutCubic);
  englishMask.remove();

  yield* waitUntil('focus-data');
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
    {kind: 'ölçüm', value: '22 °C', x: 55, y: 230},
  ].map(({kind, value, x, y}) => {
    const group = new Layout({position: [x, y + 18], opacity: 0});
    const label = text(kind, 30, {y: -52, fill: accent});
    const content = text(value, 55, {
      fontFamily: kind === 'mesaj' ? theme.fontFamily.sans : theme.fontFamily.mono,
    });
    group.add([label, content]);
    traces.add(group);
    return {group, y};
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
  const reading = text('okumak', 48, {position: [left, 185], opacity: 0});
  const readLine = new Line({
    points: [[-10, -190], [-215, -190], [-215, 185], [-460, 185]],
    radius: 30,
    stroke: accent,
    lineWidth: 3,
    endArrow: true,
    end: 0,
  });
  const readCopy = text('birazdan oradayım.', 40, {
    position: [20, -190], opacity: 0,
  });
  view.add([readLine, reading, readCopy]);
  yield* all(reading.opacity(1, 0.4), readLine.end(1, 0.9));
  yield* all(readCopy.opacity(1, 0.2), readCopy.position([left, 260], 1, easeInOutCubic));

  yield* waitUntil('produce-data');
  yield* all(readLine.opacity(0, 0.4), readCopy.opacity(0, 0.4));
  readLine.remove();
  readCopy.remove();
  yield* replaceText(reading, 'üretmek');
  const newMessage = text('geldim.', 55, {position: [left, 265], opacity: 0});
  view.add(newMessage);
  yield* newMessage.opacity(1, 0.5);
  yield* newMessage.position([20, -95], 1, easeInOutCubic);

  yield* waitUntil('intensive-question');
  yield* all(
    traces.opacity(0, 0.55), newMessage.opacity(0, 0.55),
    reading.opacity(0, 0.4), underline.opacity(0, 0.4),
    intensiveWord.x(322, 0.65, easeOutCubic), intensiveWord.opacity(1, 0.65),
  );
  traces.remove();
  newMessage.remove();
  reading.remove();

  const question = text('ne zaman?', 64, {position: [left, 180], opacity: 0});
  view.add(question);
  yield* question.opacity(1, 0.5);

  yield* waitUntil('volume');
  yield* all(opening.y(-320, 0.8, easeInOutCubic), opening.scale(0.6, 0.8));
  yield* all(question.y(-180, 0.6), question.opacity(0, 0.5));
  question.text('çok data?');
  question.y(-130);
  yield* question.opacity(1, 0.4);

  const workload = new Layout({});
  const records = Array.from({length: 24}, (_, index) => {
    const record = new Line({
      points: [[0, 0], [155, 0]],
      position: [65 + index % 4 * 175, -60 + Math.floor(index / 4) * 58],
      stroke: foreground,
      lineWidth: 9,
      lineCap: 'round',
      end: 0,
    });
    workload.add(record);
    return record;
  });
  view.add(workload);
  yield* sequence(0.07, ...records.map(record => record.end(1, 0.32)));

  yield* waitUntil('query-rate');
  yield* replaceText(question, 'daha sık erişim?');
  const requests = Array.from({length: 3}, (_, index) => new Line({
    points: [[-360, -30 + index * 100], [10, -30 + index * 100]],
    stroke: accent,
    lineWidth: 3,
    endArrow: true,
    start: 0,
    end: 0,
  }));
  workload.add(requests);
  for (let pass = 0; pass < 3; pass++) {
    for (const request of requests) {
      request.start(0);
      request.end(0);
    }
    yield* sequence(0.14, ...requests.map(request => request.end(1, 0.45)));
    yield* all(...requests.map(request => request.start(1, 0.35)));
  }

  yield* waitUntil('changes');
  yield* all(...records.map(record => record.opacity(0, 0.4)));
  workload.removeChildren();
  const value = text('22 °C', 130, {
    position: [90, 85], fontFamily: theme.fontFamily.mono, opacity: 0,
  });
  const valueLabel = text('aynı ölçüm noktası', 32, {position: [90, -25], fill: accent, opacity: 0});
  workload.add([value, valueLabel]);
  yield* replaceText(question, 'data değişiyor.');
  yield* all(value.opacity(1, 0.5), valueLabel.opacity(1, 0.5));
  yield* value.fill(accent, 0.35);
  yield* value.text('23 °C', 0.65);
  yield* value.fill(foreground, 0.5);

  yield* waitUntil('concurrency');
  yield* replaceText(question, 'aynı anda.');
  const read = new Line({
    points: [[-305, -15], [35, 60]],
    stroke: accent, lineWidth: 3, endArrow: true, end: 0,
  });
  const write = new Line({
    points: [[-305, 190], [35, 115]],
    stroke: foreground, lineWidth: 3, endArrow: true, end: 0,
  });
  const readLabel = text('read', 36, {position: [-450, -25], opacity: 0});
  const writeLabel = text('write', 36, {position: [-450, 195], opacity: 0});
  workload.add([read, write, readLabel, writeLabel]);
  yield* all(read.end(1, 0.75), write.end(1, 0.75), readLabel.opacity(1, 0.4), writeLabel.opacity(1, 0.4));

  yield* waitUntil('failures');
  yield* replaceText(question, 'bir şeyler bozulunca?');
  const breakMask = new Rect({position: [-140, 20], width: 74, height: 95, fill: background, opacity: 0});
  const consistency = text('consistency', 46, {position: [90, 265], fill: accent, opacity: 0});
  workload.add([breakMask, consistency]);
  yield* all(breakMask.opacity(1, 0.3), consistency.opacity(1, 0.5));
  const doubt = text('?', 58, {position: [-160, 18], fill: accent, opacity: 0});
  workload.add(doubt);
  yield* doubt.opacity(1, 0.4);

  yield* waitUntil('availability');
  yield* replaceText(question, 'erişebiliyor muyuz?');
  yield* replaceText(consistency, 'availability');

  yield* waitUntil('compute-intensive');
  yield* all(workload.opacity(0, 0.6), opening.opacity(0, 0.6), question.opacity(0, 0.45));
  workload.remove();
  opening.remove();
  question.remove();

  const comparison = new Layout({});
  const computeTitle = text('compute-intensive', 100, {position: [left, -265], fontWeight: 500});
  const computeCaption = text('büyük bir computation', 44, {position: [left, -120]});
  const calculation = new Rect({position: [0, 115], size: [760, 160], lineWidth: 2, stroke: foreground});
  calculation.add(text('computation', 50, {offset: [0, 0]}));
  comparison.add([computeTitle, computeCaption, calculation]);
  comparison.opacity(0);
  view.add(comparison);
  yield* comparison.opacity(1, 0.6);

  yield* waitUntil('parallel-computation');
  yield* calculation.opacity(0, 0.35);
  calculation.remove();
  const pieces = Array.from({length: 4}, (_, index) => {
    const piece = new Rect({
      position: [0, 115], size: [220, 160],
      lineWidth: 2, stroke: accent, opacity: 0,
    });
    piece.add(text(`parça ${index + 1}`, 35, {offset: [0, 0]}));
    comparison.add(piece);
    return piece;
  });
  yield* all(...pieces.map((piece, index) => all(
    piece.opacity(1, 0.5), piece.x(-465 + index * 310, 0.9, easeInOutCubic),
  )));
  yield* replaceText(computeCaption, 'paralel çalıştırmak');
  const progress = pieces.map(piece => {
    const line = new Line({
      points: [[-90, 48], [90, 48]],
      stroke: accent, lineWidth: 5, end: 0,
    });
    piece.add(line);
    return line;
  });
  yield* all(...progress.map(line => line.end(1, 1.4)));

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
  const closingCaption = text('data’yı yönetmek.', 68, {y: 160});
  const closingUnderline = new Line({
    points: [[0, 213], [170, 211], [354, 215], [550, 210]],
    stroke: accent, lineWidth: 6, lineCap: 'round', end: 0,
  });
  const qualifier = text('başlıca mühendislik zorluklarından biri', 36, {y: 280, opacity: 0});
  closing.add([closingTitle, closingCaption, closingUnderline, qualifier]);
  view.add(closing);
  yield* closing.opacity(1, 0.7);
  yield* all(closingUnderline.end(1, 0.75), qualifier.opacity(1, 0.6));

  yield* waitUntil('building-blocks');
  yield* all(closingTitle.opacity(0, 0.5), closingUnderline.opacity(0, 0.5), qualifier.opacity(0, 0.5));
  yield* all(closingCaption.y(0, 0.65, easeInOutCubic), closingCaption.fontSize(86, 0.65));
  yield* replaceText(closingCaption, 'peki, nasıl?');
  yield* waitUntil('end');
});
