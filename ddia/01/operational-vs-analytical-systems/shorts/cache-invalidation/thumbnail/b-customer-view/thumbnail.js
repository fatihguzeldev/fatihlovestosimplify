import { C, database, mount, paper, stroke, text } from '../shared/art.js';

const actual =
  text(802, 525, 33, 'asıl kayıt · #1042', { anchor: 'middle', fill: C.muted }) +
  database(805, 695, 1.3, { value: 'shipped', rotate: 4 }) +
  stroke('M 958 593 l 22 -12 M 972 621 l 27 -3', { color: C.blue, width: 4 });

const waiting =
  text(0, -95, 39, 'sipariş #1042', { anchor: 'middle' }) +
  text(0, 9, 72, 'hazırlanıyor', { anchor: 'middle', fill: C.blue }) +
  stroke('M -27 78 Q -4 72 19 78 M 36 77 l 8 0', {
    color: C.blue,
    width: 5,
    opacity: 0.8,
  }) +
  text(0, 128, 28, 'cache’ten gelen eski yanıt', {
    anchor: 'middle',
    fill: C.muted,
  });

// An oversized customer device carries the contradiction; the database remains behind it.
const device = paper(
  470,
  1200,
  700,
  850,
  stroke('M -64 -365 Q 0 -369 64 -365', { width: 4 }) +
    '<circle cx="106" cy="-365" r="5" fill="#7db4ff"/>' +
    text(0, -276, 41, 'siparişlerim', { anchor: 'middle' }) +
    paper(0, 10, 598, 420, waiting) +
    text(0, 325, 32, 'müşterinin ekranı', { anchor: 'middle', fill: C.muted }) +
    stroke('M -62 374 Q 0 379 62 374', { color: C.muted, width: 4 }),
  { fill: C.black, rotate: -5 },
);

mount(
  'Gerçekte çıktı. Ekranda bekliyor. — cache invalidation',
  text(92, 300, 110, 'gerçekte çıktı.') +
    text(82, 444, 115, 'ekranda bekliyor.', { family: 'serif', fill: C.blue }) +
    actual +
    device,
);
