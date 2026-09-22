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
  // Thumbnail sizes and gaps are percentages of the image width (vw in HTML).
  thumbnail: {
    paddingX: 8,
    paddingY: 5,
    chapterGap: 1.2,
    topicGap: 4.2,
    chapterFontSize: 3,
    titleFontSize: 11.2,
    topicFontSize: 4,
    titleLineHeight: 1.07,
    labelLineHeight: 1.3,
    titleLetterSpacing: -0.035, // em
    underlineThickness: 0.32,
    underlineOffset: 1,
  },
  // Intro dimensions are pixels on the 1920×1080 Motion Canvas stage.
  intro: {
    width: 1612.8,
    chapterFontSize: 55.68,
    titleFontSize: 157.44,
    topicFontSize: 71.04,
    chapterGap: 24.96,
    topicGap: 80.64,
    chapterLineHeight: '130%',
    titleLineHeight: '105.5%',
    topicLineHeight: '125%',
    titleLetterSpacing: -5.5104,
  },
} as const;
