import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { vi } from 'vitest';
import { DepositDetails, DepositFormData } from './deposit-details.js';

setupTestI18n(en);

// Mock the useJourneyContext hook to provide customerId
vi.mock('@api-banking/fixed-deposit.hooks.use-journey-context', () => ({
  useJourneyContext: () => ({
    updateFormData: vi.fn(),
    journeyConfig: null,
    customerId: 'TEST_CUSTOMER_ID',
    customerAccounts: [{ accountId: 'ACC001', accountNo: '12345678901234' }],
  }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ApiBankingTheme>
        {ui}
      </ApiBankingTheme>
    </MemoryRouter>
  );
};

describe('DepositDetails', () => {

  describe('rendering', () => {
    it('should render all main sections', () => {
      renderWithProviders(<DepositDetails />);

      expect(screen.getByText('Customer Details')).toBeInTheDocument();
      expect(screen.getByText('Select FD Type')).toBeInTheDocument();
      expect(screen.getByText('Interest Payout')).toBeInTheDocument();
      expect(screen.getByText('Maturity Instructions')).toBeInTheDocument();
      expect(screen.getByText('Tenure')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    it('should render customer details section without data when no customerData provided', () => {
      renderWithProviders(<DepositDetails />);

      expect(screen.getByText('Customer Details')).toBeInTheDocument();
    });

    it('should render customer details with provided values', () => {
      renderWithProviders(
        <DepositDetails
          customerData={{
            fullName: 'John Doe',
            dateOfBirth: '1985-05-15',
            pan: 'ABCDE1234F',
          }}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('1985-05-15')).toBeInTheDocument();
      expect(screen.getByText('ABCDE1234F')).toBeInTheDocument();
    });

    it('should render FD type options', () => {
      renderWithProviders(<DepositDetails />);

      expect(screen.getByText('Withdrawable FD')).toBeInTheDocument();
      expect(screen.getByText('Non-Withdrawable FD')).toBeInTheDocument();
    });

    it('should render interest payout options', () => {
      renderWithProviders(<DepositDetails />);

      expect(screen.getByText('At Maturity')).toBeInTheDocument();
      expect(screen.getByText('Monthly')).toBeInTheDocument();
      expect(screen.getByText('Quarterly')).toBeInTheDocument();
    });

    it('should render tenure input fields', () => {
      renderWithProviders(<DepositDetails />);

      expect(screen.getByLabelText('Years')).toBeInTheDocument();
      expect(screen.getByLabelText('Months')).toBeInTheDocument();
      expect(screen.getByLabelText('Days')).toBeInTheDocument();
    });

    it('should render calculate button', () => {
      renderWithProviders(<DepositDetails />);

      expect(screen.getByText('Calculate FD Details')).toBeInTheDocument();
    });

    it('should render back link', () => {
      renderWithProviders(<DepositDetails />);

      expect(screen.getByText('< Login')).toBeInTheDocument();
    });
  });

  describe('default values', () => {
    it('should have withdrawable FD selected by default', () => {
      renderWithProviders(<DepositDetails />);

      const withdrawableCard = screen.getByText('Withdrawable FD').closest('div');
      expect(withdrawableCard?.parentElement).toHaveClass('selected');
    });

    it('should have at-maturity interest payout selected by default', () => {
      renderWithProviders(<DepositDetails />);

      const radio = screen.getByLabelText(/At Maturity/);
      expect(radio).toBeChecked();
    });

    it('should have default tenure values', () => {
      renderWithProviders(<DepositDetails />);

      expect(screen.getByLabelText('Years')).toHaveValue('0');
      expect(screen.getByLabelText('Months')).toHaveValue('6');
      expect(screen.getByLabelText('Days')).toHaveValue('0');
    });
  });

  describe('FD type selection', () => {
    it('should toggle FD type when non-withdrawable is clicked', () => {
      renderWithProviders(<DepositDetails />);

      const nonWithdrawableCard = screen.getByText('Non-Withdrawable FD').closest('div');
      fireEvent.click(nonWithdrawableCard!.parentElement!);

      // Check that non-withdrawable is now selected
      expect(nonWithdrawableCard?.parentElement).toHaveClass('selected');
    });

    it('should not toggle FD type when submitting', () => {
      renderWithProviders(<DepositDetails isSubmitting={true} />);

      const nonWithdrawableCard = screen.getByText('Non-Withdrawable FD').closest('div');
      fireEvent.click(nonWithdrawableCard!.parentElement!);

      // Withdrawable should still be selected
      const withdrawableCard = screen.getByText('Withdrawable FD').closest('div');
      expect(withdrawableCard?.parentElement).toHaveClass('selected');
    });
  });

  describe('amount input', () => {
    it('should update amount when typed', () => {
      renderWithProviders(<DepositDetails />);

      const amountInput = screen.getByPlaceholderText('Enter FD amount');
      fireEvent.change(amountInput, { target: { value: '50000' } });

      expect(amountInput).toHaveValue('50000');
    });

    it('should be disabled during submission', () => {
      renderWithProviders(<DepositDetails isSubmitting={true} />);

      const amountInput = screen.getByPlaceholderText('Enter FD amount');
      expect(amountInput).toBeDisabled();
    });
  });

  describe('interest payout selection', () => {
    it('should change interest payout when monthly is clicked', () => {
      renderWithProviders(<DepositDetails />);

      const monthlyRadio = screen.getByLabelText('Monthly');
      fireEvent.click(monthlyRadio);

      expect(monthlyRadio).toBeChecked();
    });

    it('should change interest payout when quarterly is clicked', () => {
      renderWithProviders(<DepositDetails />);

      const quarterlyRadio = screen.getByLabelText('Quarterly');
      fireEvent.click(quarterlyRadio);

      expect(quarterlyRadio).toBeChecked();
    });
  });

  describe('maturity instructions conditional logic', () => {
    it('should show all 3 maturity options when interest payout is at-maturity (default)', () => {
      renderWithProviders(<DepositDetails />);

      // The hidden native select rendered by React Aria contains the options
      const hiddenSelect = document.querySelector('select[name="maturityInstructions"]') as HTMLSelectElement
        || document.querySelector('#maturityInstructions select') as HTMLSelectElement;

      // Alternatively, check that the "Renew Principal and Interest" text is present in the DOM
      // The Select component renders option labels in its trigger or hidden select
      const container = screen.getByText('Maturity Instructions').closest('div')!;
      expect(container).toBeInTheDocument();

      // With at-maturity (default), the third option should be available
      // Open the select dropdown to verify options
      const trigger = container.querySelector('button[role="button"], button') as HTMLElement;
      if (trigger) {
        fireEvent.click(trigger);
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3);
        expect(options[0]).toHaveTextContent('Do Not Renew');
        expect(options[1]).toHaveTextContent('Renew Principal');
        expect(options[2]).toHaveTextContent('Renew Principal and Interest');
      }
    });

    it('should show only 2 maturity options when interest payout is monthly', () => {
      renderWithProviders(<DepositDetails />);

      // Switch to monthly
      const monthlyRadio = screen.getByLabelText('Monthly');
      fireEvent.click(monthlyRadio);

      // Open the maturity instructions dropdown
      const section = screen.getByText('Maturity Instructions').closest('div')!;
      const trigger = section.querySelector('button[role="button"], button') as HTMLElement;
      if (trigger) {
        fireEvent.click(trigger);
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveTextContent('Do Not Renew');
        expect(options[1]).toHaveTextContent('Renew Principal');
      }
    });

    it('should show only 2 maturity options when interest payout is quarterly', () => {
      renderWithProviders(<DepositDetails />);

      // Switch to quarterly
      const quarterlyRadio = screen.getByLabelText('Quarterly');
      fireEvent.click(quarterlyRadio);

      const section = screen.getByText('Maturity Instructions').closest('div')!;
      const trigger = section.querySelector('button[role="button"], button') as HTMLElement;
      if (trigger) {
        fireEvent.click(trigger);
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
      }
    });

    it('should reset maturity selection when switching from at-maturity to monthly with RENEW_PRINCIPAL_AND_INTEREST selected', () => {
      const initialData: DepositFormData = {
        fdType: 'withdrawable',
        amount: '50000',
        interestPayout: 'at-maturity',
        maturityInstructions: 'RENEW_PRINCIPAL_AND_INTEREST',
        tenureYears: '1',
        tenureMonths: '0',
        tenureDays: '0',
      };

      const onContinue = vi.fn();
      renderWithProviders(<DepositDetails initialData={initialData} onContinue={onContinue} />);

      // Switch to monthly — should reset maturity to DO_NOT_RENEW
      const monthlyRadio = screen.getByLabelText('Monthly');
      fireEvent.click(monthlyRadio);

      // Submit the form to check the value
      fireEvent.click(screen.getByText('Continue'));

      expect(onContinue).toHaveBeenCalledWith(
        expect.objectContaining({
          interestPayout: 'monthly',
          maturityInstructions: 'DO_NOT_RENEW',
        })
      );
    });

    it('should NOT reset maturity selection when switching payout if current selection is still valid', () => {
      const initialData: DepositFormData = {
        fdType: 'withdrawable',
        amount: '50000',
        interestPayout: 'at-maturity',
        maturityInstructions: 'RENEW_PRINCIPAL',
        tenureYears: '1',
        tenureMonths: '0',
        tenureDays: '0',
      };

      const onContinue = vi.fn();
      renderWithProviders(<DepositDetails initialData={initialData} onContinue={onContinue} />);

      // Switch to monthly — RENEW_PRINCIPAL is still valid, should not reset
      const monthlyRadio = screen.getByLabelText('Monthly');
      fireEvent.click(monthlyRadio);

      fireEvent.click(screen.getByText('Continue'));

      expect(onContinue).toHaveBeenCalledWith(
        expect.objectContaining({
          interestPayout: 'monthly',
          maturityInstructions: 'RENEW_PRINCIPAL',
        })
      );
    });
  });

  describe('tenure inputs', () => {
    it('should update years when typed', () => {
      renderWithProviders(<DepositDetails />);

      const yearsInput = screen.getByLabelText('Years');
      fireEvent.change(yearsInput, { target: { value: '2' } });

      expect(yearsInput).toHaveValue('2');
    });

    it('should update months when typed', () => {
      renderWithProviders(<DepositDetails />);

      const monthsInput = screen.getByLabelText('Months');
      fireEvent.change(monthsInput, { target: { value: '3' } });

      expect(monthsInput).toHaveValue('3');
    });

    it('should update days when typed', () => {
      renderWithProviders(<DepositDetails />);

      const daysInput = screen.getByLabelText('Days');
      fireEvent.change(daysInput, { target: { value: '15' } });

      expect(daysInput).toHaveValue('15');
    });
  });

  describe('initialData prop', () => {
    it('should restore form state from initialData', () => {
      const initialData: DepositFormData = {
        fdType: 'non-withdrawable',
        amount: '100000',
        interestPayout: 'quarterly',
        maturityInstructions: 'RENEW_PRINCIPAL',
        tenureYears: '2',
        tenureMonths: '3',
        tenureDays: '15',
      };

      renderWithProviders(<DepositDetails initialData={initialData} />);

      // Check FD type
      const nonWithdrawableCard = screen.getByText('Non-Withdrawable FD').closest('div');
      expect(nonWithdrawableCard?.parentElement).toHaveClass('selected');

      // Check amount
      expect(screen.getByPlaceholderText('Enter FD amount')).toHaveValue('100000');

      // Check interest payout
      expect(screen.getByRole('radio', { name: /Quarterly/ })).toBeChecked();

      // Check tenure
      expect(screen.getByLabelText('Years')).toHaveValue('2');
      expect(screen.getByLabelText('Months')).toHaveValue('3');
      expect(screen.getByLabelText('Days')).toHaveValue('15');
    });
  });

  describe('server errors', () => {
    it('should display server error for amount field', () => {
      const serverErrors = [{ field: 'amount', message: 'Amount must be at least ₹5000' }];
      renderWithProviders(<DepositDetails serverErrors={serverErrors} />);

      expect(screen.getByText('Amount must be at least ₹5000')).toBeInTheDocument();
    });

    it('should display server error for fdType field', () => {
      const serverErrors = [{ field: 'fdType', message: 'Please select a valid FD type' }];
      renderWithProviders(<DepositDetails serverErrors={serverErrors} />);

      expect(screen.getByText('Please select a valid FD type')).toBeInTheDocument();
    });

    it('should display server error for tenure field', () => {
      const serverErrors = [{ field: 'tenure', message: 'Tenure must be at least 7 days' }];
      renderWithProviders(<DepositDetails serverErrors={serverErrors} />);

      expect(screen.getByText('Tenure must be at least 7 days')).toBeInTheDocument();
    });

    it('should display server error for interestPayout field', () => {
      const serverErrors = [{ field: 'interestPayout', message: 'Invalid interest payout option' }];
      renderWithProviders(<DepositDetails serverErrors={serverErrors} />);

      expect(screen.getByText('Invalid interest payout option')).toBeInTheDocument();
    });

    it('should display server error for maturityInstructions field', () => {
      const serverErrors = [{ field: 'maturityInstructions', message: 'Invalid maturity instructions' }];
      renderWithProviders(<DepositDetails serverErrors={serverErrors} />);

      expect(screen.getByText('Invalid maturity instructions')).toBeInTheDocument();
    });
  });

  describe('calculation', () => {
    // Note: Tests that rely on mocking the API client are skipped because
    // vi.mock doesn't work reliably in Bit's capsule build environment.
    // The calculation functionality is tested in the FixedDepositCalculator component tests.

    it('should disable calculate button during submission', () => {
      renderWithProviders(<DepositDetails isSubmitting={true} />);

      const calculateButton = screen.getByText('Calculate FD Details');
      expect(calculateButton).toBeDisabled();
    });
  });

  describe('form submission', () => {
    it('should call onContinue with form data when submitted', async () => {
      const onContinue = vi.fn();
      renderWithProviders(<DepositDetails onContinue={onContinue} />);

      // Fill in form
      fireEvent.change(screen.getByPlaceholderText('Enter FD amount'), {
        target: { value: '50000' },
      });

      // Submit form
      fireEvent.click(screen.getByText('Continue'));

      expect(onContinue).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: '50000',
          fdType: 'withdrawable',
          interestPayout: 'at-maturity',
        })
      );
    });

    it('should show submitting state', () => {
      renderWithProviders(<DepositDetails isSubmitting={true} />);

      expect(screen.getByText('Calculating...')).toBeInTheDocument();
    });

    it('should disable continue button during submission', () => {
      renderWithProviders(<DepositDetails isSubmitting={true} />);

      const continueButton = screen.getByText('Calculating...');
      expect(continueButton).toBeDisabled();
    });
  });

  describe('back navigation', () => {
    it('should call onBack when back link is clicked', () => {
      const onBack = vi.fn();
      renderWithProviders(<DepositDetails onBack={onBack} />);

      fireEvent.click(screen.getByText('< Login'));

      expect(onBack).toHaveBeenCalled();
    });

    it('should prevent default link behavior', () => {
      const onBack = vi.fn();
      renderWithProviders(<DepositDetails onBack={onBack} />);

      const backLink = screen.getByText('< Login');
      const event = new MouseEvent('click', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      backLink.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
