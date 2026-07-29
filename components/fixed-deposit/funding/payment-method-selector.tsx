import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "@api-banking/design.inputs.text-input";
import { Button } from "@api-banking/design.actions.button";
import { Heading } from "@api-banking/design.typography.heading";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import styles from "./funding.module.scss";

export type PaymentMethod = 'net_banking' | 'upi';

export type VpaVerificationStatus = 'idle' | 'verifying' | 'success' | 'error';

export type PaymentMethodSelectorProps = {
    /** Currently selected payment method */
    value: PaymentMethod;
    /** Callback when payment method changes */
    onChange: (method: PaymentMethod) => void;
    /** FD amount to display */
    fdAmount: number;
    /** VPA value for UPI */
    vpa?: string;
    /** Callback when VPA changes */
    onVpaChange?: (vpa: string) => void;
    /** VPA verification status */
    vpaStatus?: VpaVerificationStatus;
    /** Callback to verify VPA */
    onVerifyVpa?: (vpa: string) => Promise<void>;
    /** Error message for VPA */
    vpaError?: string;
    /** Whether the selector is disabled */
    disabled?: boolean;
    /** Additional CSS class */
    className?: string;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
};

/**
 * Payment method selector component for FD funding.
 * Shows NetBanking and UPI options with inline VPA input for UPI.
 */
export function PaymentMethodSelector({
    value,
    onChange,
    fdAmount,
    vpa = '',
    onVpaChange,
    vpaStatus = 'idle',
    onVerifyVpa,
    vpaError,
    disabled = false,
    className,
}: PaymentMethodSelectorProps) {
    const { t } = useTranslation();
    const [localVpa, setLocalVpa] = useState(vpa);

    const handleVpaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVpa = e.target.value;
        setLocalVpa(newVpa);
        onVpaChange?.(newVpa);
    }, [onVpaChange]);

    const handleVerifyClick = useCallback(() => {
        if (localVpa && onVerifyVpa) {
            onVerifyVpa(localVpa);
        }
    }, [localVpa, onVerifyVpa]);

    const handleCardClick = useCallback((method: PaymentMethod) => {
        if (!disabled) {
            onChange(method);
        }
    }, [disabled, onChange]);

    const isVpaValid = localVpa.includes('@') && localVpa.length >= 5;

    return (
        <div className={`${styles.paymentMethodContainer} ${className || ''}`}>
            {/* Header */}
            <div className={styles.paymentMethodHeader}>
                <Heading level={2} className={styles.paymentMethodTitle}>
                    {t('funding.title', 'Fund Your FD')}
                </Heading>
                <Paragraph className={styles.paymentMethodSubtitle}>
                    {t('funding.subtitle', 'Choose a payment method to fund your Fixed Deposit of ₹{{amount}}.', { amount: formatCurrency(fdAmount) })}
                </Paragraph>
            </div>

            {/* Payment Method Cards */}
            <div className={styles.paymentMethodCards}>
                {/* NetBanking Card */}
                <div
                    className={`${styles.paymentMethodCard} ${value === 'net_banking' ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
                    onClick={() => handleCardClick('net_banking')}
                    role="radio"
                    aria-checked={value === 'net_banking'}
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                            handleCardClick('net_banking');
                        }
                    }}
                >
                    <div className={styles.paymentMethodCardHeader}>
                        <div className={`${styles.paymentMethodRadio} ${value === 'net_banking' ? styles.checked : ''}`} />
                        <span className={styles.paymentMethodLabel}>
                            {t('funding.netBanking', 'NetBanking')}
                        </span>
                    </div>
                </div>

                {/* UPI Card */}
                <div
                    className={`${styles.paymentMethodCard} ${value === 'upi' ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
                    onClick={() => handleCardClick('upi')}
                    role="radio"
                    aria-checked={value === 'upi'}
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                            handleCardClick('upi');
                        }
                    }}
                >
                    <div className={styles.paymentMethodCardHeader}>
                        <div className={`${styles.paymentMethodRadio} ${value === 'upi' ? styles.checked : ''}`} />
                        <span className={styles.paymentMethodLabel}>
                            {t('funding.upi', 'UPI')}
                        </span>
                    </div>

                    {/* VPA Input - shown when UPI is selected */}
                    {value === 'upi' && (
                        <div className={styles.paymentMethodContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.vpaInputGroup}>
                                <div className={styles.vpaInputWrapper}>
                                    <TextInput
                                        id="vpa-input"
                                        className={styles.vpaInput}
                                        value={localVpa}
                                        onChange={handleVpaChange}
                                        placeholder={t('funding.vpaPlaceholder', 'Enter UPI ID (e.g., name@upi)')}
                                        disabled={disabled || vpaStatus === 'verifying'}
                                        error={!!vpaError || vpaStatus === 'error'}
                                    />
                                    <Button
                                        className={styles.vpaVerifyButton}
                                        appearance="secondary"
                                        onClick={handleVerifyClick}
                                        disabled={disabled || !isVpaValid || vpaStatus === 'verifying' || vpaStatus === 'success'}
                                    >
                                        {vpaStatus === 'verifying'
                                            ? t('funding.verifying', 'Verifying...')
                                            : vpaStatus === 'success'
                                            ? t('funding.verified', 'Verified')
                                            : t('funding.verify', 'Verify')
                                        }
                                    </Button>
                                </div>

                                {/* VPA Status */}
                                {vpaStatus === 'success' && (
                                    <div className={`${styles.vpaStatus} ${styles.vpaStatusSuccess}`}>
                                        ✓ {t('funding.vpaVerified', 'VPA verified successfully')}
                                    </div>
                                )}
                                {(vpaStatus === 'error' || vpaError) && (
                                    <div className={`${styles.vpaStatus} ${styles.vpaStatusError}`}>
                                        ✗ {vpaError || t('funding.vpaError', 'VPA verification failed')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
