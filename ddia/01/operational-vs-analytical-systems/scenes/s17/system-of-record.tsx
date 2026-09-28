import { Layout, makeScene2D, Path, Txt } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase, cartoonService } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, heading, muted, paper, text } from '../shared/drawing';
import { recordAndModel } from '../shared/record-and-model';
import { recordChain } from '../shared/record-chain';
import { bookContents } from '../shared/book-contents';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('satışın ', 'asıl kaydı hangisi?');
  const previous = recordAndModel();
  previous.modelBranch.opacity(0.3);
  view.add([title, previous.root]);
  yield loadFonts();
  yield* waitUntil('part');
  yield* all(title.opacity(0, 0.2), previous.root.opacity(0, 0.4));
  previous.root.remove();
  yield* bookContents(view, 'warehousing', 'records');
  const card = new Layout({ opacity: 0 });
  const first = text('asıl kayıt ve ', 104, { position: [-806, -35], offset: [-1, 0] });
  const second = text('türevleri.', 104, {
    position: () => [-806 + first.width() + 24, -35],
    offset: [-1, 0],
    fill: accent,
    fontStyle: 'italic',
    fontWeight: 500,
  });
  const line = new Path({
    data: () => `M 2 0 Q ${second.width() * 0.45} 10 ${second.width() - 4} 1`,
    position: () => second.position().addY(78),
    stroke: accent,
    lineWidth: 5,
    lineCap: 'round',
    end: 0,
  });
  line.opacity(() => (line.end() > 0 ? 1 : 0));
  card.add([first, second, line]);
  view.add(card);
  yield* card.opacity(1, 0.4);
  yield* line.end(1, 0.65);
  yield* waitUntil('first-write');
  yield* card.opacity(0, 0.4);
  card.remove();
  title.children(heading('ilk write’ı ', 'hatırlayalım.').children());
  const original = new Layout({ opacity: 0 });
  const service = cartoonService('order service', accent);
  service.root.position([-505, 35]);
  service.root.scale(1.45);
  const database = cartoonDatabase('sales database', accent);
  database.root.position([465, 35]);
  database.root.scale(1.45);
  const record = new Layout({});
  const recordId = text('#1042', 32, { y: -6, fontFamily: theme.fontFamily.mono, opacity: 0 });
  const recordAmount = text('amount: 185', 23, {
    y: 55,
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  record.add([recordId, recordAmount]);
  database.root.add(record);
  const write = cartoonArrow('s17-original-write-recall', [-244, 35], [249, 35], accent, 0);
  const authority = text('authoritative', 42, {
    position: [465, 350],
    fill: accent,
    fontStyle: 'italic',
    opacity: 0,
  });
  original.add([
    service.root,
    database.root,
    write.root,
    authority,
    text('saveOrder()', 31, {
      position: [0, -72],
      fontFamily: theme.fontFamily.mono,
      opacity: () => write.reveal(),
    }),
  ]);
  view.add(original);
  yield* all(title.opacity(1, 0.3), original.opacity(1, 0.5));
  yield* waitUntil('narration-start');
  yield* waitUntil('write-request');
  yield* write.reveal(1, 0.35);
  yield* write.travel(0.9);
  yield* write.arrive();
  yield* waitUntil('write-record');
  yield* recordId.opacity(1, 0.3);
  yield* waitUntil('write-amount');
  yield* recordAmount.opacity(1, 0.3);
  yield* waitUntil('authority');
  yield* title.opacity(0, 0.2);
  title.children(heading('bu satışın ', 'asıl kaydı', ' burada.').children());
  yield* all(title.opacity(1, 0.3), authority.opacity(1, 0.4), database.top.stroke(accent, 0.3));
  yield* waitUntil('system-of-record');
  yield* authority.opacity(0, 0.2);
  authority.text('system of record');
  yield* authority.opacity(1, 0.3);
  yield* waitUntil('conflict');
  yield* all(title.opacity(0, 0.2), original.opacity(0, 0.4));
  original.remove();
  title.children(heading('çelişirlerse ', 'hangisini esas alacağız?').children());
  const pair = new Layout({ opacity: 0 });
  const pairCards = ['sales database', 'warehouse'].map((name, i) => {
    const surface = paper(570, 280, i === 0 ? '#17232f' : '#101315');
    surface.root.position([-415 + i * 830, 50]);
    const value = text(`#1042 · amount: ${i === 0 ? 185 : 180}`, 31, {
      y: -5,
      opacity: 0,
      fontFamily: theme.fontFamily.mono,
    });
    surface.root.add([
      text(name, 31, { y: -91 }),
      value,
      text(i === 0 ? 'esas aldığımız kayıt' : 'ondan ürettiğimiz görünüm', 28, {
        y: 83,
        fill: i === 0 ? accent : muted,
      }),
    ]);
    pair.add(surface.root);
    return { ...surface, value };
  });
  const repair = cartoonArrow('s17-reconcile-from-authority', [-95, 50], [95, 50], accent, 0);
  pair.add(repair.root);
  const caution = text('hatalı girilen bir tutarı yine bizim düzeltmemiz gerekir.', 31, {
    position: [0, 326],
    fill: muted,
    opacity: 0,
  });
  pair.add(caution);
  view.add(pair);
  yield* all(title.opacity(1, 0.3), pair.opacity(1, 0.5));
  yield* waitUntil('conflict-source');
  yield* pairCards[0].value.opacity(1, 0.3);
  yield* waitUntil('conflict-copy');
  yield* pairCards[1].value.opacity(1, 0.3);
  yield* waitUntil('choose-source');
  yield* all(title.opacity(0, 0.2), pairCards[0].face.stroke(accent, 0.3));
  title.children(heading('bu satış için ', 'sales database’i', ' esas alıyoruz.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('repair');
  yield* repair.reveal(1, 0.35);
  yield* repair.travel(0.8);
  yield* repair.arrive();
  yield* waitUntil('repaired');
  pairCards[1].value.text('#1042 · amount: 185');
  yield* pairCards[1].value.fill(accent, 0.25);
  yield* waitUntil('source-error');
  yield* title.opacity(0, 0.2);
  title.children(heading('asıl kayıttaki bilgi de ', 'hatalı olabilir.').children());
  yield* all(title.opacity(1, 0.3), caution.opacity(1, 0.4));
  yield* waitUntil('authority-summary');
  yield* all(title.opacity(0, 0.2), caution.opacity(0, 0.3));
  title.children(heading('diğer kopyalar için ', 'bu kaydı esas alıyoruz.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('scope');
  yield* all(title.opacity(0, 0.2), pair.opacity(0, 0.4));
  pair.remove();
  title.children(heading('hangi veri için ', 'hangi sistemi', ' esas alıyoruz?').children());
  const scopes = new Layout({ opacity: 0 });
  const scopeEntries = ['sales database', 'inventory database'].map((name, i) => {
    const db = cartoonDatabase(name, accent);
    db.root.position([-415 + i * 830, 5]);
    db.root.scale(1.45);
    const contents = new Layout({ opacity: 0 });
    contents.add([
      text(i === 0 ? 'sales' : 'stock', 29, { y: -4, fontFamily: theme.fontFamily.mono }),
      text(i === 0 ? '#1042 · 185₺' : 'muz · 42 kg', 23, { y: 54, fill: accent }),
    ]);
    db.root.add(contents);
    const label = text(i === 0 ? 'satış tutarı' : 'stok miktarı', 39, {
      position: [-415 + i * 830, 295],
      fill: accent,
      opacity: 0,
    });
    scopes.add([db.root, label]);
    return { contents, label };
  });
  view.add(scopes);
  yield* all(title.opacity(1, 0.3), scopes.opacity(1, 0.5));
  yield* waitUntil('scope-sales');
  yield* all(scopeEntries[0].contents.opacity(1, 0.3), scopeEntries[0].label.opacity(1, 0.3));
  yield* waitUntil('scope-stock');
  yield* all(scopeEntries[1].contents.opacity(1, 0.3), scopeEntries[1].label.opacity(1, 0.3));
  yield* waitUntil('scope-role');
  yield* title.opacity(0, 0.2);
  title.children(heading('system of record ', 'bir rolü tanımlıyor.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('upstream');
  yield* all(title.opacity(0, 0.2), scopes.opacity(0, 0.4));
  scopes.remove();
  const chain = recordChain('record-lineage');
  chain.root.opacity(0);
  chain.source.root.opacity(0.25);
  chain.records[0].root.opacity(0.25);
  chain.records[0].role.opacity(0);
  chain.records[2].amount.opacity(0);
  chain.copy.reveal(0);
  chain.transform.reveal(0);
  view.add(chain.root);
  title.children(heading('warehouse veriyi ', 'lake’ten alıyor.').children());
  const distinction = new Txt({
    position: [0, 449],
    fontFamily: theme.fontFamily.sans,
    fontSize: 31,
    fill: muted,
    opacity: 0,
    textWrap: false,
    children: [
      new Txt({ text: 'upstream olmak ' }),
      new Txt({ text: '!=', fill: accent, fontFamily: theme.fontFamily.mono }),
      new Txt({ text: ' asıl kayıt olmak' }),
    ],
  });
  view.add(distinction);
  yield* all(title.opacity(1, 0.3), chain.root.opacity(1, 0.5));
  yield* waitUntil('upstream-load');
  yield* chain.transform.reveal(1, 0.3);
  yield* chain.transform.travel(0.8);
  yield* all(chain.transform.arrive(), chain.records[2].amount.opacity(1, 0.3));
  yield* waitUntil('upstream-name');
  yield* title.opacity(0, 0.2);
  title.children(heading('lake warehouse’un ', 'upstream kaynağı.').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('source-copy');
  yield* all(chain.source.root.opacity(1, 0.3), chain.records[0].root.opacity(1, 0.3));
  yield* chain.copy.reveal(1, 0.3);
  yield* chain.copy.travel(0.8);
  yield* chain.copy.arrive();
  yield* waitUntil('source-authority');
  yield* title.opacity(0, 0.2);
  title.children(heading('asıl satış kaydı ', 'sales database’de.').children());
  yield* all(title.opacity(1, 0.3), chain.records[0].role.opacity(1, 0.4));
  yield* chain.records[0].face.stroke(accent, 0.25).to(foreground, 0.35);
  yield* waitUntil('distinction');
  yield* title.opacity(0, 0.2);
  title.children(heading('lake bir sonraki adımın ', 'input’u.').children());
  yield* all(title.opacity(1, 0.3), distinction.opacity(1, 0.4));
  yield* waitUntil('lineage');
  yield* chain.copy.travel(0.65);
  yield* chain.copy.arrive();
  yield* chain.transform.travel(0.65);
  yield* chain.transform.arrive();
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.2), distinction.opacity(0, 0.3));
  title.children(heading('bu kayıttan ', 'neler türetiyoruz?').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('end');
});
