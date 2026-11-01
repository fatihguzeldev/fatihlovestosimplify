import { Circle, Layout, Path, Rect } from '@motion-canvas/2d';
import { createBrowserFrame } from '../../shared/browser-frame';

// Coral carries the focal points; nearby slate tones give the room volume.
const color = {
  paper: '#282a2d',
  dark: '#202225',
  wash: '#303b44',
  recess: '#20292f',
  slate: '#526e80',
  slateLight: '#8299a5',
  plastic: '#d0d7d6',
  ink: '#ece9e1',
  muted: '#929493',
  accent: '#ff563f',
};
const pen = {
  stroke: color.ink,
  lineWidth: 2.8,
  lineCap: 'round' as const,
  lineJoin: 'round' as const,
};
function draw(data: string, fill?: string, stroke = color.ink, lineWidth = 2.8) {
  return new Path({ ...pen, data, fill, stroke, lineWidth });
}
function ps5() {
  const root = new Layout({ x: -455, y: 342 });
  const ports = draw(
    'M -9 -1 L -2 -1 L -2 5 L -9 5 Z M 11 -1 L 23 -1 L 23 5 L 11 5 Z',
    undefined,
    color.muted,
    1.6,
  );
  root.add([
    // Concave upper plate, thick disc enclosure on the lower left, one center stand.
    draw('M -64 42 Q -6 34 37 35 L 44 54 Q -7 60 -61 54 Z', color.dark),
    draw('M -164 -16 Q -16 -8 155 -25 L 155 24 Q 10 16 -165 14 Z', color.dark),
    draw(
      'M -162 -35 Q -35 -22 168 -40 L 155 -25 Q -10 -12 -174 -14 Q -176 -25 -162 -35 Z',
      color.plastic,
    ),
    draw('M -173 14 Q -30 14 154 26 L 169 38 Q 27 23 -52 42 L -172 48 Z', color.slateLight),
    draw('M -151 27 Q -96 25 -44 27', undefined, color.dark, 4),
    ports,
    draw('M -131 -11 Q -21 -10 135 -21', undefined, color.slateLight, 2),
    draw(
      'M 99 -20 L 107 -13 M 111 -21 L 119 -14 M 123 -22 L 131 -15 M 135 -23 L 143 -16',
      undefined,
      color.muted,
      1.3,
    ),
    draw('M -184 62 Q -6 67 179 59', undefined, color.muted, 1.3),
  ]);
  return { root, ports };
}
function dualSense() {
  const root = new Layout({ x: 4, y: 358, scale: 0.96, rotation: -6 });
  root.add([
    draw('M -71 41 Q -2 48 75 40', undefined, color.muted, 1.4),
    // Soft, unequal grips; large touchpad and low sticks identify the DualSense.
    draw(
      'M -50 -28 C -37 -36 -27 -29 -14 -28 Q 1 -31 16 -27 C 31 -30 43 -33 55 -23 C 65 -11 73 10 74 27 C 75 43 63 46 53 34 L 32 13 Q 0 21 -31 13 L -51 34 C -62 47 -77 42 -74 26 C -72 6 -63 -18 -50 -28 Z',
      color.plastic,
    ),
    draw('M -24 -27 Q 0 -31 24 -26 L 28 -5 Q 1 4 -28 -5 Z', color.accent, color.dark, 2),
    draw(
      'M -32 11 Q -29 0 -18 0 Q -5 2 -8 15 Q -12 26 -24 23 Q -32 22 -32 11 Z M 9 11 Q 11 0 23 1 Q 35 3 32 16 Q 28 26 17 23 Q 9 22 9 11 Z',
      color.dark,
      color.ink,
      1.9,
    ),
    draw('M -48 -18 L -48 -1 M -57 -9 L -39 -9', undefined, color.dark, 3.2),
    new Circle({ x: 48, y: -18, size: 6, stroke: color.dark, lineWidth: 1.8 }),
    new Circle({ x: 58, y: -8, size: 6, stroke: color.dark, lineWidth: 1.8 }),
    draw(
      'M 45 -1 L 51 5 M 51 -1 L 45 5 M 35 -11 L 41 -11 L 41 -5 L 35 -5 Z',
      undefined,
      color.dark,
      1.8,
    ),
    draw('M -65 18 L -61 28 M -59 16 L -55 24', undefined, color.slate, 1.7),
    draw('M 55 19 Q 60 25 63 32', undefined, color.slate, 1.7),
  ]);
  return root;
}
function plant() {
  const root = new Layout({ x: 640, y: 201, opacity: 0.86 });
  root.add([
    draw('M -45 35 Q 0 40 43 33', undefined, color.muted, 1.3),
    draw(
      'M -1 0 Q -4 -53 1 -96 M -4 -24 Q -26 -37 -33 -59 M -2 -43 Q 25 -57 31 -76 M -2 -66 Q -20 -76 -30 -93',
      undefined,
      color.slateLight,
      2.3,
    ),
    draw(
      'M 1 -83 C -18 -92 -23 -117 -11 -125 C 9 -116 15 -95 1 -83 Z',
      color.slate,
      color.slateLight,
      2.2,
    ),
    draw(
      'M -25 -43 C -46 -34 -66 -49 -62 -63 C -43 -70 -27 -59 -25 -43 Z',
      color.wash,
      color.slateLight,
      2.2,
    ),
    draw(
      'M 18 -51 C 14 -76 34 -94 49 -87 C 56 -68 39 -49 18 -51 Z',
      color.slate,
      color.slateLight,
      2.2,
    ),
    draw(
      'M -23 -80 C -44 -77 -52 -93 -47 -104 C -31 -107 -19 -94 -23 -80 Z',
      color.wash,
      color.slateLight,
      2.2,
    ),
    draw(
      'M -38 -53 Q -31 -51 -25 -43 M -9 -106 Q -2 -98 1 -88 M 35 -75 Q 26 -64 20 -56',
      undefined,
      color.ink,
      1.3,
    ),
    draw('M -35 -4 Q 0 2 35 -4 L 27 28 Q -1 39 -28 28 Z', color.wash, color.muted, 2.2),
    draw('M -37 -8 Q -1 -15 38 -8 L 35 0 Q 0 6 -36 -1 Z', color.plastic, color.ink, 2.2),
    draw('M -24 6 Q -23 16 -20 23', undefined, color.slateLight, 2),
    draw('M 18 12 L 25 6 M 18 21 L 26 14', undefined, color.slateLight, 1.6),
  ]);
  return root;
}
function cabinet() {
  const root = new Layout({});
  const console = ps5();
  root.add([
    // Small side face and gently bowed edges give volume without colored surfaces.
    draw('M 714 243 L 728 252 L 726 433 L 714 424 Z', color.slate, color.muted, 2.2),
    draw('M -713 242 Q 0 238 714 243 L 714 424 Q 12 429 -711 423 Z', color.wash),
    draw('M -691 266 Q 2 264 691 267 L 690 403 Q -6 407 -691 401 Z', color.recess),
    draw(
      'M -242 266 L -242 404 M -225 266 L -225 404 M 225 266 L 225 404 M 242 266 L 242 404',
      undefined,
      color.ink,
      2.4,
    ),
    draw('M -737 225 Q -2 219 737 226 L 737 244 Q -1 250 -736 242 Z', color.slate, color.ink, 2.4),
    draw(
      'M -647 425 L -645 459 L -619 459 L -616 425 M 614 425 L 617 459 L 642 459 L 645 425',
      color.wash,
    ),
    draw(
      'M 685 382 L 698 369 M 686 395 L 698 383 M 685 410 L 698 397',
      undefined,
      color.muted,
      1.6,
    ),
    draw('M -679 254 Q -401 250 -278 254', undefined, color.muted, 1.4),
    console.root,
    dualSense(),
    draw('M 370 381 L 543 379 L 543 401 L 369 403 Z', color.wash),
    draw('M 380 363 L 531 364 L 531 379 L 380 380 Z', color.slate),
    draw('M 378 389 Q 445 387 533 388 M 385 370 L 514 370', undefined, color.muted, 1.5),
  ]);
  // Physical context stays quieter than the TV, console, and controller.
  for (const child of root.children()) {
    if (child instanceof Path) child.opacity(0.82);
  }
  return { root, console };
}
export function createRoom() {
  const room = new Layout({});
  const browser = createBrowserFrame();
  const furniture = cabinet();
  room.add([
    new Rect({ size: [6000, 4000], fill: color.paper }),
    draw(
      'M -797 467 Q -667 465 -580 469 M -545 469 Q -15 475 557 466 M 589 466 Q 728 463 794 465',
      undefined,
      color.muted,
      1.7,
    ),
    furniture.root,
    plant(),
    draw(
      'M -348 169 L -382 220 L -345 220 L -316 170 Z M 348 169 L 382 220 L 345 220 L 316 170 Z',
      color.dark,
    ),
    draw(
      'M -497 -417 Q -21 -422 496 -416 Q 515 -416 516 -396 L 516 166 Q 516 181 495 182 Q 1 185 -498 181 Q -516 181 -517 164 L -516 -396 Q -515 -415 -497 -417 Z',
      color.wash,
    ),
    draw('M 516 -397 L 527 -387 L 527 174 L 513 184 Z', color.slate, color.slateLight, 1.7),
    browser.root,
    draw('M -18 173 Q -1 172 17 173', undefined, color.muted, 1.5),
  ]);
  return {
    root: room,
    browser,
    console: furniture.console.root,
    consolePorts: furniture.console.ports,
  };
}
