import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  loadFonts,
  muted,
  paper,
  text,
} from '../../shared/drawing';

export default makeScene2D(function* (view) {
  view.fill(background);
  const flag = paper(820, 180, '#17232f');
  flag.root.position([0, -670]);
  flag.root.add([
    text('analiz sonucu · müşteri #17', 30, { y: -44, fill: muted }),
    text('inceleme bekliyor', 44, { y: 30, fill: accent }),
  ]);
  const warehouse = paper(820, 310);
  warehouse.root.position([0, -300]);
  const storedFlag = text('—', 45, { y: 69, fill: accent });
  warehouse.root.add([
    text('warehouse · review_flags', 34, { y: -103, fill: muted }),
    text('customer #17', 43, { y: -21 }),
    storedFlag,
  ]);
  const crm = paper(820, 430);
  crm.root.position([0, 430]);
  crm.root.opacity(0);
  const status = text('—', 45, { y: 21, fill: muted });
  const action = paper(470, 76, '#182638');
  action.root.position([0, 135]);
  action.root.opacity(0);
  action.root.add(text('incelemeyi aç', 36, { fill: accent }));
  crm.root.add([
    text('CRM · customer #17', 39, { y: -142 }),
    text('inceleme durumu', 31, { y: -63, fill: muted }),
    status,
    action.root,
  ]);
  const transfer = cartoonArrow('reverse-etl-portrait', [0, -110], [0, 175], accent, 0);
  const label = text('reverse ETL', 39, {
    position: [255, 30],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const journey = new Layout({});
  journey.add([warehouse.root, transfer.root, crm.root, label]);
  const workScreen = text('inceleme ekibinin çalışma ekranı', 30, {
    position: [0, 735],
    fill: muted,
    opacity: 0,
  });
  view.add([flag.root, journey, workScreen]);
  yield loadFonts();

  yield* waitUntil('store');
  storedFlag.text('inceleme bekliyor');
  yield* warehouse.face.stroke(accent, 0.25).to('#f5f5f5', 0.4);
  yield* waitUntil('crm');
  yield* all(crm.root.opacity(1, 0.4), workScreen.opacity(1, 0.4), flag.root.opacity(0.35, 0.4));
  yield* waitUntil('transfer');
  yield* transfer.reveal(1, 0.4);
  yield* transfer.travel(1);
  yield* transfer.arrive();
  yield* waitUntil('result');
  status.text('inceleme bekliyor');
  yield* all(status.fill(accent, 0.3), crm.face.stroke(accent, 0.3));
  yield* waitUntil('action');
  yield* action.root.opacity(1, 0.35);
  yield* waitUntil('reverse-etl');
  yield* label.opacity(1, 0.4);
  yield* waitUntil('end');
});
