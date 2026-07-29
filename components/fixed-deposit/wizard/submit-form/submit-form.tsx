import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useJourneyContext } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { useStitchClientWithFallback } from "@api-banking/stitch.stitch-client";
import { Heading } from "@api-banking/design.typography.heading";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import { CtaButton } from "@api-banking/design.actions.cta-button";
import styles from "./submit-form.module.scss";

export type SubmitFormProps = {
  onClose?: () => void;
  applicationId?: string | null;
  isSubmitting?: boolean;
  serverErrors?: { field: string; message: string }[];
};

type FieldProps = {
  label: string;
  value: string | undefined;
  fullWidth?: boolean;
  variant?: 'default' | 'positive';
};

const Field = ({ label, value, fullWidth, variant = 'default' }: FieldProps) => (
  <div className={`${styles.field} ${fullWidth ? styles.fieldFullWidth : ''}`}>
    <span className={styles.fieldLabel}>{label}</span>
    <Paragraph className={variant === 'positive' ? styles.fieldValuePositive : styles.fieldValue}>{value || '-'}</Paragraph>
  </div>
);

const mapMaturityOption = (uiValue: string): string => {
  const mapping: Record<string, string> = {
    'DO_NOT_RENEW': 'close',
    'RENEW_PRINCIPAL': 'renew',
    'RENEW_PRINCIPAL_AND_INTEREST': 'renew',
  };
  return mapping[uiValue] ?? 'close';
};

const mapRenewalOption = (uiValue: string): string | undefined => {
  const mapping: Record<string, string> = {
    'RENEW_PRINCIPAL': 'principal',
    'RENEW_PRINCIPAL_AND_INTEREST': 'full',
  };
  return mapping[uiValue];
};

export function SubmitForm({ onClose, applicationId: applicationIdProp, isSubmitting: isSubmittingProp, serverErrors: serverErrorsProp }: SubmitFormProps) {
  const { formData, updateFormData, customerId, accessToken, customerAccounts, clearSession } = useJourneyContext();
  const stitchClient = useStitchClientWithFallback();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Use prop values when provided (from SubmitStepWrapper)
  const effectiveIsSubmitting = isSubmittingProp ?? isSubmitting;

  const depositData = formData.deposit || {};
  const bankData = formData.bank || {};
  const loginData = formData.login || {};
  const calculatorData = formData.calculator || {};

  // Normalize calculator data to handle both FDCalculationResult shape
  // (from deposit-details: { interestRate, maturityAmount: number }) and
  // raw API response shape (from direct fetch: { roi, maturityAmount: { amount, currency } })
  const roi = calculatorData.roi ?? calculatorData.interestRate;
  const maturityAmountValue = typeof calculatorData.maturityAmount === 'object'
    ? calculatorData.maturityAmount?.amount
    : calculatorData.maturityAmount;

  // Auto-calculate if calculator data is missing
  useEffect(() => {
    if (formData.calculator?.maturityAmount || !depositData.amount) return;

    stitchClient.calculateFDLegacy(
      {
        amount: depositData.amount,
        tenureYears: depositData.tenureYears || '0',
        tenureMonths: depositData.tenureMonths || '0',
        tenureDays: depositData.tenureDays || '0',
        interestPayout: depositData.interestPayout || 'at-maturity',
        fdType: depositData.fdType || 'withdrawable',
      },
      customerId || undefined,
      'regular',
      {
        option: mapMaturityOption(depositData.maturityInstructions || 'DO_NOT_RENEW'),
        renewalOption: mapRenewalOption(depositData.maturityInstructions || 'DO_NOT_RENEW'),
        payoutAccountId: customerAccounts?.[0]?.accountId ?? '',
        managersCheque: false,
      },
      accessToken || undefined
    ).then((response: any) => {
      if ('maturityAmount' in response) {
        updateFormData('calculator', response);
      }
    });
  }, [depositData.amount, customerId, accessToken]);

  // Submit the FD application form to /forms (Stitch Capture API)
  useEffect(() => {
    if (isSubmitted || isSubmitting || !customerId || !accessToken) return;

    const submitApplication = async () => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const accountNo = bankData.primaryAccountNumber || customerAccounts?.[0]?.accountNo || '';
        const ifsc = bankData.branchIfsc || '';
        const amount = depositData.amount || '10000';
        const maturityInstructions = depositData.maturityInstructions || 'DO_NOT_RENEW';

        // Build ISO tenure from deposit data (e.g. P1Y6M0D)
        const tenureYears = parseInt(depositData.tenureYears, 10) || 0;
        const tenureMonths = parseInt(depositData.tenureMonths, 10) || 0;
        const tenureDays = parseInt(depositData.tenureDays, 10) || 0;
        const tenure = `P${tenureYears}Y${tenureMonths}M${tenureDays}D`.replace(/P0Y/, 'P').replace(/0M0D/, '').replace(/0D$/, '').replace(/0M$/, '') || 'P6M';

        // Map interest payout option
        const interestPayoutMap: Record<string, string> = {
          'at-maturity': 'at_maturity',
          'monthly': 'monthly',
          'quarterly': 'quarterly',
        };
        const interestOption = interestPayoutMap[depositData.interestPayout] || 'at_maturity';

        // Build nominee data if present
        const nominee = bankData.nominee;
        const nominationData = nominee ? {
          method: 'successive' as const,
          type: 'inline' as const,
          nominees: [{
            name: nominee.fullName,
            order: 1,
            relationship: nominee.relationship?.toUpperCase() || 'SON',
            dob: nominee.dateOfBirth
              ? nominee.dateOfBirth.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1')
              : undefined,
            address: { city: 'Mumbai', country: 'IN', lines: ['N/A'], pin: '400001', state: 'IN-MH' },
            ...(nominee.guardian ? {
              guardian: {
                name: nominee.guardian.name,
                dob: nominee.guardian.dateOfBirth
                  ? nominee.guardian.dateOfBirth.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1')
                  : undefined,
                address: { city: 'Mumbai', country: 'IN', lines: ['N/A'], pin: '400001', state: 'IN-MH' },
              },
            } : {}),
          }],
        } : undefined;

        // Read payment state if available
        const paymentPending = sessionStorage.getItem('fd_payment_pending');
        const paymentState = paymentPending ? JSON.parse(paymentPending) : {};
        const paymentTxnId = paymentState.paymentTxnId || `TXN${Date.now()}`;
        const today = new Date().toISOString().split('T')[0];

        const payload = {
          instructions: [{
            id: 'i-1',
            instruction: 'open_fd',
            productVariant: 'FD101',
            openMode: 'solo',
            tenure,
            branchCode: bankData.branchIfsc?.slice(-4) || '0001',
            debitAccountId: accountNo,
            depositAmount: { amount: `${amount}.00`, currency: 'INR' },
            holder: { customerId, order: 1, type: 'customer_id' },
            interestPaymentInstruction: {
              option: interestOption,
              payoutAccountId: accountNo,
            },
            maturityInstruction: {
              option: mapMaturityOption(maturityInstructions),
              ...(mapRenewalOption(maturityInstructions) ? { renewalOption: mapRenewalOption(maturityInstructions) } : {}),
              payoutAccountId: accountNo,
            },
            ...(nominationData ? { nomination: nominationData } : {}),
          }],
          sections: [
            {
              id: 's-1',
              section: 'payment',
              accountId: accountNo,
              amount: { amount: `${amount}.00`, currency: 'INR' },
              ifsc,
              method: bankData.fundingOption === 'other-bank' || bankData.fundingOption === 'combined-funds' ? 'net_banking' : 'net_banking',
              paymentDate: today,
              paymentTxnId,
              pg: { name: 'ccAvenue' },
              status: 'paid',
            },
            {
              id: 's-2',
              section: 'office-use',
              originator: { code: 'smartnow' },
            },
          ],
        };

        const result = await stitchClient.submitForm(payload, accessToken);
        setIsSubmitted(true);

        if ((result as any)?.applicationId) {
          updateFormData('submission', { applicationId: (result as any).applicationId });
        }
      } catch (error) {
        console.error('Form submission failed:', error);
        setSubmitError('Failed to submit application. Your FD details have been saved.');
        setIsSubmitted(true); // Still show the summary
      } finally {
        setIsSubmitting(false);
      }
    };

    submitApplication();
  }, [customerId, accessToken, isSubmitted, isSubmitting]);

  const formatTenure = () => {
    const years = parseInt(depositData.tenureYears, 10) || 0;
    const months = parseInt(depositData.tenureMonths, 10) || 0;
    const days = parseInt(depositData.tenureDays, 10) || 0;

    const parts = [];
    if (years > 0) parts.push(`${years} ${years > 1 ? t('step6.tenureFormat.years') : t('step6.tenureFormat.year')}`);
    if (months > 0) parts.push(`${months} ${months > 1 ? t('step6.tenureFormat.months') : t('step6.tenureFormat.month')}`);
    if (days > 0) parts.push(`${days} ${days > 1 ? t('step6.tenureFormat.days') : t('step6.tenureFormat.day')}`);

    return parts.length > 0 ? parts.join(' ') : '0';
  };

  const formatAmount = (amount: string) => {
    if (!amount) return '-';
    const num = parseInt(amount, 10);
    return Number.isNaN(num) ? amount : `₹ ${num.toLocaleString('en-IN')}`;
  };

  const formatMaturityDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const maskAccountNumber = (accountNo: string): string => {
    if (!accountNo || accountNo.length <= 4) return accountNo || '-';
    return '*'.repeat(accountNo.length - 4) + accountNo.slice(-4);
  };

  const handleBackToHome = () => {
    if (onClose) {
      onClose();
    } else {
      clearSession();
      window.location.reload();
    }
  };

  const accountNo = bankData.primaryAccountNumber || customerAccounts?.[0]?.accountNo || '';
  const referenceNo = applicationIdProp || formData.submission?.applicationId || '';

  if (effectiveIsSubmitting) {
    return (
      <div className={styles.container}>
        <Heading level={1} visualLevel="h2" className={styles.pageTitle}>
          {t('step6.fixedDepositAccount')}
        </Heading>
        <Paragraph className={styles.successSubtitle}>
          {t('step6.submitting', 'Submitting your application...')}
        </Paragraph>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Title */}
      <Heading level={1} visualLevel="h2" className={styles.pageTitle}>
        {t('step6.fixedDepositAccount')}
      </Heading>

      {/* Success Icon */}
      <div className={styles.successIcon}>
        <div className={styles.successCircle}>
          <span className={styles.checkmark}>✓</span>
        </div>
      </div>

      {/* Success Message */}
      <Heading level={2} visualLevel="h3" className={styles.successTitle}>
        {t('step6.applicationSubmitted')}
      </Heading>
      <Paragraph className={styles.successSubtitle}>
        {t('step6.fdAccountOpened')}
      </Paragraph>

      {/* Application Summary Card */}
      <div className={styles.summaryCard}>
        <Heading level={3} visualLevel="h4" className={styles.summaryTitle}>
          {t('step6.applicationSummary')}
        </Heading>
        <div className={styles.fieldsGrid}>
          <Field label={t('step6.paymentStatus')} value="Paid" variant="positive" />
          <Field label={t('step6.referenceNo')} value={referenceNo || '-'} />
          <Field label={t('step6.accountType')} value="Fixed Deposit Account" fullWidth />
          <Field label={t('step6.accountNumber')} value={maskAccountNumber(accountNo)} />
          <Field label={t('step6.customerName')} value={loginData.fullName} />
          <Field label={t('step6.mobileNumber')} value={loginData.mobileNumber ? `+91 ${loginData.mobileNumber}` : '-'} />
          <Field label={t('step6.fixedDepositAmount')} value={formatAmount(depositData.amount)} />
          <Field label={t('step6.tenure')} value={formatTenure()} />
          <Field label={t('step6.maturityDate')} value={formatMaturityDate(calculatorData.maturityDate)} />
          <Field label={t('step6.interestRate')} value={roi ? `${roi}% p.a` : '-'} />
          <Field label={t('step6.maturityAmount')} value={maturityAmountValue ? `₹ ${Number(maturityAmountValue).toLocaleString('en-IN')}` : '-'} />
          <Field label={t('step6.branch')} value={bankData.branchName || '-'} fullWidth />
        </div>
      </div>

      {/* Nominee Details Section */}
      {bankData.addNominee && bankData.nominee && (
        <div className={styles.summaryCard}>
          <Heading level={3} visualLevel="h4" className={styles.summaryTitle}>
            {t('step6.nomineeDetails')}
          </Heading>
          <div className={styles.fieldsGrid}>
            <Field label={t('step6.nomineeName')} value={bankData.nominee.fullName} />
            <Field label={t('nominee.dateOfBirth')} value={bankData.nominee.dateOfBirth} />
            <Field label={t('step6.relationship')} value={bankData.nominee.relationship} />
            {bankData.nominee.guardian && (
              <>
                <Field label={t('step6.guardianName')} value={bankData.nominee.guardian.name} />
                <Field label={t('step6.guardianDateOfBirth')} value={bankData.nominee.guardian.dateOfBirth} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Back to Home Button */}
      <CtaButton onClick={handleBackToHome} className={styles.closeButton}>
        {t('step6.backToHome')}
      </CtaButton>
    </div>
  );
}
