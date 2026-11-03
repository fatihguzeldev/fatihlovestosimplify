import { C, text, database, mount } from '../shared/art.js';

const heading =
  text(92, 320, 112, 'aynı satış.') +
  text(84, 457, 139, 'iki tutar.', { family: 'serif', fill: C.blue });

const source =
  text(347, 610, 34, 'sales database', { anchor: 'middle' }) +
  database(347, 867, 2.18, {
    value: '',
    rotate: -7,
    inside:
      text(0, -6, 20, '#1042', { family: 'mono', anchor: 'middle', fill: C.muted }) +
      text(0, 51, 48, '185₺', { family: 'mono', anchor: 'middle', fill: C.blue }),
  });

const copy =
  database(713, 1315, 2.04, {
    value: '',
    rotate: 7,
    inside:
      text(0, -6, 20, '#1042', { family: 'mono', anchor: 'middle', fill: C.muted }) +
      text(0, 51, 48, '180₺', { family: 'mono', anchor: 'middle' }),
  }) + text(713, 1635, 34, 'warehouse · kopya', { anchor: 'middle' });

const conflict = text(765, 981, 133, '≠', {
  family: 'mono',
  anchor: 'middle',
  fill: C.blue,
  rotate: 11,
});

mount('aynı satış. iki tutar. — system of record', heading + source + conflict + copy);
