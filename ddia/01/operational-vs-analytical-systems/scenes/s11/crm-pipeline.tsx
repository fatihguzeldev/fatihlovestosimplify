import { Layout, Path } from '@motion-canvas/2d';
import { cartoonArrow } from '../../../../../common/cartoon-arrow';
import { cartoonDatabase, cartoonService } from '../../../../../common/cartoon-system';
import { theme } from '../../theme';
import { accent, foreground, muted, paper, text } from '../shared/drawing';

export function crmPipeline() {
  const root = new Layout({});
  const crm = paper(330, 260, '#101315');
  crm.root.position([-645, 95]);
  const api = text('API', 56, { y: 20, fill: accent, fontFamily: theme.fontFamily.mono });
  crm.root.add([
    text('external CRM', 29, { y: -87 }),
    new Path({ data: 'M -129 -44 L 129 -44', stroke: foreground, lineWidth: 1.5, opacity: 0.4 }),
    api,
    text('customers', 23, { y: 84, fill: muted, fontFamily: theme.fontFamily.mono }),
  ]);
  const connector = cartoonService('connector', accent);
  connector.root.position([0, 95]);
  const warehouse = cartoonDatabase('data warehouse', accent);
  warehouse.root.position([645, 95]);
  warehouse.root.scale(1.22);
  warehouse.caption.fontSize(25);
  const customers = text('customers', 25, {
    y: 15,
    fill: accent,
    fontFamily: theme.fontFamily.mono,
    opacity: 0,
  });
  warehouse.root.add(customers);
  const request = cartoonArrow('crm-connector-request', [-185, 17], [-435, 17], accent, 0);
  const response = cartoonArrow('crm-connector-response', [-435, 177], [-185, 177], accent, 0);
  const load = cartoonArrow('crm-connector-load', [190, 95], [465, 95], accent, 0);
  const labels = new Layout({});
  labels.add([
    text('getCustomers()', 23, {
      position: [-310, -67],
      fontFamily: theme.fontFamily.mono,
      opacity: () => request.reveal(),
    }),
    text('records', 25, { position: [-310, 267], fill: muted, opacity: () => response.reveal() }),
    text('load', 28, { position: [327, 12], opacity: () => load.reveal() }),
  ]);
  root.add([
    crm.root,
    connector.root,
    warehouse.root,
    request.root,
    response.root,
    load.root,
    labels,
  ]);
  return { root, crm, api, connector, warehouse, customers, request, response, load };
}
