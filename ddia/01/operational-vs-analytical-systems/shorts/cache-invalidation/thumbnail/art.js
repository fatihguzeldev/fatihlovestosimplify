export const C = {
  black: '#0b0b0b',
  white: '#f5f5f5',
  blue: '#7db4ff',
  navy: '#17232f',
  muted: '#aaa9a5',
  cream: '#ece8dd',
};

const escape = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export const text = (x, y, size, value, options = {}) => {
  const {
    fill = C.white,
    family = 'sans',
    anchor = 'start',
    weight = 500,
    italic = family === 'serif',
    spacing = family === 'mono' ? 0 : -size * 0.035,
    rotate = 0,
  } = options;
  const fonts = { sans: 'IBM Plex Sans', serif: 'IBM Plex Serif', mono: 'IBM Plex Mono' };
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${fonts[family]}" font-weight="${family === 'serif' ? 400 : weight}" font-style="${italic ? 'italic' : 'normal'}" font-size="${size}" letter-spacing="${spacing}" text-anchor="${anchor}" transform="rotate(${rotate} ${x} ${y})">${escape(value)}</text>`;
};

export const stroke = (
  d,
  { color = C.white, width = 4, opacity = 1, fill = 'none', extra = '' } = {},
) =>
  `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}" ${extra}/>`;

// The cylinder and paper contours are the video's own drawing geometry.
export function database(
  x,
  y,
  scale = 1,
  {
    value = 'shipped',
    caption = '',
    rotate = 0,
    fill = C.black,
    color = C.white,
    valueColor = C.blue,
    inside = '',
  } = {},
) {
  return (
    `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})">` +
    stroke('M -115 -80 Q -117 2 -113 82 C -109 124 112 121 115 79 Q 117 -3 115 -78 Z', {
      fill,
      color,
      width: 3,
    }) +
    stroke('M -115 -80 C -111 -119 109 -122 115 -78 C 120 -40 -116 -38 -115 -80 Z', {
      fill,
      color,
      width: 3,
    }) +
    [-28, -7, 15, 38, 61, 80]
      .map((n) =>
        stroke(`M 96 ${n + 10} Q 103 ${n + 4} 108 ${n - 3}`, {
          color: C.blue,
          width: 1.8,
          opacity: 0.65,
        }),
      )
      .join('') +
    (value ? text(0, 35, 30, value, { family: 'mono', anchor: 'middle', fill: valueColor }) : '') +
    (caption ? text(0, 153, 24, caption, { anchor: 'middle' }) : '') +
    inside +
    '</g>'
  );
}

export function paper(
  x,
  y,
  width,
  height,
  body = '',
  { fill = C.navy, color = C.white, rotate = 0 } = {},
) {
  const w = width / 2,
    h = height / 2;
  return (
    `<g transform="translate(${x} ${y}) rotate(${rotate})">` +
    stroke(
      `M ${w} ${-h + 3} L ${w + 9} ${-h + 13} L ${w + 7} ${h + 9} L ${-w + 9} ${h + 11} L ${-w} ${h} Z`,
      { fill: C.black, color, width: 2 },
    ) +
    stroke(
      `M ${-w} ${-h + 2} Q 0 ${-h - 2} ${w} ${-h + 3} L ${w - 2} ${h} Q 0 ${h + 3} ${-w + 1} ${h - 1} Z`,
      { fill, color, width: 3.4 },
    ) +
    body +
    '</g>'
  );
}

export function arrow(x1, y1, x2, y2, { color = C.blue, width = 4 } = {}) {
  const length = Math.hypot(x2 - x1, y2 - y1),
    angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const end = length - 45;
  return (
    `<g transform="translate(${x1} ${y1}) rotate(${angle})">` +
    stroke(
      `M 0 -9 Q ${end / 2} -19 ${end} -11 L ${end - 4} -34 Q ${length - 21} -15 ${length} 0 Q ${length - 22} 20 ${end} 34 L ${end + 2} 12 Q ${end / 2} 18 2 12 Z`,
      { width },
    ) +
    Array.from({ length: Math.max(3, Math.floor(end / 17)) }, (_, i) =>
      stroke(`M ${10 + i * 17} 8 l 11 -17`, { color, width: 2.2, opacity: 0.75 }),
    ).join('') +
    '</g>'
  );
}

export function mount(title, body) {
  document.querySelector('main').innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" width="2160" height="3840" viewBox="0 0 1080 1920" role="img" aria-labelledby="cover-title"><title id="cover-title">${escape(title)}</title><rect width="1080" height="1920" fill="${C.black}"/>${body}</svg>`;
  window.thumbnailReady = Promise.all([
    document.fonts.load('500 120px "IBM Plex Sans"'),
    document.fonts.load('italic 400 120px "IBM Plex Serif"'),
    document.fonts.load('400 80px "IBM Plex Mono"'),
  ]).then(() => document.fonts.ready);
}
