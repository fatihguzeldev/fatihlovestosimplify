import { Layout } from '@motion-canvas/2d';
import { consoleDrawing, frame, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

export function consoleScreen() {
  const root = new Layout({});
  const device = consoleDrawing();
  device.position([-690, 80]);
  device.scale(0.55);
  const display = new Layout({ position: [130, -30] });
  display.add(frame(1160, 690, 0, 0, '#65676e', '#0d0e10', 12));
  const page = new Layout({});
  page.add(frame(1118, 648, 0, 0, 'transparent', '#111215', 3));
  const name = text('relapse', -455, -238, 40);
  name.offset([-1, 0]);
  page.add(name);
  const logs = [740, 585, 790, 650, 475].map((width, index) => {
    const line = frame(
      width,
      3,
      -455 + width / 2,
      -130 + index * 46,
      'transparent',
      index === 4 ? palette.rule : '#41434a',
    );
    return line;
  });
  page.add(logs);
  display.add(page);
  display.add(frame(20, 82, 0, 386, 'transparent', '#34363c'));
  display.add(frame(290, 12, 0, 430, 'transparent', '#565960', 5));
  const cable = wire(
    [
      [-651, 242],
      [-651, 423],
      [130, 423],
    ],
    '#41434a',
    3,
    false,
  );
  root.add([cable, display, device]);
  return { root, device, display, page, logs, name };
}
