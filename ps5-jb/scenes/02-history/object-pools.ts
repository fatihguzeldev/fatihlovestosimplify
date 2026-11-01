import { Layout, Line } from '@motion-canvas/2d';
import { record, strip, text } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** Temporary operation tables. Row numbers never appear on the object diagrams. */
export function objectPools() {
  const root = new Layout({});
  const columns = [-370, 370].map((x, side) => {
    const column = new Layout({ position: [x, -30] });
    const title = text(side ? 'okurken' : 'yazarken', 0, -220, 30, palette.muted);
    const indexHeading = text('satır', -270, -170, 22, palette.muted);
    const faces = [0, 1].map(() => record(480, 82, 0, 0));
    const indices = [0, 1].map((i) => text(String(i), -270, 0, 32, palette.ink, true));
    const labels = [side ? 'yeni array' : 'ilk array', side ? 'yeni cart' : 'ilk cart'].map(
      (value) => text(value, 45, 0, 30),
    );
    const glyphs = [0, 1].map((i) => {
      const glyph = new Layout({ x: -160 });
      if (i === 0) {
        glyph.add([
          record(38, 44, 0, 0),
          new Line({
            points: [
              [-19, 0],
              [19, 0],
            ],
            stroke: palette.rule,
            lineWidth: 1.5,
          }),
        ]);
      } else glyph.add(text('{ }', 0, 0, 32, palette.muted, true));
      return glyph;
    });
    const rows = [0, 1].map((i) => {
      const row = new Layout({ y: -105 + i * 100 });
      row.add([faces[i], indices[i], glyphs[i], labels[i]]);
      return row;
    });
    column.add([title, indexHeading, ...rows]);
    return { root: column, rows, title, indexHeading, faces, indices, glyphs, labels };
  });
  const tape = strip(['referans', '1'], 0, 250, 145);
  tape.values[0].fontSize(25);
  root.add([...columns.map((column) => column.root), tape.root]);
  return { root, columns, tape };
}
