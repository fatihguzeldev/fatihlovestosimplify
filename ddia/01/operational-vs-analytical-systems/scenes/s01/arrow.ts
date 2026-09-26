import {Layout, Path} from '@motion-canvas/2d';
import {Color, createSignal, linear, Vector2, type PossibleVector2} from '@motion-canvas/core';
import {theme} from '../../theme';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** The channel's C.2 arrow: outlined silhouette, ink hatching, traveling hatch wave. */
export function cartoonArrow(from: PossibleVector2, to: PossibleVector2, accent: string, end = 1) {
  const start = new Vector2(from);
  const delta = new Vector2(to).sub(start);
  const length = delta.magnitude;
  const angle = Math.atan2(delta.y, delta.x) * 180 / Math.PI;
  const root = new Layout({position: start, rotation: angle});
  const art = new Layout({});
  // Extend the shaft, not the pen strokes or arrowhead, for longer connections.
  const bodyX = (x: number) => x * (length - 48) / 251;
  const headX = (x: number) => x + length - 299;
  const reveal = createSignal(end);
  const activeWaves = createSignal(0);
  const pen = {stroke: theme.colors.foreground, lineWidth: 3, lineCap: 'round' as const, lineJoin: 'round' as const};
  const shaft = new Path({
    ...pen,
    data: `M 2 -4 Q ${bodyX(81)} -16 ${bodyX(157)} -23 Q ${bodyX(210)} -26 ${headX(251)} -18 M ${headX(252)} 14 Q ${bodyX(191)} 13 ${bodyX(141)} 15 Q ${bodyX(75)} 17 6 16 Q 1 9 2 -4`,
    end: () => clamp(reveal() / 0.55), opacity: () => reveal() > 0 ? 1 : 0,
  });
  const head = new Path({
    ...pen,
    data: `M ${headX(249)} -18 L ${headX(246)} -49 Q ${headX(275)} -28 ${length} -2 Q ${headX(277)} 26 ${headX(249)} 45 L ${headX(252)} 14`,
    end: () => clamp((reveal() - 0.5) / 0.25), opacity: () => reveal() > 0.5 ? 1 : 0,
  });
  const hatching = new Path({
    // Inset clip keeps every stroke, including the brighter moving strokes, inside the ink outline.
    data: `M 7 -1 Q ${bodyX(81)} -12 ${bodyX(157)} -19 Q ${bodyX(210)} -22 ${headX(254)} -14 L ${headX(250)} -41 Q ${headX(275)} -21 ${headX(293)} -2 Q ${headX(276)} 20 ${headX(254)} 36 L ${headX(256)} 10 Q ${bodyX(191)} 9 ${bodyX(141)} 11 Q ${bodyX(75)} 13 9 12 Q 6 7 7 -1 Z`,
    clip: true,
  });
  const count = Math.max(15, Math.round((length - 70) / 12));
  const marks = Array.from({length: count}, (_, i) => {
    const x = 13 + i * (length - 83) / (count - 1) + Math.sin(i * 2.1) * 1.4;
    const y = 10 + Math.sin(i * 1.6) * 1.5;
    const height = 12 + 14 * Math.sin(x / (length - 19) * Math.PI) + Math.cos(i * 2.3) * 1.5;
    const lean = height * (0.43 + Math.sin(i * 1.3) * 0.04);
    return {data: `M ${x} ${y} Q ${x + lean * 0.6 - 1} ${y - height * 0.45} ${x + lean} ${y - height}`, x: x + lean / 2, weight: 1.65 + i % 3 * 0.18};
  });
  marks.push(
    {data: `M ${headX(252)} 33 Q ${headX(266)} 15 ${headX(276)} -1`, x: headX(264), weight: 1.9},
    {data: `M ${headX(256)} 11 Q ${headX(264)} -2 ${headX(272)} -13`, x: headX(264), weight: 2.1},
    {data: `M ${headX(253)} -9 Q ${headX(258)} -17 ${headX(263)} -23`, x: headX(258), weight: 1.8},
    {data: `M ${headX(251)} -28 Q ${headX(253)} -31 ${headX(255)} -34`, x: headX(253), weight: 1.6},
    {data: `M ${headX(272)} 19 Q ${headX(281)} 9 ${headX(289)} -1`, x: headX(281), weight: 2},
  );
  for (const mark of marks) {
    const drawn = () => clamp((reveal() - 0.7 - mark.x / length * 0.2) / 0.1);
    hatching.add(new Path({
      data: mark.data, stroke: accent, lineWidth: mark.weight, lineCap: 'round', end: drawn,
      opacity: () => drawn() > 0 ? activeWaves() > 0 ? 0.43 : 0.72 : 0,
    }));
  }
  art.add([shaft, head, hatching]);
  const arrival = new Layout({position: [length + 17, 0], opacity: 0});
  for (const data of ['M 0 -17 Q 3 -12 7 -9', 'M -3 0 L 7 0', 'M 0 17 Q 4 12 7 9']) {
    arrival.add(new Path({data, stroke: accent, lineWidth: 2.5, lineCap: 'round'}));
  }
  root.add([art, arrival]);

  function* travel(duration: number, stop = 1) {
    // Separate overlays let concurrent queries share an arrow without resetting each other's animation.
    const progress = createSignal(0);
    const wave = new Layout({});
    for (const mark of marks) {
      wave.add(new Path({
        data: mark.data, stroke: Color.lerp(accent, theme.colors.foreground, 0.4),
        lineWidth: mark.weight + 1.8, lineCap: 'round',
        opacity: () => {
          const distance = progress() * length - mark.x;
          return distance < 0 ? 0 : Math.exp(-Math.pow((distance - 18) / 21, 2));
        },
      }));
    }
    hatching.add(wave);
    activeWaves(activeWaves() + 1);
    yield* progress(stop, duration, linear);
    wave.remove();
    activeWaves(activeWaves() - 1);
  }

  function* arrive(duration = 0.2) {
    yield* arrival.opacity(1, duration * 0.2).to(0, duration * 0.8);
  }

  const pointAt = (value: number) => new Vector2([length * value, -5 * Math.sin(value * Math.PI)]).rotate(angle).add(start);
  return {root, reveal, travel, arrive, pointAt};
}
