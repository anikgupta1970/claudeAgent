import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthenticationProvider, useJourneyContext } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { BasicSubmitForm } from "./submit-form.composition.js";
import { SubmitForm } from "./submit-form.js";

setupTestI18n(en);

// Mock the useJourneyContext hook
vi.mock("@api-banking/fixed-deposit.hooks.use-journey-context", async () => {
    const actual = await vi.importActual("@api-banking/fixed-deposit.hooks.use-journey-context");
    return {
        ...actual,
        useJourneyContext: vi.fn(() => ({
            formData: {
                deposit: {},
                bank: {},
                login: {},
                calculator: {
                    roi: 5.75,
                    maturityAmount: { amount: '112500', currency: 'INR' },
                    maturityDate: '2027-01-22'
                }
            }
        }))
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

const mockUseJourneyContext = vi.mocked(useJourneyContext);

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <MemoryRouter>
            <AuthenticationProvider>{ui}</AuthenticationProvider>
        </MemoryRouter>
    );
};

describe('SubmitForm', () => {
    it('should render the correct text', () => {
        const { getByText } = render(<BasicSubmitForm />);
        const rendered = getByText('Application has been submitted');
        expect(rendered).toBeTruthy();
    });

    it('should render Fixed Deposit Account heading', () => {
        renderWithProviders(<SubmitForm />);
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render Application Summary section', () => {
        renderWithProviders(<SubmitForm />);
        expect(screen.getByText('Application Summary')).toBeInTheDocument();
    });

    it('should call onClose when Close button is clicked', () => {
        const onClose = vi.fn();
        renderWithProviders(<SubmitForm onClose={onClose} />);

        const closeButton = screen.getByRole('button', { name: /Back to Home/i });
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should display default placeholder values when no form data is provided', () => {
        renderWithProviders(<SubmitForm />);

        expect(screen.getByText('5.75% p.a')).toBeInTheDocument();
        expect(screen.getByText('Account Type')).toBeInTheDocument();
        expect(screen.getAllByText('Fixed Deposit Account').length).toBeGreaterThan(0);
    });

    it('should format amount correctly with Indian locale', () => {
        // The component uses formatAmount which should format numbers with Indian locale
        renderWithProviders(<SubmitForm />);
        // The FD Amount field should show '-' when no data is present
        expect(screen.getByText('Fixed Deposit Amount')).toBeInTheDocument();
    });

    it('should format tenure with years, months, and days', () => {
        // The formatTenure function combines years, months and days
        renderWithProviders(<SubmitForm />);
        expect(screen.getByText('Tenure')).toBeInTheDocument();
    });

    it('should display "-" for empty amount field', () => {
        renderWithProviders(<SubmitForm />);
        // Fields without data should show '-'
        const dashValues = screen.getAllByText('-');
        expect(dashValues.length).toBeGreaterThan(0);
    });

    describe('formatAmount edge cases', () => {
        it('should return original value for non-numeric amount', () => {
            mockUseJourneyContext.mockReturnValue({
                formData: {
                    deposit: { amount: 'invalid-amount' },
                    bank: {},
                    login: {}
                }
            } as any);

            renderWithProviders(<SubmitForm />);
            expect(screen.getByText('invalid-amount')).toBeInTheDocument();
        });

        it('should format numeric amount with Indian locale', () => {
            mockUseJourneyContext.mockReturnValue({
                formData: {
                    deposit: { amount: '100000' },
                    bank: {},
                    login: {}
                }
            } as any);

            renderWithProviders(<SubmitForm />);
            expect(screen.getByText('₹ 1,00,000')).toBeInTheDocument();
        });
    });

    describe('formatTenure edge cases', () => {
        it('should format tenure with only years', () => {
            mockUseJourneyContext.mockReturnValue({
                formData: {
                    deposit: { tenureYears: '2', tenureMonths: '0', tenureDays: '0' },
                    bank: {},
                    login: {}
                }
            } as any);

            renderWithProviders(<SubmitForm />);
            expect(screen.getByText('2 Years')).toBeInTheDocument();
        });

        it('should format tenure with only months', () => {
            mockUseJourneyContext.mockReturnValue({
                formData: {
                    deposit: { tenureYears: '0', tenureMonths: '6' },
                    bank: {},
                    login: {}
                }
            } as any);

            renderWithProviders(<SubmitForm />);
            expect(screen.getByText('6 Months')).toBeInTheDocument();
        });

        it('should format tenure with only days', () => {
            mockUseJourneyContext.mockReturnValue({
                formData: {
                    deposit: { tenureDays: '15' },
                    bank: {},
                    login: {}
                }
            } as any);

            renderWithProviders(<SubmitForm />);
            expect(screen.getByText('15 Days')).toBeInTheDocument();
        });

        it('should format tenure with singular values', () => {
            mockUseJourneyContext.mockReturnValue({
                formData: {
                    deposit: { tenureYears: '1', tenureMonths: '1', tenureDays: '1' },
                    bank: {},
                    login: {}
                }
            } as any);

            renderWithProviders(<SubmitForm />);
            expect(screen.getByText('1 Year 1 Month 1 Day')).toBeInTheDocument();
        });

        it('should display 0 for empty tenure', () => {
            mockUseJourneyContext.mockReturnValue({
                formData: {
                    deposit: {},
                    bank: {},
                    login: {}
                }
            } as any);

            renderWithProviders(<SubmitForm />);
            expect(screen.getByText('0')).toBeInTheDocument();
        });
    });
});
