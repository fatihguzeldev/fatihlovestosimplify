import { theme } from '../../theme';
import { accent, heading, muted, paper, text } from './drawing';

export function reviewOutput() {
  const title = heading('bu uyarı ', 'ekibe nasıl ulaşacak?');
  const result = paper(600, 260, '#17232f');
  result.root.position([0, 75]);
  result.root.add([
    text('inceleme bekliyor', 43, { y: -24, fill: accent }),
    text('customer #17 · 3 başarısız deneme', 25, {
      y: 56,
      fill: muted,
      fontFamily: theme.fontFamily.mono,
    }),
  ]);
  return { title, result };
}
