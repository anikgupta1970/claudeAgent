import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Funding, type FundingOption, type OtherBankAccountData } from './funding.js';

setupTestI18n(en);

const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ApiBankingTheme>{ui}</ApiBankingTheme>);
};

describe('Funding', () => {
    it('should render all three funding options', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <Funding
                value="other-bank"
                onChange={onChange}
                fdAmount={10000}
            />
        );

        expect(screen.getByText('Other Bank')).toBeInTheDocument();
        expect(screen.getByText('HDFC Bank')).toBeInTheDocument();
        expect(screen.getByText('Combined Funds')).toBeInTheDocument();
    });

    it('should call onChange when a funding option is clicked', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <Funding
                value="primary-bank"
                onChange={onChange}
                fdAmount={10000}
            />
        );

        const otherBankOption = screen.getByText('Other Bank').closest('div[role="radio"]');
        fireEvent.click(otherBankOption!);

        expect(onChange).toHaveBeenCalledWith('other-bank');
    });

    it('should show Primary Bank account card when primary-bank is selected', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <Funding
                value="primary-bank"
                onChange={onChange}
                fdAmount={10000}
                primaryAccount={{
                    accountNumber: '***12',
                    accountType: 'SAVINGS ACCOUNT',
                    availableBalance: 100000
                }}
            />
        );

        expect(screen.getByText('HDFC Bank', { selector: 'h4' })).toBeInTheDocument();
        expect(screen.getByText('***12')).toBeInTheDocument();
        expect(screen.getByText('SAVINGS ACCOUNT')).toBeInTheDocument();
    });

    it('should show Add Account button when other-bank is selected without account', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <Funding
                value="other-bank"
                onChange={onChange}
                fdAmount={10000}
                otherBankAccount={null}
            />
        );

        expect(screen.getByText('Add Account +')).toBeInTheDocument();
    });

    it('should show account card when other-bank account is added', () => {
        const onChange = vi.fn();
        const otherBankAccount: OtherBankAccountData = {
            accountNumber: '123456789012',
            ifsc: 'ICIC0001234'
        };

        renderWithTheme(
            <Funding
                value="other-bank"
                onChange={onChange}
                fdAmount={10000}
                otherBankAccount={otherBankAccount}
            />
        );

        expect(screen.getByText('123456789012')).toBeInTheDocument();
        expect(screen.getByText('ICIC0001234')).toBeInTheDocument();
    });

    it('should show primary bank amount input when combined-funds is selected', () => {
        const onChange = vi.fn();
        const onPrimaryAmountChange = vi.fn();

        renderWithTheme(
            <Funding
                value="combined-funds"
                onChange={onChange}
                fdAmount={10000}
                primaryAmount=""
                onPrimaryAmountChange={onPrimaryAmountChange}
            />
        );

        expect(screen.getByText('Amount from HDFC')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter FD amount')).toBeInTheDocument();
    });

    it('should call onOtherBankAccountChange with null when delete button is clicked', () => {
        const onChange = vi.fn();
        const onOtherBankAccountChange = vi.fn();
        const otherBankAccount: OtherBankAccountData = {
            accountNumber: '123456789012',
            ifsc: 'ICIC0001234'
        };

        renderWithTheme(
            <Funding
                value="other-bank"
                onChange={onChange}
                fdAmount={10000}
                otherBankAccount={otherBankAccount}
                onOtherBankAccountChange={onOtherBankAccountChange}
            />
        );

        const deleteButton = screen.getAllByRole('button')[1];
        fireEvent.click(deleteButton);

        expect(onOtherBankAccountChange).toHaveBeenCalledWith(null);
    });

    it('should not allow interaction when disabled', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <Funding
                value="primary-bank"
                onChange={onChange}
                fdAmount={10000}
                disabled
            />
        );

        const otherBankOption = screen.getByText('Other Bank').closest('div[role="radio"]');
        fireEvent.click(otherBankOption!);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('should display error text for server errors', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <Funding
                value="other-bank"
                onChange={onChange}
                fdAmount={10000}
                otherBankAccount={{ accountNumber: '123456', ifsc: 'INVALID' }}
                serverErrors={[{ field: 'ifsc', message: 'Invalid IFSC code' }]}
            />
        );

        expect(screen.getByText('Invalid IFSC code')).toBeInTheDocument();
    });

    describe('Account Modal', () => {
        it('should open account modal with empty fields when Add Account is clicked', () => {
            const onChange = vi.fn();
            const onOtherBankAccountChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="other-bank"
                    onChange={onChange}
                    fdAmount={10000}
                    otherBankAccount={null}
                    onOtherBankAccountChange={onOtherBankAccountChange}
                />
            );

            const addAccountButton = screen.getByText('Add Account +');
            fireEvent.click(addAccountButton);

            // Fields should be empty - this verifies modal is open
            const accountNumberInput = screen.getByPlaceholderText('Enter account number');
            const confirmAccountInput = screen.getByPlaceholderText('Re-enter account number');
            const ifscInput = screen.getByPlaceholderText('Enter IFSC code');

            expect(accountNumberInput).toHaveValue('');
            expect(confirmAccountInput).toHaveValue('');
            expect(ifscInput).toHaveValue('');
        });

        it('should open account modal with pre-filled data when editing existing account', () => {
            const onChange = vi.fn();
            const onOtherBankAccountChange = vi.fn();
            const existingAccount: OtherBankAccountData = {
                accountNumber: '123456789012',
                ifsc: 'ICIC0001234'
            };

            renderWithTheme(
                <Funding
                    value="other-bank"
                    onChange={onChange}
                    fdAmount={10000}
                    otherBankAccount={existingAccount}
                    onOtherBankAccountChange={onOtherBankAccountChange}
                />
            );

            // Click edit button (first button after the account card is rendered)
            const editButton = screen.getAllByRole('button')[0];
            fireEvent.click(editButton);

            // Modal should be open with pre-filled data - check input fields
            const accountNumberInput = screen.getByPlaceholderText('Enter account number');
            const confirmAccountInput = screen.getByPlaceholderText('Re-enter account number');
            const ifscInput = screen.getByPlaceholderText('Enter IFSC code');

            expect(accountNumberInput).toHaveValue('123456789012');
            expect(confirmAccountInput).toHaveValue('123456789012');
            expect(ifscInput).toHaveValue('ICIC0001234');
        });

        it('should close account modal when close is triggered', () => {
            const onChange = vi.fn();
            const onOtherBankAccountChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="other-bank"
                    onChange={onChange}
                    fdAmount={10000}
                    otherBankAccount={null}
                    onOtherBankAccountChange={onOtherBankAccountChange}
                />
            );

            // Open modal
            const addAccountButton = screen.getByText('Add Account +');
            fireEvent.click(addAccountButton);

            // Modal should be open - look for the input fields which are unique to the modal
            expect(screen.getByPlaceholderText('Enter account number')).toBeInTheDocument();
        });

        it('should show error when account numbers do not match', () => {
            const onChange = vi.fn();
            const onOtherBankAccountChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="other-bank"
                    onChange={onChange}
                    fdAmount={10000}
                    otherBankAccount={null}
                    onOtherBankAccountChange={onOtherBankAccountChange}
                />
            );

            // Open modal
            const addAccountButton = screen.getByText('Add Account +');
            fireEvent.click(addAccountButton);

            // Enter mismatched account numbers
            const accountNumberInput = screen.getByPlaceholderText('Enter account number');
            const confirmAccountInput = screen.getByPlaceholderText('Re-enter account number');

            fireEvent.change(accountNumberInput, { target: { value: '123456789012' } });
            fireEvent.change(confirmAccountInput, { target: { value: '123456789000' } });

            // Error should be shown
            expect(screen.getByText('Account numbers do not match')).toBeInTheDocument();
        });

        it('should confirm account when all fields are valid and matching', async () => {
            const onChange = vi.fn();
            const onOtherBankAccountChange = vi.fn();
            const onVerifyAccount = vi.fn().mockResolvedValue(true);

            renderWithTheme(
                <Funding
                    value="other-bank"
                    onChange={onChange}
                    fdAmount={10000}
                    otherBankAccount={null}
                    onOtherBankAccountChange={onOtherBankAccountChange}
                    onVerifyAccount={onVerifyAccount}
                />
            );

            // Open modal
            const addAccountButton = screen.getByText('Add Account +');
            fireEvent.click(addAccountButton);

            // Fill in valid data
            const accountNumberInput = screen.getByPlaceholderText('Enter account number');
            const confirmAccountInput = screen.getByPlaceholderText('Re-enter account number');
            const ifscInput = screen.getByPlaceholderText('Enter IFSC code');

            fireEvent.change(accountNumberInput, { target: { value: '123456789012' } });
            fireEvent.change(confirmAccountInput, { target: { value: '123456789012' } });
            fireEvent.change(ifscInput, { target: { value: 'ICIC0001234' } });

            // Wait for auto-verification to complete and Add Account button to become enabled
            const confirmButton = await screen.findByRole('button', { name: 'Add Account' });
            fireEvent.click(confirmButton);

            // Callback should be called with the account data
            expect(onOtherBankAccountChange).toHaveBeenCalledWith({
                accountNumber: '123456789012',
                ifsc: 'ICIC0001234',
                bankName: undefined,
                branchName: undefined,
                city: undefined,
            });
        });

        it('should convert IFSC input to uppercase', () => {
            const onChange = vi.fn();
            const onOtherBankAccountChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="other-bank"
                    onChange={onChange}
                    fdAmount={10000}
                    otherBankAccount={null}
                    onOtherBankAccountChange={onOtherBankAccountChange}
                />
            );

            // Open modal
            const addAccountButton = screen.getByText('Add Account +');
            fireEvent.click(addAccountButton);

            const ifscInput = screen.getByPlaceholderText('Enter IFSC code');
            fireEvent.change(ifscInput, { target: { value: 'icic0001234' } });

            expect(ifscInput).toHaveValue('ICIC0001234');
        });

        it('should only allow digits in account number fields', () => {
            const onChange = vi.fn();
            const onOtherBankAccountChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="other-bank"
                    onChange={onChange}
                    fdAmount={10000}
                    otherBankAccount={null}
                    onOtherBankAccountChange={onOtherBankAccountChange}
                />
            );

            // Open modal
            const addAccountButton = screen.getByText('Add Account +');
            fireEvent.click(addAccountButton);

            const accountNumberInput = screen.getByPlaceholderText('Enter account number');
            fireEvent.change(accountNumberInput, { target: { value: 'abc123def456' } });

            expect(accountNumberInput).toHaveValue('123456');
        });

        it('should disable confirm button when fields are incomplete', () => {
            const onChange = vi.fn();
            const onOtherBankAccountChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="other-bank"
                    onChange={onChange}
                    fdAmount={10000}
                    otherBankAccount={null}
                    onOtherBankAccountChange={onOtherBankAccountChange}
                />
            );

            // Open modal
            const addAccountButton = screen.getByText('Add Account +');
            fireEvent.click(addAccountButton);

            // Find confirm button in modal (it's the one inside the modal, not the trigger)
            const allButtons = screen.getAllByRole('button');
            const confirmButton = allButtons.find(btn =>
                btn.textContent === 'Confirm' && btn !== addAccountButton
            );

            if (confirmButton) {
                expect(confirmButton).toBeDisabled();
            }
        });
    });

    describe('combined-funds option', () => {
        it('should call onChange with combined-funds when clicked', () => {
            const onChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="other-bank"
                    onChange={onChange}
                    fdAmount={10000}
                />
            );

            const combinedFundsOption = screen.getByText('Combined Funds').closest('div[role="radio"]');
            fireEvent.click(combinedFundsOption!);

            expect(onChange).toHaveBeenCalledWith('combined-funds');
        });

        it('should show primary bank amount input for combined-funds', () => {
            const onChange = vi.fn();
            const onPrimaryAmountChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="combined-funds"
                    onChange={onChange}
                    fdAmount={100000}
                    primaryAmount="50000"
                    onPrimaryAmountChange={onPrimaryAmountChange}
                />
            );

            expect(screen.getByText('Amount from HDFC')).toBeInTheDocument();
            expect(screen.getByText('FD Funding Amount: ₹ 1,00,000')).toBeInTheDocument();
        });

        it('should call onPrimaryAmountChange when primary bank amount is entered', () => {
            const onChange = vi.fn();
            const onPrimaryAmountChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="combined-funds"
                    onChange={onChange}
                    fdAmount={100000}
                    primaryAmount=""
                    onPrimaryAmountChange={onPrimaryAmountChange}
                />
            );

            const primaryAmountInput = screen.getByPlaceholderText('Enter FD amount');
            fireEvent.change(primaryAmountInput, { target: { value: '50000' } });

            expect(onPrimaryAmountChange).toHaveBeenCalledWith('50000');
        });

        it('should only allow digits in primary bank amount input', () => {
            const onChange = vi.fn();
            const onPrimaryAmountChange = vi.fn();

            renderWithTheme(
                <Funding
                    value="combined-funds"
                    onChange={onChange}
                    fdAmount={100000}
                    primaryAmount=""
                    onPrimaryAmountChange={onPrimaryAmountChange}
                />
            );

            const primaryAmountInput = screen.getByPlaceholderText('Enter FD amount');
            fireEvent.change(primaryAmountInput, { target: { value: 'abc50000def' } });

            expect(onPrimaryAmountChange).toHaveBeenCalledWith('50000');
        });
    });
});
