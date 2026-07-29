import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useJourneyContext, type ValidationError } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { useStitchClientWithFallback } from "@api-banking/stitch.stitch-client";
import { CtaButton } from "@api-banking/design.actions.cta-button";
import { Link } from "@api-banking/design.navigation.link";
import { Heading } from "@api-banking/design.typography.heading";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import { Funding, type FundingOption, type OtherBankAccountData, type PrimaryAccountInfo, type IFSCLookupResult, type CustomerAccountOption } from "@api-banking/fixed-deposit.funding";
import { BranchSelector, type Branch, type BranchFilterParams } from "@api-banking/stitch.branch-selector";
import { Nomination, type NomineeData } from "@api-banking/fixed-deposit.nomination";
import styles from "./bank-details.module.scss";

export type { FundingOption, NomineeData, OtherBankAccountData };

export type BankDetailsProps = {
    onContinue?: (data: BankDetailsFormData) => void;
    onBack?: () => void;
    serverErrors?: ValidationError[];
    isSubmitting?: boolean;
    initialData?: BankDetailsFormData;
    fdAmount?: number;
    primaryAccount?: PrimaryAccountInfo;
};

export type BankDetailsFormData = {
    fundingOption: FundingOption;
    primaryAmount?: string;
    otherBankAccount?: OtherBankAccountData;
    branch: string;
    branchName?: string;
    branchIfsc?: string;
    branchAddress?: string;
    primaryAccountId?: string;
    primaryAccountNumber?: string;
    primaryAccountType?: string;
    addNominee: boolean;
    nominee?: NomineeData;
};

const getFieldError = (errors: ValidationError[] | undefined, field: string): string | undefined => {
    return errors?.find(e => e.field === field)?.message;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
};

export function BankDetails({
    onContinue,
    onBack,
    serverErrors,
    isSubmitting,
    initialData,
    fdAmount = 10000,
    primaryAccount = {
        accountNumber: '***12',
        accountType: 'SAVINGS ACCOUNT',
        availableBalance: 100000
    }
}: BankDetailsProps) {
    const { updateFormData, accessToken, customerId, customerAccounts } = useJourneyContext();

    const [fundingOption, setFundingOption] = useState<FundingOption>(initialData?.fundingOption ?? 'primary-bank');
    const [primaryAmount, setPrimaryAmount] = useState<string>(initialData?.primaryAmount ?? '');
    const [selectedBranch, setSelectedBranch] = useState<string>(initialData?.branch ?? '');
    const [addNominee, setAddNominee] = useState<boolean>(initialData?.addNominee ?? false);
    const [nomineeData, setNomineeData] = useState<NomineeData | null>(initialData?.nominee ?? null);
    const [otherBankAccount, setOtherBankAccount] = useState<OtherBankAccountData | null>(initialData?.otherBankAccount ?? null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoadingBranches, setIsLoadingBranches] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string>(
        initialData?.primaryAccountId ?? customerAccounts[0]?.accountNo ?? ''
    );

    // Auto-select first account when accounts are loaded (handles async loading)
    useEffect(() => {
        if (!selectedAccountId && customerAccounts.length > 0) {
            setSelectedAccountId(customerAccounts[0].accountNo);
        }
    }, [customerAccounts, selectedAccountId]);

    // Convert customer accounts to the format expected by Funding
    // Use accountNo as accountId since the API's accountId is the customerId (not unique per account)
    const fundingAccounts: CustomerAccountOption[] = customerAccounts.map(acc => ({
        accountId: acc.accountNo,
        accountNumber: acc.accountNo,
        accountType: 'SAVINGS ACCOUNT',
        availableBalance: Number(acc.currentBalance?.amount ?? 0),
    }));

    // Derive primaryAccountInfo from selected customer account (for form submission)
    const selectedAccount = customerAccounts.find(acc => acc.accountNo === selectedAccountId);
    const primaryAccountInfo: PrimaryAccountInfo = selectedAccount ? {
        accountNumber: selectedAccount.accountNo,
        accountType: 'SAVINGS ACCOUNT',
        availableBalance: Number(selectedAccount.currentBalance?.amount ?? 0),
    } : primaryAccount;
    const stitchClient = useStitchClientWithFallback();
    const { t } = useTranslation();

    const fetchBranches = useCallback(async (filters?: BranchFilterParams) => {
        setIsLoadingBranches(true);
        try {
            const response = await stitchClient.getBranches({
                country: 'IN',
                state: filters?.state,
                city: filters?.city,
                pin: filters?.pin,
            }) as any;
            // Handle both array response (real Stitch API) and { branches: [...] } (stubs/mock)
            if (Array.isArray(response)) {
                setBranches(response);
            } else if ('branches' in response) {
                setBranches(response.branches);
            }
        } finally {
            setIsLoadingBranches(false);
        }
    }, [stitchClient]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const handleBranchFilterChange = useCallback((filters: BranchFilterParams) => {
        fetchBranches(filters);
    }, [fetchBranches]);

    const handleLookupIFSC = useCallback(async (ifscCode: string): Promise<IFSCLookupResult | null> => {
        try {
            const response = await stitchClient.lookupIFSC(ifscCode) as any;
            if ('bankName' in response) {
                return {
                    bankName: response.bankName,
                    branchName: response.branchName,
                    city: response.city,
                };
            }
        } catch {
            // silently fail
        }
        return null;
    }, [stitchClient]);

    const handleVerifyAccount = useCallback(async (accountNumber: string, ifsc: string): Promise<boolean> => {
        if (!customerId) {
            console.warn('Cannot verify bank account: customerId not available');
            return false;
        }
        try {
            const response = await stitchClient.verifyBankAccount(
                {
                    customerId,
                    accountNo: accountNumber,
                    ifsc,
                },
                accessToken
            );
            // Check for successful verification status
            if (response?.status === 'success') {
                return true;
            }
        } catch (error) {
            console.error('Bank account verification failed:', error);
        }
        return false;
    }, [stitchClient, customerId, accessToken]);

    const fetchNominee = useCallback(async (): Promise<NomineeData | null> => {
        const nominee = selectedAccount?.nomination?.nominees?.[0];
        if (!nominee) return null;
        // Map API fields to UI NomineeData shape
        const dob = nominee.dob
            ? nominee.dob.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')
            : '';
        const apiGuardian = nominee.guardian;
        const guardian = apiGuardian ? {
            name: apiGuardian.name,
            dateOfBirth: apiGuardian.dob
                ? apiGuardian.dob.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')
                : '',
        } : undefined;
        return {
            fullName: nominee.name,
            dateOfBirth: dob,
            relationship: nominee.relationship
                ? nominee.relationship.charAt(0).toUpperCase() + nominee.relationship.slice(1).toLowerCase()
                : '',
            guardian,
        };
    }, [selectedAccount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedBranchData = branches.find(b => b.code === selectedBranch);
        const data: BankDetailsFormData = {
            fundingOption,
            primaryAmount: fundingOption === 'combined-funds' ? primaryAmount : undefined,
            otherBankAccount: (fundingOption === 'other-bank' || fundingOption === 'combined-funds') && otherBankAccount ? otherBankAccount : undefined,
            branch: selectedBranch,
            branchName: selectedBranchData?.name,
            branchIfsc: selectedBranchData?.ifsc,
            branchAddress: selectedBranchData?.address,
            primaryAccountId: selectedAccountId || undefined,
            primaryAccountNumber: primaryAccountInfo.accountNumber,
            primaryAccountType: primaryAccountInfo.accountType,
            addNominee,
            nominee: addNominee && nomineeData ? nomineeData : undefined,
        };
        updateFormData('bank', data);
        onContinue?.(data);
    };

    const showBranchAndNominee = fundingOption === 'primary-bank' || fundingOption === 'combined-funds' || fundingOption === 'other-bank';

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <Link href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }} className={styles.backLink}>
                    &lt; {t('step2.depositDetails')}
                </Link>
            </div>

            {/* FD Funding Amount */}
            <div>
                <Paragraph variant="muted" className={styles.fundingAmountLabel}>{t('step3.fdFundingAmount')}</Paragraph>
                <Heading level={2} visualLevel="h3" className={styles.fundingAmountValue}>₹ {formatCurrency(fdAmount)}</Heading>
            </div>

            {/* Funding Options */}
            <Funding
                value={fundingOption}
                onChange={setFundingOption}
                fdAmount={fdAmount}
                primaryAccount={primaryAccountInfo}
                customerAccounts={fundingAccounts}
                selectedAccountId={selectedAccountId}
                onAccountChange={setSelectedAccountId}
                primaryAmount={primaryAmount}
                onPrimaryAmountChange={setPrimaryAmount}
                otherBankAccount={otherBankAccount}
                onOtherBankAccountChange={setOtherBankAccount}
                onLookupIFSC={handleLookupIFSC}
                onVerifyAccount={handleVerifyAccount}
                serverErrors={serverErrors}
                disabled={isSubmitting}
            />

            {/* Branch Section - shown for primary-bank and combined-funds */}
            {showBranchAndNominee && (
                <BranchSelector
                    value={selectedBranch}
                    onChange={setSelectedBranch}
                    branches={branches}
                    errorText={getFieldError(serverErrors, 'branch')}
                    disabled={isSubmitting}
                    isLoading={isLoadingBranches}
                    onFilterChange={handleBranchFilterChange}
                />
            )}

            {/* Nominee Section - shown for primary-bank and combined-funds */}
            {showBranchAndNominee && (
                <Nomination
                    enabled={addNominee}
                    onEnabledChange={setAddNominee}
                    nomineeData={nomineeData}
                    onNomineeChange={setNomineeData}
                    onFetchNominee={fetchNominee}
                    disabled={isSubmitting}
                />
            )}

            {/* Continue Button */}
            <form onSubmit={handleSubmit}>
                <CtaButton
                    type="submit"
                    className={styles.continueButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('step3.loading.loadingAccountDetails') : t('step3.continue')}
                </CtaButton>
            </form>
        </div>
    );
}
