import { C, mount, stroke, text } from '../shared/art.js';

// The two amounts belong to the same sale: an original document and its carbon copy.
// Cream paper occupies the cover instead of a headline sitting above a diagram.
const original =
  '<g transform="translate(80 185) rotate(-6 405 600)">' +
  stroke(
    'M 0 5 Q 401 -4 810 7 L 801 1190 L 773 1207 L 744 1187 L 711 1209 L 679 1190 L 645 1211 L 612 1188 L 579 1206 L 546 1189 L 513 1210 L 480 1190 L 448 1207 L 416 1188 L 382 1210 L 349 1190 L 317 1208 L 284 1188 L 251 1209 L 218 1189 L 184 1208 L 152 1187 L 118 1209 L 86 1191 L 52 1207 L 18 1189 Z',
    { fill: C.cream, color: C.cream, width: 4 },
  ) +
  text(58, 161, 116, 'aynı satış.', { fill: C.black }) +
  text(63, 250, 36, '#1042', { family: 'mono', fill: C.black }) +
  text(743, 250, 31, 'asıl kayıt', { anchor: 'end', fill: C.black }) +
  stroke('M 61 293 Q 404 297 745 291', { color: C.black, width: 3 }) +
  text(58, 570, 210, '185₺', { family: 'mono', fill: C.black }) +
  stroke('M 61 635 Q 402 640 744 634', { color: C.black, width: 3 }) +
  text(63, 710, 31, 'sales database', { family: 'mono', fill: C.black }) +
  stroke('M 66 803 L 223 801 M 66 834 L 365 831 M 65 866 L 303 863', {
    color: C.black,
    width: 5,
    opacity: 0.25,
  }) +
  '</g>';

const carbon =
  '<g transform="translate(285 970) rotate(7 360 400)">' +
  stroke(
    'M 5 4 Q 353 -2 718 6 L 723 744 L 695 761 L 666 746 L 636 762 L 605 746 L 574 763 L 543 747 L 513 761 L 482 747 L 452 763 L 420 747 L 390 762 L 359 747 L 328 763 L 297 748 L 266 762 L 235 747 L 204 763 L 173 747 L 142 762 L 111 747 L 80 762 L 49 747 L 17 763 Z',
    { fill: C.navy, color: C.blue, width: 4 },
  ) +
  stroke('M 20 21 Q 362 17 702 22 L 706 728', {
    color: C.blue,
    width: 2,
    opacity: 0.4,
  }) +
  text(48, 96, 35, '#1042', { family: 'mono', fill: C.blue }) +
  text(666, 96, 31, 'kopya', { anchor: 'end', fill: C.blue }) +
  stroke('M 48 132 Q 359 136 667 130', { color: C.blue, width: 2, opacity: 0.6 }) +
  text(42, 281, 119, 'iki tutar.', { family: 'serif', fill: C.blue }) +
  text(43, 502, 186, '180₺', { family: 'mono' }) +
  stroke('M 47 570 Q 357 574 667 569', { color: C.blue, width: 2, opacity: 0.6 }) +
  text(49, 643, 31, 'warehouse', { family: 'mono', fill: C.blue }) +
  '</g>';

mount('aynı satış. iki tutar. — system of record', original + carbon);
