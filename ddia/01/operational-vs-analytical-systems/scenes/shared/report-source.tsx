import { Layout } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, muted, text } from './drawing';
import { monthlyChart } from './workloads';

export function salesReportSource() {
  const root = new Layout({});
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([-560, 75]);
  warehouse.root.scale(1.55);
  warehouse.caption.fontSize(24);
  warehouse.root.add([
    text('sales', 31, { y: -2, fill: accent, fontFamily: theme.fontFamily.mono }),
    text('ocak 2026', 22, { y: 60, fontFamily: theme.fontFamily.mono }),
  ]);
  const report = monthlyChart([640, 480]);
  report.root.position([420, 75]);
  const result = cartoonArrow('s13-warehouse-report', [-317, 75], [41, 75], accent);
  const caption = text('satış raporu', 29, { position: [420, 318], fill: muted });
  root.add([warehouse.root, result.root, report.root, caption]);
  return { root, warehouse, report, result, caption };
}
