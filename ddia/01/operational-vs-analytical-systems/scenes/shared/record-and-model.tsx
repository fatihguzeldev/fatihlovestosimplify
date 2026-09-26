import {Layout} from '@motion-canvas/2d';
import {theme} from '../../theme';
import {accent, muted, paper, text} from './drawing';

export function recordAndModel() {
  const root = new Layout({});
  const cards = ['sales database', 'warehouse', 'recommendation service'].map((name, i) => {
    const card = paper(450, 270, '#101315');
    card.root.position([-575 + i * 575, 75]);
    card.root.add([
      text(name, 26, {y: -84, fill: muted}),
      text(i === 2 ? 'model v1' : '#1042', 46, {y: -5, fill: accent, fontFamily: theme.fontFamily.mono}),
      text(i === 2 ? 'training data → model' : 'amount: 185', i === 2 ? 24 : 29, {y: 78, fontFamily: theme.fontFamily.mono}),
    ]);
    root.add(card.root);
    return card;
  });
  return {root, cards};
}
