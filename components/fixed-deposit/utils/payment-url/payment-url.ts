/**
 * Centralized payment URL utilities.
 *
 * In production the payment gateway redirects back to simple origin-based
 * paths (`/payment/success`, `/payment/failure`).
 *
 * When running inside an iframe the popup-based flow is used instead, so
 * these redirect URLs are only relevant for the standalone (non-iframe) case.
 */

const PAYMENT_PARAM = 'fdPayment';

/**
 * Builds success/failure callback URLs using origin-based paths.
 */
export function buildPaymentCallbackUrls(): { successUrl: string; failureUrl: string } {
  const origin = window.location.origin;

  return {
    successUrl: `${origin}/payment/success`,
    failureUrl: `${origin}/payment/failure`,
  };
}

/**
 * Detects whether the current page was loaded as a payment callback.
 *
 * Checks (in order):
 *  1. `?fdPayment=success|failure` query parameter (new)
 *  2. `/payment/success` or `/payment/failure` in the pathname (legacy)
 *
 * Returns the status string or `null` if this is not a payment return.
 */
export function detectPaymentStatus(): 'success' | 'failure' | null {
  // New: query-parameter based
  const params = new URLSearchParams(window.location.search);
  const paramValue = params.get(PAYMENT_PARAM);
  if (paramValue === 'success') return 'success';
  if (paramValue === 'failure') return 'failure';

  // Legacy: pathname based
  const path = window.location.pathname;
  if (path.includes('/payment/success')) return 'success';
  if (path.includes('/payment/failure')) return 'failure';

  return null;
}

/**
 * Removes payment indicators from the URL.
 *
 * - Strips `fdPayment` query param if present.
 * - Replaces `/payment/success` or `/payment/failure` pathnames to `/`.
 */
export function cleanPaymentUrl(): void {
  const params = new URLSearchParams(window.location.search);

  if (params.has(PAYMENT_PARAM)) {
    params.delete(PAYMENT_PARAM);
    const search = params.toString();
    const cleanUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', cleanUrl);
    return;
  }

  const path = window.location.pathname;
  if (path.includes('/payment/success') || path.includes('/payment/failure')) {
    window.history.replaceState({}, '', '/');
  }
}
