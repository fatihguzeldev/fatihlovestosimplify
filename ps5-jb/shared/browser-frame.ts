import { Circle, Path, Rect, Txt } from '@motion-canvas/2d';

const color = {
  dark: '#202225',
  wash: '#303b44',
  ink: '#ece9e1',
  muted: '#929493',
  accent: '#ff563f',
};
function draw(data: string, fill?: string, stroke = color.ink, lineWidth = 2.8) {
  return new Path({ data, fill, stroke, lineWidth, lineCap: 'round', lineJoin: 'round' });
}
function text(value: string, x: number, y: number, fontSize: number, fill = color.ink) {
  return new Txt({
    text: value,
    x,
    y,
    fontSize,
    fill,
    fontFamily: 'IBM Plex Sans',
    offset: [-1, 0],
  });
}

export function createBrowserFrame() {
  const screen = new Rect({
    x: 0,
    y: -120,
    width: 992,
    height: 558,
    radius: 6,
    clip: true,
    fill: color.dark,
  });
  const address = text('/relapse', -296, -254, 15);
  const title = text('relapse', -423, -133, 48, color.accent);
  screen.add([
    draw('M -497 -279 L 496 -279 L 496 -228 Q 0 -226 -497 -229 Z', color.wash, color.wash),
    draw(
      'M -459 -263 L -468 -255 L -458 -246 M -428 -263 L -419 -255 L -428 -247',
      undefined,
      color.ink,
      2.3,
    ),
    draw(
      'M -385 -260 A 8 8 0 1 0 -385 -250 M -385 -266 L -384 -259 L -391 -258',
      undefined,
      color.ink,
      2,
    ),
    draw(
      'M -326 -268 Q 5 -270 346 -267 L 347 -240 Q 6 -238 -326 -241 Z',
      color.dark,
      color.muted,
      1.6,
    ),
    new Circle({ x: -310, y: -254, size: 5, fill: color.accent }),
    address,
    draw('M 452 -259 L 468 -259 M 452 -252 L 468 -252', undefined, color.ink, 1.8),
    // Editorial page title; no invented exploit progress or terminal output.
    title,
  ]);
  return { root: screen, address, title };
}
