import { Img, makeScene2D } from '@motion-canvas/2d';
import {
  all,
  createSignal,
  delay,
  easeInOutCubic,
  useScene,
  useTransition,
  waitUntil,
} from '@motion-canvas/core';
import { theme } from '../../../../../common/theme';
import artwork from './the-end.png';

export default makeScene2D(function* (view) {
  view.add(<Img src={artwork} size={() => view.size()} />);

  const size = useScene().getRealSize();
  const center = size.scale(0.5);
  const radius = Math.hypot(center.x, center.y) + 1;
  const closing = createSignal(1);
  const opening = createSignal(0);

  const clipCircle = (context: CanvasRenderingContext2D, progress: number) => {
    context.beginPath();
    context.arc(center.x, center.y, radius * progress, 0, Math.PI * 2);
    context.clip();
  };

  // Keep the outgoing scene above the black matte while its iris closes.
  const finishTransition = useTransition(
    (context) => {
      context.fillStyle = theme.colors.background;
      context.fillRect(0, 0, size.x, size.y);
      clipCircle(context, opening());
    },
    (context) => clipCircle(context, closing()),
    true,
  );

  yield* all(closing(0, 0.6, easeInOutCubic), delay(0.5, opening(1, 0.95, easeInOutCubic)));
  finishTransition();

  yield* waitUntil('narration-start');
  yield* waitUntil('end');
});
