import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../../common/fonts';
import { arrow, label, palette, panel, replace } from '../../shared/portrait';

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();

  const process = new Layout({ position: [-20, -510] });
  const processFace = panel(740, 250, 0, 0);
  const mode = label('user mode', 0, 62, 46, palette.muted);
  process.add([
    processFace,
    label('process', 0, -170, 48),
    label('open(file)', 0, -35, 50, palette.ink, true),
    mode,
  ]);

  const kernel = new Layout({ position: [-20, -10] });
  const kernelFace = panel(800, 560, 0, 0, palette.rule);
  const credentials = new Layout({ opacity: 0 });
  const credentialsFace = panel(620, 180, 0, -15);
  const credentialsName = label('kimlik bilgileri', 0, -155, 46, palette.muted);
  const uidName = label('kullanıcı', -160, -45, 42, palette.muted);
  const uid = label('1000', 115, -45, 60, palette.ink, true);
  const group = label('grup', -160, 30, 42, palette.muted);
  const groupValue = label('1000', 115, 30, 44, palette.muted, true);
  credentials.add([credentialsFace, credentialsName, uidName, uid, group, groupValue]);
  const result = label('istek', 0, 180, 48, palette.muted);
  kernel.add([kernelFace, label('kernel', -275, -225, 44, palette.muted), credentials, result]);

  const file = new Layout({ position: [-20, 500] });
  const fileFace = panel(620, 170, 0, 0);
  const requirement = label('root gerekli', 0, 30, 44, palette.muted);
  requirement.opacity(0);
  file.add([fileFace, label('dosya', 0, -37, 48), requirement]);
  const request = arrow([
    [-20, -385],
    [-20, -290],
  ]);
  request.end(0);
  const access = arrow([
    [-20, 270],
    [-20, 415],
  ]);
  access.end(0);
  view.add([process, kernel, file, request, access]);

  yield* request.end(1, 0.4);
  yield* waitUntil('identity');
  yield* credentials.opacity(1, 0.35);
  yield* waitUntil('root-required');
  yield* requirement.opacity(1, 0.3);
  yield* waitUntil('deny');
  yield* all(replace(result, 'reddedildi'), fileFace.stroke(palette.accent, 0.25));
  result.fill(palette.accent);
  yield* waitUntil('credentials');
  yield* replace(credentialsName, 'credentials');
  yield* waitUntil('uid');
  yield* replace(uidName, 'UID');
  yield* waitUntil('root-is-zero');
  yield* all(requirement.fill(palette.accent, 0.25), credentialsFace.stroke(palette.accent, 0.25));
  yield* waitUntil('identity-write');
  yield* credentialsFace.fill(palette.accentWash, 0.3);
  yield* waitUntil('uid-zero');
  yield* all(replace(uid, '0'), replace(groupValue, '0'));
  uid.fill(palette.accent);
  groupValue.fill(palette.accent);
  yield* credentialsFace.fill(palette.surface, 0.25);
  yield* waitUntil('retry');
  request.end(0);
  yield* all(request.end(1, 0.45), replace(result, 'istek'), fileFace.stroke(palette.rule, 0.3));
  result.fill(palette.muted);
  yield* waitUntil('allow');
  yield* replace(result, 'izin verildi');
  result.fill(palette.accent);
  yield* all(access.end(1, 0.4), fileFace.stroke(palette.accent, 0.35));
  yield* waitUntil('same-process');
  yield* all(processFace.stroke(palette.accent, 0.3), request.stroke(palette.muted, 0.3));
  yield* waitUntil('user-mode');
  yield* all(mode.fill(palette.accent, 0.25), mode.fontSize(52, 0.25));
  yield* waitUntil('cpu-mode');
  yield* all(credentialsFace.stroke(palette.rule, 0.3), mode.fill(palette.accent, 0.3));
  yield* waitUntil('end');
});
