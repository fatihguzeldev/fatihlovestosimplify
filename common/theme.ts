export const theme = {
  fontFamily: {
    sans: 'IBM Plex Sans',
    mono: 'IBM Plex Mono',
  },
  colors: {
    background: '#0b0b0b',
    foreground: '#f5f5f5',
    muted: '#a0a0a0',
    blue: '#7db4ff',
    amber: '#ffd166',
  },
  // Starting sizes for the 1920×1080 canvas; refine with the actual scenes.
  fontSize: {
    title: 96,
    body: 48,
    label: 36,
    code: 36,
  },
  // Percent of canvas width: use vw in HTML, value * view.width() / 100 in scenes.
  // These are optional spacing choices; each layout can use its own values.
  spacing: {
    xs: 0.5,
    s: 1,
    m: 2,
    l: 4,
    xl: 8,
  },
  underlineThickness: 0.32, // Percent of canvas width, like spacing.
} as const;
