import {Layout, makeScene2D, Node, Path, Txt} from '@motion-canvas/2d';
import {createRef, waitUntil} from '@motion-canvas/core';
import {loadFonts} from '../../../../../common/fonts';
import {theme} from '../../theme';

export default makeScene2D(function* (view) {
  yield loadFonts();

  view.fill(theme.colors.background);
  view.fontFamily(theme.fontFamily.sans);
  view.fontWeight(400);

  const chapter = createRef<Txt>();
  const brush = createRef<Layout>();
  const operational = createRef<Txt>();
  const versus = createRef<Txt>();
  const analytical = createRef<Txt>();
  const topicLeft = 249.6;
  const topicTop = 852.2;
  const topicGap = 17.28;
  const topicStyle = {
    fontSize: 74.88,
    lineHeight: '120%',
    letterSpacing: -1.4976,
    fill: theme.colors.foreground,
  } as const;
  const versusLeft = () => topicLeft + operational().width() + topicGap;
  const analyticalLeft = () => versusLeft() + versus().width() + topicGap;

  view.add(
    <Node position={[-960, -540]}>
      <Txt
        ref={chapter}
        offset={[-1, -1]}
        position={[153.6, 115.2]}
        text={'chapter 1'}
        fill={theme.colors.foreground}
        fontSize={55.2}
        lineHeight={'125%'}
      />
      <Txt
        offset={[-1, -1]}
        position={() => [153.6 + chapter().width() + 4.416, 115.2]}
        text={'.'}
        fill={theme.colors.accent}
        fontSize={55.2}
        lineHeight={'125%'}
      />
      <Layout
        layout
        offset={[-1, -1]}
        position={[153.6, 303.36]}
        alignItems={'baseline'}
        fontSize={261.12}
        fontWeight={500}
        lineHeight={'100%'}
        letterSpacing={-14.3616}
      >
        <Txt text={'trade-'} fill={theme.colors.foreground} />
        <Layout
          ref={brush}
          layout
          padding={[0, 21.12, 7.68, 11.52]}
          marginLeft={7.68}
          rotation={-3}
        >
          <Node
            position={() => [-brush().width() / 2 - 19.2, -brush().height() / 2 - 15.36]}
            scale={() => [(brush().width() + 53.76) / 380, (brush().height() + 46.08) / 170]}
          >
            <Path
              layout={false}
              fill={theme.colors.accent}
              data={'M17 22Q93 9 174 15T363 14L357 21 371 25 358 30 368 35 358 41 369 46 359 58 370 62 363 77 369 85 359 96 367 105 358 117 365 125 354 134 360 143Q264 157 170 153T15 151L21 143 11 138 19 128 12 120 20 109 10 99 17 90 11 79 19 65 10 55 18 44 12 32Z'}
            />
            <Path
              layout={false}
              fill={theme.colors.background}
              data={'M18 26Q99 18 139 22L77 25 21 29ZM164 20L244 18 252 20 187 23ZM22 141L84 146 61 148 20 143ZM157 148Q234 143 343 145L343 148 258 149 197 151ZM13 49L46 48 21 51ZM345 72L371 70 370 73 352 75ZM18 113L40 114 19 116ZM283 16L343 12 340 15 311 18ZM82 31L117 29 102 31ZM224 139L281 137 274 139ZM16 131L43 132 29 134Z'}
            />
          </Node>
          <Txt text={'offs'} fill={theme.colors.background} />
        </Layout>
      </Layout>
      <Txt
        offset={[-1, -1]}
        position={[172.8, 618.24]}
        text={'in data systems'}
        fill={theme.colors.foreground}
        fontFamily={theme.fontFamily.serif}
        fontStyle={'italic'}
        fontSize={105.6}
        lineHeight={'100%'}
        letterSpacing={-3.696}
      />
      <Path
        position={[153.6, 739.2]}
        scale={[76.8 / 44, 136.32 / 78]}
        data={'M16 4C8 21 6 43 13 57C18 67 27 67 38 66'}
        stroke={theme.colors.accent}
        lineWidth={2.7}
        lineCap={'round'}
      />
      <Txt
        {...topicStyle}
        ref={operational}
        offset={[-1, -1]}
        position={[topicLeft, topicTop]}
        text={'operational'}
      />
      <Txt
        {...topicStyle}
        ref={versus}
        position={() => [versusLeft() + versus().width() / 2, 835.2 + versus().height() / 2 - 9.6]}
        text={'vs.'}
        fill={theme.colors.accent}
        fontFamily={theme.fontFamily.serif}
        fontStyle={'italic'}
        fontSize={92.16}
        rotation={-10}
      />
      <Txt
        {...topicStyle}
        ref={analytical}
        offset={[-1, -1]}
        position={() => [analyticalLeft(), topicTop]}
        text={'analytical'}
      />
      <Txt
        {...topicStyle}
        offset={[-1, -1]}
        position={() => [analyticalLeft() + analytical().width() + 26.88, topicTop]}
        text={'systems'}
      />
    </Node>,
  );

  yield* waitUntil('start-video');
});
