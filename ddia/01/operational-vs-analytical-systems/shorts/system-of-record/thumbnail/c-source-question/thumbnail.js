import { C, database, mount, stroke, text } from '../shared/art.js';

const title =
  text(92, 320, 119, 'asıl kayıt.') +
  text(83, 457, 125, 'hatasız mı?', { family: 'serif', fill: C.blue });

const source = database(467, 1125, 2.85, {
  value: '',
  rotate: -7,
  inside:
    text(0, -7, 22, '#1042', { family: 'mono', anchor: 'middle', fill: C.muted }) +
    text(0, 50, 49, '185₺', { family: 'mono', anchor: 'middle', fill: C.blue }),
});

// The record remains intact; the question is about its guarantee, not its authority.
const question =
  '<g transform="rotate(9 850 850)">' +
  stroke('M 758 734 C 756 622 949 608 951 728 C 954 793 882 818 851 859 Q 834 881 837 924', {
    color: C.blue,
    width: 17,
  }) +
  stroke('M 836 986 l 1 3', { color: C.blue, width: 21 }) +
  '</g>';

mount(
  'asıl kayıt. hatasız mı? — system of record',
  title +
    source +
    question +
    text(480, 1580, 41, 'system of record', { family: 'serif', anchor: 'middle', fill: C.muted }),
);
