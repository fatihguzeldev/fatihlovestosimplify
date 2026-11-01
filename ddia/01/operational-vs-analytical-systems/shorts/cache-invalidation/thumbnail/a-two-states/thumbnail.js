import { C, text, stroke, database, paper, mount } from '../shared/art.js';

const title =
  text(92, 320, 112, 'sipariş çıktı.') +
  text(83, 457, 131, 'cache kaldı.', { family: 'serif', fill: C.blue });

const current =
  text(340, 626, 38, 'asıl kayıt', { anchor: 'middle' }) +
  database(340, 880, 2.2, {
    value: 'shipped',
    rotate: -6,
    inside: text(0, -7, 19, '#1042', { family: 'mono', anchor: 'middle', fill: C.muted }),
  });

const stale = paper(
  629,
  1310,
  715,
  350,
  text(-290, -99, 43, 'cache') +
    text(284, -99, 27, '#1042', { family: 'mono', anchor: 'end', fill: C.muted }) +
    stroke('M -290 -65 Q 0 -69 286 -64', { width: 2, opacity: 0.4 }) +
    text(0, 65, 75, 'preparing', { family: 'mono', anchor: 'middle', fill: C.blue }),
  { rotate: 5, fill: C.navy },
);

const difference = text(753, 1048, 108, '≠', {
  family: 'mono',
  anchor: 'middle',
  fill: C.blue,
  rotate: 12,
});
mount('sipariş çıktı. cache kaldı. — cache invalidation', title + current + difference + stale);
