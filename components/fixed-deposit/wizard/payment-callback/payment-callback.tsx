import React, { useEffect, useState } from 'react';
import { detectPaymentStatus } from '@api-banking/fixed-deposit.utils.payment-url';

/**
 * Payment callback landing page that loads in the popup window
 * after the payment gateway redirects back.
 *
 * Reads the URL to determine success/failure (query param or legacy pathname),
 * sends a postMessage to the opener (iframe), and shows a "you may close this
 * window" message.
 */
export function PaymentCallback() {
  const [status, setStatus] = useState<'success' | 'failure' | 'unknown'>('unknown');

  useEffect(() => {
    const paymentStatus = detectPaymentStatus() || 'failure';

    setStatus(paymentStatus);

    // Send result to the opener window (the iframe)
    if (window.opener) {
      try {
        window.opener.postMessage(
          { type: 'PAYMENT_COMPLETE', status: paymentStatus },
          '*'
        );
      } catch {
        // Opener may have been closed or is cross-origin blocked
      }
    }

    // Attempt to close popup after a short delay
    const timer = setTimeout(() => {
      try {
        window.close();
      } catch {
        // Some browsers block window.close() for non-script-opened windows
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px',
      textAlign: 'center',
    }}>
      {status === 'success' ? (
        <>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#10003;</div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Payment Successful</h1>
          <p style={{ color: '#666' }}>You may close this window. Your application will continue automatically.</p>
        </>
      ) : (
        <>
          <div style={{ fontSize: '48px', marginBottom: '16px', color: '#dc2626' }}>&#10007;</div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Payment Failed</h1>
          <p style={{ color: '#666' }}>You may close this window and try again.</p>
        </>
      )}
    </div>
  );
}
