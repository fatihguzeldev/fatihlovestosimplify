import { palette } from '../../shared/theme.ts';

export const c = { ...palette, black: '#141517' };
const consoleAsset = new URL('./assets/ps5-illustration.png', import.meta.url).href;
const outline = `stroke="${c.black}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

export const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
export const line = (d, color = c.black, width = 4) =>
  path(
    d,
    'none',
    `stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`,
  );

export function text(
  x,
  y,
  size,
  content,
  {
    fill = c.white,
    family = 'Sans',
    italic = false,
    anchor = 'start',
    tracking = -size * 0.045,
  } = {},
) {
  return `<text x="${x}" y="${y}" font-family="${family === 'Serif' ? 'PlexSerif' : family}" font-weight="${family === 'Serif' ? 400 : 500}" font-style="${italic ? 'italic' : 'normal'}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${tracking}">${content}</text>`;
}

// A single isolated generated asset; all staging and typography is authored SVG.
export function ps5(x, y, scale = 1, angle = 0) {
  return `<image href="${consoleAsset}" x="-256" y="-384" width="512" height="768" transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"/>`;
}

export function cursor(x, y, scale = 1, angle = 0, color = c.white) {
  const shape = 'M 0 0 L 0 126 L 35 95 L 62 149 L 84 138 L 57 84 L 106 81 Z';
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">
    ${path(shape, c.black, 'transform="translate(9 12)"')}
    ${path(shape, color, outline)}
  </g>`;
}

export function mount(body, title) {
  document.querySelector('main').innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" width="3840" height="2160" viewBox="0 0 1920 1080" role="img" aria-labelledby="thumbnail-title"><title id="thumbnail-title">${title}</title>${body}</svg>`;
  window.thumbnailReady = Promise.all([
    document.fonts.load('500 180px Sans'),
    document.fonts.load('italic 500 180px Sans'),
    document.fonts.load('italic 400 180px PlexSerif'),
    ...[...document.querySelectorAll('svg image')].map(async (element) => {
      const image = new Image();
      image.src = element.getAttribute('href');
      await image.decode();
    }),
  ]).then(() => document.fonts.ready);
}
