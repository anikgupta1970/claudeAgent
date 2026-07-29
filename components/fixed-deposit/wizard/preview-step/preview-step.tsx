import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useJourneyContext } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { useStitchClientWithFallback } from "@api-banking/stitch.stitch-client";
import { Heading } from "@api-banking/design.typography.heading";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import { CtaButton } from "@api-banking/design.actions.cta-button";
import { Link } from "@api-banking/design.navigation.link";
import styles from "./preview-step.module.scss";

export type PreviewStepProps = {
  onContinue?: () => void;
  onBack?: () => void;
};

type FieldProps = {
  label: string;
  value: string | undefined;
  fullWidth?: boolean;
};

const Field = ({ label, value, fullWidth }: FieldProps) => (
  <div className={`${styles.field} ${fullWidth ? styles.fieldFullWidth : ''}`}>
    <span className={styles.fieldLabel}>{label}</span>
    <Paragraph className={styles.fieldValue}>{value || '-'}</Paragraph>
  </div>
);

export function PreviewStep({ onContinue, onBack }: PreviewStepProps) {
  const { formData, updateFormData, customerId, accessToken, customerAccounts } = useJourneyContext();
  const stitchClient = useStitchClientWithFallback();
  const { t } = useTranslation();

  const depositData = formData.deposit || {};
  const bankData = formData.bank || {};
  const loginData = formData.login || {};
  const calculatorData = formData.calculator || {};
  const primaryAccountId = customerAccounts?.[0]?.accountId ?? '';

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

    const maturityInstructions = depositData.maturityInstructions || 'DO_NOT_RENEW';

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
      'FD101',
      {
        option: mapMaturityOption(maturityInstructions),
        renewalOption: mapRenewalOption(maturityInstructions),
        payoutAccountId: primaryAccountId,
        managersCheque: false,
      },
      accessToken || undefined
    ).then((response: any) => {
      if ('maturityAmount' in response) {
        updateFormData('calculator', response);
      }
    });
  }, [depositData.amount, customerId, accessToken]);

  const formatTenure = () => {
    const years = parseInt(depositData.tenureYears, 10) || 0;
    const months = parseInt(depositData.tenureMonths, 10) || 0;
    const days = parseInt(depositData.tenureDays, 10) || 0;

    const parts = [];
    if (years > 0) parts.push(`${years} ${years > 1 ? t('step4.tenureFormat.years') : t('step4.tenureFormat.year')}`);
    if (months > 0) parts.push(`${months} ${months > 1 ? t('step4.tenureFormat.months') : t('step4.tenureFormat.month')}`);
    if (days > 0) parts.push(`${days} ${days > 1 ? t('step4.tenureFormat.days') : t('step4.tenureFormat.day')}`);

    return parts.length > 0 ? parts.join(' ') : '0';
  };

  const formatAmount = (amount: string) => {
    if (!amount) return '-';
    const num = parseInt(amount, 10);
    return Number.isNaN(num) ? amount : `₹ ${num.toLocaleString('en-IN')}`;
  };

  const {fundingOption} = bankData;
  const {otherBankAccount} = bankData;

  return (
    <div className={styles.container}>
      {/* Back Link */}
      <Link href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }} className={styles.backLink}>
        &lt; {t('step4.bankDetails')}
      </Link>

      {/* Page Title */}
      <Heading level={1} visualLevel="h2" className={styles.pageTitle}>
        {t('step4.fixedDepositAccount')}
      </Heading>

      {/* Customer Details Section */}
      <section className={styles.section}>
        <Heading level={2} visualLevel="h4" className={styles.sectionTitle}>
          {t('step4.customerDetails')}
        </Heading>
        <div className={styles.fieldsGrid}>
          <Field label={t('step4.fullName')} value={loginData.fullName} />
          <Field label={t('step4.dateOfBirth')} value={loginData.dateOfBirth} />
          <Field label={t('step4.pan')} value={loginData.pan} />
          <Field label={t('step4.mobileNumber')} value={loginData.mobileNumber} />
        </div>
      </section>

      {/* Fixed Deposit Details Section */}
      <section className={styles.section}>
        <Heading level={2} visualLevel="h4" className={styles.sectionTitle}>
          {t('step4.fixedDepositDetails')}
        </Heading>
        <div className={styles.fieldsGrid}>
          <Field label={t('step4.fixedDepositAmount')} value={formatAmount(depositData.amount)} />
          <Field label={t('step4.tenure')} value={formatTenure()} />
          <Field label={t('step4.interestPayout')} value={
            { 'at-maturity': 'At Maturity', 'monthly': 'Monthly', 'quarterly': 'Quarterly' }[depositData.interestPayout] || depositData.interestPayout
          } />
          <Field label={t('step4.maturityInstructions')} value={
            { 'DO_NOT_RENEW': 'Do Not Renew', 'RENEW_PRINCIPAL': 'Renew Principal', 'RENEW_PRINCIPAL_AND_INTEREST': 'Renew Principal and Interest' }[depositData.maturityInstructions] || depositData.maturityInstructions
          } />
          <Field label={t('step4.rateOfInterest')} value={roi ? `${roi}% ${t('step4.rateOfInterestSuffix')}` : '-'} />
          <Field label={t('step4.maturityAmount')} value={maturityAmountValue ? `₹ ${Number(maturityAmountValue).toLocaleString('en-IN')}` : '-'} />
          <Field label={t('step4.branch')} value={bankData.branchName || 'Nariman Pt - Tulsiani Chmbrs'} fullWidth />
        </div>
      </section>

      {/* Primary Bank Account Details Section - shown for primary-bank and combined-funds */}
      {(fundingOption === 'primary-bank' || fundingOption === 'combined-funds') && (
        <section className={styles.section}>
          <Heading level={2} visualLevel="h4" className={styles.sectionTitle}>
            {t('step4.bankAccountDetails')}
          </Heading>
          <div className={styles.fieldsGrid}>
            <Field label={t('step4.accountNumber')} value={bankData.primaryAccountNumber || '-'} />
            <Field label={t('step4.bankName')} value={t('step3.hdfcBank')} />
            <Field label={t('step4.branch')} value={bankData.branchName || '-'} />
            <Field label={t('step4.ifscCode')} value={bankData.branchIfsc || '-'} />
            {fundingOption === 'combined-funds' && bankData.primaryAmount && (
              <Field label={t('step3.amountFromHdfc')} value={formatAmount(bankData.primaryAmount)} />
            )}
          </div>
        </section>
      )}

      {/* Other Bank Account Details Section - shown for other-bank and combined-funds */}
      {(fundingOption === 'other-bank' || fundingOption === 'combined-funds') && otherBankAccount && (
        <section className={styles.section}>
          <Heading level={2} visualLevel="h4" className={styles.sectionTitle}>
            {t('step3.otherBankAccount')}
          </Heading>
          <div className={styles.fieldsGrid}>
            <Field label={t('step4.accountNumber')} value={otherBankAccount.accountNumber} />
            <Field label={t('step4.bankName')} value={otherBankAccount.bankName || '-'} />
            <Field label={t('step4.ifscCode')} value={otherBankAccount.ifsc} />
          </div>
        </section>
      )}

      {/* Nominee Details Section */}
      {bankData.addNominee && bankData.nominee && (
        <section className={styles.section}>
          <Heading level={2} visualLevel="h4" className={styles.sectionTitle}>
            {t('step4.nomineeDetails')}
          </Heading>
          <div className={styles.fieldsGrid}>
            <Field label={t('step4.fullName')} value={bankData.nominee.fullName} />
            <Field label={t('step4.dateOfBirth')} value={bankData.nominee.dateOfBirth} />
            <Field label={t('step4.relationship')} value={bankData.nominee.relationship} />
            {bankData.nominee.guardian && (
              <>
                <Field label={t('step4.guardianName')} value={bankData.nominee.guardian.name} />
                <Field label={t('step4.guardianDateOfBirth')} value={bankData.nominee.guardian.dateOfBirth} />
              </>
            )}
          </div>
        </section>
      )}

      {/* Continue Button */}
      <div className={styles.actions}>
        <CtaButton onClick={onContinue} className={styles.continueButton}>
          {t('step4.confirm')}
        </CtaButton>
      </div>
    </div>
  );
}
