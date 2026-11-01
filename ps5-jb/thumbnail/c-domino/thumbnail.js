import { c, path, line, text, ps5, cursor, mount } from '../shared/art.js';

function domino(x, y, height, angle, width = 145) {
  const pip = (px, py, radius = 13) =>
    `<circle cx="${px}" cy="${py}" r="${radius}" fill="${c.white}"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${angle})">
    ${path(`M ${-width} ${-height} L ${-width + 22} ${-height - 12} L 22 -12 V -4 L 0 10 L ${-width} 10 Z`, '#9c3024', `stroke="${c.black}" stroke-width="4" stroke-linejoin="round"`)}
    ${path(`M ${-width} ${-height} H 0 V 0 H ${-width} Z`, c.accent, `stroke="${c.black}" stroke-width="4" stroke-linejoin="round"`)}
    ${line(`M ${-width + 10} ${-height + 16} V -20`, '#ff9181', 3)}
    ${line(`M ${-width + 17} ${-height * 0.5} H -17`, c.black, 3)}
    ${pip(-width * 0.72, -height * 0.85)}
    ${pip(-width * 0.5, -height * 0.75)}
    ${pip(-width * 0.28, -height * 0.65)}
    ${pip(-width * 0.72, -height * 0.35)}
    ${pip(-width * 0.28, -height * 0.35)}
    ${pip(-width * 0.5, -height * 0.25)}
    ${pip(-width * 0.72, -height * 0.15)}
    ${pip(-width * 0.28, -height * 0.15)}
  </g>`;
}

function firstBrowser() {
  return `<g transform="translate(500 950) rotate(42)">
    ${path('M -320 -300 L -301 -316 L 20 -316 L 20 -16 L 0 0 H -320 Z', '#9c3024', `stroke="${c.black}" stroke-width="4" stroke-linejoin="round"`)}
    ${path('M -320 -300 H 0 V 0 H -320 Z', c.white, `stroke="${c.black}" stroke-width="5" stroke-linejoin="round"`)}
    ${path('M -320 -300 H 0 V -240 H -320 Z', c.accent, `stroke="${c.black}" stroke-width="4"`)}
    ${line('M -294 -271 h 12 M -271 -271 h 12 M -248 -271 h 12', c.black, 4)}
    ${line('M -52 -281 l 17 17 M -35 -281 l -17 17', c.black, 3)}
    ${line('M -287 -211 l -10 9 l 10 9 M -296 -202 h 26', c.black, 3)}
    <rect x="-251" y="-221" width="220" height="37" rx="12" fill="none" stroke="${c.black}" stroke-width="3"/>
    ${text(-270, -86, 96, 'www.', { fill: c.black, tracking: -4 })}
    ${line('M -273 -46 H -136', '#b8b5af', 5)}
    ${line('M -273 -25 H -94', '#b8b5af', 4)}
  </g>`;
}

const scene = `
  <rect width="1920" height="1080" fill="${c.paper}"/>
  ${text(112, 202, 139, 'bir siteyle', { tracking: -6 })}
  ${text(103, 414, 244, 'devrildi.', { family: 'Serif', italic: true, fill: c.accent, tracking: -11 })}
  ${line('M 208 978 Q 924 929 1694 951', '#444340', 3)}
  <ellipse cx="460" cy="973" rx="227" ry="23" fill="${c.black}"/>
  <ellipse cx="727" cy="943" rx="95" ry="13" fill="${c.black}"/>
  <ellipse cx="935" cy="941" rx="95" ry="13" fill="${c.black}"/>
  <ellipse cx="1322" cy="950" rx="263" ry="24" fill="${c.black}"/>
  ${ps5(1390, 520, 1.1, 19)}
  ${domino(950, 920, 680, 29, 155)}
  ${domino(740, 920, 500, 32)}
  ${firstBrowser()}
  ${cursor(238, 703, 0.73, -9)}
`;

mount(scene, 'Bir internet sitesi, domino zinciriyle konsolu deviriyor');
