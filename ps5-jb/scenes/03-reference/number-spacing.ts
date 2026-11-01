import { Txt } from '@motion-canvas/2d';
import { type SignalValue, unwrap } from '@motion-canvas/core';

/** IBM Plex Mono gives narrow spaces a full character; scale only the separator. */
export function compactNumber(label: Txt, value: SignalValue<string> = label.text()): Txt {
  label.children(() =>
    unwrap(value)
      .split('\u202f')
      .flatMap((part, index) =>
        index === 0 ? [part] : [new Txt({ text: ' ', fontSize: () => label.fontSize() / 3 }), part],
      ),
  );
  return label;
}
