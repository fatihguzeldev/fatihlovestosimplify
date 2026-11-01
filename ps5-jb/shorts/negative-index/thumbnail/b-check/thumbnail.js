import { c, path, line, text, ps5, mount } from '../shared/art.js';

const coral = '#ff5745';

const body = `
  <rect width="1080" height="1920" fill="${c.paper}"/>

  ${text(91, 252, 137, 'bu kontrol', { tracking: -6 })}
  ${text(80, 467, 236, 'yetmedi.', {
    family: 'Serif',
    italic: true,
    fill: coral,
    tracking: -11,
  })}

  ${line('M 92 597 H 980', '#646564', 2)}
  ${line('M 92 875 H 980', '#646564', 2)}
  ${line('M 92 645 V 827 M 92 645 H 112 M 92 827 H 112', c.white, 4)}
  ${text(130, 707, 59, 'if (index &gt;= count)', {
    family: 'Mono',
    tracking: -2,
  })}
  ${text(202, 813, 68, 'reject();', {
    family: 'Mono',
    fill: '#9c9e9b',
    tracking: -2,
  })}
  ${line('M 185 783 L 592 801', coral, 9)}

  <ellipse cx="694" cy="1659" rx="253" ry="24" fill="${c.black}"/>
  ${ps5(667, 1237, 1.04, 7)}

  ${line('M 357 1163 C 429 1126 448 1040 461 875', coral, 5)}
  <g transform="translate(100 1117) rotate(-11)">
    ${path('M 0 0 H 218 L 284 94 L 218 188 H 0 Z', c.black, 'transform="translate(9 12)"')}
    ${path('M 0 0 H 218 L 284 94 L 218 188 H 0 Z', coral, `stroke="${c.black}" stroke-width="4" stroke-linejoin="round"`)}
    <circle cx="243" cy="94" r="12" fill="${c.paper}" stroke="${c.black}" stroke-width="3"/>
    ${text(31, 135, 126, '−1', {
      family: 'Mono',
      fill: c.black,
      tracking: -9,
    })}
  </g>
`;

mount(body, 'Bu kontrol yetmedi: negatif indeks ve çağrılmayan reject kontrolü');
