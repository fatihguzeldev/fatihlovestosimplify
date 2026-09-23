import {Layout, makeScene2D, Txt} from '@motion-canvas/2d';
import {waitUntil} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {theme} from '../../theme';

export default makeScene2D(function* (view) {
  yield loadFonts();

  view.fill(theme.colors.background);
  view.fontFamily(theme.fontFamily.sans);
  view.fontWeight(400);

  view.add(
    <Layout
      layout
      width={1612.8}
      direction={'column'}
      alignItems={'start'}
      textAlign={'left'}
    >
      <Txt
        text={'chapter 1'}
        fill={theme.colors.accent}
        fontSize={55.68}
        lineHeight={'130%'}
      />
      <Txt
        text={'trade-offs\nin data systems'}
        textWrap={'pre'}
        fill={theme.colors.foreground}
        marginTop={24.96}
        fontSize={157.44}
        fontWeight={500}
        lineHeight={'105.5%'}
        letterSpacing={-5.5104}
      />
      <Txt
        text={'operational vs. analytical systems'}
        fill={theme.colors.foreground}
        marginTop={80.64}
        fontSize={71.04}
        lineHeight={'125%'}
      />
    </Layout>,
  );

  yield* waitUntil('start-video');
});
