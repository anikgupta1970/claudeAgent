import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Login, CredentialsMode, LoginFormData } from './login.js';
import type { ConsentItem } from './consent-item-type.js';

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          step1: {
            title: 'Open Fixed Deposit',
            customerDetails: 'Customer Details',
            mobileNumber: 'Mobile Number',
            mobileHelpText: 'For testing purposes Mobile Number: 9876543210',
            dateOfBirth: 'Date of Birth',
            dobHelpText: 'For testing purposes DOB: 01/01/1990 (MM/DD/YYYY)',
            dobPlaceholder: 'MM/DD/YYYY',
            pan: 'PAN Number',
            panPlaceholder: 'e.g. ABCDE1234F',
            panHelpText: 'Enter your 10-character PAN number.',
            verifyUsing: 'Verify using',
            debitCardNumber: 'Debit Card Number',
            debitCardPlaceholder: '1234 5678 9012 3456',
            debitCardHelpText: 'Enter your 16-digit debit card number.',
            ucic: 'UCIC',
            ucicPlaceholder: 'e.g. 1234567890',
            ucicHelpText: 'Enter your UCIC',
            password: 'Password',
            passwordPlaceholder: 'Enter password',
            passwordHelpText: 'Enter your password',
            loading: 'Loading...',
            termsText: 'For full details read our',
            termsLink: 'Terms and Conditions',
            privacyLink: 'Privacy Policy',
            continue: 'Continue',
            processing: 'Processing...',
            errors: {
              validMobileRequired: 'Valid mobile number required',
              dobRequired: 'DOB required',
              panRequired: 'PAN required',
              debitCardRequired: 'Debit card number required',
              ucicRequired: 'UCIC required',
              passwordRequired: 'Password required',
            },
          },
          common: {
            consentDetails: 'Consent Details',
            and: 'and',
          },
        },
      },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ApiBankingTheme>{ui}</ApiBankingTheme>
    </MemoryRouter>
  );
};

const mockTerms: ConsentItem[] = [
  {
    id: 'term1',
    summary: 'Accept the Privacy Policy',
    documentUrl: 'https://example.com/privacy',
  },
  {
    id: 'term2',
    summary: 'Accept the Terms and Conditions',
    content: 'These are the terms and conditions content.',
  },
];

describe('Login', () => {
  describe('rendering', () => {
    it('should render the login page with headings', () => {
      renderWithTheme(<Login />);

      expect(screen.getByRole('heading', { level: 2, name: /Open Fixed Deposit/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: /Customer Details/i })).toBeInTheDocument();
    });

    it('should render mobile number field for mobile_dob mode', () => {
      renderWithTheme(<Login credentials="mobile_dob" />);

      expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
      expect(screen.getByText(/Date of Birth/i)).toBeInTheDocument();
    });

    it('should render mobile and PAN fields for mobile_pan mode', () => {
      renderWithTheme(<Login credentials="mobile_pan" />);

      expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. ABCDE1234F')).toBeInTheDocument();
    });

    it('should render mobile field and radio buttons for mobile_dob_pan mode', () => {
      renderWithTheme(<Login credentials="mobile_dob_pan" />);

      expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
      expect(screen.getByLabelText('PAN Number')).toBeInTheDocument();
      // DOB field shown by default, PAN field hidden
      expect(screen.getByLabelText('Date Picker')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('e.g. ABCDE1234F')).not.toBeInTheDocument();
    });

    it('should render debit card field for debit_card mode', () => {
      renderWithTheme(<Login credentials="debit_card" />);

      expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument();
      expect(screen.queryByLabelText(/Mobile Number/i)).not.toBeInTheDocument();
    });

    it('should render UCIC and password fields for ucic_password mode', () => {
      renderWithTheme(<Login credentials="ucic_password" />);

      expect(screen.getByPlaceholderText('e.g. 1234567890')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
      expect(screen.queryByLabelText(/Mobile Number/i)).not.toBeInTheDocument();
    });

    it('should render default terms when none provided', () => {
      renderWithTheme(<Login />);

      expect(screen.getByText(/I\/we have read, understood, and hereby accept the Privacy Policy/i)).toBeInTheDocument();
    });

    it('should render custom terms when provided', () => {
      renderWithTheme(<Login terms={mockTerms} />);

      expect(screen.getByText('Accept the Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Accept the Terms and Conditions')).toBeInTheDocument();
    });

    it('should render continue button', () => {
      renderWithTheme(<Login />);

      expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
    });

    it('should render footer text with links', () => {
      renderWithTheme(<Login />);

      expect(screen.getByText(/For full details read our/i)).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show skeleton when isLoadingTerms is true', () => {
      const { container } = renderWithTheme(<Login isLoadingTerms={true} />);

      expect(container.querySelector('[class*="skeletonHeadingLarge"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="skeletonInput"]')).toBeInTheDocument();
    });

    it('should hide form when isLoadingTerms is true', () => {
      renderWithTheme(<Login isLoadingTerms={true} />);

      expect(screen.queryByRole('button', { name: /Continue/i })).not.toBeInTheDocument();
    });
  });

  describe('mobile number input', () => {
    it('should have default mobile number', () => {
      renderWithTheme(<Login />);

      const mobileInput = screen.getByLabelText(/Mobile Number/i);
      expect(mobileInput).toHaveValue('9876543210');
    });

    it('should only allow digits in mobile number', () => {
      renderWithTheme(<Login />);

      const mobileInput = screen.getByLabelText(/Mobile Number/i);
      fireEvent.change(mobileInput, { target: { value: 'abc123def456' } });

      expect(mobileInput).toHaveValue('123456');
    });
  });

  describe('PAN input', () => {
    it('should convert PAN to uppercase', () => {
      renderWithTheme(<Login credentials="mobile_pan" />);

      const panInput = screen.getByPlaceholderText('e.g. ABCDE1234F');
      fireEvent.change(panInput, { target: { value: 'abcde1234f' } });

      expect(panInput).toHaveValue('ABCDE1234F');
    });
  });

  describe('debit card input', () => {
    it('should only allow digits in debit card number', () => {
      renderWithTheme(<Login credentials="debit_card" />);

      const debitInput = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.change(debitInput, { target: { value: 'abcd1234efgh5678' } });

      expect(debitInput).toHaveValue('12345678');
    });
  });

  describe('UCIC input', () => {
    it('should only allow digits in UCIC', () => {
      renderWithTheme(<Login credentials="ucic_password" />);

      const ucicInput = screen.getByPlaceholderText('e.g. 1234567890');
      fireEvent.change(ucicInput, { target: { value: 'abc123def' } });

      expect(ucicInput).toHaveValue('123');
    });
  });

  describe('consent management', () => {
    it('should open consent modal when checkbox is clicked', async () => {
      renderWithTheme(<Login terms={mockTerms} />);

      const checkbox = screen.getByRole('checkbox', { name: /Accept the Privacy Policy/i });
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Consent Details' })).toBeInTheDocument();
      });
    });

    it('should render all consent checkboxes', () => {
      renderWithTheme(<Login terms={mockTerms} />);

      expect(screen.getByRole('checkbox', { name: /Accept the Privacy Policy/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /Accept the Terms and Conditions/i })).toBeInTheDocument();
    });

    it('should start with all checkboxes unchecked', () => {
      renderWithTheme(<Login terms={mockTerms} />);

      expect(screen.getByRole('checkbox', { name: /Accept the Privacy Policy/i })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: /Accept the Terms and Conditions/i })).not.toBeChecked();
    });

    it('should disable submit button when no terms are accepted', () => {
      renderWithTheme(<Login terms={mockTerms} />);

      const submitButton = screen.getByRole('button', { name: /Continue/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('server errors', () => {
    it('should display general error above form', () => {
      const serverErrors = [{ field: 'general', message: 'Authentication failed' }];
      renderWithTheme(<Login serverErrors={serverErrors} />);

      expect(screen.getByText('Authentication failed')).toBeInTheDocument();
    });

    it('should display mobile field error', () => {
      const serverErrors = [{ field: 'mobile', message: 'Invalid mobile number' }];
      renderWithTheme(<Login serverErrors={serverErrors} />);

      expect(screen.getByText('Invalid mobile number')).toBeInTheDocument();
    });

    it('should display dob field error', () => {
      const serverErrors = [{ field: 'dob', message: 'Invalid date of birth' }];
      renderWithTheme(<Login serverErrors={serverErrors} credentials="mobile_dob" />);

      expect(screen.getByText('Invalid date of birth')).toBeInTheDocument();
    });

    it('should display pan field error', () => {
      const serverErrors = [{ field: 'pan', message: 'Invalid PAN' }];
      renderWithTheme(<Login serverErrors={serverErrors} credentials="mobile_pan" />);

      expect(screen.getByText('Invalid PAN')).toBeInTheDocument();
    });

    it('should display debit card field error', () => {
      const serverErrors = [{ field: 'debitCard', message: 'Invalid debit card' }];
      renderWithTheme(<Login serverErrors={serverErrors} credentials="debit_card" />);

      expect(screen.getByText('Invalid debit card')).toBeInTheDocument();
    });

    it('should display UCIC field error', () => {
      const serverErrors = [{ field: 'ucic', message: 'Invalid UCIC' }];
      renderWithTheme(<Login serverErrors={serverErrors} credentials="ucic_password" />);

      expect(screen.getByText('Invalid UCIC')).toBeInTheDocument();
    });

    it('should display password field error', () => {
      const serverErrors = [{ field: 'password', message: 'Invalid password' }];
      renderWithTheme(<Login serverErrors={serverErrors} credentials="ucic_password" />);

      expect(screen.getByText('Invalid password')).toBeInTheDocument();
    });

    it('should display acceptedTerms field error', () => {
      const serverErrors = [{ field: 'acceptedTerms', message: 'Please accept all terms' }];
      renderWithTheme(<Login serverErrors={serverErrors} />);

      expect(screen.getByText('Please accept all terms')).toBeInTheDocument();
    });
  });

  describe('submission state', () => {
    it('should show Submitting text when isSubmitting is true', () => {
      renderWithTheme(<Login isSubmitting={true} />);

      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('should disable button when isSubmitting is true', () => {
      renderWithTheme(<Login isSubmitting={true} />);

      const submitButton = screen.getByText('Processing...');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('form submission', () => {
    it('should not call onContinue if terms are not accepted', async () => {
      const onContinue = vi.fn();
      const singleTerm = [{ id: 'term1', summary: 'Accept terms' }];
      renderWithTheme(
        <Login
          onContinue={onContinue}
          credentials="mobile_dob"
          terms={singleTerm}
        />
      );

      // The DOB DatePicker should be present (React Aria renders segments, not a text input)
      expect(screen.getByLabelText('Date Picker')).toBeInTheDocument();

      // Don't accept terms - just click submit
      const submitButton = screen.getByRole('button', { name: /Continue/i });
      // Button should be disabled since terms not accepted
      expect(submitButton).toBeDisabled();
    });
  });

  describe('custom styling', () => {
    it('should apply custom className', () => {
      const { container } = renderWithTheme(<Login className="custom-class" />);

      const loginDiv = container.querySelector('.login');
      expect(loginDiv).toHaveClass('custom-class');
    });
  });

  describe('password field for ucic_password mode', () => {
    it('should update password field value on change', () => {
      renderWithTheme(<Login credentials="ucic_password" />);

      const passwordInput = screen.getByPlaceholderText('Enter password');
      fireEvent.change(passwordInput, { target: { value: 'mySecurePassword123' } });

      expect(passwordInput).toHaveValue('mySecurePassword123');
    });

    it('should mask password input', () => {
      renderWithTheme(<Login credentials="ucic_password" />);

      const passwordInput = screen.getByPlaceholderText('Enter password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('mobile_dob_pan toggle', () => {
    it('should show DOB field by default', () => {
      renderWithTheme(<Login credentials="mobile_dob_pan" />);

      expect(screen.getByLabelText('Date Picker')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('e.g. ABCDE1234F')).not.toBeInTheDocument();
    });

    it('should show PAN field when PAN radio selected', () => {
      renderWithTheme(<Login credentials="mobile_dob_pan" />);

      const panRadio = screen.getByLabelText('PAN Number');
      fireEvent.click(panRadio);

      expect(screen.getByPlaceholderText('e.g. ABCDE1234F')).toBeInTheDocument();
      expect(screen.queryByLabelText('Date Picker')).not.toBeInTheDocument();
    });

    it('should switch back to DOB when DOB radio re-selected', () => {
      renderWithTheme(<Login credentials="mobile_dob_pan" />);

      // Switch to PAN
      fireEvent.click(screen.getByLabelText('PAN Number'));
      expect(screen.getByPlaceholderText('e.g. ABCDE1234F')).toBeInTheDocument();

      // Switch back to DOB
      fireEvent.click(screen.getByLabelText('Date of Birth'));
      expect(screen.getByLabelText('Date Picker')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('e.g. ABCDE1234F')).not.toBeInTheDocument();
    });

    it('should not show radio buttons for mobile_dob mode', () => {
      renderWithTheme(<Login credentials="mobile_dob" />);

      expect(screen.queryByLabelText('Date of Birth')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('PAN Number')).not.toBeInTheDocument();
      expect(screen.queryByText('Verify using')).not.toBeInTheDocument();
    });

    it('should not show radio buttons for mobile_pan mode', () => {
      renderWithTheme(<Login credentials="mobile_pan" />);

      expect(screen.queryByText('Verify using')).not.toBeInTheDocument();
    });
  });

  describe('consent handling', () => {
    it('should open consent modal when first term checkbox is clicked', async () => {
      renderWithTheme(<Login terms={mockTerms} />);

      const checkbox = screen.getByRole('checkbox', { name: /Accept the Privacy Policy/i });
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Consent Details' })).toBeInTheDocument();
      });
    });

    it('should check checkbox when Accept button is clicked in consent modal', async () => {
      renderWithTheme(<Login terms={mockTerms} />);

      // Open the consent modal
      const checkbox = screen.getByRole('checkbox', { name: /Accept the Privacy Policy/i });
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Consent Details' })).toBeInTheDocument();
      });

      // Click the Accept button (not Agree)
      const acceptButton = screen.getByRole('button', { name: /Accept/i });
      fireEvent.click(acceptButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: 'Consent Details' })).not.toBeInTheDocument();
      });

      // Checkbox should now be checked
      expect(checkbox).toBeChecked();
    });

    it('should close modal without checking checkbox when Cancel button is clicked', async () => {
      renderWithTheme(<Login terms={mockTerms} />);

      // Open the consent modal
      const checkbox = screen.getByRole('checkbox', { name: /Accept the Privacy Policy/i });
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Consent Details' })).toBeInTheDocument();
      });

      // Click the Cancel button (handleDisagree)
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: 'Consent Details' })).not.toBeInTheDocument();
      });

      // Checkbox should still be unchecked
      expect(checkbox).not.toBeChecked();
    });

  });
});
