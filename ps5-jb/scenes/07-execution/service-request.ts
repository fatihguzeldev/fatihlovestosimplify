import { Layout } from '@motion-canvas/2d';
import { frame, record, text, wire } from '../../shared/drawing';
import { palette } from '../../shared/theme';

export function serviceRequest() {
  const root = new Layout({});
  const user = record(330, 150, -550, 0);
  const userName = text('sayfayı çalıştıran process', -550, -160, 32, palette.muted);
  const operation = text('read request', -550, 0, 31, palette.accent, true);
  const boundary = frame(820, 540, 330, 0, palette.rule, 'transparent');
  const kernelName = text('kernel', 330, -215, 34);
  const request = record(370, 160, 330, 0);
  const requestName = text('başlatılan iş', 330, 0, 34);
  const path = wire(
    [
      [-385, 0],
      [145, 0],
    ],
    palette.accent,
  );
  root.add([boundary, user, userName, operation, kernelName, request, requestName, path]);
  return { root, user, operation, boundary, request, requestName, path };
}
