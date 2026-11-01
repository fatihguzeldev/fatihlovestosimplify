import { C, database, mount, paper, stroke, text } from './art.js';

// The crossed-out copy sits in front; the original record stays whole behind it.
const original = database(660, 905, 2.35, {
  value: 'shipped',
  inside: text(0, -5, 20, '#1042', {
    family: 'mono',
    fill: C.muted,
    anchor: 'middle',
  }),
});

const discardedCopy = paper(
  390,
  1370,
  610,
  310,
  text(-238, -66, 37, 'cache · #1042', { family: 'mono' }) +
    text(0, 57, 65, 'preparing', {
      family: 'mono',
      fill: C.muted,
      anchor: 'middle',
    }),
  { rotate: -12 },
);

// Two emphatic blue pen strokes are the operation, not a decorative background.
const deletion =
  stroke('M 164 1258 Q 372 1342 639 1469', { color: C.blue, width: 14 }) +
  stroke('M 228 1513 Q 403 1361 594 1221', { color: C.blue, width: 14 });

mount(
  'kopyayı sildik. sipariş duruyor. — cache invalidation',
  text(88, 331, 104, 'kopyayı sildik.') +
    text(82, 465, 111, 'sipariş duruyor.', { family: 'serif', fill: C.blue }) +
    text(660, 590, 38, 'asıl kayıt', { anchor: 'middle', fill: C.muted }) +
    original +
    discardedCopy +
    deletion,
);
