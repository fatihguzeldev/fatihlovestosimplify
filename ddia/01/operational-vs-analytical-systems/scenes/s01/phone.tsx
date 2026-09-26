import {Circle, Layout, Line, Path, Rect, Txt} from '@motion-canvas/2d';
import {createSignal} from '@motion-canvas/core';
import {theme} from '../../theme';

const {foreground, accent} = theme.colors;
const ink = '#111315';

function label(value: string, fontSize: number, x = 0, y = 0) {
  return new Txt({
    text: value,
    fontFamily: theme.fontFamily.sans,
    fontSize,
    fill: foreground,
    x,
    y,
    textWrap: false,
  });
}

function stroke(data: string, color: string = foreground, width = 3) {
  return new Path({data, stroke: color, lineWidth: width, lineCap: 'round', lineJoin: 'round'});
}

export function createPhone(name: string) {
  const root = new Layout({});
  const body = new Path({
    data: 'M -163 -428 C -224 -430 -249 -403 -249 -345 L -246 345 C -246 405 -223 431 -166 432 L 166 428 C 221 429 247 403 248 347 L 250 -342 C 251 -401 226 -426 167 -427 Z',
    fill: '#1c1e20',
    stroke: foreground,
    lineWidth: 4,
    lineJoin: 'round',
  });
  const screen = new Rect({width: 464, height: 820, radius: 62, fill: ink, clip: true});
  root.add([
    new Rect({position: [-252, -250], size: [7, 36], radius: 3, fill: foreground}),
    new Rect({position: [-251, -169], size: [7, 66], radius: 3, fill: foreground}),
    new Rect({position: [-251, -81], size: [7, 66], radius: 3, fill: foreground}),
    new Rect({position: [253, -144], size: [7, 105], radius: 3, fill: foreground}),
    body,
    screen,
    new Rect({size: () => screen.size(), radius: () => screen.radius(), stroke: '#62676d', lineWidth: 2}),
  ]);

  screen.add(new Rect({position: [0, -320], size: [464, 180], fill: '#191c1f'}));
  const clock = label('14:32', 21, -156, -365);
  screen.add(clock);
  screen.add(new Rect({position: [0, -367], size: [132, 35], radius: 20, fill: '#050505'}));
  screen.add(new Circle({position: [42, -367], size: 9, fill: '#1b2b3b'}));
  [8, 12, 17, 22].forEach((height, i) => {
    screen.add(new Rect({position: [115 + i * 8, -362 - height / 2], size: [5, height], radius: 1.4, fill: foreground}));
  });
  screen.add(new Rect({position: [174, -373], size: [32, 17], radius: 4, stroke: foreground, lineWidth: 2}));
  screen.add(new Rect({position: [171, -373], size: [22, 11], radius: 2, fill: foreground}));
  screen.add(new Line({points: [[193, -376], [193, -370]], stroke: foreground, lineWidth: 3, lineCap: 'round'}));

  screen.add(stroke('M -190 -298 L -202 -285 L -190 -272', accent, 4));
  const avatar = new Layout({position: [-151, -284]});
  avatar.add(new Circle({size: 55, fill: '#304156'}));
  avatar.add(stroke('M -21 25 C -19 9 18 9 21 25', accent, 2.5));
  avatar.add(new Path({data: 'M -12 -13 C -9 -26 14 -22 13 -6 L 10 4 Q 0 16 -10 3 Z', fill: '#e2e5e9', rotation: -8}));
  avatar.add(new Path({data: 'M -14 -8 C -21 -29 15 -33 17 -8 L 9 -16 L -1 -10 L -5 -14 L -12 -7 Z', fill: '#0d0f11', rotation: -8}));
  avatar.add(stroke('M -6 -1 L -5 0 M 5 -2 L 6 -1 M -2 6 Q 2 9 5 5', '#3c3532', 1.7));
  screen.add(avatar);
  const contact = label(name, 29, -107, -297);
  contact.offset([-1, 0]);
  contact.fontWeight(500);
  const status = label('çevrimiçi', 18, -105, -267);
  status.offset([-1, 0]);
  status.fill('#acb4bd');
  screen.add([contact, status]);
  screen.add(stroke('M 110 -294 L 135 -294 Q 139 -294 139 -290 L 139 -276 Q 139 -272 135 -272 L 110 -272 Q 106 -272 106 -277 L 106 -289 Q 106 -294 110 -294 M 140 -288 L 151 -295 L 151 -271 L 140 -277 Z', accent, 2.5));
  screen.add(stroke('M 180 -299 C 173 -295 181 -281 185 -277 C 190 -272 202 -267 204 -274 L 198 -282 L 193 -278 C 187 -281 184 -285 184 -289 L 188 -292 Z', accent, 2.5));

  const wallpaper = new Layout({opacity: 0.06});
  for (const [x, y, rotation] of [[-145, -100, -14], [150, 80, 19], [-110, 235, -17]] as const) {
    const doodle = new Layout({position: [x, y], rotation});
    doodle.add(stroke('M -19 -17 Q -26 -17 -26 -9 L -26 8 Q -26 16 -18 16 L -10 16 L -18 26 L 1 16 L 21 16 Q 29 16 29 7 L 29 -8 Q 29 -17 20 -17 Z', foreground, 2));
    doodle.add(stroke('M -14 -5 L 15 -5 M -14 4 L 5 4', foreground, 2));
    wallpaper.add(doodle);
  }
  wallpaper.add(stroke('M 116 -154 L 123 -136 L 142 -128 L 123 -121 L 116 -102 L 110 -122 L 92 -129 L 110 -136 Z', foreground, 2));
  screen.add(wallpaper);
  const chat = new Layout({y: -30});
  screen.add(chat);

  const keyboardProgress = createSignal(0);
  const keyboard = new Layout({y: () => 530 - 250 * keyboardProgress()});
  keyboard.add(new Rect({size: [464, 240], fill: '#25282c'}));
  ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].forEach((row, rowIndex) => {
    [...row].forEach((key, i) => {
      const keyX = (i - (row.length - 1) / 2) * 43;
      const keyY = -81 + rowIndex * 50;
      keyboard.add(new Rect({position: [keyX, keyY], size: [37, 42], radius: 6, fill: '#45494f'}));
      keyboard.add(label(key, 24, keyX, keyY - 1));
    });
  });
  keyboard.add(new Rect({position: [0, 70], size: [218, 37], radius: 6, fill: '#45494f'}));
  keyboard.add(label('boşluk', 17, 0, 69));
  keyboard.add(label('123', 19, -177, 69));
  keyboard.add(label('↵', 27, 176, 69));
  screen.add(keyboard);

  const composer = new Rect({x: -38, y: () => 335 - 215 * keyboardProgress(), size: [365, 68], radius: 34, fill: '#282c30'});
  const input = label('', 28, -165);
  input.offset([-1, 0]);
  composer.add(input);
  const send = new Layout({x: 187, y: () => composer.y()});
  send.add(new Circle({size: 60, fill: accent}));
  const sendIcon = new Path({data: 'M -13 -15 L 17 0 L -13 15 L -8 3 L 7 0 L -8 -3 Z', fill: '#101720', rotation: -12});
  send.add(sendIcon);
  screen.add([composer, send]);
  screen.add(new Rect({position: [0, 395], size: [464, 30], fill: ink}));
  screen.add(new Rect({position: [0, 394], size: [158, 5], radius: 3, fill: foreground}));
  return {root, screen, chat, composer, input, send, sendIcon, keyboardProgress, contact, status, clock};
}

export function createBubble(value: string, outgoing: boolean, time: string, width = 380) {
  const root = new Layout({});
  const fill = outgoing ? '#243e5a' : '#2a2e33';
  const body = new Rect({width, height: 74, radius: outgoing ? [23, 23, 6, 23] : [6, 23, 23, 23], fill});
  const tail = new Path({
    data: outgoing ? 'M 0 0 L 17 14 Q 5 15 -5 7 Z' : 'M 0 0 L -17 -14 Q -4 -15 5 -7 Z',
    x: outgoing ? width / 2 - 5 : -width / 2 + 5,
    y: () => outgoing ? body.height() / 2 - 15 : -body.height() / 2 + 15,
    fill,
  });
  const text = label(value, 25, -width / 2 + 22, -12);
  text.offset([-1, 0]);
  const stamp = label(time, 17, width / 2 - (outgoing ? 56 : 22), 15);
  stamp.offset([1, 0]);
  stamp.fill('#aeb7c1');
  stamp.y(() => body.height() / 2 - 22);
  const checks = new Layout({x: width / 2 - 31, y: () => body.height() / 2 - 23, opacity: outgoing ? 1 : 0});
  checks.add(stroke('M -13 0 L -8 5 L 2 -6 M -4 3 L -1 5 L 9 -6', accent, 2.2));
  root.add([tail, body, text, stamp, checks]);
  return {root, body, text, stamp, checks};
}
