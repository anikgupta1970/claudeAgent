import React, { useState } from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Funding, type FundingOption, type OtherBankAccountData } from './funding.js';

export const FundingPrimaryBank = () => {
    const [value, setValue] = useState<FundingOption>('primary-bank');
    const [primaryAmount, setPrimaryAmount] = useState('');
    const [otherBankAccount, setOtherBankAccount] = useState<OtherBankAccountData | null>(null);

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '500px' }}>
                <Funding
                    value={value}
                    onChange={setValue}
                    fdAmount={10000}
                    primaryAmount={primaryAmount}
                    onPrimaryAmountChange={setPrimaryAmount}
                    otherBankAccount={otherBankAccount}
                    onOtherBankAccountChange={setOtherBankAccount}
                />
            </div>
        </ApiBankingTheme>
    );
};

export const FundingOtherBank = () => {
    const [value, setValue] = useState<FundingOption>('other-bank');
    const [primaryAmount, setPrimaryAmount] = useState('');
    const [otherBankAccount, setOtherBankAccount] = useState<OtherBankAccountData | null>(null);

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '500px' }}>
                <Funding
                    value={value}
                    onChange={setValue}
                    fdAmount={10000}
                    primaryAmount={primaryAmount}
                    onPrimaryAmountChange={setPrimaryAmount}
                    otherBankAccount={otherBankAccount}
                    onOtherBankAccountChange={setOtherBankAccount}
                />
            </div>
        </ApiBankingTheme>
    );
};

export const FundingOtherBankWithAccount = () => {
    const [value, setValue] = useState<FundingOption>('other-bank');
    const [primaryAmount, setPrimaryAmount] = useState('');
    const [otherBankAccount, setOtherBankAccount] = useState<OtherBankAccountData | null>({
        accountNumber: '123456789012',
        ifsc: 'ICIC0001234'
    });

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '500px' }}>
                <Funding
                    value={value}
                    onChange={setValue}
                    fdAmount={10000}
                    primaryAmount={primaryAmount}
                    onPrimaryAmountChange={setPrimaryAmount}
                    otherBankAccount={otherBankAccount}
                    onOtherBankAccountChange={setOtherBankAccount}
                />
            </div>
        </ApiBankingTheme>
    );
};

export const FundingCombinedFunds = () => {
    const [value, setValue] = useState<FundingOption>('combined-funds');
    const [primaryAmount, setPrimaryAmount] = useState('5000');
    const [otherBankAccount, setOtherBankAccount] = useState<OtherBankAccountData | null>({
        accountNumber: '987654321098',
        ifsc: 'SBIN0005678'
    });

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '500px' }}>
                <Funding
                    value={value}
                    onChange={setValue}
                    fdAmount={10000}
                    primaryAmount={primaryAmount}
                    onPrimaryAmountChange={setPrimaryAmount}
                    otherBankAccount={otherBankAccount}
                    onOtherBankAccountChange={setOtherBankAccount}
                />
            </div>
        </ApiBankingTheme>
    );
};

export const FundingDisabled = () => {
    const [value, setValue] = useState<FundingOption>('primary-bank');
    const [primaryAmount, setPrimaryAmount] = useState('');
    const [otherBankAccount, setOtherBankAccount] = useState<OtherBankAccountData | null>(null);

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '500px' }}>
                <Funding
                    value={value}
                    onChange={setValue}
                    fdAmount={10000}
                    primaryAmount={primaryAmount}
                    onPrimaryAmountChange={setPrimaryAmount}
                    otherBankAccount={otherBankAccount}
                    onOtherBankAccountChange={setOtherBankAccount}
                    disabled
                />
            </div>
        </ApiBankingTheme>
    );
};
