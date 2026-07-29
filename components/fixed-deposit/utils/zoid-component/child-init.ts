import type { ZoidParentProps } from './zoid-component.js';

/**
 * Returns the zoid xprops injected by the parent, or null if not running as a zoid child.
 */
export function getZoidProps(): ZoidParentProps | null {
  try {
    const xprops = (window as any).xprops;
    if (xprops && typeof xprops === 'object') {
      return xprops as ZoidParentProps;
    }
  } catch {
    // Not in a zoid context
  }
  return null;
}

/**
 * Returns true if the current window is running as a zoid child component.
 */
export function isZoidChild(): boolean {
  return getZoidProps() !== null;
}
