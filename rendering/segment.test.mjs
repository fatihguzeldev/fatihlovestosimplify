import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('./segment.html', import.meta.url), 'utf8');
const expression = html.match(/range:\s*(\[[^\]]+\])/)[1];
const range = new Function('start', 'end', `return ${expression};`);
// Motion Canvas converts seconds to frames with Math.ceil(seconds * fps).
const frames = (start, end) => range(start, end).map((seconds) => Math.ceil(seconds * 60));

test('the 62413–63865 export contains exactly its requested inclusive frames', () => {
  assert.deepEqual(frames(62413, 63866), [62413, 63865]);
});

test('every supported frame survives the render-time round trip, including zero', () => {
  for (let frame = 0; frame < 1_000_000; frame++) {
    assert.deepEqual(frames(frame, frame + 1), [frame, frame]);
  }
});
