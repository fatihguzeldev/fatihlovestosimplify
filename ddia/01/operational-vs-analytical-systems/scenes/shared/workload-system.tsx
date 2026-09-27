import { Layout } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, text } from './drawing';
import { createMarket } from './market';
import { monthlyChart } from './workloads';

export function workloadSystem() {
  const root = new Layout({});
  const market = createMarket();
  market.root.position([-620, 75]);
  market.root.scale(0.6);
  market.cart.remove();
  market.receipt.opacity(1);
  market.status.text('preparing');
  market.label.opacity(0);
  const database = cartoonDatabase('sales database', accent);
  database.root.position([0, 75]);
  database.root.scale(1.12);
  const orders = text('orders', 28, { y: -7, fontFamily: theme.fontFamily.mono });
  const sales = text('sales', 28, { y: 57, fontFamily: theme.fontFamily.mono });
  database.root.add([orders, sales]);
  const chart = monthlyChart([640, 480]);
  chart.bars.forEach(({ bar, value }) => {
    bar.height(0);
    value.opacity(0);
    value.y(() => 110 - bar.height() - 28);
  });
  chart.root.position([620, 75]);
  chart.root.scale(0.63);
  const order = cartoonArrow('workloads-order-request', [-385, 75], [-170, 75], accent);
  const query = cartoonArrow('workloads-january-query', [375, 75], [170, 75], accent);
  const orderLabel = text('getOrder(1042)', 21, {
    position: order.pointAt(0.5).addY(-79),
    fontFamily: theme.fontFamily.mono,
  });
  const queryLabel = text('SUM(amount)', 23, {
    position: query.pointAt(0.5).addY(-79),
    fontFamily: theme.fontFamily.mono,
  });
  const context = new Layout({});
  context.add([
    market.root,
    chart.root,
    order.root,
    query.root,
    orderLabel,
    queryLabel,
    text('siparişin durumu', 30, { position: [-620, -126] }),
    text('ocak satışları', 30, { position: [620, -126] }),
  ]);
  root.add([context, database.root]);
  return {
    root,
    context,
    market,
    database,
    orders,
    sales,
    chart,
    order,
    query,
    orderLabel,
    queryLabel,
  };
}
