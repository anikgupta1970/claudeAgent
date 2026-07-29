import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "@api-banking/design.inputs.text-input";
import { InputGroup } from "@api-banking/design.inputs.input-group";
import { Button } from "@api-banking/design.actions.button";
import { CtaButton } from "@api-banking/design.actions.cta-button";
import { Heading } from "@api-banking/design.typography.heading";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import { Label } from "@api-banking/design.typography.label";
import { Card } from "@api-banking/design.content.card";
import { Modal } from "@api-banking/design.overlays.modal";
import styles from "./funding.module.scss";

export type FundingOption = 'other-bank' | 'primary-bank' | 'combined-funds';

export type OtherBankAccountData = {
    accountNumber: string;
    ifsc: string;
    bankName?: string;
    branchName?: string;
    city?: string;
};

export type PrimaryAccountInfo = {
    accountNumber: string;
    accountType: string;
    availableBalance: number;
};

export type ValidationError = {
    field: string;
    message: string;
};

export type IFSCLookupResult = {
    bankName: string;
    branchName: string;
    city: string;
};

export type CustomerAccountOption = {
    accountId: string;
    accountNumber: string;
    accountType: string;
    availableBalance: number;
};

export type FundingProps = {
    value: FundingOption;
    onChange: (option: FundingOption) => void;
    fdAmount: number;
    primaryAccount?: PrimaryAccountInfo;
    /** List of customer accounts for selection (when multiple accounts exist) */
    customerAccounts?: CustomerAccountOption[];
    /** Currently selected account ID */
    selectedAccountId?: string;
    /** Callback when account selection changes */
    onAccountChange?: (accountId: string) => void;
    primaryAmount?: string;
    onPrimaryAmountChange?: (amount: string) => void;
    otherBankAccount?: OtherBankAccountData | null;
    onOtherBankAccountChange?: (account: OtherBankAccountData | null) => void;
    onLookupIFSC?: (ifscCode: string) => Promise<IFSCLookupResult | null>;
    onVerifyAccount?: (accountNumber: string, ifsc: string) => Promise<boolean>;
    serverErrors?: ValidationError[];
    disabled?: boolean;
    className?: string;
};

const getFieldError = (errors: ValidationError[] | undefined, field: string): string | undefined => {
    return errors?.find(e => e.field === field)?.message;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
};

export function Funding({
    value,
    onChange,
    fdAmount,
    primaryAccount = {
        accountNumber: '',
        accountType: 'SAVINGS ACCOUNT',
        availableBalance: 100000
    },
    customerAccounts = [],
    selectedAccountId,
    onAccountChange,
    primaryAmount = '',
    onPrimaryAmountChange,
    otherBankAccount,
    onOtherBankAccountChange,
    onLookupIFSC,
    onVerifyAccount,
    serverErrors,
    disabled = false,
    className,
}: FundingProps) {
    const hasMultipleAccounts = customerAccounts.length > 1;

    // Get the display account info - use selected account if available, otherwise fallback
    const displayAccount: PrimaryAccountInfo = selectedAccountId && customerAccounts.length > 0
        ? customerAccounts.find(acc => acc.accountId === selectedAccountId) ?? primaryAccount
        : primaryAccount;
    const { t } = useTranslation();
    const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
    const [tempAccount, setTempAccount] = useState<{ accountNumber: string; confirmAccountNumber: string; ifsc: string }>({
        accountNumber: '',
        confirmAccountNumber: '',
        ifsc: ''
    });
    const [ifscLookupResult, setIfscLookupResult] = useState<IFSCLookupResult | null>(null);
    const [isLookingUpIFSC, setIsLookingUpIFSC] = useState(false);
    const [accountVerified, setAccountVerified] = useState<boolean | null>(null);
    const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
    const ifscLookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // IFSC validation helper - must be 11 chars, format: XXXX0XXXXXX
    const isValidIFSC = (ifsc: string): boolean => {
        const ifscPattern = /^[A-Z]{4}0[0-9A-Z]{6}$/;
        return ifsc.length === 11 && ifscPattern.test(ifsc);
    };

    // IFSC lookup with debounce
    const handleIFSCChange = useCallback((ifscValue: string) => {
        setTempAccount(prev => ({ ...prev, ifsc: ifscValue.toUpperCase() }));
        setIfscLookupResult(null);

        if (ifscLookupTimer.current) {
            clearTimeout(ifscLookupTimer.current);
        }

        if (ifscValue.length >= 4 && onLookupIFSC) {
            setIsLookingUpIFSC(true);
            ifscLookupTimer.current = setTimeout(async () => {
                try {
                    const result = await onLookupIFSC(ifscValue.toUpperCase());
                    setIfscLookupResult(result);
                } finally {
                    setIsLookingUpIFSC(false);
                }
            }, 300);
        }
    }, [onLookupIFSC]);

    const accountsMatch =
        !!tempAccount.accountNumber &&
        !!tempAccount.confirmAccountNumber &&
        tempAccount.accountNumber === tempAccount.confirmAccountNumber;

    const accountsMismatch =
        !!tempAccount.confirmAccountNumber &&
        tempAccount.accountNumber !== tempAccount.confirmAccountNumber;

    // Auto-verify when accounts match AND IFSC is valid
    const readyToVerify = accountsMatch && isValidIFSC(tempAccount.ifsc);
    const verifyKeyRef = useRef('');
    useEffect(() => {
        const key = `${tempAccount.accountNumber}:${tempAccount.ifsc}`;
        if (readyToVerify && key !== verifyKeyRef.current && onVerifyAccount) {
            verifyKeyRef.current = key;
            setIsVerifyingAccount(true);
            setAccountVerified(null);
            onVerifyAccount(tempAccount.accountNumber, tempAccount.ifsc).then(
                (verified) => { setAccountVerified(verified); setIsVerifyingAccount(false); },
                () => { setAccountVerified(false); setIsVerifyingAccount(false); }
            );
        }
        if (!readyToVerify) {
            setAccountVerified(null);
            verifyKeyRef.current = '';
        }
    }, [readyToVerify, tempAccount.accountNumber, tempAccount.ifsc, onVerifyAccount]);

    const canAddAccount =
        readyToVerify &&
        accountVerified === true;

    const openAccountModal = () => {
        if (otherBankAccount) {
            setTempAccount({
                accountNumber: otherBankAccount.accountNumber,
                confirmAccountNumber: otherBankAccount.accountNumber,
                ifsc: otherBankAccount.ifsc,
            });
            if (otherBankAccount.bankName) {
                setIfscLookupResult({
                    bankName: otherBankAccount.bankName,
                    branchName: otherBankAccount.branchName || '',
                    city: otherBankAccount.city || '',
                });
            }
        } else {
            setTempAccount({ accountNumber: '', confirmAccountNumber: '', ifsc: '' });
            setIfscLookupResult(null);
            setAccountVerified(null);
        }
        setIsAccountModalOpen(true);
    };

    const closeAccountModal = () => {
        setIsAccountModalOpen(false);
        setIfscLookupResult(null);
        setAccountVerified(null);
    };

    const confirmAccount = () => {
        if (canAddAccount) {
            onOtherBankAccountChange?.({
                accountNumber: tempAccount.accountNumber,
                ifsc: tempAccount.ifsc,
                bankName: ifscLookupResult?.bankName,
                branchName: ifscLookupResult?.branchName,
                city: ifscLookupResult?.city,
            });
            closeAccountModal();
        }
    };

    const deleteAccount = () => {
        onOtherBankAccountChange?.(null);
    };

    const showPrimarySection = value === 'primary-bank' || value === 'combined-funds';
    const showOtherBankSection = value === 'other-bank' || value === 'combined-funds';

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {/* Funding Options */}
            <div>
                <Heading level={3} className={styles.sectionTitle}>{t('step3.fundYourFdVia')}</Heading>
                <div className={styles.fundingOptions}>
                    <div
                        className={`${styles.fundingOptionCard} ${value === 'other-bank' ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
                        onClick={() => !disabled && onChange('other-bank')}
                        role="radio"
                        aria-checked={value === 'other-bank'}
                        tabIndex={disabled ? -1 : 0}
                    >
                        <div className={`${styles.fundingOptionIcon} ${styles.otherBankIcon}`}>
                            🏛️
                        </div>
                        <span className={styles.fundingOptionLabel}>{t('step3.otherBank')}</span>
                    </div>
                    <div
                        className={`${styles.fundingOptionCard} ${value === 'primary-bank' ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
                        onClick={() => !disabled && onChange('primary-bank')}
                        role="radio"
                        aria-checked={value === 'primary-bank'}
                        tabIndex={disabled ? -1 : 0}
                    >
                        <div className={`${styles.fundingOptionIcon} ${styles.primaryBankIcon}`}>
                            🏦
                        </div>
                        <span className={styles.fundingOptionLabel}>{t('step3.hdfcBank')}</span>
                    </div>
                    <div
                        className={`${styles.fundingOptionCard} ${value === 'combined-funds' ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
                        onClick={() => !disabled && onChange('combined-funds')}
                        role="radio"
                        aria-checked={value === 'combined-funds'}
                        tabIndex={disabled ? -1 : 0}
                    >
                        <div className={`${styles.fundingOptionIcon} ${styles.combinedFundsIcon}`}>
                            ⊕
                        </div>
                        <span className={styles.fundingOptionLabel}>{t('step3.combinedFunds')}</span>
                    </div>
                </div>
            </div>

            {/* Primary Bank Account Section */}
            {showPrimarySection && (
                <div className={styles.section}>
                    <Heading level={4} className={styles.sectionTitle}>{t('step3.hdfcBank')}</Heading>
                    <div className={styles.accountsList}>
                        {(hasMultipleAccounts ? customerAccounts : [{ accountId: displayAccount.accountNumber, ...displayAccount }]).map(account => (
                            <div
                                key={account.accountId}
                                className={`${styles.accountCard} ${(selectedAccountId || customerAccounts[0]?.accountId) === account.accountId ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
                                onClick={() => !disabled && onAccountChange?.(account.accountId)}
                                role="radio"
                                aria-checked={(selectedAccountId || customerAccounts[0]?.accountId) === account.accountId}
                                tabIndex={disabled ? -1 : 0}
                            >
                                <div className={styles.accountInfo}>
                                    <span className={styles.accountNumber}>{account.accountNumber}</span>
                                    <span className={styles.accountType}>{account.accountType}</span>
                                    <span className={styles.accountBalance}>
                                        {t('step3.availableBalance')}: ₹ {formatCurrency(account.availableBalance)}
                                    </span>
                                </div>
                                {(selectedAccountId || customerAccounts[0]?.accountId) === account.accountId && (
                                    <span className={styles.accountCheckmark}>✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Amount from Primary Bank - shown only for combined-funds */}
            {value === 'combined-funds' && (
                <div className={styles.amountSection}>
                    <div className={styles.amountHeader}>
                        <Label className={styles.amountLabel}>{t('step3.amountFromHdfc')}</Label>
                        <Paragraph variant="muted" element="span" className={styles.amountTotal}>{t('step3.fdFundingAmount')}: ₹ {formatCurrency(fdAmount)}</Paragraph>
                    </div>
                    <InputGroup
                        errorText={getFieldError(serverErrors, 'primaryAmount')}
                    >
                        <TextInput
                            id="primaryAmount"
                            value={primaryAmount}
                            onChange={(e) => onPrimaryAmountChange?.(e.target.value.replace(/\D/g, ''))}
                            placeholder={t('step2.enterFDAmount')}
                            disabled={disabled}
                            error={!!getFieldError(serverErrors, 'primaryAmount')}
                        />
                    </InputGroup>
                </div>
            )}

            {/* Other Bank Account Section */}
            {showOtherBankSection && (
                <div className={styles.otherBankSection}>
                    <Heading level={4} className={styles.otherBankTitle}>{t('step3.otherBankAccount')}</Heading>

                    {otherBankAccount ? (
                        <Card variant="outlined" className={`${styles.accountCardAdded} ${(getFieldError(serverErrors, 'accountNumber') || getFieldError(serverErrors, 'ifsc')) ? styles.accountCardError : ''}`}>
                            <div className={styles.accountCardAddedContent}>
                                <div className={styles.accountCardAddedRow}>
                                    <div className={styles.accountCardAddedField}>
                                        <Label className={styles.accountCardAddedLabel}>{t('step3.accountNumber')}</Label>
                                        <Paragraph element="span" className={styles.accountCardAddedValue}>{otherBankAccount.accountNumber}</Paragraph>
                                    </div>
                                    <div className={styles.accountCardAddedField}>
                                        <Label className={styles.accountCardAddedLabel}>{t('step3.ifsc')}</Label>
                                        <Paragraph element="span" className={styles.accountCardAddedValue}>{otherBankAccount.ifsc}</Paragraph>
                                    </div>
                                    {otherBankAccount.bankName && (
                                        <div className={styles.accountCardAddedField}>
                                            <Label className={styles.accountCardAddedLabel}>{t('step3.bank')}</Label>
                                            <Paragraph element="span" className={styles.accountCardAddedValue}>{otherBankAccount.bankName}</Paragraph>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.accountCardAddedActions}>
                                <Button
                                    appearance="tertiary"
                                    className={styles.accountEditButton}
                                    onClick={openAccountModal}
                                    disabled={disabled}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                    </svg>
                                </Button>
                                <Button
                                    appearance="tertiary"
                                    className={styles.accountDeleteButton}
                                    onClick={deleteAccount}
                                    disabled={disabled}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                    </svg>
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Button appearance="secondary" className={styles.addAccountButton} onClick={openAccountModal} disabled={disabled}>
                            {t('step3.addAccount')} +
                        </Button>
                    )}

                    {getFieldError(serverErrors, 'otherBankAccount') && (
                        <p className={styles.errorText}>{getFieldError(serverErrors, 'otherBankAccount')}</p>
                    )}
                    {getFieldError(serverErrors, 'accountNumber') && (
                        <p className={styles.errorText}>{getFieldError(serverErrors, 'accountNumber')}</p>
                    )}
                    {getFieldError(serverErrors, 'ifsc') && (
                        <p className={styles.errorText}>{getFieldError(serverErrors, 'ifsc')}</p>
                    )}
                </div>
            )}

            {/* Maturity Account - shown for other-bank */}
            {value === 'other-bank' && (
                <div className={styles.section}>
                    <Heading level={4} className={styles.sectionTitle}>{t('step3.maturityAccount')}</Heading>
                    <Paragraph variant="muted" className={styles.maturityAccountDescription}>
                        {t('step3.maturityAccountDesc')}
                    </Paragraph>
                    <div className={styles.accountsList}>
                        {(hasMultipleAccounts ? customerAccounts : [{ accountId: displayAccount.accountNumber, ...displayAccount }]).map(account => (
                            <div
                                key={account.accountId}
                                className={`${styles.accountCard} ${(selectedAccountId || customerAccounts[0]?.accountId) === account.accountId ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
                                onClick={() => !disabled && onAccountChange?.(account.accountId)}
                                role="radio"
                                aria-checked={(selectedAccountId || customerAccounts[0]?.accountId) === account.accountId}
                                tabIndex={disabled ? -1 : 0}
                            >
                                <div className={styles.accountInfo}>
                                    <span className={styles.accountNumber}>{account.accountNumber}</span>
                                    <span className={styles.accountType}>{account.accountType}</span>
                                    <span className={styles.accountBalance}>
                                        {t('step3.availableBalance')}: ₹ {formatCurrency(account.availableBalance)}
                                    </span>
                                </div>
                                {(selectedAccountId || customerAccounts[0]?.accountId) === account.accountId && (
                                    <span className={styles.accountCheckmark}>✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Account Modal */}
            <Modal
                isOpen={isAccountModalOpen}
                onClose={closeAccountModal}
                title={t('step3.otherBankAccount')}
                className={styles.accountModal}
            >
                <div className={styles.modalContent}>
                    {/* Step 1: Account Number */}
                    <div className={styles.modalStep}>
                        <div className={styles.modalStepIndicator}>
                            <span className={`${styles.stepNumber} ${tempAccount.accountNumber ? styles.stepComplete : ''}`}>1</span>
                            <span className={styles.stepLabel}>{t('accountDetails.accountNumber')}</span>
                        </div>
                        <InputGroup
                            inputId="accountNumber"
                        >
                            <TextInput
                                id="accountNumber"
                                value={tempAccount.accountNumber}
                                onChange={(e) => setTempAccount({ ...tempAccount, accountNumber: e.target.value.replace(/\D/g, '') })}
                                placeholder={t('accountDetails.accountNumberPlaceholder')}
                                rightAdornment={
                                    isVerifyingAccount ? (
                                        <span className={styles.adornmentLoading}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={styles.spinIcon}><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" /></svg>
                                        </span>
                                    ) : accountVerified === true ? (
                                        <span className={styles.adornmentVerified}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                                        </span>
                                    ) : accountVerified === false ? (
                                        <span className={styles.adornmentError}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                                        </span>
                                    ) : undefined
                                }
                            />
                            <Paragraph variant="muted" className={styles.helpText}>Example: For testing, try with "50100115851324"</Paragraph>
                        </InputGroup>
                        
                    </div>

                    {/* Step 2: Confirm Account Number */}
                    <div className={styles.modalStep}>
                        <div className={styles.modalStepIndicator}>
                            <span className={`${styles.stepNumber} ${accountsMatch ? styles.stepComplete : ''}`}>2</span>
                            <span className={styles.stepLabel}>{t('accountDetails.confirmAccountNumber')}</span>
                        </div>
                        <InputGroup
                            inputId="confirmAccountNumber"
                            errorText={accountsMismatch ? t('accountDetails.errors.confirmMismatch') : undefined}
                            helpText={accountsMatch ? t('accountDetails.accountNumbersMatch', 'Account numbers match') : undefined}
                        >
                            <TextInput
                                id="confirmAccountNumber"
                                value={tempAccount.confirmAccountNumber}
                                onChange={(e) => setTempAccount({ ...tempAccount, confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
                                placeholder={t('accountDetails.confirmAccountNumberPlaceholder')}
                                error={accountsMismatch}
                                rightAdornment={
                                    accountsMatch ? (
                                        <span className={styles.adornmentSuccess}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                        </span>
                                    ) : accountsMismatch ? (
                                        <span className={styles.adornmentError}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                                        </span>
                                    ) : undefined
                                }
                            />
                        </InputGroup>
                    </div>

                    {/* Step 3: IFSC - disabled until account is verified */}
                    <div className={`${styles.modalStep} ${!accountsMatch ? styles.modalStepDisabled : ''}`}>
                        <div className={styles.modalStepIndicator}>
                            <span className={`${styles.stepNumber} ${accountVerified === true ? styles.stepComplete : ''}`}>3</span>
                            <span className={styles.stepLabel}>{t('accountDetails.ifsc')}</span>
                            {!accountsMatch && (
                                <span className={styles.stepHint}>{t('accountDetails.matchAccountsFirst', 'Confirm account number first')}</span>
                            )}
                        </div>
                        <InputGroup
                            inputId="ifsc"
                            errorText={accountsMatch && tempAccount.ifsc && !isValidIFSC(tempAccount.ifsc) ? t('accountDetails.invalidIfsc', 'Invalid IFSC code (e.g., SBIN0009101)') : undefined}
                        >
                            <TextInput
                                id="ifsc"
                                value={tempAccount.ifsc}
                                onChange={(e) => handleIFSCChange(e.target.value)}
                                placeholder={t('accountDetails.ifscPlaceholder')}
                                maxLength={11}
                                disabled={!accountsMatch}
                                error={!!(accountsMatch && tempAccount.ifsc && !isValidIFSC(tempAccount.ifsc))}
                                rightAdornment={
                                    isLookingUpIFSC ? (
                                        <span className={styles.adornmentLoading}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={styles.spinIcon}><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" /></svg>
                                        </span>
                                    ) : ifscLookupResult ? (
                                        <span className={styles.adornmentSuccess}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                        </span>
                                    ) : undefined
                                }
                            />
                            <Paragraph variant="muted" className={styles.helpText}>Example: Try with "ATNT0001111"</Paragraph>
                        </InputGroup>


                        {/* Bank details resolved from IFSC */}
                        {ifscLookupResult && !isLookingUpIFSC && (
                            <Card variant="outlined" className={styles.bankInfoCard}>
                                <Paragraph className={styles.bankInfoName}>{ifscLookupResult.bankName}</Paragraph>
                                <Paragraph variant="muted" className={styles.bankInfoBranch}>{ifscLookupResult.branchName}, {ifscLookupResult.city}</Paragraph>
                            </Card>
                        )}

                        {/* Verification status */}
                        {isVerifyingAccount && (
                            <Paragraph variant="muted" className={styles.verifyingText}>{t('accountDetails.verifyingAccount', 'Verifying account...')}</Paragraph>
                        )}
                        {accountVerified === false && !isVerifyingAccount && (
                            <Paragraph className={styles.verificationError}>{t('accountDetails.accountInvalid', 'Account verification failed. Please check your details.')}</Paragraph>
                        )}
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <CtaButton
                        onClick={confirmAccount}
                        disabled={!canAddAccount || isVerifyingAccount}
                    >
                        {isVerifyingAccount ? t('accountDetails.verifyingAccount', 'Verifying account...') : t('step3.addAccount')}
                    </CtaButton>
                </div>
            </Modal>
        </div>
    );
}
