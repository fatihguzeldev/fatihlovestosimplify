import { Layout } from '@motion-canvas/2d';
import { frame, memory, text } from '../../shared/drawing';
import { palette } from '../../shared/theme';

/** A carried reminder of the already-shown records, not a success badge. */
export function authorityRecord(x = 400, y = -355) {
  const root = new Layout({ position: [x, y] });
  const uid = text('uid 0', -210, 0, 27, palette.accent, true);
  const filesystem = text('filesystem', -20, 0, 27, palette.muted);
  const platform = text('platform', 180, 0, 27, palette.muted);
  root.add([uid, filesystem, platform]);
  return { root, uid, filesystem, platform };
}

export function nativeReady() {
  const root = new Layout({});
  const process = frame(1600, 900, 0, 10, palette.rule, 'transparent');
  const name = text('aynı process', -520, -355, 31, palette.muted);
  const area = memory(500, 230, -400, 60);
  const areaName = text('kod alanı', -400, 60, 34);
  const authority = authorityRecord();
  const records = new Layout({ position: [-400, 0] });
  records.add([
    frame(480, 250, 0, 0, palette.rule, 'transparent'),
    text('değişen process kayıtları', 0, -180, 31, palette.muted),
    text('uid 0', 0, -70, 34, palette.accent, true),
    text('filesystem root: /', 0, 0, 31),
    text('platform izinleri', 0, 70, 31),
  ]);
  const pipes = new Layout({ position: [400, 0] });
  pipes.add([
    frame(340, 170, 0, 0, palette.accent, 'transparent', 16),
    text('çalışma pipe’ları', 0, -130, 30, palette.muted),
    text('memory read/write', 0, 0, 28, palette.accent, true),
  ]);
  root.add([process, name, area, areaName, records, pipes, authority.root]);
  return { root, process, name, area, areaName, pipes, authority };
}
