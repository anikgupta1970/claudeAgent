import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useJourneyContext, type ValidationError } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { TextInput } from "@api-banking/design.inputs.text-input";
import { RadioButton } from "@api-banking/design.inputs.radio-button";
import { InputGroup } from "@api-banking/design.inputs.input-group";
import { Select } from "@api-banking/design.inputs.select";
import { Link } from "@api-banking/design.navigation.link";
import { CtaButton } from "@api-banking/design.actions.cta-button";
import { Heading } from "@api-banking/design.typography.heading";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import { Label } from "@api-banking/design.typography.label";
import { Card } from "@api-banking/design.content.card";
import { FixedDepositCalculator } from "@api-banking/stitch.fixed-deposit-calculator";
import { Skeleton } from "@api-banking/design.content.skeleton";
import styles from "./deposit-details.module.scss";

export type DepositDetailsProps = {
    allowedFdTypes?: Array<'withdrawable' | 'non-withdrawable'>;
    onContinue?: (data: DepositFormData) => void;
    onBack?: () => void;
    serverErrors?: ValidationError[];
    isSubmitting?: boolean;
    isLoadingProfile?: boolean;
    initialData?: DepositFormData;
    customerData?: {
        fullName: string;
        dateOfBirth: string;
        pan: string;
    };
};

export type DepositFormData = {
    fdType: 'withdrawable' | 'non-withdrawable';
    amount: string;
    interestPayout: 'at-maturity' | 'monthly' | 'quarterly';
    maturityInstructions: string;
    tenureYears: string;
    tenureMonths: string;
    tenureDays: string;
};

const getFieldError = (errors: ValidationError[] | undefined, field: string): string | undefined => {
    return errors?.find(e => e.field === field)?.message;
};

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

const DEFAULT_FORM_DATA: DepositFormData = {
    fdType: 'withdrawable',
    amount: '',
    interestPayout: 'at-maturity',
    maturityInstructions: 'DO_NOT_RENEW',
    tenureYears: '0',
    tenureMonths: '6',
    tenureDays: '0',
};

export function DepositDetails({
    allowedFdTypes,
    onContinue,
    onBack,
    serverErrors,
    isSubmitting,
    isLoadingProfile,
    initialData,
    customerData
}: DepositDetailsProps) {
    const [formData, setFormData] = useState<DepositFormData>(initialData ?? DEFAULT_FORM_DATA);
    const { t } = useTranslation();

    const { updateFormData, journeyConfig, customerId, customerAccounts } = useJourneyContext();
    const primaryAccountId = customerAccounts[0]?.accountId ?? '';

    // Show error state if customerId is missing
    if (!customerId) {
        return (
            <div className={styles.container}>
                <Card variant="outlined" className={styles.errorCard}>
                    <Heading level={3} visualLevel="h4">{t('common.sessionExpired', 'Session Expired')}</Heading>
                    <Paragraph>{t('common.pleaseLoginAgain', 'Your session has expired. Please log in again to continue.')}</Paragraph>
                    <CtaButton onClick={onBack} className={styles.backButton}>
                        {t('common.backToLogin', 'Back to Login')}
                    </CtaButton>
                </Card>
            </div>
        );
    }

    const [localErrors, setLocalErrors] = useState<ValidationError[]>([]);

    const validate = (): ValidationError[] => {
        const errors: ValidationError[] = [];
        const amount = parseInt(formData.amount, 10);
        if (!formData.amount || Number.isNaN(amount) || amount <= 0) {
            errors.push({ field: 'amount', message: t('step2.errors.amountRequired', 'Please enter the FD amount') });
        } else if (amount < 5000) {
            errors.push({ field: 'amount', message: t('step2.errors.amountMin', 'Minimum amount is ₹5,000') });
        } else if (amount > 1000000000) {
            errors.push({ field: 'amount', message: t('step2.errors.amountMax', 'Maximum amount is ₹1,000,000,000') });
        }

        const years = parseInt(formData.tenureYears, 10) || 0;
        const months = parseInt(formData.tenureMonths, 10) || 0;
        const days = parseInt(formData.tenureDays, 10) || 0;
        if (years === 0 && months === 0 && days === 0) {
            errors.push({ field: 'tenure', message: t('step2.errors.tenureRequired', 'Please enter the tenure') });
        } else {
            const totalDays = years * 365 + months * 30 + days;
            if (formData.interestPayout === 'at-maturity' && (totalDays < 7 || totalDays > 180)) {
                errors.push({ field: 'tenure', message: t('step2.errors.interestPayoutMaturity') });
            }
            if ((formData.interestPayout === 'monthly' || formData.interestPayout === 'quarterly') && totalDays <= 180) {
                errors.push({ field: 'tenure', message: t('step2.errors.monthlyQuarterlyTenure') });
            }
        }

        return errors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate();
        setLocalErrors(errors);
        if (errors.length > 0) return;
        updateFormData('deposit', formData);
        onContinue?.(formData);
    };

    const allErrors = [...localErrors, ...(serverErrors || [])];

    const handleInputChange = (field: keyof DepositFormData, value: string) => {
        const errorField = field.startsWith('tenure') || field === 'interestPayout' ? 'tenure' : field;
        setLocalErrors(prev => prev.filter(e => e.field !== errorField));
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            // Reset maturity instruction when switching away from at-maturity
            // and current selection is not available in the reduced option set
            if (field === 'interestPayout' && value !== 'at-maturity' && prev.maturityInstructions === 'RENEW_PRINCIPAL_AND_INTEREST') {
                updated.maturityInstructions = 'DO_NOT_RENEW';
            }
            return updated;
        });
    };

    const isFdTypeDisabled = (type: 'withdrawable' | 'non-withdrawable') =>
        allowedFdTypes != null && !allowedFdTypes.includes(type);

    const liveYears = parseInt(formData.tenureYears, 10) || 0;
    const liveMonths = parseInt(formData.tenureMonths, 10) || 0;
    const liveDays = parseInt(formData.tenureDays, 10) || 0;
    const liveTotalDays = liveYears * 365 + liveMonths * 30 + liveDays;
    let tenurePayoutError: string | undefined;
    if (liveTotalDays > 0) {
        if (formData.interestPayout === 'at-maturity' && (liveTotalDays < 7 || liveTotalDays > 180)) {
            tenurePayoutError = t('step2.errors.interestPayoutMaturity');
        } else if ((formData.interestPayout === 'monthly' || formData.interestPayout === 'quarterly') && liveTotalDays <= 180) {
            tenurePayoutError = t('step2.errors.monthlyQuarterlyTenure');
        }
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <Link href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }} className={styles.backLink}>
                    &lt; Login
                </Link>
                {journeyConfig?.interestRatesUrl && (
                    <Paragraph variant="muted" className={styles.headerSubtext}>
                        {t('step2.interestRates')} <Link href={journeyConfig.interestRatesUrl} target="_blank">{t('step2.clickHere')}</Link>
                    </Paragraph>
                )}
            </div>

            {/* Customer Details */}
            <Card variant="outlined" className={styles.customerDetails}>
                <Heading level={3} visualLevel="h4" className={styles.customerDetailsTitle}>{t('step2.customerDetails')}</Heading>
                <div className={styles.customerInfo}>
                    <div className={styles.customerField}>
                        <Label className={styles.customerFieldLabel}>{t('step2.fullName')}</Label>
                        {isLoadingProfile
                            ? <Skeleton variant="text" width="120px" />
                            : <Paragraph element="span" className={styles.customerFieldValue}>{customerData?.fullName || '-'}</Paragraph>
                        }
                    </div>
                    <div className={styles.customerField}>
                        <Label className={styles.customerFieldLabel}>{t('step2.dateOfBirth')}</Label>
                        {isLoadingProfile
                            ? <Skeleton variant="text" width="100px" />
                            : <Paragraph element="span" className={styles.customerFieldValue}>{customerData?.dateOfBirth || '-'}</Paragraph>
                        }
                    </div>
                    <div className={styles.customerField}>
                        <Label className={styles.customerFieldLabel}>{t('step2.pan')}</Label>
                        {isLoadingProfile
                            ? <Skeleton variant="text" width="100px" />
                            : <Paragraph element="span" className={styles.customerFieldValue}>{customerData?.pan || '-'}</Paragraph>
                        }
                    </div>
                </div>
            </Card>

            {/* Select FD Type */}
            <div className={styles.section}>
                <Heading level={4} className={styles.sectionTitle}>{t('step2.selectFDType')}</Heading>
                <div className={styles.fdTypeOptions}>
                    <div
                        className={`${styles.fdTypeCard} ${formData.fdType === 'withdrawable' ? styles.selected : ''} ${getFieldError(allErrors, 'fdType') ? styles.error : ''} ${isFdTypeDisabled('withdrawable') ? styles.disabled : ''}`}
                        onClick={() => !isSubmitting && !isFdTypeDisabled('withdrawable') && handleInputChange('fdType', 'withdrawable')}
                    >
                        <div className={styles.fdTypeCardHeader}>
                            <div className={`${styles.fdTypeRadio} ${formData.fdType === 'withdrawable' ? styles.selected : ''}`} />
                            <Paragraph element="span" className={styles.fdTypeTitle}>{t('step2.withdrawableFD')}</Paragraph>
                        </div>
                        <Paragraph variant="muted" element="span" className={styles.fdTypeDescription}>{t('step2.withdrawableDesc')}</Paragraph>
                    </div>
                    <div
                        className={`${styles.fdTypeCard} ${formData.fdType === 'non-withdrawable' ? styles.selected : ''} ${getFieldError(allErrors, 'fdType') ? styles.error : ''} ${isFdTypeDisabled('non-withdrawable') ? styles.disabled : ''}`}
                        onClick={() => !isSubmitting && !isFdTypeDisabled('non-withdrawable') && handleInputChange('fdType', 'non-withdrawable')}
                    >
                        <div className={styles.fdTypeCardHeader}>
                            <div className={`${styles.fdTypeRadio} ${formData.fdType === 'non-withdrawable' ? styles.selected : ''}`} />
                            <Paragraph element="span" className={styles.fdTypeTitle}>{t('step2.nonWithdrawableFD')}</Paragraph>
                        </div>
                        <Paragraph variant="muted" element="span" className={styles.fdTypeDescription}>{t('step2.nonWithdrawableDesc')}</Paragraph>
                    </div>
                </div>
                {getFieldError(allErrors, 'fdType') && (
                    <Paragraph variant="muted" className={styles.errorText}>{getFieldError(allErrors, 'fdType')}</Paragraph>
                )}
            </div>

            {/* FD Amount */}
            <InputGroup
                label={t('step2.fdAmount')}
                inputId="fdAmount"
                errorText={getFieldError(allErrors, 'amount')}
            >
                <TextInput
                    id="fdAmount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder={t('step2.enterFDAmount')}
                    disabled={isSubmitting}
                    error={!!getFieldError(allErrors, 'amount')}
                />
                <Paragraph variant="muted" className={styles.minMaxText}>Min: ₹5000 | Max: ₹1,000,000,000</Paragraph>
                <Paragraph variant="muted" className={styles.helpText}>For testing purposes, please Enter Amount: 5000</Paragraph>
            </InputGroup>

            {/* Interest Payout */}
            <div className={styles.section}>
                <Heading level={4} className={styles.sectionTitle}>{t('step2.interestPayout')}</Heading>
                <div className={`${styles.interestPayoutOptions} ${getFieldError(allErrors, 'interestPayout') ? styles.error : ''}`}>
                    <div className={styles.interestPayoutOption}>
                        <RadioButton
                            id="interestPayout-at-maturity"
                            name="interestPayout"
                            value="at-maturity"
                            checked={formData.interestPayout === 'at-maturity'}
                            onChange={() => handleInputChange('interestPayout', 'at-maturity')}
                            disabled={isSubmitting}
                            label={
                                <span className={styles.radioLabelContent}>
                                    <span className={styles.radioLabel}>{t('step2.interestPayoutAtMaturity')}</span>
                                    {formData.interestPayout === 'at-maturity' && (
                                        <span className={styles.checkIcon}>✓</span>
                                    )}
                                </span>
                            }
                        />
                        <Paragraph variant="muted" element="span" className={styles.radioDescription}>{t('step2.interestPayoutAtMaturityDesc')}</Paragraph>
                    </div>
                    <div className={styles.interestPayoutOption}>
                        <RadioButton
                            id="interestPayout-monthly"
                            name="interestPayout"
                            value="monthly"
                            checked={formData.interestPayout === 'monthly'}
                            onChange={() => handleInputChange('interestPayout', 'monthly')}
                            disabled={isSubmitting}
                            label={
                                <span className={styles.radioLabelContent}>
                                    <span className={styles.radioLabel}>{t('step2.interestPayoutMonthly')}</span>
                                    {formData.interestPayout === 'monthly' && (
                                        <span className={styles.checkIcon}>✓</span>
                                    )}
                                </span>
                            }
                        />
                        <Paragraph variant="muted" element="span" className={styles.radioDescription}>{t('step2.interestPayoutMonthlyDesc')}</Paragraph>
                    </div>
                    <div className={styles.interestPayoutOption}>
                        <RadioButton
                            id="interestPayout-quarterly"
                            name="interestPayout"
                            value="quarterly"
                            checked={formData.interestPayout === 'quarterly'}
                            onChange={() => handleInputChange('interestPayout', 'quarterly')}
                            disabled={isSubmitting}
                            label={
                                <span className={styles.radioLabelContent}>
                                    <span className={styles.radioLabel}>{t('step2.interestPayoutQuarterly')}</span>
                                    {formData.interestPayout === 'quarterly' && (
                                        <span className={styles.checkIcon}>✓</span>
                                    )}
                                </span>
                            }
                        />
                        <Paragraph variant="muted" element="span" className={styles.radioDescription}>{t('step2.interestPayoutQuarterlyDesc')}</Paragraph>
                    </div>
                </div>
                <Paragraph variant="muted" className={styles.helpText}>For testing purposes, please Select Interest Payout: Monthly</Paragraph>
                {getFieldError(allErrors, 'interestPayout') && (
                    <Paragraph variant="muted" className={styles.errorText}>{getFieldError(allErrors, 'interestPayout')}</Paragraph>
                )}
            </div>

            {/* Maturity Instructions */}
            <div className={styles.section}>
                <Heading level={4} className={styles.sectionTitle}>{t('step2.maturityInstructions')}</Heading>
                <InputGroup
                    errorText={getFieldError(allErrors, 'maturityInstructions')}
                >
                    <Select
                        id="maturityInstructions"
                        value={formData.maturityInstructions}
                        onChange={(value) => handleInputChange('maturityInstructions', value)}
                        disabled={isSubmitting}
                        error={!!getFieldError(allErrors, 'maturityInstructions')}
                        options={
                            formData.interestPayout === 'at-maturity'
                                ? [
                                    { value: 'DO_NOT_RENEW', label: t('step2.maturityDoNotRenew', 'Do Not Renew') },
                                    { value: 'RENEW_PRINCIPAL', label: t('step2.maturityRenewPrincipal', 'Renew Principal') },
                                    { value: 'RENEW_PRINCIPAL_AND_INTEREST', label: t('step2.maturityRenewPrincipalAndInterest', 'Renew Principal and Interest') },
                                ]
                                : [
                                    { value: 'DO_NOT_RENEW', label: t('step2.maturityDoNotRenew', 'Do Not Renew') },
                                    { value: 'RENEW_PRINCIPAL', label: t('step2.maturityRenewPrincipal', 'Renew Principal') },
                                ]
                        }
                    />
                </InputGroup>
                <Card variant="outlined" className={styles.infoBox}>
                    <Paragraph element="span">
                        <span className={styles.infoIcon}>ℹ</span>
                        {t('step2.maturityInfoMessage')}
                    </Paragraph>
                </Card>
            </div>

            {/* Tenure */}
            <div className={styles.section}>
                <Heading level={4} className={styles.sectionTitle}>{t('step2.tenure')}</Heading>
                <div className={styles.tenureInputs}>
                    <InputGroup label={t('step2.years')} inputId="tenureYears" className={styles.tenureField}>
                        <TextInput
                            id="tenureYears"
                            value={formData.tenureYears}
                            onChange={(e) => handleInputChange('tenureYears', e.target.value)}
                            disabled={isSubmitting}
                            error={!!getFieldError(allErrors, 'tenure')}
                        />
                    </InputGroup>
                    <InputGroup label={t('step2.months')} inputId="tenureMonths" className={styles.tenureField}>
                        <TextInput
                            id="tenureMonths"
                            value={formData.tenureMonths}
                            onChange={(e) => handleInputChange('tenureMonths', e.target.value)}
                            disabled={isSubmitting}
                            error={!!getFieldError(allErrors, 'tenure')}
                        />
                    </InputGroup>
                    <InputGroup label={t('step2.days')} inputId="tenureDays" className={styles.tenureField}>
                        <TextInput
                            id="tenureDays"
                            value={formData.tenureDays}
                            onChange={(e) => handleInputChange('tenureDays', e.target.value)}
                            disabled={isSubmitting}
                            error={!!getFieldError(allErrors, 'tenure')}
                        />
                    </InputGroup>
                </div>
                <Paragraph variant="muted" className={styles.helpText}>For testing purposes, please Enter Year: 1, Month: 0, Days: 0</Paragraph>
                {(getFieldError(allErrors, 'tenure') || tenurePayoutError) && (
                    <Paragraph variant="muted" className={styles.errorText}>
                        {getFieldError(allErrors, 'tenure') || tenurePayoutError}
                    </Paragraph>
                )}
                <Card variant="outlined" className={styles.noteBox}>
                    <Paragraph element="span">
                        <span className={styles.noteIcon}>ℹ</span>
                        {t('step2.atMaturityNote')}
                    </Paragraph>
                </Card>

                {/* FD Calculator */}
                <FixedDepositCalculator
                    input={{
                        amount: formData.amount,
                        tenureYears: formData.tenureYears,
                        tenureMonths: formData.tenureMonths,
                        tenureDays: formData.tenureDays,
                        interestPayout: formData.interestPayout,
                        fdType: formData.fdType,
                    }}
                    customerId={customerId}
                    productVariant="FD101"
                    maturityInstruction={{
                        option: mapMaturityOption(formData.maturityInstructions),
                        renewalOption: mapRenewalOption(formData.maturityInstructions),
                        payoutAccountId: primaryAccountId,
                        managersCheque: false,
                    }}
                    onCalculationComplete={(result) => updateFormData('calculator', result)}
                    disabled={isSubmitting || !!tenurePayoutError}
                />
            </div>

            {/* Continue Button */}
            <form onSubmit={handleSubmit}>
                <CtaButton
                    type="submit"
                    className={styles.continueButton}
                    disabled={isSubmitting || !formData.amount}
                >
                    {isSubmitting ? t('step2.calculating') : t('step2.continue')}
                </CtaButton>
            </form>
        </div>
    );
}
