import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { AuthenticationProvider } from '@api-banking/fixed-deposit.hooks.use-journey-context';
import { FixedDepositCalculatorBase, type FDCalculatorInput, type FDCalculationResult } from './fixed-deposit-calculator-base.js';
import { FixedDepositCalculator } from './fixed-deposit-calculator.js';

setupTestI18n(en);

// Mock the Stitch client
const mockStitchClient = {
    calculateFDLegacy: vi.fn(),
    setTokenProvider: vi.fn(),
};

vi.mock('@api-banking/stitch.stitch-client', () => ({
    useStitchClientWithFallback: () => mockStitchClient,
    StitchClientProvider: ({ children }: { children: React.ReactNode }) => children,
    isTokenExpiringSoon: () => false,
}));

const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ApiBankingTheme>{ui}</ApiBankingTheme>);
};

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <ApiBankingTheme>
            <AuthenticationProvider clientId="test-client">
                {ui}
            </AuthenticationProvider>
        </ApiBankingTheme>
    );
};

const defaultInput: FDCalculatorInput = {
    amount: '10000',
    tenureYears: '1',
    tenureMonths: '0',
    tenureDays: '0',
    interestPayout: 'monthly',
    fdType: 'withdrawable',
};

const defaultStitchProps = {
    customerId: 'CUST001',
    productVariant: 'STANDARD_FD',
    maturityInstruction: {
        option: 'renew',
        payoutAccountId: 'ACC001',
        managersCheque: false,
    },
};

describe('FixedDepositCalculatorBase', () => {
    it('should render calculate button', () => {
        const onCalculate = vi.fn();

        renderWithTheme(
            <FixedDepositCalculatorBase
                input={defaultInput}
                onCalculate={onCalculate}
            />
        );

        expect(screen.getByText('Calculate FD Details')).toBeInTheDocument();
    });

    it('should call onCalculate when button is clicked', async () => {
        const onCalculate = vi.fn();

        renderWithTheme(
            <FixedDepositCalculatorBase
                input={defaultInput}
                onCalculate={onCalculate}
            />
        );

        const button = screen.getByText('Calculate FD Details');
        fireEvent.click(button);

        expect(onCalculate).toHaveBeenCalled();
    });

    it('should display result when provided', () => {
        const onCalculate = vi.fn();
        const result: FDCalculationResult = {
            principal: 10000,
            interestRate: 6.5,
            interestEarned: 650,
            maturityAmount: 10650,
            maturityDate: '2027-01-22',
        };

        renderWithTheme(
            <FixedDepositCalculatorBase
                input={defaultInput}
                onCalculate={onCalculate}
                result={result}
            />
        );

        expect(screen.getByText('Maturity Details')).toBeInTheDocument();
        expect(screen.getAllByText(/₹\s*10,000/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/6\.5\s*%\s*p\.a\./)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/₹\s*650/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/₹\s*10,650/)[0]).toBeInTheDocument();
    });
    it('should display error when provided', () => {
        const onCalculate = vi.fn();

        renderWithTheme(
            <FixedDepositCalculatorBase
                input={defaultInput}
                onCalculate={onCalculate}
                error="Unable to calculate FD details"
            />
        );

        expect(screen.getByText('Unable to calculate FD details')).toBeInTheDocument();
    });

    it('should show calculating state', () => {
        const onCalculate = vi.fn();

        renderWithTheme(
            <FixedDepositCalculatorBase
                input={defaultInput}
                onCalculate={onCalculate}
                isCalculating
            />
        );

        expect(screen.getByText('Calculating...')).toBeInTheDocument();
    });

    it('should disable button when disabled prop is true', () => {
        const onCalculate = vi.fn();

        renderWithTheme(
            <FixedDepositCalculatorBase
                input={defaultInput}
                onCalculate={onCalculate}
                disabled
            />
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should disable button when amount is empty', () => {
        const onCalculate = vi.fn();
        const incompleteInput: FDCalculatorInput = {
            ...defaultInput,
            amount: '',
        };

        renderWithTheme(
            <FixedDepositCalculatorBase
                input={incompleteInput}
                onCalculate={onCalculate}
            />
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should disable button when tenure is zero', () => {
        const onCalculate = vi.fn();
        const incompleteInput: FDCalculatorInput = {
            ...defaultInput,
            tenureYears: '0',
            tenureMonths: '0',
            tenureDays: '0',
        };

        renderWithTheme(
            <FixedDepositCalculatorBase
                input={incompleteInput}
                onCalculate={onCalculate}
            />
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should not call onCalculate when button is clicked while calculating', () => {
        const onCalculate = vi.fn();

        renderWithTheme(
            <FixedDepositCalculatorBase
                input={defaultInput}
                onCalculate={onCalculate}
                isCalculating
            />
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(onCalculate).not.toHaveBeenCalled();
    });
});

describe('FixedDepositCalculator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockSuccessResponse = {
        maturityAmount: { amount: '107100', currency: 'INR' },
        roi: 7.1,
        startDate: '2026-01-22',
        maturityDate: '2027-01-22',
        interestEarned: { amount: '7100', currency: 'INR' },
    };

    it('should render calculate button', () => {
        renderWithProviders(
            <FixedDepositCalculator input={defaultInput} {...defaultStitchProps} />
        );

        expect(screen.getByText('Calculate FD Details')).toBeInTheDocument();
    });

    it('should call API and display result on successful calculation', async () => {
        mockStitchClient.calculateFDLegacy.mockResolvedValue(mockSuccessResponse);

        renderWithProviders(
            <FixedDepositCalculator input={defaultInput} {...defaultStitchProps} />
        );

        const button = screen.getByText('Calculate FD Details');
        fireEvent.click(button);

        // Should show calculating state
        expect(screen.getByText('Calculating...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Maturity Details')).toBeInTheDocument();
        });

        expect(screen.getAllByText(/₹\s*10,000/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/7\.1\s*%\s*p\.a\./)[0]).toBeInTheDocument();
    });

    it('should call onCalculationComplete callback on success', async () => {
        mockStitchClient.calculateFDLegacy.mockResolvedValue(mockSuccessResponse);
        const onCalculationComplete = vi.fn();

        renderWithProviders(
            <FixedDepositCalculator
                input={defaultInput}
                {...defaultStitchProps}
                onCalculationComplete={onCalculationComplete}
            />
        );

        fireEvent.click(screen.getByText('Calculate FD Details'));

        await waitFor(() => {
            expect(onCalculationComplete).toHaveBeenCalledWith({
                principal: 10000,
                interestRate: 7.1,
                interestEarned: 7100,
                maturityAmount: 107100,
                maturityDate: '2027-01-22',
            });
        });
    });

    it('should display error when API returns error response', async () => {
        mockStitchClient.calculateFDLegacy.mockResolvedValue({
            success: false,
            errors: [{ field: 'amount', message: 'Amount must be at least ₹1,000' }],
        });

        renderWithProviders(
            <FixedDepositCalculator input={defaultInput} {...defaultStitchProps} />
        );

        fireEvent.click(screen.getByText('Calculate FD Details'));

        await waitFor(() => {
            expect(screen.getByText('Amount must be at least ₹1,000')).toBeInTheDocument();
        });
    });

    it('should display fallback error message when API returns error without message', async () => {
        mockStitchClient.calculateFDLegacy.mockResolvedValue({
            success: false,
            errors: [],
        });

        renderWithProviders(
            <FixedDepositCalculator input={defaultInput} {...defaultStitchProps} />
        );

        fireEvent.click(screen.getByText('Calculate FD Details'));

        await waitFor(() => {
            expect(screen.getByText('Failed to calculate FD details')).toBeInTheDocument();
        });
    });

    it('should call onCalculationError callback on API error', async () => {
        mockStitchClient.calculateFDLegacy.mockResolvedValue({
            success: false,
            errors: [{ field: 'general', message: 'Server error' }],
        });
        const onCalculationError = vi.fn();

        renderWithProviders(
            <FixedDepositCalculator
                input={defaultInput}
                {...defaultStitchProps}
                onCalculationError={onCalculationError}
            />
        );

        fireEvent.click(screen.getByText('Calculate FD Details'));

        await waitFor(() => {
            expect(onCalculationError).toHaveBeenCalledWith('Server error');
        });
    });

    it('should display network error when API call fails', async () => {
        mockStitchClient.calculateFDLegacy.mockRejectedValue(new Error('Network error'));

        renderWithProviders(
            <FixedDepositCalculator input={defaultInput} {...defaultStitchProps} />
        );

        fireEvent.click(screen.getByText('Calculate FD Details'));

        await waitFor(() => {
            expect(screen.getByText('Unable to connect to server. Please try again.')).toBeInTheDocument();
        });
    });

    it('should call onCalculationError callback on network error', async () => {
        mockStitchClient.calculateFDLegacy.mockRejectedValue(new Error('Network error'));
        const onCalculationError = vi.fn();

        renderWithProviders(
            <FixedDepositCalculator
                input={defaultInput}
                {...defaultStitchProps}
                onCalculationError={onCalculationError}
            />
        );

        fireEvent.click(screen.getByText('Calculate FD Details'));

        await waitFor(() => {
            expect(onCalculationError).toHaveBeenCalledWith('Unable to connect to server. Please try again.');
        });
    });

    it('should disable button when disabled prop is true', () => {
        renderWithProviders(
            <FixedDepositCalculator input={defaultInput} {...defaultStitchProps} disabled />
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should apply className to container', () => {
        const { container } = renderWithProviders(
            <FixedDepositCalculator input={defaultInput} {...defaultStitchProps} className="custom-class" />
        );

        expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should clear previous result and error when calculating again', async () => {
        // First call returns success
        mockStitchClient.calculateFDLegacy.mockResolvedValueOnce(mockSuccessResponse);

        renderWithProviders(
            <FixedDepositCalculator input={defaultInput} {...defaultStitchProps} />
        );

        fireEvent.click(screen.getByText('Calculate FD Details'));

        await waitFor(() => {
            expect(screen.getByText('Maturity Details')).toBeInTheDocument();
        });

        // Second call will fail
        mockStitchClient.calculateFDLegacy.mockResolvedValueOnce({
            success: false,
            errors: [{ field: 'general', message: 'Error occurred' }],
        });

        fireEvent.click(screen.getByText('Calculate FD Details'));

        // Result should be cleared during calculation
        await waitFor(() => {
            expect(screen.queryByText('Maturity Details')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Error occurred')).toBeInTheDocument();
        });
    });
});
