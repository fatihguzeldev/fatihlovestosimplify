import {theme as baseTheme} from '../../common/theme';
import chapterColors from './theme.json';

export const theme = {
  ...baseTheme,
  colors: {...baseTheme.colors, ...chapterColors},
} as const;
