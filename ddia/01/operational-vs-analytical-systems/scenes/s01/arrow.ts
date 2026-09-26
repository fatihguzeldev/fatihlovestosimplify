import {Layout, Path} from '@motion-canvas/2d';
import {Vector2, type PossibleVector2} from '@motion-canvas/core';

export function sketchArrow(from: PossibleVector2, to: PossibleVector2, color: string, end = 1) {
  const start = new Vector2(from);
  const delta = new Vector2(to).sub(start);
  const length = delta.magnitude;
  const angle = Math.atan2(delta.y, delta.x) * 180 / Math.PI;
  const root = new Layout({position: start, rotation: angle});
  const path = new Path({
    data: `M 0 0 C ${length * 0.22} -7 ${length * 0.36} 7 ${length * 0.53} 3 S ${length * 0.85} -5 ${length} 0`,
    stroke: color, lineWidth: 3, lineCap: 'round', lineJoin: 'round', end,
  });
  path.opacity(() => path.end() > 0 ? 1 : 0);
  const tip = new Path({
    data: 'M -15 -10 Q -7 -4 0 0 Q -8 4 -17 11',
    stroke: color, lineWidth: 3, lineCap: 'round', lineJoin: 'round',
    position: () => path.getPointAtPercentage(path.end()).position,
    rotation: () => {
      const direction = path.getPointAtPercentage(path.end()).normal.flipped.perpendicular;
      return Math.atan2(direction.y, direction.x) * 180 / Math.PI;
    },
    opacity: () => Math.min(1, path.end() * 10),
  });
  root.add([path, tip]);
  const pointAt = (value: number) => path.getPointAtPercentage(value).position.rotate(angle).add(start);
  return {root, path, pointAt};
}
