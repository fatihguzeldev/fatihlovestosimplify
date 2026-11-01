import { c, path, text, ps5, mount } from '../shared/art.js';

const body = `
  <rect width="1080" height="1920" fill="${c.white}"/>
  ${path('M 0 930 L 1080 755 V 1920 H 0 Z', c.paper)}
  ${text(75, 440, 334, '−1’i', { family: 'Mono', fill: c.black, tracking: -24 })}
  ${text(75, 680, 158, 'unutmuşlar.', { family: 'Serif', italic: true, fill: c.accent, tracking: -8 })}
  <ellipse cx="615" cy="1817" rx="280" ry="29" fill="${c.black}"/>
  ${ps5(615, 1310, 1.18, 11)}
`;

mount(body, 'Negatif index kontrolünde unutulan eksi bir');
