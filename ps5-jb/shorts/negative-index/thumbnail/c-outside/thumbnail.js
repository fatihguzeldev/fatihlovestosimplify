import { c, path, line, text, mount } from '../shared/art.js';

const ink = `stroke="${c.black}" stroke-width="7" stroke-linejoin="round"`;
const ivory = '#f4f0e7';
const coral = '#ed684f';

function validList() {
  return `<g transform="translate(318 1068) rotate(5)">
    ${path('M 0 0 L 27 -21 H 582 V 549 L 555 570 H 0 Z', c.black, ink)}
    ${path('M 555 0 L 582 -21 V 549 L 555 570 Z', '#c34f3c', ink)}
    ${path('M 0 0 H 555 V 570 H 0 Z', ivory, ink)}
    ${line('M 0 190 H 555 M 0 380 H 555', c.black, 7)}
    ${line('M 151 0 V 570', c.black, 7)}
    ${[0, 1, 2]
      .map((index) => {
        const y = 134 + index * 190;
        return `${text(72, y, 104, String(index), { family: 'Mono', fill: c.black, anchor: 'middle', tracking: -5 })}
        ${line(`M 210 ${y - 56} H 473`, c.black, 17)}
        ${line(`M 210 ${y - 18} H ${index === 1 ? 395 : 437}`, c.black, 11)}`;
      })
      .join('')}
  </g>`;
}

function outsideRow() {
  return `<g transform="translate(144 793) rotate(-8)">
    ${path('M 0 0 L 27 -21 H 677 V 170 L 650 191 H 0 Z', c.black, ink)}
    ${path('M 650 0 L 677 -21 V 170 L 650 191 Z', '#b74b39', ink)}
    ${path('M 0 0 H 650 V 191 H 0 Z', c.black, ink)}
    ${line('M 191 0 V 191', ivory, 5)}
    ${text(96, 132, 110, '−1', { family: 'Mono', fill: ivory, anchor: 'middle', tracking: -9 })}
    ${path('M 254 50 H 582 V 139 H 254 Z', ivory)}
    ${line('M 278 74 H 454 M 278 112 H 535', c.black, 12)}
  </g>`;
}

const scene = `
  <rect width="1080" height="1920" fill="${coral}"/>
  ${text(74, 313, 195, 'listenin', { fill: c.black, tracking: -10 })}
  ${text(68, 535, 221, 'dışından.', { family: 'Serif', italic: true, fill: ivory, tracking: -12 })}
  ${validList()}
  ${outsideRow()}
`;

mount(
  scene,
  'Listenin dışından: eksi bir satırı, sıfırdan başlayan üç satırlı listenin önünde ve dışında duruyor',
);
