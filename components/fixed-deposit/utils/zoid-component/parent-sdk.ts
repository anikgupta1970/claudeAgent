import { FdFlowComponent } from './zoid-component.js';
import type { ZoidParentProps } from './zoid-component.js';

export { FdFlowComponent } from './zoid-component.js';
export type { ZoidParentProps } from './zoid-component.js';

export interface RenderOptions extends Omit<ZoidParentProps, 'appUrl'> {
  appUrl: string;
}

/**
 * Renders the FD Flow widget into a container element.
 * Convenience wrapper for vanilla JS / non-React host pages.
 *
 * @param container - CSS selector or HTMLElement to render into
 * @param options - appUrl and optional lifecycle callbacks
 */
export function renderFdFlow(
  container: string | HTMLElement,
  options: RenderOptions,
): Promise<void> {
  const el =
    typeof container === 'string'
      ? document.querySelector(container)
      : container;

  if (!el) {
    throw new Error(`renderFdFlow: container "${container}" not found`);
  }

  const instance = FdFlowComponent({
    appUrl: options.appUrl,
    onStepChange: options.onStepChange,
    onPaymentStarted: options.onPaymentStarted,
    onPaymentComplete: options.onPaymentComplete,
    onFlowComplete: options.onFlowComplete,
  });

  return instance.render(el as HTMLElement);
}
