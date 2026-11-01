import { makeScene2D } from '@motion-canvas/2d';
import { all, easeInOutCubic, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { createRoom } from './room';

export default makeScene2D(function* (view) {
  yield loadFonts();
  view.fill('#282a2d');
  const { root: room, browser } = createRoom();
  view.add(room);
  // Keep the accepted room reveal; the spoken introduction owns its duration.
  room.scale(2.04);
  room.position([0, 274]);
  browser.title.opacity(0);
  yield* waitUntil('reveal-room');
  yield* all(room.scale(1, 3.85, easeInOutCubic), room.position([0, 0], 3.85, easeInOutCubic));
  yield* waitUntil('prepare-relapse');
  // Settle before "Karşınızda", then reveal the page title on the spoken name.
  const zoomDuration = 2.15;
  yield* all(
    room.scale(2.04, zoomDuration, easeInOutCubic),
    room.position([0, 274], zoomDuration, easeInOutCubic),
  );
  yield* waitUntil('reveal-relapse');
  yield* browser.title.opacity(1, 0.28);
  // This exact crop is the first image of 01; the final word's decay stays in audio.
  yield* waitUntil('end');
});
