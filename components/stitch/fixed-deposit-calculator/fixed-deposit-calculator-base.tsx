import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@api-banking/design.actions.button";
import { Heading } from "@api-banking/design.typography.heading";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import { Label } from "@api-banking/design.typography.label";
import { Card } from "@api-banking/design.content.card";
import styles from "./fixed-deposit-calculator.module.scss";

export type FDCalculatorInput = {
    amount: string;
    tenureYears: string;
    tenureMonths: string;
    tenureDays: string;
    interestPayout: 'at-maturity' | 'monthly' | 'quarterly';
    fdType: 'withdrawable' | 'non-withdrawable';
};

export type FDCalculationResult = {
    principal: number;
    interestRate: number;
    interestEarned: number;
    maturityAmount: number;
    maturityDate: string;
};

export type FixedDepositCalculatorBaseProps = {
    /** Input values for calculation display */
    input: FDCalculatorInput;
    /** Callback when calculate button is clicked */
    onCalculate: () => void;
    /** Calculation result to display */
    result?: FDCalculationResult | null;
    /** Error message to display */
    error?: string | null;
    /** Whether calculation is in progress */
    isCalculating?: boolean;
    /** Whether the calculator is disabled */
    disabled?: boolean;
    /** Additional CSS class */
    className?: string;
};

/**
 * Presentational component for FD calculation display.
 * Use this when you want full control over calculation logic and state.
 * For a ready-to-use version with built-in API handling, use `FixedDepositCalculator` instead.
 */
export function FixedDepositCalculatorBase({
    input,
    onCalculate,
    result,
    error,
    isCalculating = false,
    disabled = false,
    className,
}: FixedDepositCalculatorBaseProps) {
    const { t } = useTranslation();

    const handleCalculate = () => {
        if (!isCalculating && !disabled) {
            onCalculate();
        }
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-IN');
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const canCalculate = input.amount && (
        parseInt(input.tenureYears || '0', 10) > 0 ||
        parseInt(input.tenureMonths || '0', 10) > 0 ||
        parseInt(input.tenureDays || '0', 10) > 0
    );

    return (
        <div className={`${styles.container} ${className || ''}`}>
            <Button
                appearance="secondary"
                className={styles.calculateButton}
                disabled={disabled || isCalculating || !canCalculate}
                onClick={handleCalculate}
            >
                {isCalculating ? t('step2.calculating') : t('step2.calculateFD')}
            </Button>
            <Paragraph variant="muted" className={styles.calculateHelperText}>
                {t('step2.calculateInfo')}
            </Paragraph>

            {error && (
                <Card variant="outlined" className={styles.errorBox}>
                    <Paragraph element="span" className={styles.errorText}>
                        {error}
                    </Paragraph>
                </Card>
            )}

            {result && (
                <Card variant="outlined" className={styles.calculationResult}>
                    <Heading level={4} className={styles.resultTitle}>{t('step2.maturityDetails')}</Heading>
                    <div className={styles.resultGrid}>
                        <div className={styles.resultItem}>
                            <Label className={styles.resultLabel}>{t('step2.fdAmount')}</Label>
                            <Paragraph element="span" className={styles.resultValue}>
                                ₹{formatCurrency(result.principal)}
                            </Paragraph>
                        </div>
                        <div className={styles.resultItem}>
                            <Label className={styles.resultLabel}>{t('step2.rateOfInterest')}</Label>
                            <Paragraph element="span" className={styles.resultValue}>
                                {result.interestRate}% p.a.
                            </Paragraph>
                        </div>
                        <div className={styles.resultItem}>
                            <Label className={styles.resultLabel}>{t('step2.interestEarned')}</Label>
                            <Paragraph element="span" className={styles.resultValueHighlight}>
                                ₹{formatCurrency(result.interestEarned)}
                            </Paragraph>
                        </div>
                        <div className={styles.resultItem}>
                            <Label className={styles.resultLabel}>{t('step2.maturityAmount')}</Label>
                            <Paragraph element="span" className={styles.resultValueHighlight}>
                                ₹{formatCurrency(result.maturityAmount)}
                            </Paragraph>
                        </div>
                        <div className={styles.resultItem}>
                            <Label className={styles.resultLabel}>{t('step2.maturityDate')}</Label>
                            <Paragraph element="span" className={styles.resultValue}>
                                {formatDate(result.maturityDate)}
                            </Paragraph>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
