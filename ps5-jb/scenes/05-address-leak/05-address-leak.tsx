import { Txt, makeScene2D } from '@motion-canvas/2d';
import { all, waitUntil } from '@motion-canvas/core';
import { loadFonts } from '../../../common/fonts';
import { preparationPose } from '../04-address-need/preparation-visuals';
import { text } from '../../shared/drawing';
import { palette } from '../../shared/theme';
import {
  conversionStory,
  getterStory,
  hostStory,
  internalStory,
  proxyStory,
  scopeStory,
} from './leak-story';

function* replaceText(label: Txt, value: string, duration = 0.5) {
  yield* label.opacity(0, duration / 2);
  label.text(value);
  yield* label.opacity(1, duration / 2);
}

export default makeScene2D(function* (view) {
  view.fill(palette.paper);
  yield loadFonts();
  const incoming = preparationPose(false);
  const outgoing = preparationPose(true);
  const knownReference = outgoing.referenceValue.text();
  outgoing.referenceValue.text('adres');
  outgoing.root.opacity(0);
  const javascript = text('sayfanın JavaScript’i', -500, -390, 28, palette.muted);
  javascript.opacity(0);
  const ordinary = getterStory();
  ordinary.total.text('total');
  const proxy = proxyStory();
  proxy.receiver.text('receiver');
  proxy.receiver.opacity(0);
  ordinary.thisValue.text('this = receiver');
  const lexical = scopeStory();
  const internal = internalStory();
  const conversion = conversionStory();
  const host = hostStory();
  conversion.wrapperName.text('hazırlanan wrapper');
  const normalNodes = [
    outgoing.real,
    outgoing.a,
    outgoing.originalPath,
    outgoing.fakePath,
    outgoing.targetMark,
    outgoing.result,
  ];
  normalNodes.forEach((node) => node.opacity(0.18));
  view.add([
    incoming.root,
    ordinary.root,
    proxy.root,
    lexical.root,
    internal.root,
    conversion.root,
    host.root,
    javascript,
    outgoing.root,
  ]);

  yield* waitUntil('reference');
  yield* all(
    ...[
      incoming.real,
      incoming.a,
      incoming.originalPath,
      incoming.fakePath,
      incoming.targetMark,
      incoming.result,
    ].map((node) => node.opacity(0.18, 0.7)),
  );

  yield* waitUntil('example');
  yield* incoming.root.opacity(0, 0.6);
  yield* ordinary.root.opacity(1, 0.6);

  yield* waitUntil('calculation');
  yield* all(
    ordinary.functionPath.end(1, 0.6),
    ordinary.functionRoot.opacity(1, 0.5),
    replaceText(ordinary.total, 'get total()', 0.4),
  );

  yield* waitUntil('getter');
  yield* ordinary.functionName.opacity(1, 0.4);
  yield* ordinary.total.fill(palette.ink, 0.4);

  yield* waitUntil('getter-result-path');
  yield* ordinary.resultPath.end(1, 0.6);
  yield* waitUntil('getter-result');
  yield* ordinary.result.opacity(1, 0.4);

  yield* waitUntil('intercept');
  yield* all(
    ...[
      ordinary.functionRoot,
      ordinary.functionPath,
      ordinary.resultPath,
      ordinary.result,
      ordinary.readPath,
    ].map((node) => node.opacity(0, 0.5)),
  );
  yield* all(ordinary.request.position([-650, 0], 0.8), ordinary.cart.position([570, 0], 0.8));
  yield* proxy.root.opacity(1, 0.5);

  yield* waitUntil('proxy-request');
  yield* proxy.input.end(1, 0.6);

  yield* waitUntil('proxy-name');
  yield* proxy.name.opacity(1, 0.4);

  yield* waitUntil('proxy-receiver');
  yield* proxy.receiver.opacity(1, 0.35);

  yield* waitUntil('receiver-this');
  yield* all(proxy.onward.end(1, 0.6), ordinary.thisValue.opacity(1, 0.4));

  yield* waitUntil('receiver-cart');
  yield* all(
    replaceText(proxy.receiver, 'receiver: cart', 0.4),
    replaceText(ordinary.thisValue, 'this = cart', 0.4),
    proxy.receiver.fill(palette.accent, 0.4),
    ordinary.total.fill(palette.accent, 0.4),
  );

  yield* waitUntil('names');
  lexical.functionRoot.opacity(0);
  lexical.binding.opacity(0);
  lexical.root.opacity(1);
  // Transfer the same visible cart into a visible parent before retiring the Proxy.
  ordinary.cart.reparent(lexical.root);
  yield* all(
    ordinary.root.opacity(0, 0.4),
    proxy.root.opacity(0, 0.4),
    ordinary.thisValue.opacity(0, 0.3),
  );
  yield* all(
    ordinary.cart.position([530, 300], 0.8),
    ordinary.cartFace.size([400, 220], 0.8),
    ordinary.cartName.y(-70, 0.8),
    ordinary.price.y(0, 0.8),
    ordinary.quantity.y(65, 0.8),
    ordinary.total.opacity(0, 0.4),
    lexical.functionRoot.opacity(1, 0.6),
  );

  yield* waitUntil('name-binding');
  yield* all(lexical.binding.opacity(1, 0.5), lexical.path.end(1, 0.6));

  yield* waitUntil('object-binding');
  yield* lexical.objectPath.end(1, 0.5);

  yield* waitUntil('scope');
  yield* lexical.name.opacity(1, 0.4);

  yield* waitUntil('real-path');
  // Retire the example. The engine scope below is a separate actual actor.
  yield* lexical.root.opacity(0, 0.6);
  ordinary.request.reparent(view);
  ordinary.request.text('super.foo');
  ordinary.request.position([-650, 0]);
  ordinary.request.opacity(0);
  proxy.property.text('property: foo');
  proxy.receiver.text('receiver');
  proxy.onward.opacity(0);
  proxy.input.end(0);
  yield* all(
    ordinary.request.opacity(1, 0.5),
    proxy.root.opacity(1, 0.5),
    internal.root.opacity(1, 0.5),
    internal.scope.opacity(1, 0.5),
  );

  yield* waitUntil('engine-request');
  yield* proxy.input.end(1, 0.6);

  yield* waitUntil('scope-receiver');
  yield* proxy.scopePath.end(1, 0.6);
  yield* replaceText(proxy.receiver, 'receiver: scope');
  yield* proxy.receiver.fill(palette.accent, 0.4);

  yield* waitUntil('return-scope');
  yield* proxy.returnValue.opacity(1, 0.4);

  yield* waitUntil('scope-leak');
  yield* all(proxy.root.opacity(0, 0.6), internal.origin.opacity(0, 0.6));
  yield* all(
    internal.scope.position([-500, 0], 1),
    ordinary.request.position([-500, -300], 1),
    javascript.opacity(1, 0.5),
  );
  yield* replaceText(ordinary.request, 'scope = super.foo');

  yield* waitUntil('getter-record');
  yield* all(
    ordinary.request.opacity(0, 0.5),
    internal.scope.position([-630, 0], 0.8),
    internal.scopeFace.size([320, 240], 0.8),
    internal.scopeName.y(-190, 0.8),
    replaceText(internal.scopeValue, 'g: getter'),
  );

  yield* waitUntil('getter-function');
  yield* internal.carrier.opacity(1, 0.5);

  yield* waitUntil('read-getter');
  yield* internal.access.opacity(1, 0.4);

  yield* waitUntil('returned-getter-record');
  yield* all(
    internal.cell.opacity(1, 0.5),
    internal.returned.opacity(1, 0.5),
    internal.accessPath.end(1, 0.7),
    internal.getterPath.end(1, 0.7),
  );

  yield* waitUntil('getter-reference');
  yield* internal.getterPath.stroke(palette.accent, 0.4);

  yield* waitUntil('target-reference');
  yield* all(
    ...[internal.scope, internal.access, internal.accessPath, internal.returned, javascript].map(
      (node) => node.opacity(0, 0.5),
    ),
  );
  yield* all(
    internal.cell.position([-500, 0], 0.8),
    internal.cellFace.width(390, 0.8),
    internal.carrier.position([90, 0], 0.8),
    internal.getterPath.points(
      [
        [-290, -45],
        [-95, -45],
      ],
      0.8,
    ),
  );

  yield* waitUntil('function-property');
  yield* internal.carrierReference.opacity(1, 0.4);

  yield* waitUntil('prepared-object');
  yield* internal.host.opacity(1, 0.5);

  yield* waitUntil('host-reference');
  yield* internal.hostPath.end(1, 0.7);

  yield* waitUntil('convert');
  yield* all(internal.getterPath.opacity(0, 0.25), internal.hostPath.opacity(0, 0.25));
  // The wrapper surrounds the same record; it does not turn the record into a Symbol.
  // reparent preserves transforms, not ancestor opacity. Make the destination
  // visible before transferring any actor; only its new decorations are hidden.
  conversion.root.opacity(1);
  internal.cell.reparent(conversion.wrapper);
  for (const node of [internal.carrier, internal.host, internal.getterPath, internal.hostPath]) {
    node.reparent(conversion.root);
  }
  internal.root.opacity(0);
  yield* all(
    internal.cell.position([0, 0], 0.8),
    internal.cellFace.size([380, 180], 0.8),
    internal.cellName.y(-120, 0.8),
    // Descend before moving left so the function's title never crosses the record.
    internal.carrier.y(330, 0.8),
    internal.carrierFace.size([360, 160], 0.8),
    internal.carrierName.y(-130, 0.8),
    internal.carrierCode.opacity(0, 0.5),
    internal.carrierReference.y(0, 0.8),
    internal.host.position([500, 330], 0.8),
    internal.hostFace.size([360, 160], 0.8),
    internal.hostField.size([300, 90], 0.8),
    internal.hostField.y(0, 0.8),
    internal.hostName.y(-130, 0.8),
    internal.hostView.y(0, 0.8),
  );
  yield* internal.carrier.x(-520, 0.65);
  internal.getterPath.points([
    [-725, -125],
    [-805, -125],
    [-805, 330],
    [-715, 330],
  ]);
  internal.hostPath.points([
    [-325, 330],
    [305, 330],
  ]);

  yield* waitUntil('wrapper');
  yield* all(
    conversion.wrapperFace.opacity(1, 0.45),
    conversion.wrapperName.opacity(1, 0.45),
    conversion.expression.opacity(1, 0.45),
    internal.getterPath.opacity(1, 0.4),
    internal.hostPath.opacity(1, 0.4),
  );

  yield* waitUntil('wrapper-kind');
  yield* all(
    replaceText(conversion.wrapperName, 'Symbol wrapper', 0.4),
    conversion.expression.fill(palette.accent, 0.4),
    internal.getter.fill(palette.accent, 0.4),
  );

  yield* waitUntil('normal-symbol');
  yield* all(
    internal.getterPath.opacity(0, 0.25),
    internal.hostPath.opacity(0, 0.25),
    internal.getter.fill(palette.ink, 0.25),
  );
  // Clear the destination before the wrapper enters the function's lower row.
  yield* all(
    conversion.expression.opacity(0, 0.35),
    internal.carrier.opacity(0, 0.35),
    internal.host.opacity(0, 0.35),
  );
  yield* conversion.wrapper.position([-520, 260], 0.8);

  yield* waitUntil('symbol-value');
  yield* conversion.symbol.opacity(1, 0.45);

  yield* waitUntil('symbol-description');
  conversion.symbolDescription.text('description');
  yield* conversion.symbolDescription.opacity(1, 0.35);

  yield* waitUntil('symbol-etiket');
  yield* replaceText(conversion.symbolDescription, 'description: etiket', 0.4);

  yield* waitUntil('to-string');
  yield* all(conversion.call.opacity(1, 0.45), conversion.path.end(1, 0.6));

  yield* waitUntil('symbol-result');
  yield* all(conversion.resultPath.end(1, 0.5), conversion.result.opacity(1, 0.5));

  yield* waitUntil('wrong-type');
  yield* all(
    conversion.symbol.opacity(0, 0.4),
    conversion.result.opacity(0, 0.4),
    conversion.path.opacity(0, 0.4),
    conversion.resultPath.opacity(0, 0.4),
  );
  yield* conversion.wrapper.position([-520, -80], 0.8);
  yield* all(
    conversion.expression.opacity(1, 0.5),
    conversion.expression.fill(palette.accent, 0.5),
    conversion.path.stroke(palette.accent, 0.5),
  );
  // The lower row returns only after the wrapper has completely cleared it.

  yield* waitUntil('restore-chain');
  yield* all(internal.carrier.opacity(1, 0.6), internal.host.opacity(1, 0.6));
  yield* all(internal.getterPath.opacity(1, 0.4), internal.hostPath.opacity(1, 0.4));

  yield* waitUntil('type-confusion');
  yield* all(
    conversion.assumption.fill(palette.accent, 0.4),
    internal.getter.fill(palette.accent, 0.4),
  );

  yield* waitUntil('string-call');
  yield* conversion.path.opacity(1, 0.5);

  yield* waitUntil('address-output');
  yield* all(conversion.leakOutput.opacity(1, 0.5), conversion.resultPath.opacity(1, 0.5));

  yield* waitUntil('extract-address');
  // Move the actual selected characters; rename only after reaching the extraction position.
  conversion.h.reparent(conversion.root);
  yield* all(conversion.h.position([-80, 160], 0.7), conversion.h.fontSize(34, 0.7));
  conversion.h.text('0x…');
  yield* all(
    conversion.addressName.opacity(1, 0.3),
    conversion.leakOutput.opacity(0, 0.3),
    conversion.resultPath.opacity(0, 0.3),
  );

  yield* waitUntil('name-object-address');
  yield* replaceText(conversion.h, 'H', 0.4);

  yield* waitUntil('mark-object-start');
  yield* conversion.addressName.opacity(0, 0.2);
  yield* all(conversion.h.position([320, 200], 0.65), conversion.h.fontSize(40, 0.65));

  yield* waitUntil('knowledge');
  yield* all(internal.getterPath.opacity(0, 0.25), internal.hostPath.opacity(0, 0.25));
  host.root.opacity(1);
  internal.host.reparent(host.root);
  internal.host.moveToBottom();
  conversion.h.reparent(host.root);
  // Keep the field label above both faces until the growing field is visible.
  internal.hostView.reparent(host.root);
  yield* conversion.root.opacity(0, 0.5);
  yield* all(
    internal.host.position([0, 120], 1.1),
    internal.hostFace.size([1180, 240], 1.1),
    internal.hostField.opacity(0, 0.5),
    internal.hostName.position([0, -540], 1.1),
    internal.hostName.fontSize(36, 1.1),
    internal.hostName.lineHeight(36 * 1.35, 1.1),
    internal.hostName.fill(palette.ink, 1.1),
    internal.hostView.position([150, 120], 1.1),
    internal.hostView.fontSize(38, 1.1),
    internal.hostView.lineHeight(38 * 1.35, 1.1),
    conversion.h.position([-590, -95], 1.1),
    conversion.h.fontSize(48, 1.1),
    conversion.h.lineHeight(48 * 1.35, 1.1),
  );
  yield* host.details.opacity(1, 0.35);
  internal.hostView.reparent(host.field);

  yield* waitUntil('record-address');
  yield* host.offset.opacity(1, 0.4);

  yield* waitUntil('address-formula');
  yield* all(host.formula.opacity(1, 0.4), host.formulaOffset.opacity(1, 0.4));

  yield* waitUntil('name-fake-address');
  yield* all(host.f.opacity(1, 0.35), host.fMarker.end(1, 0.35), host.formulaF.opacity(1, 0.35));

  yield* waitUntil('reference-address');
  yield* host.root.opacity(0, 0.6);
  yield* outgoing.root.opacity(1, 0.7);

  yield* waitUntil('fill-address-buffer');
  yield* all(...outgoing.referenceLabels.map((label) => label.opacity(0, 0.2)));
  outgoing.referenceValue.text(knownReference);
  yield* all(...outgoing.referenceLabels.map((label) => label.opacity(1, 0.3)));

  yield* waitUntil('normal-view-return');
  yield* all(...normalNodes.map((node) => node.opacity(1, 0.6)));

  yield* waitUntil('missing-access');
  yield* all(
    outgoing.result.fill(palette.accent, 0.4),
    outgoing.originalPath.stroke(palette.accent, 0.4),
    outgoing.aBytes.cells[0].stroke(palette.accent, 0.4),
  );

  yield* waitUntil('handoff');
  yield* all(
    outgoing.referenceValue.fill(palette.accent, 0.4),
    outgoing.result.fill(palette.ink, 0.4),
    outgoing.originalPath.stroke(palette.muted, 0.4),
    outgoing.aBytes.cells[0].stroke(palette.rule, 0.4),
  );
  yield* waitUntil('end');
});
