import assert from 'node:assert/strict';
import test from 'node:test';
import { renderFormat, videoMatches } from './video-format.mjs';

test('accepts native landscape and portrait projects without changing their dimensions', () => {
  assert.deepEqual(renderFormat({ width: 1920, height: 1080, fps: 60 }), {
    width: 1920,
    height: 1080,
    fps: 60,
  });
  assert.deepEqual(renderFormat({ width: 1080, height: 1920, fps: 60 }), {
    width: 1080,
    height: 1920,
    fps: 60,
  });
});

test('rejects invalid encoded dimensions and unsupported playback settings', () => {
  for (const patch of [
    { width: 0 },
    { height: -2 },
    { width: 1081 },
    { height: 1920.5 },
    { fps: 30 },
    { resolutionScale: 0.5 },
  ]) {
    assert.throws(() => renderFormat({ width: 1080, height: 1920, fps: 60, ...patch }));
  }
});

test('rejects a cached landscape segment for a portrait project, including frame mismatches', () => {
  const format = renderFormat({ width: 1080, height: 1920, fps: 60 });
  const stream = { width: 1080, height: 1920, r_frame_rate: '60/1', nb_read_frames: '120' };
  assert.equal(videoMatches(stream, format, 120), true);
  assert.equal(videoMatches({ ...stream, width: 1920, height: 1080 }, format, 120), false);
  assert.equal(videoMatches({ ...stream, nb_read_frames: '119' }, format, 120), false);
  assert.equal(videoMatches({ ...stream, r_frame_rate: '30/1' }, format, 120), false);
});
