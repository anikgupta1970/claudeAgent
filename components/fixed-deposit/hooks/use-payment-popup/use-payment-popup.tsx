import { useState, useEffect, useRef, useCallback } from 'react';

const POPUP_FEATURES = 'width=1024,height=768,scrollbars=yes,resizable=yes';
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export interface PaymentResult {
  status: 'success' | 'failure';
  [key: string]: unknown;
}

export interface UsePaymentPopupOptions {
  /** Called when payment completes (via postMessage or polling) */
  onPaymentComplete: (result: PaymentResult) => void;
  /** Called when payment fails or times out */
  onPaymentError: (error: string) => void;
  /** Function to poll payment status from the API */
  pollPaymentStatus?: (clientRefNo: string) => Promise<PaymentResult | null>;
}

export interface UsePaymentPopupReturn {
  /** Pre-open a popup synchronously (call from click handler before async work) */
  preOpenPopup: () => Window | null;
  /** Navigate an already-opened popup to a URL */
  navigatePopup: (popup: Window, url: string) => void;
  /** Write an HTML form into an already-opened popup */
  writePopupForm: (popup: Window, htmlForm: string) => void;
  /** Whether we're currently waiting for payment to complete */
  isWaitingForPayment: boolean;
  /** Start monitoring a popup for completion */
  startMonitoring: (popup: Window, clientRefNo: string) => void;
  /** Cancel the current payment wait */
  cancel: () => void;
  /** Whether the popup was blocked by the browser */
  popupBlocked: boolean;
}

export function usePaymentPopup({
  onPaymentComplete,
  onPaymentError,
  pollPaymentStatus,
}: UsePaymentPopupOptions): UsePaymentPopupReturn {
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);

  const popupRef = useRef<Window | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clientRefNoRef = useRef<string>('');

  const cleanup = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    if (closedCheckRef.current) {
      clearInterval(closedCheckRef.current);
      closedCheckRef.current = null;
    }
    popupRef.current = null;
  }, []);

  const startPolling = useCallback((clientRefNo: string) => {
    if (!pollPaymentStatus || pollTimerRef.current) return;

    pollTimerRef.current = setInterval(async () => {
      try {
        const result = await pollPaymentStatus(clientRefNo);
        if (result && (result.status === 'success' || result.status === 'failure')) {
          cleanup();
          setIsWaitingForPayment(false);
          onPaymentComplete(result);
        }
      } catch {
        // Continue polling on error
      }
    }, POLL_INTERVAL_MS);

    // Timeout after 10 minutes
    pollTimeoutRef.current = setTimeout(() => {
      cleanup();
      setIsWaitingForPayment(false);
      onPaymentError('Payment timed out. Please check your payment status and try again.');
    }, POLL_TIMEOUT_MS);
  }, [pollPaymentStatus, onPaymentComplete, onPaymentError, cleanup]);

  // Listen for postMessage from the popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PAYMENT_COMPLETE' && isWaitingForPayment) {
        cleanup();
        setIsWaitingForPayment(false);
        onPaymentComplete({
          status: event.data.status || 'success',
          ...event.data,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isWaitingForPayment, onPaymentComplete, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const preOpenPopup = useCallback((): Window | null => {
    const popup = window.open('about:blank', 'fd-payment', POPUP_FEATURES);
    if (!popup || popup.closed) {
      setPopupBlocked(true);
      return null;
    }
    setPopupBlocked(false);
    popupRef.current = popup;
    return popup;
  }, []);

  const navigatePopup = useCallback((popupWindow: Window, url: string) => {
    try {
      popupWindow.location.assign(url);
    } catch {
      // Cross-origin — popup may have navigated away
    }
  }, []);

  const writePopupForm = useCallback((popup: Window, htmlForm: string) => {
    try {
      popup.document.open();
      popup.document.write(htmlForm);
      popup.document.close();
    } catch {
      // Cross-origin — popup may have navigated away
    }
  }, []);

  const startMonitoring = useCallback((popup: Window, clientRefNo: string) => {
    popupRef.current = popup;
    clientRefNoRef.current = clientRefNo;
    setIsWaitingForPayment(true);

    // Monitor popup.closed — when user closes popup, start polling as fallback
    closedCheckRef.current = setInterval(() => {
      if (popup.closed) {
        if (closedCheckRef.current) {
          clearInterval(closedCheckRef.current);
          closedCheckRef.current = null;
        }
        // Popup was closed — start polling for status
        startPolling(clientRefNo);
      }
    }, 500);
  }, [startPolling]);

  const cancel = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    cleanup();
    setIsWaitingForPayment(false);
  }, [cleanup]);

  return {
    preOpenPopup,
    navigatePopup,
    writePopupForm,
    isWaitingForPayment,
    startMonitoring,
    cancel,
    popupBlocked,
  };
}
