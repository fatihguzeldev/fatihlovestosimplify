import {makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {fontFamily, loadFonts} from '../../../animations/fonts';
import {theme} from '../../../animations/theme';

export default makeScene2D(function* (view) {
  yield loadFonts();

  view.fill(theme.colors.background);
  view.fontFamily(fontFamily.sans);
  view.fontSize(theme.fontSize.body);
  view.fontWeight(400);

  // Empty stage for the next intro pass; this is not the final duration.
  yield* waitFor(1);
});
