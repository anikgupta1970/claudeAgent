import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@api-banking/design.content.card";
import { CtaButton } from "@api-banking/design.actions.cta-button";
import { Button } from "@api-banking/design.actions.button";
import { Link } from "@api-banking/design.navigation.link";
import { Heading } from "@api-banking/design.typography.heading";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import { TextInput } from "@api-banking/design.inputs.text-input";
import { useJourneyContext } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { useStitchClientWithFallback } from "@api-banking/stitch.stitch-client";
import { isInIframe, postMessageToParent } from "@api-banking/fixed-deposit.utils.iframe-utils";
import { usePaymentPopup } from "@api-banking/fixed-deposit.hooks.use-payment-popup";
import type { PaymentResult } from "@api-banking/fixed-deposit.hooks.use-payment-popup";
import { buildPaymentCallbackUrls } from "@api-banking/fixed-deposit.utils.payment-url";
import styles from "./funding-step.module.scss";

export type FundingStepProps = {
  onContinue?: () => void;
  onBack?: () => void;
  fdAmount?: number;
};

export type PaymentMethod = 'net_banking' | 'upi';
export type VpaStatus = 'idle' | 'verifying' | 'success' | 'error';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

export function FundingStep({ onContinue, onBack, fdAmount = 10000 }: FundingStepProps) {
  const { t } = useTranslation();
  const { customerId, accessToken, formData } = useJourneyContext();
  const stitchClient = useStitchClientWithFallback();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [vpa, setVpa] = useState('');
  const [vpaStatus, setVpaStatus] = useState<VpaStatus>('idle');
  const [vpaError, setVpaError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(() => {
    const failed = sessionStorage.getItem('fd_payment_failed');
    if (failed) {
      sessionStorage.removeItem('fd_payment_failed');
      return t('funding.paymentFailed', 'Payment failed. Please try again.');
    }
    return null;
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const inIframe = isInIframe();

  // Payment popup hook for iframe mode
  const handlePopupPaymentComplete = useCallback((result: PaymentResult) => {
    postMessageToParent('FD_FLOW_PAYMENT_COMPLETE', { status: result.status });
    if (result.status === 'success') {
      onContinue?.();
    } else {
      setPaymentError(t('funding.paymentFailed', 'Payment failed. Please try again.'));
    }
  }, [onContinue, t]);

  const handlePopupPaymentError = useCallback((error: string) => {
    setPaymentError(error);
  }, []);

  const pollPaymentStatus = useCallback(async (clientRefNo: string): Promise<PaymentResult | null> => {
    try {
      const result = await stitchClient.getPaymentStatus({ clientReferenceNumber: clientRefNo });
      if (result?.status === 'success' || result?.status === 'failure') {
        return { status: result.status } as PaymentResult;
      }
      return null;
    } catch {
      return null;
    }
  }, [stitchClient]);

  const {
    preOpenPopup,
    navigatePopup,
    writePopupForm,
    isWaitingForPayment,
    startMonitoring,
    cancel: cancelPaymentPopup,
    popupBlocked,
  } = usePaymentPopup({
    onPaymentComplete: handlePopupPaymentComplete,
    onPaymentError: handlePopupPaymentError,
    pollPaymentStatus,
  });

  // Get FD amount from form data if available
  const depositAmount = formData.deposit?.amount ? parseInt(formData.deposit.amount, 10) : fdAmount;

  const handleVerifyVpa = useCallback(async () => {
    if (!vpa || !customerId) return;

    setVpaStatus('verifying');
    setVpaError(null);

    try {
      const result = await stitchClient.verifyUpiVpa({ customerId, vpa });
      if (result && (result as any).status === 'success') {
        setVpaStatus('success');
      } else {
        setVpaStatus('error');
        setVpaError(t('funding.vpaInvalid', 'Invalid UPI ID'));
      }
    } catch (error) {
      setVpaStatus('error');
      setVpaError(t('funding.vpaVerificationFailed', 'VPA verification failed'));
    }
  }, [vpa, customerId, stitchClient, t]);

  const handlePayNow = useCallback(async () => {
    if (!selectedMethod || !customerId) return;

    // Clear any previous errors
    setPaymentError(null);

    // For UPI, ensure VPA is verified
    if (selectedMethod === 'upi' && vpaStatus !== 'success') {
      setVpaError(t('funding.verifyVpaFirst', 'Please verify your UPI ID first'));
      return;
    }

    // Validate bank account data
    const otherBankAccount = formData.bank?.otherBankAccount;
    const accountNo = otherBankAccount?.accountNumber || '';
    const ifsc = otherBankAccount?.ifsc || '';

    // Validate account number (must be digits only)
    if (!accountNo || !/^\d+$/.test(accountNo)) {
      console.error('Invalid account number:', accountNo);
      setPaymentError(t('funding.invalidAccountNumber', 'Invalid bank account number. Please go back and add your external bank account.'));
      return;
    }

    // Validate IFSC for NetBanking (must be 11 chars, format: XXXX0XXXXXX)
    if (selectedMethod === 'net_banking') {
      const ifscPattern = /^[A-Z]{4}0[0-9A-Z]{6}$/;
      if (!ifsc || !ifscPattern.test(ifsc)) {
        console.error('Invalid IFSC code:', ifsc);
        setPaymentError(t('funding.invalidIfsc', 'Invalid IFSC code. Please go back and verify your bank details.'));
        return;
      }
    }

    // Validate customer name for UPI (required by payment gateway)
    if (selectedMethod === 'upi' && !formData.login?.fullName) {
      setPaymentError(t('funding.missingCustomerName', 'Customer name is required for UPI payment.'));
      return;
    }

    // Pre-open popup BEFORE async work to avoid popup blockers (iframe mode only)
    const popup = inIframe ? preOpenPopup() : null;

    setIsProcessing(true);

    try {
      const clientRefNo = `FD-${Date.now()}`;
      const { successUrl, failureUrl } = buildPaymentCallbackUrls();

      const customerName = formData.login?.fullName || '';

      const paymentData = {
        customerId,
        clientReferenceNumber: clientRefNo,
        clientSuccessUrl: successUrl,
        clientFailureUrl: failureUrl,
        method: selectedMethod,
        amount: { amount: depositAmount, currency: 'INR' },
        instrument: selectedMethod === 'upi'
          ? { accountNo, customerName, vpa }
          : { accountNo, ifsc },
      };

      postMessageToParent('FD_FLOW_PAYMENT_STARTED', { clientReferenceNumber: clientRefNo });

      const result = await stitchClient.initiatePayment(paymentData);

      // --- Iframe mode: use popup ---
      if (inIframe && popup && !popup.closed) {
        if (result?.htmlForm) {
          writePopupForm(popup, result.htmlForm);
          startMonitoring(popup, clientRefNo);
          setIsProcessing(false);
          return;
        }

        if (result?.paymentLink?.url) {
          const { paymentLink } = result;
          let redirectUrl = paymentLink.url;
          if (paymentLink.parameters) {
            const queryString = Object.entries(paymentLink.parameters)
              .map(([key, value]) => {
                const paramKey = key === 'encResp' ? 'encRequest' : key;
                return `${encodeURIComponent(paramKey)}=${encodeURIComponent(String(value))}`;
              })
              .join('&');
            redirectUrl = `${paymentLink.url}&${queryString}`;
          }
          navigatePopup(popup, redirectUrl);
          startMonitoring(popup, clientRefNo);
          setIsProcessing(false);
          return;
        }

        // No valid payment response — close the empty popup
        popup.close();
        setPaymentError(t('funding.noPaymentLink', 'Payment initiation failed - no payment link received.'));
        setIsProcessing(false);
        return;
      }

      // If we were in iframe mode but popup was blocked/closed, close it and show error
      if (inIframe && (!popup || popup.closed)) {
        setPaymentError(t('funding.popupBlocked', 'Popup was blocked. Please allow popups for this site and try again.'));
        setIsProcessing(false);
        return;
      }

      // --- Non-iframe mode: original behavior ---

      // Handle HTML form response (CCAvenue direct POST flow)
      if (result?.htmlForm) {
        sessionStorage.setItem('fd_payment_pending', JSON.stringify({
          clientReferenceNumber: clientRefNo,
          paymentPending: true,
        }));
        document.open();
        document.write(result.htmlForm);
        document.close();
        return;
      }

      if (result?.paymentLink?.url) {
        // Save payment state to sessionStorage before redirecting
        sessionStorage.setItem('fd_payment_pending', JSON.stringify({
          clientReferenceNumber: clientRefNo,
          paymentPending: true,
        }));

        // Build redirect URL from paymentLink
        const { paymentLink } = result;
        let redirectUrl = paymentLink.url;
        if (paymentLink.parameters) {
          const queryString = Object.entries(paymentLink.parameters)
            .map(([key, value]) => {
              const paramKey = key === 'encResp' ? 'encRequest' : key;
              return `${encodeURIComponent(paramKey)}=${encodeURIComponent(String(value))}`;
            })
            .join('&');
          redirectUrl = `${paymentLink.url}&${queryString}`;
        }
        window.location.href = redirectUrl;
        return;
      }

      // No valid payment response
      setPaymentError(t('funding.noPaymentLink', 'Payment initiation failed - no payment link received.'));
    } catch (error) {
      console.error('Payment initiation failed:', error);
      // Close popup if it was opened
      if (popup && !popup.closed) popup.close();
      setPaymentError(t('funding.paymentFailed', 'Payment initiation failed. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  }, [selectedMethod, customerId, vpaStatus, vpa, depositAmount, formData, stitchClient, t, inIframe, preOpenPopup, navigatePopup, writePopupForm, startMonitoring]);

  const isVpaValid = vpa.includes('@') && vpa.length >= 5;
  const canPay = selectedMethod === 'net_banking' || (selectedMethod === 'upi' && vpaStatus === 'success');

  return (
    <div className={styles.container}>
      <Link href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }} className={styles.backLink}>
        &lt; {t('step4.fixedDepositAccount', 'Fixed Deposit Account')}
      </Link>

      <Heading level={1} visualLevel="h2" className={styles.title}>
        {t('funding.title', 'Fund Your FD')}
      </Heading>
      <Paragraph className={styles.subtitle}>
        {t('funding.subtitle', 'Choose a payment method to fund your Fixed Deposit of ₹{{amount}}.', { amount: formatCurrency(depositAmount) })}
      </Paragraph>

      <div className={styles.bankOptions}>
        {/* NetBanking Option */}
        <Card
          variant="outlined"
          className={`${styles.bankCard} ${selectedMethod === 'net_banking' ? styles.selected : ''}`}
          onClick={() => setSelectedMethod('net_banking')}
        >
          <div className={styles.cardContent}>
            <div className={`${styles.radioCircle} ${selectedMethod === 'net_banking' ? styles.checked : ''}`} />
            <span className={styles.cardLabel}>{t('funding.netBanking', 'NetBanking')}</span>
          </div>
        </Card>

        {/* UPI Option */}
        <Card
          variant="outlined"
          className={`${styles.bankCard} ${selectedMethod === 'upi' ? styles.selected : ''}`}
          onClick={() => setSelectedMethod('upi')}
        >
          <div className={styles.cardContent}>
            <div className={`${styles.radioCircle} ${selectedMethod === 'upi' ? styles.checked : ''}`} />
            <span className={styles.cardLabel}>{t('funding.upi', 'UPI')}</span>
          </div>

          {/* VPA Input - shown when UPI is selected */}
          {selectedMethod === 'upi' && (
            <div className={styles.vpaSection} onClick={(e) => e.stopPropagation()}>
              <div className={styles.vpaInputRow}>
                <TextInput
                  id="vpa-input"
                  value={vpa}
                  onChange={(e) => {
                    setVpa(e.target.value);
                    setVpaStatus('idle');
                    setVpaError(null);
                  }}
                  placeholder={t('funding.vpaPlaceholder', 'Enter UPI ID (e.g., name@upi)')}
                  disabled={vpaStatus === 'verifying'}
                  error={!!vpaError}
                  className={styles.vpaInput}
                />
                <Button
                  appearance="secondary"
                  onClick={handleVerifyVpa}
                  disabled={!isVpaValid || vpaStatus === 'verifying' || vpaStatus === 'success'}
                  className={styles.verifyButton}
                >
                  {vpaStatus === 'verifying'
                    ? t('funding.verifying', 'Verifying...')
                    : vpaStatus === 'success'
                    ? '✓'
                    : t('funding.verify', 'Verify')
                  }
                </Button>
              </div>

              {vpaStatus === 'success' && (
                <Paragraph className={styles.vpaSuccess}>
                  ✓ {t('funding.vpaVerified', 'UPI ID verified')}
                </Paragraph>
              )}
              {vpaError && (
                <Paragraph className={styles.vpaError}>
                  ✗ {vpaError}
                </Paragraph>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Payment Error Message */}
      {paymentError && (
        <Paragraph className={styles.paymentError}>
          ✗ {paymentError}
        </Paragraph>
      )}

      {/* Popup blocked hint */}
      {popupBlocked && inIframe && (
        <Paragraph className={styles.paymentError}>
          {t('funding.popupBlockedHint', 'Your browser blocked the payment popup. Please allow popups for this site and click "Pay Now" again.')}
        </Paragraph>
      )}

      <div className={styles.actions}>
        <Button appearance="secondary" onClick={onBack} className={styles.backButton}>
          {t('common.back', 'Back')}
        </Button>
        <CtaButton
          onClick={handlePayNow}
          disabled={!canPay || isProcessing || isWaitingForPayment}
          className={styles.payButton}
        >
          {isProcessing
            ? t('funding.processing', 'Processing...')
            : t('step5.buttons.payNow', 'Pay Now')
          }
        </CtaButton>
      </div>

      {/* Waiting for payment overlay (iframe popup mode) */}
      {isWaitingForPayment && (
        <div className={styles.paymentOverlay}>
          <div className={styles.paymentOverlayContent}>
            <div className={styles.spinner} />
            <Heading level={2} visualLevel="h3">
              {t('funding.waitingForPayment', 'Waiting for payment...')}
            </Heading>
            <Paragraph>
              {t('funding.completeInPopup', 'Please complete the payment in the popup window.')}
            </Paragraph>
            <Button appearance="secondary" onClick={cancelPaymentPopup}>
              {t('common.cancel', 'Cancel')}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
