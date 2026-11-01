import { Txt } from '@motion-canvas/2d';
import { theme } from '../../theme';

export { loadFonts } from '../../../../../common/fonts';
export { cartoonArrow } from '../../../../../common/cartoon-arrow';
export { cartoonDatabase, cartoonService } from '../../../../../common/cartoon-system';
export { text, paper, banana } from '../../scenes/shared/drawing';
export const { background, foreground, accent, muted } = theme.colors;

// Portrait compositions keep the title and diagram inside the phone's central area.
export function heading(before: string, emphasis = '', after = '') {
  return new Txt({
    position: [-440, -725],
    offset: [-1, -1],
    width: 880,
    fontFamily: theme.fontFamily.sans,
    fontSize: 66,
    lineHeight: 82,
    fontWeight: 500,
    fill: foreground,
    // v3.17 forwards CSS white-space values but omits pre-wrap from its type.
    textWrap: 'pre-wrap' as 'pre',
    textAlign: 'left',
    ...(emphasis
      ? {
          children: [
            new Txt({ text: before }),
            new Txt({ text: emphasis, fill: accent, fontStyle: 'italic' }),
            new Txt({ text: after }),
          ],
        }
      : { text: before }),
  });
}
