import { Layout, Path } from '@motion-canvas/2d';
import { Color, createSignal, linear, Vector2, type PossibleVector2 } from '@motion-canvas/core';
import { theme } from './theme';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function seededRandom(name: string) {
  let seed = 2166136261;
  for (const char of name) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  return (min: number, max: number) => {
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return min + (((value ^ (value >>> 14)) >>> 0) / 4294967296) * (max - min);
  };
}

export function cartoonArrow(
  name: string,
  from: PossibleVector2,
  to: PossibleVector2,
  accent: string,
  end = 1,
) {
  const start = new Vector2(from);
  const delta = new Vector2(to).sub(start);
  const length = delta.magnitude;
  const angle = (Math.atan2(delta.y, delta.x) * 180) / Math.PI;
  const root = new Layout({ position: start, rotation: angle });
  const art = new Layout({});
  const random = seededRandom(name);
  const thickness = random(0.85, 1.16);
  const bow = random(-10, 10);
  const headDepth = random(45, 65);
  const headSkew = random(-0.16, 0.16);
  const headX = (x: number) => length - ((299 - x) * headDepth) / 53;
  const bodyX = (x: number) => (x * headX(251)) / 251;
  const centerY = (x: number) => bow * Math.sin((x / length) * Math.PI);
  const body = (x: number, y: number) => `${bodyX(x)} ${y * thickness + centerY(bodyX(x))}`;
  const head = (x: number, y: number) =>
    `${headX(x)} ${y * (1 + Math.sign(y) * headSkew) + centerY(headX(x))}`;
  const reveal = createSignal(end);
  const activeWaves = createSignal(0);
  const pen = {
    stroke: theme.colors.foreground,
    lineWidth: random(2.7, 3.3),
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
  };
  const shaft = new Path({
    ...pen,
    data: `M ${body(2, -4)} Q ${body(81, -16)} ${body(157, -23)} Q ${body(210, -26)} ${head(251, -18)} M ${head(252, 14)} Q ${body(191, 13)} ${body(141, 15)} Q ${body(75, 17)} ${body(6, 16)} Q ${body(1, 9)} ${body(2, -4)}`,
    end: () => clamp(reveal() / 0.55),
    opacity: () => (reveal() > 0 ? 1 : 0),
  });
  const arrowhead = new Path({
    ...pen,
    data: `M ${head(249, -18)} L ${head(246, -49)} Q ${head(275, -28)} ${head(299, 0)} Q ${head(277, 26)} ${head(249, 45)} L ${head(252, 14)}`,
    end: () => clamp((reveal() - 0.5) / 0.25),
    opacity: () => (reveal() > 0.5 ? 1 : 0),
  });
  const hatching = new Path({
    data: `M ${body(7, -1)} Q ${body(81, -12)} ${body(157, -19)} Q ${body(210, -22)} ${head(254, -14)} L ${head(250, -41)} Q ${head(275, -21)} ${head(293, 0)} Q ${head(276, 20)} ${head(254, 36)} L ${head(256, 10)} Q ${body(191, 9)} ${body(141, 11)} Q ${body(75, 13)} ${body(9, 12)} Q ${body(6, 7)} ${body(7, -1)} Z`,
    clip: true,
  });
  const count = Math.max(12, Math.round((headX(229) - 13) / random(10, 16)));
  const slant = random(0.3, 0.7);
  const weight = random(1.5, 2.2);
  const marks = Array.from({ length: count }, (_, i) => {
    const x = 13 + ((i + random(-0.3, 0.3)) * (headX(229) - 13)) / (count - 1);
    const y = random(8, 12) * thickness + centerY(x);
    const height =
      (12 + 14 * Math.sin((x / (length - 19)) * Math.PI)) * thickness * random(0.75, 1.08);
    const lean = height * (slant + random(-0.12, 0.12));
    return {
      data: `M ${x} ${y} Q ${x + lean * 0.6 + random(-2, 2)} ${y - height * 0.45} ${x + lean} ${y - height}`,
      x: x + lean / 2,
      weight: weight * random(0.8, 1.2),
    };
  });
  for (const [x, y, cx, cy, ex, ey] of [
    [252, 33, 266, 15, 276, -1],
    [256, 11, 264, -2, 272, -13],
    [253, -9, 258, -17, 263, -23],
    [251, -28, 253, -31, 255, -34],
    [272, 19, 281, 9, 289, -1],
  ]) {
    const dx = random(-2.5, 2.5);
    const dy = random(-3, 3);
    marks.push({
      data: `M ${head(x + dx, y + dy)} Q ${head(cx + dx, cy + dy)} ${head(ex + dx, ey + dy)}`,
      x: headX((x + ex) / 2 + dx),
      weight: weight * random(0.8, 1.2),
    });
  }
  for (const mark of marks) {
    const drawn = () => clamp((reveal() - 0.7 - (mark.x / length) * 0.2) / 0.1);
    hatching.add(
      new Path({
        data: mark.data,
        stroke: accent,
        lineWidth: mark.weight,
        lineCap: 'round',
        end: drawn,
        opacity: () => (drawn() > 0 ? (activeWaves() > 0 ? 0.43 : 0.72) : 0),
      }),
    );
  }
  art.add([shaft, arrowhead, hatching]);
  const arrival = new Layout({ position: [length + 17, 0], opacity: 0 });
  for (const data of ['M 0 -17 Q 3 -12 7 -9', 'M -3 0 L 7 0', 'M 0 17 Q 4 12 7 9']) {
    arrival.add(new Path({ data, stroke: accent, lineWidth: 2.5, lineCap: 'round' }));
  }
  root.add([art, arrival]);

  function* travel(duration: number, stop = 1) {
    const progress = createSignal(0);
    const wave = new Layout({});
    for (const mark of marks) {
      wave.add(
        new Path({
          data: mark.data,
          stroke: Color.lerp(accent, theme.colors.foreground, 0.4),
          lineWidth: mark.weight + 1.8,
          lineCap: 'round',
          opacity: () => {
            const distance = progress() * length - mark.x;
            return distance < 0 ? 0 : Math.exp(-Math.pow((distance - 18) / 21, 2));
          },
        }),
      );
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

  const pointAt = (value: number) =>
    new Vector2([
      length * value,
      centerY(length * value) - 5 * thickness * Math.sin(value * Math.PI),
    ])
      .rotate(angle)
      .add(start);
  return { root, reveal, travel, arrive, pointAt };
}
