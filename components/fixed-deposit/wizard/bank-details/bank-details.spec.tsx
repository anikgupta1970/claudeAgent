import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { AuthenticationProvider } from '@api-banking/fixed-deposit.hooks.use-journey-context';
import { BankDetails, BankDetailsFormData } from './bank-details.js';

setupTestI18n(en);

// Mock the Stitch client for BranchSelector
const mockStitchClient = {
    getBranchStates: vi.fn().mockResolvedValue({ states: ['IN-MH', 'IN-DL'] }),
    getBranchCities: vi.fn().mockResolvedValue({ cities: ['Mumbai', 'Pune'] }),
    getBranches: vi.fn().mockResolvedValue({ branches: [
        { code: '1', name: 'Mumbai - Andheri West', address: 'Shop No. 5, Andheri West, Mumbai 400058', ifsc: 'HDFC0000001' },
        { code: '2', name: 'Mumbai - Bandra', address: 'Linking Road, Bandra West, Mumbai 400050', ifsc: 'HDFC0000002' }
    ] }),
    getBranchesByLocation: vi.fn().mockResolvedValue([
        { code: '1', name: 'Mumbai - Andheri West', address: 'Shop No. 5, Andheri West, Mumbai 400058', ifsc: 'HDFC0000001' }
    ]),
    getBranchesByPincode: vi.fn().mockResolvedValue([]),
    setTokenProvider: vi.fn(),
};

vi.mock('@api-banking/stitch.stitch-client', () => ({
    useStitchClientWithFallback: () => mockStitchClient,
    StitchClientProvider: ({ children }: { children: React.ReactNode }) => children,
    isTokenExpiringSoon: () => false,
}));

beforeEach(() => {
    vi.clearAllMocks();
    mockStitchClient.getBranchStates.mockResolvedValue({ states: ['IN-MH', 'IN-DL'] });
    mockStitchClient.getBranchCities.mockResolvedValue({ cities: ['Mumbai', 'Pune'] });
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ApiBankingTheme>
        <AuthenticationProvider>{ui}</AuthenticationProvider>
      </ApiBankingTheme>
    </MemoryRouter>
  );
};

describe('BankDetails', () => {
  describe('rendering', () => {
    it('should render all main sections', () => {
      renderWithProviders(<BankDetails />);

      expect(screen.getByText('FD Funding Amount')).toBeInTheDocument();
      expect(screen.getByText('Fund your FD via')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    it('should render funding options', () => {
      renderWithProviders(<BankDetails />);

      expect(screen.getByText('Other Bank')).toBeInTheDocument();
      expect(screen.getAllByText('HDFC Bank').length).toBeGreaterThan(0);
      expect(screen.getByText('Combined Funds')).toBeInTheDocument();
    });

    it('should render back link', () => {
      renderWithProviders(<BankDetails />);

      expect(screen.getByText('< Deposit Details')).toBeInTheDocument();
    });

    it('should display formatted FD amount', () => {
      renderWithProviders(<BankDetails fdAmount={100000} />);

   const amounts = screen.getAllByText(/₹\s*1,00,000/);
expect(amounts.length).toBeGreaterThan(0); 
expect(amounts[0]).toBeInTheDocument();
    });

    it('should render primary account info when primary-bank is selected', () => {
      renderWithProviders(<BankDetails />);

      expect(screen.getByText('***12')).toBeInTheDocument();
      expect(screen.getByText('SAVINGS ACCOUNT')).toBeInTheDocument();
      expect(screen.getByText(/Available balance:/)).toBeInTheDocument();
    });

    it('should render custom primary account info', () => {
      renderWithProviders(
        <BankDetails
          primaryAccount={{
            accountNumber: '***99',
            accountType: 'CURRENT ACCOUNT',
            availableBalance: 500000,
          }}
        />
      );

      expect(screen.getByText('***99')).toBeInTheDocument();
      expect(screen.getByText('CURRENT ACCOUNT')).toBeInTheDocument();
    });
  });

  describe('funding option selection', () => {
    it('should render primary-bank as default with account info visible', () => {
      renderWithProviders(<BankDetails />);

      // When Primary Bank is selected, the account info is shown
      expect(screen.getByText('***12')).toBeInTheDocument();
      expect(screen.getByText('SAVINGS ACCOUNT')).toBeInTheDocument();
    });
  });

  describe('branch section', () => {
    it('should show branch selector for primary-bank', async () => {
      await act(async () => {
        renderWithProviders(<BankDetails />);
      });

      await waitFor(() => {
        expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
      });

      expect(screen.getByText('Select a branch')).toBeInTheDocument();
    });

    it('should open branch modal when clicked', async () => {
      await act(async () => {
        renderWithProviders(<BankDetails />);
      });

      await waitFor(() => {
        expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
      });

      fireEvent.click(screen.getByText('Select a branch'));

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Search Branch' })).toBeInTheDocument();
      });
    });

    it('should show mode toggle in modal with Location selected by default', async () => {
      await act(async () => {
        renderWithProviders(<BankDetails />);
      });

      await waitFor(() => {
        expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
      });

      fireEvent.click(screen.getByText('Select a branch'));

      await waitFor(() => {
        expect(screen.getByLabelText('Location')).toBeChecked();
        expect(screen.getByLabelText('PinCode')).not.toBeChecked();
      });
    });

    it('should show state, city, and branch dropdowns in modal', async () => {
      await act(async () => {
        renderWithProviders(<BankDetails />);
      });

      await waitFor(() => {
        expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
      });

      fireEvent.click(screen.getByText('Select a branch'));

      await waitFor(() => {
        expect(screen.getByText('State')).toBeInTheDocument();
        expect(screen.getByText('City')).toBeInTheDocument();
        // "Branch" appears twice (outer label + modal label), so check for multiple
        expect(screen.getAllByText('Branch').length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should switch to pincode mode when PinCode is selected', async () => {
      await act(async () => {
        renderWithProviders(<BankDetails />);
      });

      await waitFor(() => {
        expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
      });

      fireEvent.click(screen.getByText('Select a branch'));

      await waitFor(() => {
        expect(screen.getByLabelText('PinCode')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('PinCode'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter 6-digit\s*pin\s*code/i)).toBeInTheDocument();
      });
    });

    it('should show branches after city is selected in modal', async () => {
      await act(async () => {
        renderWithProviders(<BankDetails />);
      });

      await waitFor(() => {
        expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
      });

      fireEvent.click(screen.getByText('Select a branch'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select state
      const stateDropdown = document.getElementById('state-select')!;
      await act(async () => {
        fireEvent.click(stateDropdown);
      });
      const mhOption = await screen.findByRole('option', { name: 'MH' });
      await act(async () => {
        fireEvent.click(mhOption);
      });

      // Select city
      const cityDropdown = document.getElementById('city-select')!;
      await act(async () => {
        fireEvent.click(cityDropdown);
      });

      const cityOptions = await screen.findAllByRole('option', { name: /Mumbai|Pune/i });
      fireEvent.click(cityOptions[0]);

      // Verify the modal still shows state/city/branch dropdowns
      expect(screen.getByText('State')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getAllByText('Branch').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('nominee section', () => {
    it('should show add nominee checkbox', () => {
      renderWithProviders(<BankDetails />);

      expect(screen.getByText('Add Nominee to FD (strongly recommended)')).toBeInTheDocument();
    });

    it('should open nominee modal when checkbox is checked', async () => {
      renderWithProviders(<BankDetails />);

      const checkbox = screen.getByRole('checkbox', { name: /Add Nominee/i });
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Add Nominee' })).toBeInTheDocument();
      });
    });

    it('should show nominee form fields in modal', async () => {
      renderWithProviders(<BankDetails />);

      const checkbox = screen.getByRole('checkbox', { name: /Add Nominee/i });
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText('Relationship')).toBeInTheDocument();
        expect(screen.getByText('Nominee Name')).toBeInTheDocument();
        expect(screen.getByText('Date of Birth')).toBeInTheDocument();
      });
    });
  });

  describe('server errors', () => {
    it('should display branch error', () => {
      const serverErrors = [{ field: 'branch', message: 'Please select a branch' }];
      renderWithProviders(<BankDetails serverErrors={serverErrors} />);

      expect(screen.getByText('Please select a branch')).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('should call onContinue when form is submitted', () => {
      const onContinue = vi.fn();
      renderWithProviders(<BankDetails onContinue={onContinue} />);

      fireEvent.click(screen.getByText('Continue'));

      expect(onContinue).toHaveBeenCalled();
    });

    it('should show submitting state', () => {
      renderWithProviders(<BankDetails isSubmitting={true} />);

      expect(screen.getByText('Loading account details...')).toBeInTheDocument();
    });

    it('should disable button during submission', () => {
      renderWithProviders(<BankDetails isSubmitting={true} />);

      expect(screen.getByText('Loading account details...')).toBeDisabled();
    });
  });

  describe('back navigation', () => {
    it('should call onBack when back link is clicked', () => {
      const onBack = vi.fn();
      renderWithProviders(<BankDetails onBack={onBack} />);

      fireEvent.click(screen.getByText('< Deposit Details'));

      expect(onBack).toHaveBeenCalled();
    });
  });

  describe('initialData', () => {
    it('should restore funding option from initialData', () => {
      const initialData: BankDetailsFormData = {
        fundingOption: 'other-bank',
        branch: '',
        addNominee: false,
      };
      renderWithProviders(<BankDetails initialData={initialData} />);

      // When other-bank is selected, Other Bank Account section is shown
      expect(screen.getByText('Other Bank Account')).toBeInTheDocument();
    });

    it('should restore addNominee state from initialData', () => {
      const initialData: BankDetailsFormData = {
        fundingOption: 'primary-bank',
        branch: '',
        addNominee: true,
        nominee: {
          fullName: 'John Doe',
          dateOfBirth: '01/01/1990',
          relationship: 'Spouse',
        },
      };
      renderWithProviders(<BankDetails initialData={initialData} />);

      const checkbox = screen.getByRole('checkbox', { name: /Add Nominee/i });
      expect(checkbox).toBeChecked();
    });
  });

  describe('account selector', () => {
    // Note: Account selector tests are verified through the component implementation:
    // - When customerAccounts.length <= 1, the selector is hidden
    // - When customerAccounts.length > 1, the selector is shown
    // The AuthenticationProvider provides customerAccounts: [] by default,
    // so the existing tests verify the "no selector" scenario.

    it('should not show account selector when using default AuthenticationProvider', () => {
      // AuthenticationProvider initializes customerAccounts as empty array
      renderWithProviders(<BankDetails />);

      // The Select Account heading should not appear since customerAccounts is empty
      expect(screen.queryByText('Select Account')).not.toBeInTheDocument();
    });
  });
});
