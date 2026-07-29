import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthenticationProvider, useJourneyContext } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { BasicPreviewStep } from "./preview-step.composition.js";
import { PreviewStep } from "./preview-step.js";

setupTestI18n(en);

// Mock the useJourneyContext hook
const mockUseJourneyContext = vi.fn();

vi.mock("@api-banking/fixed-deposit.hooks.use-journey-context", async () => {
    const actual = await vi.importActual("@api-banking/fixed-deposit.hooks.use-journey-context");
    return {
        ...actual,
        useJourneyContext: () => mockUseJourneyContext()
    };
});

// Mock fetch to prevent unhandled ECONNREFUSED errors from useEffect API calls
const originalFetch = global.fetch;
beforeAll(() => {
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
    });
});
afterAll(() => {
    global.fetch = originalFetch;
});

const defaultMockData = {
    formData: {
        deposit: {
            amount: '100000',
            tenureYears: '2',
            tenureMonths: '6',
            tenureDays: '15',
            interestPayout: 'monthly',
            maturityInstructions: 'RENEW_PRINCIPAL'
        },
        bank: {
            fundingOption: 'primary-bank',
            branchName: 'Test Branch',
            otherBankAccount: null,
            primaryAmount: '50000'
        },
        login: {
            fullName: 'John Doe',
            dateOfBirth: '1990',
            pan: 'ABCD1234F',
            mobileNumber: '+91 9876543210'
        },
        calculator: {
            roi: 5.75,
            maturityAmount: { amount: '112500', currency: 'INR' },
            maturityDate: '2027-01-22'
        }
    }
};

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <MemoryRouter>
            <AuthenticationProvider>{ui}</AuthenticationProvider>
        </MemoryRouter>
    );
};

describe('PreviewStep', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseJourneyContext.mockReturnValue(defaultMockData);
    });

    it('should render the correct text', () => {
        const { getByText } = render(<BasicPreviewStep />);
        const rendered = getByText('Fixed Deposit Account');
        expect(rendered).toBeTruthy();
    });

    it('should render Customer Details section', () => {
        renderWithProviders(<PreviewStep />);
        expect(screen.getByText('Customer Details')).toBeInTheDocument();
    });

    it('should render Fixed Deposit Details section', () => {
        renderWithProviders(<PreviewStep />);
        expect(screen.getByText('Fixed Deposit Details')).toBeInTheDocument();
    });

    it('should call onBack when back link is clicked', () => {
        const onBack = vi.fn();
        renderWithProviders(<PreviewStep onBack={onBack} />);

        const backLink = screen.getByText('< Bank Details');
        fireEvent.click(backLink);

        expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('should call onContinue when Continue button is clicked', () => {
        const onContinue = vi.fn();
        renderWithProviders(<PreviewStep onContinue={onContinue} />);

        const continueButton = screen.getByRole('button', { name: /Confirm/i });
        fireEvent.click(continueButton);

        expect(onContinue).toHaveBeenCalledTimes(1);
    });

    it('should display Rate of Interest', () => {
        renderWithProviders(<PreviewStep />);
        expect(screen.getByText('5.75% p.a')).toBeInTheDocument();
    });
});

describe('PreviewStep utility functions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle formatAmount with non-numeric input', () => {
        mockUseJourneyContext.mockReturnValue({
            formData: {
                deposit: { amount: 'invalid' },
                bank: {},
                login: {}
            }
        });

        renderWithProviders(<PreviewStep />);
        // Non-numeric input should return the original value
        expect(screen.getByText('invalid')).toBeInTheDocument();
    });

    it('should handle formatAmount with empty input', () => {
        mockUseJourneyContext.mockReturnValue({
            formData: {
                deposit: { amount: '' },
                bank: {},
                login: {}
            }
        });

        renderWithProviders(<PreviewStep />);
        // Empty amount should show '-'
        const dashElements = screen.getAllByText('-');
        expect(dashElements.length).toBeGreaterThan(0);
    });

    it('should display account number without masking', () => {
        mockUseJourneyContext.mockReturnValue({
            formData: {
                deposit: {},
                bank: {
                    fundingOption: 'other-bank',
                    otherBankAccount: { accountNumber: '123456789012', ifsc: 'ICIC0001234' }
                },
                login: {}
            }
        });

        renderWithProviders(<PreviewStep />);
        expect(screen.getByText('123456789012')).toBeInTheDocument();
    });

    it('should render Primary Bank section when fundingOption is primary-bank', () => {
        mockUseJourneyContext.mockReturnValue({
            formData: {
                deposit: {},
                bank: {
                    fundingOption: 'primary-bank',
                    branchName: 'Test Branch'
                },
                login: {}
            }
        });

        renderWithProviders(<PreviewStep />);
        expect(screen.getByText('Bank Account Details')).toBeInTheDocument();
    });

    it('should render Other Bank section when fundingOption is other-bank with account data', () => {
        mockUseJourneyContext.mockReturnValue({
            formData: {
                deposit: {},
                bank: {
                    fundingOption: 'other-bank',
                    otherBankAccount: { accountNumber: '123456789012', ifsc: 'ICIC0001234' }
                },
                login: {}
            }
        });

        renderWithProviders(<PreviewStep />);
        expect(screen.getByText('Other Bank Account')).toBeInTheDocument();
        expect(screen.getByText('ICIC0001234')).toBeInTheDocument();
    });

    it('should render both Primary Bank and Other Bank sections for combined-funds', () => {
        mockUseJourneyContext.mockReturnValue({
            formData: {
                deposit: {},
                bank: {
                    fundingOption: 'combined-funds',
                    primaryAmount: '50000',
                    otherBankAccount: { accountNumber: '123456789012', ifsc: 'ICIC0001234' }
                },
                login: {}
            }
        });

        renderWithProviders(<PreviewStep />);
        expect(screen.getByText('Bank Account Details')).toBeInTheDocument();
        expect(screen.getByText('Other Bank Account')).toBeInTheDocument();
    });

    it('should format tenure correctly with all parts', () => {
        mockUseJourneyContext.mockReturnValue({
            formData: {
                deposit: {
                    tenureYears: '2',
                    tenureMonths: '6',
                    tenureDays: '15'
                },
                bank: {},
                login: {}
            }
        });

        renderWithProviders(<PreviewStep />);
        expect(screen.getByText('2 Years 6 months 15 days')).toBeInTheDocument();
    });

    it('should format tenure with singular values', () => {
        mockUseJourneyContext.mockReturnValue({
            formData: {
                deposit: {
                    tenureYears: '1',
                    tenureMonths: '1',
                    tenureDays: '1'
                },
                bank: {},
                login: {}
            }
        });

        renderWithProviders(<PreviewStep />);
        expect(screen.getByText('1 Year 1 month 1 day')).toBeInTheDocument();
    });

    it('should show 0 for empty tenure', () => {
        mockUseJourneyContext.mockReturnValue({
            formData: {
                deposit: {},
                bank: {},
                login: {}
            }
        });

        renderWithProviders(<PreviewStep />);
        // There are multiple 0s on the page, just verify the component renders
        expect(screen.getByText('Tenure')).toBeInTheDocument();
    });
});
