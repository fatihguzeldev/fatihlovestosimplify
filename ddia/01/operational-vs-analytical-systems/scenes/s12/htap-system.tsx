import { Layout, Path, Rect } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, background, foreground, muted, paper, text } from '../shared/drawing';

function records(label: string, x: number) {
  const root = new Layout({ position: [x, 280] });
  const selection = new Rect({
    size: [376, 40],
    y: -48,
    radius: 5,
    fill: '#182638',
    stroke: accent,
    lineWidth: 2,
    opacity: 0,
  });
  root.add([text(label, 30, { y: -113, fill: accent, fontStyle: 'italic' }), selection]);
  const statuses = ['shipped', 'preparing', 'created'].map((status, index) => {
    const y = -48 + index * 48;
    const value = text(status, 25, {
      position: [-44, y],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
    });
    root.add([
      text(String(1041 + index), 25, {
        position: [-166, y],
        offset: [-1, 0],
        fontFamily: theme.fontFamily.mono,
      }),
      value,
    ]);
    return value;
  });
  return { root, selection, statuses };
}

export function htapSystem() {
  const root = new Layout({ opacity: 0 });
  const application = paper(1480, 190, '#101315');
  application.root.position([0, -188]);
  const order = text('sipariş #1042', 31, { position: [-425, -4] });
  const orderResult = text('yanıt bekleniyor…', 29, {
    position: [-425, 49],
    fill: muted,
    fontFamily: theme.fontFamily.mono,
  });
  const countResult = text('hesaplanıyor…', 29, {
    position: [425, 49],
    fill: muted,
    fontFamily: theme.fontFamily.mono,
  });
  application.root.add([
    new Path({
      data: 'M -702 -73 L -680 -74 L -678 -52 Q -691 -49 -704 -52 Z M -698 -73 C -699 -91 -684 -91 -684 -73',
      stroke: accent,
      lineWidth: 2.5,
      lineCap: 'round',
      lineJoin: 'round',
    }),
    text('market', 25, { position: [-660, -64], offset: [-1, 0], fontWeight: 500 }),
    text('aynı uygulama', 23, { position: [704, -64], offset: [1, 0], fill: muted }),
    new Path({
      data: 'M -739 -39 Q 0 -37 738 -39 M 0 -19 Q -2 25 0 72',
      stroke: foreground,
      lineWidth: 1.4,
      opacity: 0.25,
    }),
    order,
    orderResult,
    text('kaç sipariş hazırlanıyor?', 31, { position: [425, -4] }),
    countResult,
  ]);
  const body = paper(1480, 380);
  body.root.position([0, 230]);
  const oltp = records('OLTP', -425);
  const analytics = records('analytics', 425);
  const transfer = cartoonArrow('s12-internal-change', [0, 0], [535, 0], accent, 0);
  transfer.root.position([-193, 280]);
  transfer.root.scale(0.72);
  const internals = new Layout({ opacity: 0 });
  const scanLabel = text('kayıtları tara ve say', 24, { position: [425, 384], fill: muted });
  const tally = text('COUNT → 0', 27, {
    position: [425, 384],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  internals.add([
    oltp.root,
    analytics.root,
    transfer.root,
    tally,
    text('değişiklik aktarılır', 24, {
      position: [0, 217],
      fill: muted,
      opacity: () => transfer.reveal(),
    }),
    text('kaydı güncelle', 24, { position: [-425, 384], fill: muted }),
    scanLabel,
  ]);
  const doors = [-1, 1].map(
    (side) =>
      new Rect({
        position: [side * 736, 230],
        offset: [side, 0],
        size: [737, 372],
        fill: background,
      }),
  );
  const name = text('HTAP', 100, {
    position: [0, 208],
    fontFamily: theme.fontFamily.mono,
    fill: accent,
  });
  const expanded = text('hybrid transactional / analytical processing', 30, {
    position: [0, 302],
    fill: muted,
  });
  const facade = new Layout({ opacity: 0 });
  facade.add([
    new Path({
      data: 'M -699 129 Q 0 127 698 130',
      stroke: foreground,
      lineWidth: 1.8,
      opacity: 0.4,
    }),
    text('ortak arayüz', 28, { position: [0, 88] }),
  ]);
  const requests = [-425, 425].map((x, index) => {
    const arrow = cartoonArrow(`s12-application-request-${index}`, [0, 0], [0, 177], accent, 0);
    arrow.root.position([x, -77]);
    arrow.root.scale(0.57);
    return arrow;
  });
  const responses = [-425, 425].map((x, index) => {
    const arrow = cartoonArrow(`s12-application-response-${index}`, [0, 0], [0, -177], accent, 0);
    arrow.root.position([x, 24]);
    arrow.root.scale(0.57);
    return arrow;
  });
  const operations = ['read', 'count'].map((label, index) =>
    text(label, 25, {
      position: [-425 + index * 850 + 72, -27],
      offset: [-1, 0],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
  );
  root.add([
    body.root,
    internals,
    ...doors,
    name,
    expanded,
    facade,
    application.root,
    ...requests.map((arrow) => arrow.root),
    ...responses.map((arrow) => arrow.root),
    ...operations,
  ]);
  return {
    root,
    application,
    order,
    orderResult,
    countResult,
    internals,
    oltp,
    analytics,
    transfer,
    tally,
    scanLabel,
    doors,
    name,
    expanded,
    facade,
    requests,
    responses,
    operations,
  };
}

export function htapLandscape() {
  const root = new Layout({ opacity: 0 });
  const local = paper(420, 240, '#101315');
  local.root.position([-570, -116]);
  local.root.add([
    text('HTAP', 43, { y: -74, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('OLTP', 25, { position: [-103, 5] }),
    text('analytics', 25, { position: [96, 5] }),
    new Path({
      data: 'M -177 -32 Q 0 -29 175 -32 M -11 -9 L -10 84',
      stroke: foreground,
      lineWidth: 1.5,
      opacity: 0.3,
    }),
    ...[-145, 49].flatMap((x) =>
      [40, 58, 76].map(
        (y) =>
          new Path({
            data: `M ${x} ${y} Q ${x + 40} ${y - 1} ${x + 83} ${y}`,
            stroke: accent,
            lineWidth: 3,
            lineCap: 'round',
            opacity: 0.65,
          }),
      ),
    ),
  ]);
  const inventory = cartoonDatabase('inventory database', accent);
  inventory.root.position([0, -116]);
  inventory.root.scale(0.95);
  inventory.root.add(text('stock', 30, { y: 8, fontFamily: theme.fontFamily.mono }));
  const stores = cartoonDatabase('store database', accent);
  stores.root.position([570, -116]);
  stores.root.scale(0.95);
  stores.root.add([
    text('store A', 29, { y: -10, fontFamily: theme.fontFamily.mono }),
    text('Marmara', 27, { y: 44, fill: accent, fontFamily: theme.fontFamily.mono }),
  ]);
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([0, 306]);
  warehouse.root.scale(0.91);
  warehouse.root.opacity(0);
  const combined = new Layout({ opacity: 0 });
  combined.add([
    text('satışlar', 26, { y: -16, fill: accent }),
    text('stoklar', 26, { y: 22, fill: accent }),
    text('bölgeler', 26, { y: 60, fill: accent }),
  ]);
  warehouse.root.add(combined);
  const routes = [
    [
      [-520, 119],
      [-132, 288],
    ],
    [
      [0, 119],
      [0, 189],
    ],
    [
      [520, 119],
      [132, 288],
    ],
  ].map(([from, to], index) => {
    const scale = index === 1 ? 0.48 : 0.62;
    const arrow = cartoonArrow(
      `s12-combine-source-${index}`,
      [0, 0],
      [(to[0] - from[0]) / scale, (to[1] - from[1]) / scale],
      accent,
      0,
    );
    arrow.root.position([from[0], from[1]]);
    arrow.root.scale(scale);
    return arrow;
  });
  root.add([
    local.root,
    text('satış uygulaması', 28, { position: [-570, 31] }),
    inventory.root,
    stores.root,
    ...['siparişler ve satışlar', 'stoklar', 'mağazalar ve bölgeler'].map((label, index) =>
      text(label, 27, { position: [-570 + index * 570, 83], fill: accent }),
    ),
    warehouse.root,
    ...routes.map((arrow) => arrow.root),
  ]);
  return { root, local, warehouse, combined, routes };
}
