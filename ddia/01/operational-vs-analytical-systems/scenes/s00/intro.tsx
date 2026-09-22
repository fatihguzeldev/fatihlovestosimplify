import {Layout, makeScene2D, Txt} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {theme} from '../../theme';

// Preview hold; set the final duration when the narration is ready.
const previewHoldSeconds = 3;

export default makeScene2D(function* (view) {
  yield loadFonts();

  view.fill(theme.colors.background);
  view.fontFamily(theme.fontFamily.sans);
  view.fontWeight(400);

  view.add(
    <Layout
      layout
      width={theme.intro.width}
      direction={'column'}
      alignItems={'start'}
      textAlign={'left'}
    >
      <Txt
        text={'chapter 1'}
        fill={theme.colors.accent}
        fontSize={theme.intro.chapterFontSize}
        lineHeight={theme.intro.chapterLineHeight}
      />
      <Txt
        text={'trade-offs\nin data systems'}
        textWrap={'pre'}
        fill={theme.colors.foreground}
        marginTop={theme.intro.chapterGap}
        fontSize={theme.intro.titleFontSize}
        fontWeight={500}
        lineHeight={theme.intro.titleLineHeight}
        letterSpacing={theme.intro.titleLetterSpacing}
      />
      <Txt
        text={'operational vs. analytical systems'}
        fill={theme.colors.foreground}
        marginTop={theme.intro.topicGap}
        fontSize={theme.intro.topicFontSize}
        lineHeight={theme.intro.topicLineHeight}
      />
    </Layout>,
  );

  yield* waitFor(previewHoldSeconds);
});
