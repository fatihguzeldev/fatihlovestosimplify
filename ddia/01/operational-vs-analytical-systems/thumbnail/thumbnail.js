const BLACK = '#0b0b0b',
  WHITE = '#f5f3ed',
  PAPER = '#ece8dd',
  BLUE = '#7db4ff';
const boarSize = { width: 1761, height: 1038 };
const asset = (name) => `./assets/${name}`;
const pic = (kind, angle, x, y, w) =>
  `<image href="${asset(`boar-clean-${kind}-${angle}.png`)}" x="${x}" y="${y}" width="${w}" height="${(w * boarSize.height) / boarSize.width}"/>`;
const text = (
  x,
  y,
  size,
  value,
  {
    fill = WHITE,
    family = 'Plex',
    weight = 500,
    italic = false,
    anchor = 'start',
    tracking = -size * 0.035,
    stroke = 0,
  } = {},
) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-weight="${weight}" font-style="${italic ? 'italic' : 'normal'}" font-size="${size}" text-anchor="${anchor}" letter-spacing="${tracking}" ${stroke ? `stroke="${fill}" stroke-width="${stroke}" paint-order="stroke fill"` : ''}>${value}</text>`;
const word = (x, y, size, value, extra = {}) =>
  text(x, y, size, value, { weight: 700, stroke: 0.4, ...extra });
const serif = (x, y, size, value, extra = {}) =>
  text(x, y, size, value, { family: 'Serif', italic: true, fill: BLUE, stroke: 1, ...extra });
const rect = (x, y, w, h, fill, other = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${other}/>`;
const path = (a) => 'M' + a.map((p) => p.map((v) => v.toFixed(2)).join(',')).join(' L');
const grain = Array.from({ length: 2100 }, (_, i) => {
  let x = ((((Math.sin(i * 37.7 + 1) * 43758.5453) % 1) + 1) % 1) * 1920,
    y = ((((Math.sin(i * 23.1 + 67) * 28758.1253) % 1) + 1) % 1) * 1080;
  return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${0.2 + (i % 4) * 0.2}" fill="#322a22" opacity=".07"/>`;
}).join('');
const svg = (name, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="thumbnail-title" width="3840" height="2160" viewBox="0 0 1920 1080"><title id="thumbnail-title">${name} — aynı data, farklı işler. — Designing Data-Intensive Applications — chapter 1</title><defs><style>text{font-kerning:normal}</style>${defs}</defs>${body}</svg>`;

// Fixed seeds keep the paper edge and fibers identical on every render.
function tornCurve(p, seed, amplitude) {
  let state = seed;
  const rand = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const points = [];
  const steps = 780;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps,
      u = 1 - t;
    const x =
      u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0];
    const y =
      u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1];
    const dx =
      3 * u * u * (p[1][0] - p[0][0]) +
      6 * u * t * (p[2][0] - p[1][0]) +
      3 * t * t * (p[3][0] - p[2][0]);
    const dy =
      3 * u * u * (p[1][1] - p[0][1]) +
      6 * u * t * (p[2][1] - p[1][1]) +
      3 * t * t * (p[3][1] - p[2][1]);
    const length = Math.hypot(dx, dy),
      fade = Math.min(1, t * 25, (1 - t) * 25);
    const coarse = Math.sin(t * 43 + seed) * 3.2 + Math.sin(t * 91 + seed * 0.7) * 2.0;
    const nicks = [
      [0.14, 0.01, 7],
      [0.29, 0.007, -5],
      [0.46, 0.018, 8],
      [0.63, 0.009, 9],
      [0.79, 0.013, -5],
      [0.92, 0.006, 6],
    ].reduce(
      (sum, [center, width, depth]) => sum + Math.exp(-(((t - center) / width) ** 2)) * depth,
      0,
    );
    const fine =
      (Math.sin(i * 0.071 + seed) * 0.5 + Math.sin(i * 0.193) * 0.3 + (rand() - 0.5) * 0.85) *
      amplitude;
    const noise = (coarse + nicks + fine) * fade;
    points.push([x - (dy / length) * noise, y + (dx / length) * noise]);
  }
  return points;
}
const upper = tornCurve(
  [
    [-130, 864],
    [410, 605],
    [1000, 420],
    [1400, 385],
  ],
  19,
  2.8,
);
const seam = tornCurve(
  [
    [1400, 385],
    [1350, 545],
    [1190, 790],
    [1100, 1110],
  ],
  83,
  4.3,
);
const paperPath = path([...upper, ...seam.slice(1), [-130, 1110]]) + ' Z';
const defs = `<clipPath id="paper"><path d="${paperPath}"/></clipPath><clipPath id="dark"><path d="M0,0H1920V1080H0Z ${paperPath}" clip-rule="evenodd"/></clipPath><filter id="edge-shadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.4"/></filter><filter id="paper-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="17" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`;
function frayedEdge(points, seed) {
  let state = seed;
  const rand = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const inner = [],
    fibers = [];
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i],
      a = points[Math.max(0, i - 2)],
      b = points[Math.min(points.length - 1, i + 2)];
    const dx = b[0] - a[0],
      dy = b[1] - a[1],
      len = Math.hypot(dx, dy) || 1,
      nx = -dy / len,
      ny = dx / len;
    const width =
      0.35 +
      6 * Math.max(0, Math.sin(i * 0.037 + seed)) ** 3 +
      2 * Math.max(0, Math.sin(i * 0.13)) ** 2;
    inner.push([x + nx * width, y + ny * width]);
    if (i % 2 === 0 && rand() > 0.49) {
      const length = 0.5 + rand() ** 2 * 5,
        along = (rand() - 0.5) * 5;
      fibers.push(
        `<path d="M${x + nx * 1.6},${y + ny * 1.6} l${-nx * length + (dx / len) * along},${-ny * length + (dy / len) * along}" stroke="${rand() > 0.25 ? '#f9f6eb' : '#b9b2a4'}" stroke-width="${0.35 + rand() * 0.6}" opacity="${0.35 + rand() * 0.5}"/>`,
      );
    }
  }
  return (
    `<path d="${path([...points, ...inner.reverse()])} Z" fill="#f8f4e8" opacity=".86"/>` +
    fibers.join('')
  );
}
const edgeMaterial = frayedEdge(upper, 49) + frayedEdge(seam, 92);

// Actual cover lettering preserves its font shapes, capitals and three-line spacing.
const bookTitleWidth = 580;
const bookTitleHeight = (bookTitleWidth * 708) / 1692;
const originalBookTitle = `<image id="book-title" href="${asset('ddia-cover-title-white.png')}" x="1190" y="64" width="${bookTitleWidth}" height="${bookTitleHeight}"/>`;
// The approved Gilroy lettering is rendered at native 4K size; no font redistribution.
const chapterLabel = `<image href="${asset('chapter-1.png')}" x="1191.5" y="332" width="256.5" height="56.5"/>`;
const artwork = svg(
  'DDIA chapter 1',
  defs,
  rect(0, 0, 1920, 1080, BLACK) +
    `<g transform="translate(103 72.6) scale(.96)"><path d="${paperPath}" fill="${PAPER}"/><g clip-path="url(#paper)">${grain}<rect x="-140" y="0" width="2100" height="1150" filter="url(#paper-grain)" opacity=".055"/>${pic('warm', 12, 620, 365, 1130)}</g><g clip-path="url(#dark)">${pic('blue', 12, 620, 365, 1130)}</g>` +
    `<path d="${path(seam)}" fill="none" stroke="#000" opacity=".28" stroke-width="6" transform="translate(3 1)" filter="url(#edge-shadow)"/>${edgeMaterial}</g>` +
    word(132, 242, 190, 'aynı data,') +
    serif(122, 435, 204, 'farklı işler.') +
    originalBookTitle +
    chapterLabel,
);

document.querySelector('.thumbnail').innerHTML = artwork;

window.thumbnailReady = (async () => {
  await Promise.all([
    document.fonts.load('500 190px Plex'),
    document.fonts.load('italic 400 204px Serif'),
    ...[...document.querySelectorAll('svg image')].map((element) => {
      const image = new Image();
      image.src = element.getAttribute('href');
      return image.decode();
    }),
  ]);
  await document.fonts.ready;
})();
