import { C, arrow, database, mount, paper, stroke, text } from '../shared/art.js';

const title =
  text(92, 310, 123, 'iki kayıt.') +
  text(82, 458, 144, 'tek karar.', { family: 'serif', fill: C.blue });

const copy = paper(
  683,
  763,
  480,
  310,
  text(-190, -91, 31, 'warehouse · kopya') +
    stroke('M -191 -57 Q 0 -61 191 -56', { width: 2, opacity: 0.4 }) +
    text(0, -10, 23, '#1042', { family: 'mono', anchor: 'middle', fill: C.muted }) +
    text(0, 100, 105, '180₺', { family: 'mono', anchor: 'middle' }),
  { rotate: 8 },
);

// The foreground source determines which value repairs the copy, not real-world truth.
const source = database(415, 1211, 2.65, {
  value: '',
  rotate: -7,
  inside:
    text(0, -8, 19, '#1042', { family: 'mono', anchor: 'middle', fill: C.muted }) +
    text(0, 52, 46, '185₺', { family: 'mono', anchor: 'middle', fill: C.blue }),
});

const repair =
  arrow(831, 1271, 870, 1010) +
  text(882, 1380, 30, 'aslına', { anchor: 'middle', fill: C.blue, rotate: -5 }) +
  text(877, 1418, 30, 'göre', { anchor: 'middle', fill: C.blue, rotate: -5 });

mount(
  'iki kayıt. tek karar. — system of record',
  title +
    copy +
    repair +
    source +
    text(408, 1620, 39, 'esas aldığımız kayıt', { anchor: 'middle', fill: C.blue }),
);
