import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
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
  const title = heading('uyarı hazır.\n', 'ekip nereden görecek?');
  const warehouse = paper(820, 310);
  warehouse.root.position([0, -300]);
  warehouse.root.add([
    text('warehouse · review_flags', 34, { y: -103, fill: muted }),
    text('customer #17', 43, { y: -21 }),
    text('inceleme bekliyor', 45, { y: 69, fill: accent }),
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
  view.add([title, journey]);
  yield loadFonts();

  yield* waitUntil('store');
  yield* warehouse.face.stroke(accent, 0.25).to('#f5f5f5', 0.4);
  yield* waitUntil('crm');
  title.children(heading('inceleme ekibi\n', 'CRM’i kullanıyor.').children());
  yield* crm.root.opacity(1, 0.4);
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
  title.children(heading('hazırladığımız veri,\n', 'günlük işe dönüyor.').children());
  yield* label.opacity(1, 0.4);
  yield* waitUntil('return');
  yield* all(transfer.travel(1.2), journey.y(-15, 0.6, easeInOutCubic));
  yield* transfer.arrive();
  yield* waitUntil('end');
});
