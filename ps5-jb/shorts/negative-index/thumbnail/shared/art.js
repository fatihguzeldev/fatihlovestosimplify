export { c, path, line, text, ps5, cursor } from '../../../../thumbnail/shared/art.js';

export function mount(body, title) {
  document.querySelector('main').innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" width="2160" height="3840" viewBox="0 0 1080 1920" role="img" aria-labelledby="thumbnail-title"><title id="thumbnail-title">${title}</title>${body}</svg>`;
  window.thumbnailReady = Promise.all([
    document.fonts.load('500 120px Sans', 'çğıöşü−1'),
    document.fonts.load('italic 400 160px PlexSerif', 'çğıöşü−1'),
    document.fonts.load('500 90px Mono', '−1 0 1 2'),
    ...[...document.querySelectorAll('svg image')].map(async (element) => {
      const image = new Image();
      image.src = element.getAttribute('href');
      await image.decode();
    }),
  ]).then(() => document.fonts.ready);
}
