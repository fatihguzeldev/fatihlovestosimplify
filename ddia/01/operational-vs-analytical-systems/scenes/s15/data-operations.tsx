import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, paper, text } from '../shared/drawing';
import { lakeConsumers } from '../shared/lake-system';
import { missingRecordIntro } from '../shared/missing-record';
import { reviewOutput } from '../shared/review-output';
import { batchAndStream } from './batch-and-stream';
import { accessExample } from './access';

export default makeScene2D(function* (view) {
  view.fill(background);
  const { title, record: input } = missingRecordIntro();
  view.add([title, input.root]);
  yield loadFonts();
  yield* waitUntil('invalid');
  yield* title.opacity(0, 0.2);
  title.children(heading('bu kaydın ', 'mağazası eksik.').children());
  title.position([-806, -370]);
  title.offset([-1, 0]);
  title.fontSize(56);
  const quality = new Layout({});
  const processing = new Layout({ opacity: 0 });
  const validate = paper(280, 160, '#101315');
  validate.root.position([0, 70]);
  validate.root.add([
    text('validate', 35, { y: -22, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('store_id gerekli', 24, { y: 35 }),
  ]);
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([600, -111]);
  warehouse.root.scale(0.88);
  warehouse.caption.fontSize(31);
  const review = paper(400, 148, '#182638');
  review.root.position([600, 266]);
  review.root.opacity(0);
  review.root.add([
    text('needs review', 30, { y: -33, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('#1047 · store_id: null', 24, { y: 28, fontFamily: theme.fontFamily.mono }),
  ]);
  const read = cartoonArrow('s15-validate-new-record', [-350, 70], [-185, 70], accent, 0);
  const accepted = cartoonArrow('s15-only-valid-records', [190, 44], [456, -103], accent, 0);
  const rejected = cartoonArrow('s15-record-needs-review', [190, 102], [354, 248], accent, 0);
  accepted.root.opacity(0.27);
  const sourceLabel = text('lake’ten gelen yeni kayıt', 27, {
    position: [-600, -140],
    fill: muted,
  });
  const fresh = text('şubat 2026', 25, { position: [-600, 286], fill: muted });
  processing.add([
    validate.root,
    warehouse.root,
    review.root,
    read.root,
    accepted.root,
    rejected.root,
    sourceLabel,
    fresh,
    text('geçerli kayıtlar', 25, {
      position: [271, -106],
      fill: muted,
      opacity: () => accepted.reveal(),
    }),
  ]);
  quality.add([input.root, processing]);
  view.add(quality);
  yield* all(
    title.opacity(1, 0.3),
    input.root.position([-600, 70], 0.75, easeInOutCubic),
    input.root.scale(1, 0.75, easeInOutCubic),
  );
  yield* processing.opacity(1, 0.45);
  yield* accepted.reveal(1, 0.3);
  yield* waitUntil('validation-read');
  yield* read.reveal(1, 0.3);
  yield* read.travel(0.65);
  yield* read.arrive();
  yield* waitUntil('invalid-record');
  yield* validate.face.stroke(accent, 0.2).to(foreground, 0.3);
  yield* waitUntil('review-record');
  yield* rejected.reveal(1, 0.35);
  yield* rejected.travel(0.7);
  yield* all(rejected.arrive(), review.root.opacity(1, 0.3));
  yield* waitUntil('incomplete');
  yield* title.opacity(0, 0.2);
  title.children(heading('ayırdık; ', 'rapora henüz katamadık.').children());
  const caveat = text('1 kayıt inceleme bekliyor.', 29, {
    position: [600, 410],
    fill: accent,
    opacity: 0,
  });
  quality.add(caveat);
  yield* all(title.opacity(1, 0.3), caveat.opacity(1, 0.3));
  yield* waitUntil('operations');
  yield* all(title.opacity(0, 0.2), quality.opacity(0, 0.4));
  quality.remove();
  const systems = lakeConsumers();
  systems.root.opacity(0);
  view.add(systems.root);
  title.children(heading('bu akışın ', 'sorumluluğu', ' bizde.').children());
  const tags = new Layout({});
  const accessTag = text('access', 29, {
    position: [-540, -255],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const qualityTag = text('quality', 29, {
    position: [115, -205],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const monitoringTag = text('monitoring', 29, {
    position: [650, -255],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const dataOps = text('DataOps', 29, {
    position: [0, 426],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  tags.add([accessTag, qualityTag, monitoringTag, dataOps]);
  view.add(tags);
  yield* all(title.opacity(1, 0.3), systems.root.opacity(1, 0.5));
  yield* waitUntil('monitoring');
  yield* all(qualityTag.opacity(1, 0.35), monitoringTag.opacity(1, 0.35));
  yield* waitUntil('data-ops');
  yield* dataOps.opacity(1, 0.35);
  yield* waitUntil('responsibility');
  yield* accessTag.opacity(1, 0.35);
  yield* waitUntil('privacy');
  yield* all(title.opacity(0, 0.2), systems.root.opacity(0, 0.4), tags.opacity(0, 0.3));
  systems.root.remove();
  tags.remove();
  const access = new Layout({});
  view.add(access);
  yield* accessExample(access, title);
  yield* waitUntil('usable');
  yield* title.opacity(0, 0.2);
  title.children(heading('sonucu ', 'ne zaman kullanabiliyoruz?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('batch');
  yield* all(title.opacity(0, 0.2), access.opacity(0, 0.4));
  access.remove();
  const timing = new Layout({});
  view.add(timing);
  yield* batchAndStream(timing, title);
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.2), timing.opacity(0, 0.4));
  timing.remove();
  const handoff = reviewOutput();
  title.children(handoff.title.children());
  const { result } = handoff;
  result.root.opacity(0);
  view.add(result.root);
  yield* all(title.opacity(1, 0.3), result.root.opacity(1, 0.5));
  yield* waitUntil('end');
});
