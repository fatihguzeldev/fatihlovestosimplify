import { C, mount, stroke, text } from '../shared/art.js';

// The amounts are the composition. No diagram or repeated headline template.
const amounts =
  text(528, 717, 319, '185₺', { family: 'mono', anchor: 'middle', spacing: -22 }) +
  text(538, 1237, 319, '180₺', {
    family: 'mono',
    anchor: 'middle',
    spacing: -22,
    fill: C.blue,
  });

const oneSale =
  text(540, 294, 46, 'aynı satış · #1042', { anchor: 'middle' }) +
  stroke('M 118 361 Q 535 342 953 359', { width: 2.5, color: C.muted, opacity: 0.65 });

const annotations =
  text(157, 492, 35, 'sales database', { fill: C.muted }) +
  text(157, 1002, 35, 'warehouse · kopya', { fill: C.muted }) +
  stroke('M 135 806 Q 510 855 944 798', { width: 4 }) +
  stroke('M 126 819 Q 527 858 947 813', { width: 2, opacity: 0.45 });

const question =
  text(540, 1583, 158, 'hangisi?', { family: 'serif', anchor: 'middle' }) +
  stroke('M 270 1630 Q 546 1661 806 1618', { color: C.blue, width: 6 });

mount('185₺ mi, 180₺ mi? — aynı satış, iki kayıt', amounts + oneSale + annotations + question);
