/**
 * Utilities for detecting iframe context and communicating with parent frames.
 * Prefers zoid xprops callbacks when available, falls back to raw postMessage.
 */
import { getZoidProps, isZoidChild } from '@api-banking/fixed-deposit.utils.zoid-component';

/**
 * Detects whether the current window is running inside an iframe.
 * Returns true if running as a zoid child or inside a regular iframe.
 */
export function isInIframe(): boolean {
  if (isZoidChild()) return true;

  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin iframe — access to window.top throws
    return true;
  }
}

/** Structured message types sent to the parent frame */
export type ParentMessageType =
  | 'FD_FLOW_STEP_CHANGE'
  | 'FD_FLOW_PAYMENT_STARTED'
  | 'FD_FLOW_PAYMENT_COMPLETE'
  | 'FD_FLOW_COMPLETE';

export interface ParentMessage {
  type: ParentMessageType;
  payload: Record<string, unknown>;
}

/** Maps message types to their corresponding zoid xprops callback names */
const XPROPS_CALLBACK_MAP: Record<ParentMessageType, string> = {
  FD_FLOW_STEP_CHANGE: 'onStepChange',
  FD_FLOW_PAYMENT_STARTED: 'onPaymentStarted',
  FD_FLOW_PAYMENT_COMPLETE: 'onPaymentComplete',
  FD_FLOW_COMPLETE: 'onFlowComplete',
};

/**
 * Sends a structured message to the parent window.
 * If running as a zoid child, calls the typed xprops callback directly.
 * Otherwise falls back to raw postMessage with '*' targetOrigin.
 */
export function postMessageToParent(type: ParentMessageType, payload: Record<string, unknown> = {}): void {
  if (!isInIframe()) return;

  // Try zoid xprops first
  const xprops = getZoidProps();
  if (xprops) {
    const callbackName = XPROPS_CALLBACK_MAP[type];
    const callback = (xprops as any)[callbackName];
    if (typeof callback === 'function') {
      try {
        callback(payload);
      } catch {
        // Silently fail if callback throws
      }
    }
    return;
  }

  // Fallback to raw postMessage
  const message: ParentMessage = { type, payload };
  try {
    window.parent.postMessage(message, '*');
  } catch {
    // Silently fail if postMessage is blocked
  }
}
