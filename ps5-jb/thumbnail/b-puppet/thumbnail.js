import { c, path, line, text, ps5, cursor, mount } from '../shared/art.js';

const body = `
  <rect width="1920" height="1080" fill="${c.accent}"/>
  <ellipse cx="639" cy="1002" rx="231" ry="20" fill="${c.black}" opacity=".13"/>
  ${line('M 620 285 L 583 440 M 810 306 L 692 432', c.black, 5)}
  ${ps5(635, 734, 0.78, -12)}
  ${path('M 575 442 Q 582 429 592 438 Q 600 449 588 454', 'none', `stroke="${c.black}" stroke-width="4"`)}
  ${path('M 685 433 Q 692 420 702 430 Q 710 442 698 447', 'none', `stroke="${c.black}" stroke-width="4"`)}
  <g transform="translate(430 55) rotate(6) scale(.9)">
    ${path('M 28 15 H 1075 Q 1106 15 1106 48 V 218 Q 1106 247 1077 247 H 29 Q 0 247 0 219 V 47 Q 0 15 28 15 Z', c.black, 'transform="translate(8 13)"')}
    ${path('M 28 0 H 1075 Q 1106 0 1106 32 V 202 Q 1106 233 1076 233 H 29 Q 0 233 0 201 V 32 Q 0 0 28 0 Z', c.paper, `stroke="${c.black}" stroke-width="4"`)}
    ${line('M 0 65 H 1106', '#75736f', 2)}
    ${line('M 28 31 h 14 M 56 31 h 14 M 84 31 h 14', c.white, 4)}
    ${line('M 1034 25 l 17 17 M 1051 25 l -17 17', c.white, 3)}
    ${path('M 36 143 l 25 -22 l -3 44 Z', c.white)}
    ${line('M 41 143 h 57', c.white, 4)}
    <rect x="143" y="87" width="905" height="118" rx="20" fill="${c.black}" stroke="#75736f" stroke-width="2"/>
    ${text(183, 176, 104, 'www.')}
    ${line('M 1007 115 v 61', c.accent, 4)}
  </g>
  ${cursor(1316, 222, 0.64, 3)}
  ${text(955, 667, 125, 'bir sitenin', { fill: c.black })}
  ${text(920, 867, 196, 'oyuncağı.', { family: 'Serif', italic: true })}
`;

mount(body, 'Bir internet sitesinin oyuncağına dönüşen konsol');
