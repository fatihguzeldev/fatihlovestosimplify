import { theme } from '../../theme';
import { accent, heading, muted, paper, text } from './drawing';

export function missingRecordIntro() {
  const title = heading('bu kez ', 'eksik bir kayıt', ' geliyor.');
  title.position([0, -245]);
  title.offset([0, 0]);
  title.fontSize(72);

  const record = paper(400, 280, '#101315');
  record.root.position([0, 100]);
  record.root.scale(1.35);
  const missing = text('null', 29, {
    position: [110, -9],
    offset: [1, 0],
    fill: accent,
    fontFamily: theme.fontFamily.mono,
  });
  record.root.add([
    text('#1047', 39, {
      position: [-150, -87],
      offset: [-1, 0],
      fontFamily: theme.fontFamily.mono,
    }),
    text('store_id', 25, {
      position: [-150, -9],
      offset: [-1, 0],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    missing,
    text('amount', 25, {
      position: [-150, 56],
      offset: [-1, 0],
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
    text('90', 29, { position: [110, 56], offset: [1, 0], fontFamily: theme.fontFamily.mono }),
  ]);
  return { title, record, missing };
}
