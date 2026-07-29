// @ts-ignore
import * as zoidModule from 'zoid/dist/zoid.frameworks';

// Handle both ESM default interop and direct CJS export
// @ts-ignore
const zoid = zoidModule.default || zoidModule;

export interface ZoidParentProps {
  appUrl: string;
  onStepChange?: (payload: { step: string }) => void;
  onPaymentStarted?: (payload: { clientReferenceNumber: string }) => void;
  onPaymentComplete?: (payload: { status: string }) => void;
  onFlowComplete?: (payload: Record<string, unknown>) => void;
}

export const FdFlowComponent = zoid.create({
  tag: 'fd-flow-widget',
  url: ({ props }: { props: { appUrl: string } }) => props.appUrl,
  dimensions: {
    width: '100%',
    height: '100%',
  },
  props: {
    appUrl: {
      type: 'string',
      required: true,
    },
    onStepChange: {
      type: 'function',
      required: false,
    },
    onPaymentStarted: {
      type: 'function',
      required: false,
    },
    onPaymentComplete: {
      type: 'function',
      required: false,
    },
    onFlowComplete: {
      type: 'function',
      required: false,
    },
  },
});
