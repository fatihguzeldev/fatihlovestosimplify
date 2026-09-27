import { Layout, makeScene2D, Txt } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitFor, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../../common/fonts';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { accent, background, foreground, heading, muted, text } from '../shared/drawing';
import { monthlyChart } from '../shared/workloads';
import { workloadSystem } from '../shared/workload-system';
import { money, newSale, sellerPanel } from './seller-panel';

export default makeScene2D(function* (view) {
  view.fill(background);
  const title = heading('bu analizi ', 'uygulamanın içinde', ' sunsak?');
  const previous = monthlyChart();
  previous.root.position([0, 80]);
  previous.root.scale(1.15);
  view.add([title, previous.root]);
  yield loadFonts();
  yield* waitUntil('product');
  const panel = sellerPanel();
  previous.root.remove();
  view.add([panel.root, previous.root]);
  yield* title.opacity(0, 0.25);
  title.children(heading('satış analizi ', 'satıcının ekranında.').children());
  yield* all(
    panel.chrome.opacity(1, 0.65),
    previous.root.position([240, 150], 0.9, easeInOutCubic),
    previous.root.scale(0.78, 0.9, easeInOutCubic),
    previous.root.findFirst((node) => node instanceof Txt).opacity(0, 0.5),
    title.opacity(1, 0.3),
  );
  previous.root.remove();
  panel.root.add(previous.root);
  previous.root.position([240, 70]);
  yield* panel.details.opacity(1, 0.4);

  yield* waitUntil('fresh');
  yield* title.opacity(0, 0.25);
  title.children(heading('bugünkü satışları ', 'buradan takip edelim.').children());
  yield* all(title.opacity(1, 0.3), panel.pointer.opacity(1, 0.25));
  yield* panel.pointer.position([433, -136], 0.6);
  yield* panel.pointer.scale(0.82, 0.12).to(1, 0.12);
  yield* all(previous.root.opacity(0, 0.3), panel.details.opacity(0, 0.3));
  previous.root.remove();
  panel.period.text('bugün');
  panel.total.text(() => money(panel.sum()));
  yield* all(
    panel.chart.opacity(1, 0.4),
    panel.details.opacity(1, 0.4),
    panel.period.fill(accent, 0.2).to(foreground, 0.3),
    panel.pointer.opacity(0, 0.25),
  );

  yield* waitUntil('read');
  yield* title.opacity(0, 0.25);
  title.children(heading('yeni satış da ', 'toplama yansısın.').children());
  const sale = newSale();
  const update = cartoonArrow('s08-new-sale', [-455, 101], [-283, 101], accent, 0);
  const freshness = new Layout({ opacity: 0 });
  freshness.add([
    text('verinin güncelliği', 31, { position: [0, 426], fill: accent, fontStyle: 'italic' }),
    text('yeni satış ne zaman sonuca yansıyor?', 26, { position: [0, 473], fill: muted }),
  ]);
  view.add([sale, update.root, freshness]);
  yield* all(
    title.opacity(1, 0.3),
    panel.root.position([245, 80], 0.65),
    panel.root.scale(0.9, 0.65),
    sale.opacity(1, 0.45),
  );
  yield* waitFor(0.7);
  yield* update.reveal(1, 0.35);
  yield* update.travel(0.65);
  yield* all(update.arrive(), panel.amounts[0](1385, 0.65, easeInOutCubic));
  yield* all(panel.updated.opacity(1, 0.3), freshness.opacity(1, 0.35));

  yield* waitUntil('latency');
  yield* all(
    title.opacity(0, 0.3),
    sale.opacity(0, 0.3),
    update.root.opacity(0, 0.3),
    freshness.opacity(0, 0.3),
  );
  sale.remove();
  update.root.remove();
  freshness.remove();
  title.children(heading('paneli açınca ', 'sonuç hemen gelsin.').children());
  yield* all(
    title.opacity(1, 0.3),
    panel.root.position([0, 80], 0.6),
    panel.root.scale(1, 0.6),
    panel.details.opacity(0, 0.25),
    panel.chart.opacity(0, 0.25),
    panel.updated.opacity(0, 0.25),
  );
  panel.nav.fill('#1b2530');
  panel.pointer.position([-78, -177]);
  const responseTime = new Layout({ opacity: 0 });
  responseTime.add([
    text('yanıt süresi', 31, { position: [0, 426], fill: accent, fontStyle: 'italic' }),
    text('paneli açınca sonucu ne kadar bekliyoruz?', 26, { position: [0, 473], fill: muted }),
  ]);
  view.add(responseTime);
  yield* panel.pointer.opacity(1, 0.25);
  yield* panel.pointer.position([-173, -229], 0.55);
  yield* panel.pointer.scale(0.82, 0.12).to(1, 0.12);
  panel.nav.fill('#182638');
  yield* panel.loading.opacity(1, 0.15);
  yield* waitFor(0.5);
  yield* panel.loading.opacity(0, 0.15);
  yield* all(panel.details.opacity(1, 0.3), panel.chart.opacity(1, 0.3));
  yield* all(panel.pointer.opacity(0, 0.25), responseTime.opacity(1, 0.35));

  yield* waitUntil('dimensions');
  yield* all(title.opacity(0, 0.3), responseTime.opacity(0, 0.3));
  responseTime.remove();
  title.children(heading('hem ', 'güncellik', ' hem hız gerekiyor.').children());
  const needs = new Layout({ opacity: 0 });
  for (const [i, label, detail] of [
    [0, 'güncel veri', 'yeni satış da hesaba katılır'],
    [1, 'hızlı yanıt', 'panel açılınca sonuç gelir'],
  ] as const) {
    const x = i ? 324 : -324;
    needs.add([
      text(label, 32, { position: [x, 426], fill: accent, fontStyle: 'italic' }),
      text(detail, 25, { position: [x, 473], fill: muted }),
    ]);
  }
  view.add(needs);
  yield* all(title.opacity(1, 0.3), needs.opacity(1, 0.4));
  yield* waitUntil('name');
  yield* title.opacity(0, 0.3);
  title.children(heading('', 'product / real-time analytics').children());
  yield* title.opacity(1, 0.3);
  yield* waitUntil('next');
  yield* all(title.opacity(0, 0.35), panel.root.opacity(0, 0.35), needs.opacity(0, 0.35));
  panel.root.remove();
  needs.remove();
  title.children(heading('bu işleri ', 'nerede çalıştıracağız?').children());
  const system = workloadSystem();
  system.root.opacity(0);
  view.add(system.root);
  yield* all(title.opacity(1, 0.3), system.root.opacity(1, 0.5));
  yield* waitUntil('end');
});
