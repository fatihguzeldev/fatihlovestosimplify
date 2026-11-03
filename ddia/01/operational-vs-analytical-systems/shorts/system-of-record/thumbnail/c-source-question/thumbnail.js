import { C, mount, stroke, text } from '../shared/art.js';

// Authority is a physical stamp. The proof mark challenges the implied guarantee.
const authority =
  '<g transform="translate(506 576) rotate(-9)">' +
  stroke('M -355 -153 Q -10 -161 355 -151 L 348 150 Q 0 160 -352 150 Z', {
    color: C.white,
    width: 5,
  }) +
  stroke('M -331 -130 Q 0 -137 330 -128', { color: C.white, width: 2, opacity: 0.45 }) +
  text(-5, 12, 164, 'asıl kayıt', { anchor: 'middle', weight: 500 }) +
  text(-5, 100, 37, '#1042 · 185₺', { anchor: 'middle', family: 'mono', fill: C.muted }) +
  '</g>';

const proof =
  stroke('M 167 952 Q 499 903 894 937', { color: C.blue, width: 43 }) +
  stroke('M 183 1117 Q 484 1075 874 1104', { color: C.blue, width: 43 }) +
  stroke('M 724 793 Q 566 1022 383 1256', { color: C.blue, width: 44 }) +
  stroke('M 725 805 Q 566 1033 391 1251', { color: C.white, width: 2, opacity: 0.38 });

const assumption = text(521, 1495, 190, 'hatasız.', {
  family: 'serif',
  anchor: 'middle',
  rotate: 6,
});

mount(
  'asıl kayıt, hatasız kayıt demek değil. — system of record',
  authority +
    proof +
    assumption +
    text(530, 1644, 35, 'system of record', { anchor: 'middle', fill: C.muted }),
);
