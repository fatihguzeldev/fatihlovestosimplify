import { theme as commonTheme } from '../../common/theme';

export const theme = {
  ...commonTheme,
  colors: {
    ...commonTheme.colors,
    accent: '#7db4ff',
  },
} as const;
