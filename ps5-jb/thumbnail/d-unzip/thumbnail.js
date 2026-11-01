import { c, cursor, line, mount, path, ps5, text } from '../shared/art.js';

// The original front plate is staged as an opening flap around its lower tip.
// These clips keep the console's photographic contour and its stand intact.
const frontPlate =
  'M 35 -371 Q 32 -381 20 -373 L -134 -259 Q -148 -249 -144 -230 C -140 -102 -146 69 -167 269 Q -170 278 -157 283 C -81 315 -6 326 63 329 Q 76 331 75 316 C 76 137 64 -36 52 -196 Z';
const clips = `<defs>
  <clipPath id="d-front-plate"><path d="${frontPlate}"/></clipPath>
  <mask id="d-rest" maskUnits="userSpaceOnUse" x="-256" y="-384" width="512" height="768">
    <rect x="-256" y="-384" width="512" height="768" fill="white"/>
    <path d="${frontPlate}" fill="black" stroke="black" stroke-width="20" stroke-linejoin="round"/>
  </mask>
</defs>`;

// Wide-open tracks above the slider; a joined track continues below it.
const teeth = Array.from({ length: 15 }, (_, i) => {
  const y = -230 + i * 22;
  const left = y < 45 ? -78 + (y + 230) * 0.295 : 3 + (y - 45) * 2.22;
  const right = 120 - y * 0.03;
  return `<rect x="${left - 19}" y="${y}" width="25" height="15" rx="3" fill="${c.accent}" transform="rotate(-16 ${left} ${y})"/>
    <rect x="${right}" y="${y + 5}" width="25" height="15" rx="3" fill="${c.accent}" transform="rotate(4 ${right} ${y})"/>`;
}).join('');

const closed = Array.from({ length: 8 }, (_, i) => {
  const y = 120 + i * 18;
  const x = 110 + (y - 120) * 0.035;
  return `<rect x="${x - 14}" y="${y}" width="18" height="13" rx="2" fill="${c.accent}"/>
    <rect x="${x + 2}" y="${y + 8}" width="18" height="13" rx="2" fill="${c.accent}"/>`;
}).join('');

const device = `<g transform="translate(599 490) rotate(-11) scale(1.1)">
  ${clips}
  ${path('M -114 -347 Q 2 -331 121 -250 L 151 274 Q 119 313 63 320 C 16 111 -42 -113 -114 -347 Z', c.black)}
  ${path('M -105 -333 Q -23 -301 113 -248 L 118 95 Q 36 53 -11 -75 Z', c.accent, 'opacity=".23"')}
  ${line('M -86 -301 Q -28 -106 109 94', c.accent, 4)}
  <g mask="url(#d-rest)">${ps5(0, 0)}</g>
  <g transform="rotate(-13 63 320)"><g clip-path="url(#d-front-plate)">${ps5(0, 0)}</g></g>
  ${line('M -78 -232 Q -37 -90 3 45 Q 40 92 110 94 M 129 -249 Q 122 -102 118 95', c.black, 17)}
  ${teeth}
  ${closed}
  ${path('M 103 80 Q 113 71 124 81 L 137 114 Q 137 126 122 129 L 106 128 Q 94 126 96 112 Z', c.accent, `stroke="${c.black}" stroke-width="4" stroke-linejoin="round"`)}
  <ellipse cx="117" cy="104" rx="7" ry="13" fill="${c.black}"/>
</g>`;

const browser = `<g transform="translate(803 566) rotate(12)">
  <rect x="8" y="15" width="800" height="273" rx="26" fill="${c.black}"/>
  <rect width="800" height="273" rx="26" fill="${c.accent}" stroke="${c.black}" stroke-width="5"/>
  ${line('M 0 70 H 800', c.black, 4)}
  ${line('M 30 34 h 13 M 58 34 h 13 M 86 34 h 13', c.black, 5)}
  ${path('M 154 70 V 24 Q 154 10 169 10 H 374 Q 391 10 391 28 V 70 Z', c.paper, `stroke="${c.black}" stroke-width="4"`)}
  ${line('M 349 30 l 15 15 M 364 30 l -15 15', c.white, 3)}
  ${line('M 40 121 l -14 14 l 14 14 M 27 135 h 34', c.black, 4)}
  <rect x="87" y="94" width="673" height="143" rx="17" fill="${c.white}" stroke="${c.black}" stroke-width="4"/>
  ${text(130, 201, 126, 'www.', { fill: c.black })}
  ${line('M 708 120 v 91', c.accent, 4)}
</g>`;

mount(
  `<rect width="1920" height="1080" fill="${c.paper}"/>
  <ellipse cx="580" cy="980" rx="239" ry="23" fill="${c.black}"/>
  ${device}
  ${line('M 748 586 Q 787 585 824 614', c.black, 21)}
  ${line('M 748 586 Q 787 585 824 614', c.white, 11)}
  ${browser}
  ${cursor(1451, 788, 0.8, 21)}
  ${text(935, 203, 100, 'bir siteyle', { fill: c.white })}
  ${text(915, 439, 251, 'açıldı.', { fill: c.accent, family: 'Serif', italic: true })}`,
  'Bir internet sitesi, konsolu açan fermuara dönüşüyor',
);
