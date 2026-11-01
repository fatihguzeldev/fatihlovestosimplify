import { Layout, Path } from '@motion-canvas/2d';
import { all } from '@motion-canvas/core';
import { fileDrawing, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** Keep the current entry itself when the overview gives way to the cart experiment. */
export function historyIntro() {
  const overview = new Layout({ opacity: 0 });
  const title = text('History API', 0, -180, 44);
  const entries = new Layout({ opacity: 0 });
  overview.add([title, entries]);
  for (const [index, path] of ['/products', '/product'].entries()) {
    const entry = new Layout({ position: [-420 + index * 420, 80], opacity: 0.65 });
    entry.add([fileDrawing(300, 120, 0, 0), text(path, 0, 0, 30, palette.muted, true)]);
    entries.add(entry);
  }
  for (const x of [-210, 210]) {
    const connection = wire(
      [
        [x - 48, 80],
        [x + 48, 80],
      ],
      palette.muted,
      2,
    );
    connection.startArrow(true);
    connection.arrowSize(9);
    entries.add(connection);
  }

  const history = new Layout({ position: [420, 80], opacity: 0 });
  const face = fileDrawing(300, 120, 0, 0);
  face.stroke(palette.accent);
  const label = text('/cart', 0, 0, 30, palette.ink, true);
  const data = text('data', 0, 24, 30, palette.accent, true);
  data.opacity(0);
  const currentPage = text('bu sayfa', 0, 100, 26, palette.accent);
  history.add([face, label, data, currentPage]);

  // Overlay the existing toolbar glyphs in their own coordinate system.
  const navigation = new Path({
    data: 'M -459 -263 L -468 -255 L -458 -246 M -428 -263 L -419 -255 L -428 -247',
    stroke: palette.accent,
    lineWidth: 2.8,
    lineCap: 'round',
    lineJoin: 'round',
    opacity: 0,
  });

  function* show() {
    yield* overview.opacity(1, 0.5);
  }

  function* showEntries() {
    yield* all(entries.opacity(1, 0.6), history.opacity(1, 0.6));
  }

  function* attachData() {
    yield* all(label.y(-20, 0.45), data.opacity(1, 0.45));
  }

  function* focusCart() {
    yield* all(
      overview.opacity(0, 0.5),
      currentPage.opacity(0, 0.5),
      history.position([520, 270], 0.8),
      label.opacity(0, 0.25),
    );
    label.text('history kaydı');
    label.fontFamily('IBM Plex Sans');
    label.fontSize(32);
    yield* label.opacity(1, 0.25);
    overview.remove();
    navigation.remove();
  }

  function* writeCart() {
    yield* all(data.opacity(0, 0.3), label.y(0, 0.3), face.stroke(palette.rule, 0.3));
  }

  return { overview, history, navigation, show, showEntries, attachData, focusCart, writeCart };
}
