import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import {
  accent,
  background,
  cartoonArrow,
  cartoonDatabase,
  heading,
  loadFonts,
  muted,
  text,
} from '../../shared/drawing';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('satışın ', 'asıl kaydı.');
  const source = cartoonDatabase('sales database', accent);
  source.root.position([0, -255]);
  source.root.scale(1.55);
  source.caption.fontSize(27);
  source.root.add([
    text('#1042', 25, { y: -4, fontFamily: 'IBM Plex Mono', fill: muted }),
    text('185₺', 42, { y: 53, fontFamily: 'IBM Plex Mono', fill: accent }),
  ]);
  const authority = text('esas aldığımız kayıt', 35, { position: [0, -490], fill: accent });
  const role = text('system of record', 38, {
    position: [0, 18],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  const warehouse = cartoonDatabase('warehouse · kopya', accent);
  warehouse.root.position([0, 375]);
  warehouse.root.scale(1.55);
  warehouse.caption.fontSize(27);
  warehouse.root.opacity(0);
  warehouse.root.add(text('#1042', 25, { y: -4, fontFamily: 'IBM Plex Mono', fill: muted }));
  const copied = text('180₺', 42, { y: 53, fontFamily: 'IBM Plex Mono' });
  warehouse.root.add(copied);
  const repair = cartoonArrow('short-authority-repair', [0, 70], [0, 173], accent, 0);
  const repairLabel = text('kaynağa göre düzelt', 29, {
    position: [-80, 118],
    offset: [1, 0],
    opacity: 0,
  });
  const caution = new Layout({ opacity: 0 });
  caution.add([
    text('asıl kayıt, hatasız kayıt demek değil.', 40, {
      position: [0, 720],
      width: 830,
      textWrap: true,
      lineHeight: 53,
      textAlign: 'center',
      fill: accent,
    }),
  ]);
  view.add([
    title,
    source.root,
    authority,
    role,
    warehouse.root,
    repair.root,
    repairLabel,
    caution,
  ]);
  yield loadFonts();

  yield* waitUntil('name');
  yield* role.opacity(1, 0.3);
  yield* waitUntil('conflict');
  title.children(heading('aynı satış, ', 'iki farklı tutar.').children());
  yield* warehouse.root.opacity(1, 0.4);
  yield* waitUntil('choose-source');
  yield* all(source.top.stroke(accent, 0.3), authority.scale(1.04, 0.2).to(1, 0.25));
  yield* waitUntil('repair');
  title.children(heading('kopyayı ', 'bu kayda göre', ' düzeltiyoruz.').children());
  yield* all(repair.reveal(1, 0.3), repairLabel.opacity(1, 0.3));
  yield* repair.travel(0.7);
  yield* repair.arrive();
  yield* waitUntil('repaired');
  copied.text('185₺');
  yield* copied.fill(accent, 0.3);
  yield* waitUntil('caution');
  title.children(heading('ilk kaydı da ', 'yanlış girmiş olabiliriz.').children());
  yield* all(caution.opacity(1, 0.4), repair.root.opacity(0.3, 0.3), repairLabel.opacity(0.3, 0.3));
  yield* waitUntil('end');
});
