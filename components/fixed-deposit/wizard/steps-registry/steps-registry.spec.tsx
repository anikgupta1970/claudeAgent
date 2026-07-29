import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { AuthenticationProvider } from '@api-banking/fixed-deposit.hooks.use-journey-context';
import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import { createStepsRegistry, testWrappers } from './steps-registry.js';

setupTestI18n(en);

const {
  LoginWithOtpWrapper,
  OtpStepWrapper,
  DepositDetailsWrapper,
  BankDetailsWrapper,
  SubmitStepWrapper,
} = testWrappers;

// Mock the Stitch client
const mockStitchClient = {
  getLoginTerms: vi.fn(),
  authorize: vi.fn(),
  exchangeToken: vi.fn(),
  getCustomerAccounts: vi.fn(),
  saveDepositDetails: vi.fn(),
  saveBankDetails: vi.fn(),
  submitApplication: vi.fn(),
  submitFD: vi.fn(),
  verifyOtp: vi.fn(),
  setTokenProvider: vi.fn(),
};

vi.mock('@api-banking/stitch.stitch-client', () => ({
  useStitchClientWithFallback: () => mockStitchClient,
  StitchClientProvider: ({ children }: { children: React.ReactNode }) => children,
  isTokenExpiringSoon: () => false,
}));

// Mock the Login component
vi.mock('@api-banking/authentication.login', () => ({
  Login: ({
    onContinue,
    isLoadingTerms,
    serverErrors,
    isSubmitting,
    ...props
  }: any) => (
    <div data-testid="login-component">
      <h2>Login</h2>
      {isLoadingTerms && <span>Loading terms...</span>}
      {serverErrors?.length > 0 && (
        <span data-testid="server-error">{serverErrors[0].message}</span>
      )}
      {isSubmitting && <span>Submitting...</span>}
      <button
        data-testid="continue-button"
        onClick={() =>
          onContinue?.({ mobileNumber: '9876543210', acceptedTerms: ['term1'] })
        }
      >
        Continue
      </button>
    </div>
  ),
}));

// Mock the OtpModal component
vi.mock('@api-banking/authentication.overlays.otp-modal', () => ({
  OtpModal: ({
    isOpen,
    onOtpSubmit,
    onClose,
    serverErrors,
    isSubmitting,
    ...props
  }: any) =>
    isOpen ? (
      <div data-testid="otp-modal">
        <h3>Enter OTP</h3>
        {serverErrors?.length > 0 && (
          <span data-testid="otp-error">{serverErrors[0].message}</span>
        )}
        {isSubmitting && <span>Verifying...</span>}
        <button
          data-testid="otp-submit"
          onClick={() => onOtpSubmit?.('123456')}
        >
          Submit OTP
        </button>
        <button data-testid="otp-close" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

// Mock the DepositDetails component
vi.mock('@api-banking/fixed-deposit.wizard.deposit-details', () => ({
  DepositDetails: ({
    onContinue,
    onBack,
    serverErrors,
    isSubmitting,
    ...props
  }: any) => (
    <div data-testid="deposit-details-component">
      <h2>Deposit Details</h2>
      {serverErrors?.length > 0 && (
        <span data-testid="deposit-error">{serverErrors[0].message}</span>
      )}
      {isSubmitting && <span>Saving...</span>}
      <button data-testid="deposit-back" onClick={onBack}>
        Back
      </button>
      <button
        data-testid="deposit-continue"
        onClick={() => onContinue?.({ amount: '100000' })}
      >
        Continue
      </button>
    </div>
  ),
}));

// Mock the BankDetails component
vi.mock('@api-banking/fixed-deposit.wizard.bank-details', () => ({
  BankDetails: ({
    onContinue,
    onBack,
    serverErrors,
    isSubmitting,
    ...props
  }: any) => (
    <div data-testid="bank-details-component">
      <h2>Bank Details</h2>
      {serverErrors?.length > 0 && (
        <span data-testid="bank-error">{serverErrors[0].message}</span>
      )}
      {isSubmitting && <span>Saving...</span>}
      <button data-testid="bank-back" onClick={onBack}>
        Back
      </button>
      <button
        data-testid="bank-continue"
        onClick={() => onContinue?.({ accountNumber: '123456789' })}
      >
        Continue
      </button>
    </div>
  ),
}));

// Mock the PreviewStep component
vi.mock('@api-banking/fixed-deposit.wizard.preview-step', () => ({
  PreviewStep: ({ onContinue, onBack, ...props }: any) => (
    <div data-testid="preview-step-component">
      <h2>Fixed Deposit Account</h2>
      <button data-testid="preview-back" onClick={onBack}>
        Back
      </button>
      <button data-testid="preview-continue" onClick={onContinue}>
        Continue
      </button>
    </div>
  ),
}));

// Mock the SubmitForm component
vi.mock('@api-banking/fixed-deposit.wizard.submit-form', () => ({
  SubmitForm: ({
    applicationId,
    isSubmitting,
    serverErrors,
    onClose,
    ...props
  }: any) => (
    <div data-testid="submit-form-component">
      {isSubmitting ? (
        <span>Submitting...</span>
      ) : applicationId ? (
        <div>
          <h2>Application has been submitted</h2>
          <span data-testid="application-id">
            Application ID: {applicationId}
          </span>
        </div>
      ) : serverErrors?.length > 0 ? (
        <span data-testid="submit-error">Error: {serverErrors[0].message}</span>
      ) : (
        <span>Loading...</span>
      )}
      <button data-testid="submit-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

// Mock Stepper component for testing
const MockStepper = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="stepper">{children}</div>
);

// Helper to create a valid schema for testing
const createTestSchema = (type: string) => ({
  id: `test-${type}`,
  type,
  props: {},
});

// Helper to render with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ApiBankingTheme>
        <AuthenticationProvider>{ui}</AuthenticationProvider>
      </ApiBankingTheme>
    </MemoryRouter>
  );
};

beforeEach(() => {
  mockStitchClient.getCustomerAccounts.mockResolvedValue([]);
});

describe('createStepsRegistry', () => {
  it('should create a registry with all journey components registered', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });

    // Verify the registry has the expected components
    expect(registry).toBeDefined();
    expect(typeof registry.getFactory).toBe('function');
    expect(typeof registry.has).toBe('function');
    expect(typeof registry.listRegisteredTypes).toBe('function');
  });

  it('should register LoginPage component', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    expect(registry.has('LoginPage')).toBe(true);
    expect(registry.getFactory('LoginPage')).toBeDefined();
  });

  it('should register OtpModal component', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    expect(registry.has('OtpModal')).toBe(true);
    expect(registry.getFactory('OtpModal')).toBeDefined();
  });

  it('should register Stepper component', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    expect(registry.has('Stepper')).toBe(true);
    expect(registry.getFactory('Stepper')).toBeDefined();
  });

  it('should register OtpStep component', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    expect(registry.has('OtpStep')).toBe(true);
    expect(registry.getFactory('OtpStep')).toBeDefined();
  });

  it('should register DepositDetails component', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    expect(registry.has('DepositDetails')).toBe(true);
    expect(registry.getFactory('DepositDetails')).toBeDefined();
  });

  it('should register BankDetails component', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    expect(registry.has('BankDetails')).toBe(true);
    expect(registry.getFactory('BankDetails')).toBeDefined();
  });

  it('should register PreviewStep component', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    expect(registry.has('PreviewStep')).toBe(true);
    expect(registry.getFactory('PreviewStep')).toBeDefined();
  });

  it('should register SubmitStep component', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    expect(registry.has('SubmitStep')).toBe(true);
    expect(registry.getFactory('SubmitStep')).toBeDefined();
  });

  it('should list all registered component types', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const types = registry.listRegisteredTypes();

    expect(types).toContain('LoginPage');
    expect(types).toContain('OtpModal');
    expect(types).toContain('Stepper');
    expect(types).toContain('OtpStep');
    expect(types).toContain('DepositDetails');
    expect(types).toContain('BankDetails');
    expect(types).toContain('PreviewStep');
    expect(types).toContain('SubmitStep');
  });

  it('should have exactly 8 registered components', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const types = registry.listRegisteredTypes();
    expect(types).toHaveLength(9);
  });
});

describe('Factory validation', () => {
  it('should return valid validation result for LoginPage factory', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const factory = registry.getFactory('LoginPage');
    const result = factory.validate(createTestSchema('LoginPage'));

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return valid validation result for OtpModal factory', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const factory = registry.getFactory('OtpModal');
    const result = factory.validate(createTestSchema('OtpModal'));

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return valid validation result for Stepper factory', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const factory = registry.getFactory('Stepper');
    const result = factory.validate(createTestSchema('Stepper'));

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return valid validation result for DepositDetails factory', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const factory = registry.getFactory('DepositDetails');
    const result = factory.validate(createTestSchema('DepositDetails'));

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return valid validation result for BankDetails factory', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const factory = registry.getFactory('BankDetails');
    const result = factory.validate(createTestSchema('BankDetails'));

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return valid validation result for PreviewStep factory', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const factory = registry.getFactory('PreviewStep');
    const result = factory.validate(createTestSchema('PreviewStep'));

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return valid validation result for SubmitStep factory', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const factory = registry.getFactory('SubmitStep');
    const result = factory.validate(createTestSchema('SubmitStep'));

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return valid validation result for OtpStep factory', () => {
    const registry = createStepsRegistry({ Stepper: MockStepper });
    const factory = registry.getFactory('OtpStep');
    const result = factory.validate(createTestSchema('OtpStep'));

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });
});

describe('Registry behavior with different Stepper components', () => {
  it('should accept custom Stepper component', () => {
    const CustomStepper = ({ children }: { children?: React.ReactNode }) => (
      <nav>{children}</nav>
    );
    const registry = createStepsRegistry({ Stepper: CustomStepper });
    expect(registry.has('Stepper')).toBe(true);
  });

  it('should create independent registries', () => {
    const registry1 = createStepsRegistry({ Stepper: MockStepper });
    const registry2 = createStepsRegistry({ Stepper: MockStepper });

    expect(registry1).not.toBe(registry2);
    expect(registry1.listRegisteredTypes()).toEqual(
      registry2.listRegisteredTypes()
    );
  });
});

describe('LoginWithOtpWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStitchClient.getLoginTerms.mockResolvedValue({ terms: [] });
    mockStitchClient.getCustomerAccounts.mockResolvedValue([]);
  });

  it('should fetch terms on mount', async () => {
    mockStitchClient.getLoginTerms.mockResolvedValue({
      terms: [{ id: '1', summary: 'Test term' }],
    });

    await act(async () => {
      renderWithProviders(<LoginWithOtpWrapper />);
    });

    await waitFor(() => {
      expect(mockStitchClient.getLoginTerms).toHaveBeenCalled();
    });
  });

  it('should show loading state while fetching terms', async () => {
    // Make getTerms hang to observe loading state
    mockStitchClient.getLoginTerms.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<LoginWithOtpWrapper />);

    expect(screen.getByText('Loading terms...')).toBeInTheDocument();
  });

  it('should handle authorize success and show OTP modal', async () => {
    mockStitchClient.getLoginTerms.mockResolvedValue({ terms: [] });
    mockStitchClient.authorize.mockResolvedValue({
      sessionId: 'test-session-123',
      hint: '****1234',
      otpLength: 6,
      maxAttempts: 3,
    });

    await act(async () => {
      renderWithProviders(<LoginWithOtpWrapper credentials="mobile_dob" />);
    });

    // Wait for terms to load
    await waitFor(() => {
      expect(screen.queryByText('Loading terms...')).not.toBeInTheDocument();
    });

    // Click continue to trigger authorization
    const continueButton = screen.getByTestId('continue-button');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    // OTP modal should appear after successful authorization
    await waitFor(() => {
      expect(mockStitchClient.authorize).toHaveBeenCalled();
    });

    // Check if OTP modal is shown
    await waitFor(() => {
      expect(screen.getByTestId('otp-modal')).toBeInTheDocument();
    });
  });

  it('should handle authorize with API errors', async () => {
    mockStitchClient.getLoginTerms.mockResolvedValue({ terms: [] });
    mockStitchClient.authorize.mockResolvedValue({
      errors: [{ field: 'mobile', message: 'Invalid mobile number' }],
    });

    await act(async () => {
      renderWithProviders(<LoginWithOtpWrapper />);
    });

    // Wait for terms to load
    await waitFor(() => {
      expect(screen.queryByText('Loading terms...')).not.toBeInTheDocument();
    });

    // Click continue to trigger authorization
    const continueButton = screen.getByTestId('continue-button');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    // Should show error
    await waitFor(() => {
      expect(screen.getByTestId('server-error')).toHaveTextContent(
        'Invalid mobile number'
      );
    });
  });

  it('should handle network error during authorization', async () => {
    mockStitchClient.getLoginTerms.mockResolvedValue({ terms: [] });
    mockStitchClient.authorize.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      renderWithProviders(<LoginWithOtpWrapper />);
    });

    // Wait for terms to load
    await waitFor(() => {
      expect(screen.queryByText('Loading terms...')).not.toBeInTheDocument();
    });

    // Click continue to trigger authorization
    const continueButton = screen.getByTestId('continue-button');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    // Should show network error
    await waitFor(() => {
      expect(screen.getByTestId('server-error')).toHaveTextContent(
        'Network error. Please try again.'
      );
    });
  });

  it('should handle token exchange success', async () => {
    mockStitchClient.getLoginTerms.mockResolvedValue({ terms: [] });
    mockStitchClient.authorize.mockResolvedValue({
      sessionId: 'test-session-123',
      hint: '****1234',
      otpLength: 6,
      maxAttempts: 3,
    });
    mockStitchClient.exchangeToken.mockResolvedValue({
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
    });

    const onContinue = vi.fn();

    await act(async () => {
      renderWithProviders(<LoginWithOtpWrapper onContinue={onContinue} />);
    });

    // Wait for terms to load and click continue
    await waitFor(() => {
      expect(screen.queryByText('Loading terms...')).not.toBeInTheDocument();
    });

    const continueButton = screen.getByTestId('continue-button');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    // Wait for OTP modal
    await waitFor(() => {
      expect(screen.getByTestId('otp-modal')).toBeInTheDocument();
    });

    // Submit OTP
    const otpSubmitButton = screen.getByTestId('otp-submit');
    await act(async () => {
      fireEvent.click(otpSubmitButton);
    });

    // Should call onContinue after successful token exchange
    await waitFor(() => {
      expect(mockStitchClient.exchangeToken).toHaveBeenCalled();
      expect(onContinue).toHaveBeenCalled();
    });
  });

  it('should handle token exchange with API errors', async () => {
    mockStitchClient.getLoginTerms.mockResolvedValue({ terms: [] });
    mockStitchClient.authorize.mockResolvedValue({
      sessionId: 'test-session-123',
      hint: '****1234',
      otpLength: 6,
      maxAttempts: 3,
    });
    mockStitchClient.exchangeToken.mockResolvedValue({
      errors: [{ field: 'otp', message: 'Invalid OTP' }],
    });

    await act(async () => {
      renderWithProviders(<LoginWithOtpWrapper />);
    });

    // Wait for terms to load and click continue
    await waitFor(() => {
      expect(screen.queryByText('Loading terms...')).not.toBeInTheDocument();
    });

    const continueButton = screen.getByTestId('continue-button');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    // Wait for OTP modal
    await waitFor(() => {
      expect(screen.getByTestId('otp-modal')).toBeInTheDocument();
    });

    // Submit OTP
    const otpSubmitButton = screen.getByTestId('otp-submit');
    await act(async () => {
      fireEvent.click(otpSubmitButton);
    });

    // Should show OTP error
    await waitFor(() => {
      expect(screen.getByTestId('otp-error')).toHaveTextContent('Invalid OTP');
    });
  });

  it('should close OTP modal when close is clicked', async () => {
    mockStitchClient.getLoginTerms.mockResolvedValue({ terms: [] });
    mockStitchClient.authorize.mockResolvedValue({
      sessionId: 'test-session-123',
      hint: '****1234',
      otpLength: 6,
      maxAttempts: 3,
    });

    await act(async () => {
      renderWithProviders(<LoginWithOtpWrapper />);
    });

    // Wait for terms to load and click continue
    await waitFor(() => {
      expect(screen.queryByText('Loading terms...')).not.toBeInTheDocument();
    });

    const continueButton = screen.getByTestId('continue-button');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    // Wait for OTP modal
    await waitFor(() => {
      expect(screen.getByTestId('otp-modal')).toBeInTheDocument();
    });

    // Close OTP modal
    const closeButton = screen.getByTestId('otp-close');
    await act(async () => {
      fireEvent.click(closeButton);
    });

    // OTP modal should be closed
    await waitFor(() => {
      expect(screen.queryByTestId('otp-modal')).not.toBeInTheDocument();
    });
  });

  it('should handle terms fetch failure', async () => {
    mockStitchClient.getLoginTerms.mockRejectedValue(
      new Error('Failed to fetch terms')
    );

    await act(async () => {
      renderWithProviders(<LoginWithOtpWrapper />);
    });

    // Should still render login component
    await waitFor(() => {
      expect(screen.getByTestId('login-component')).toBeInTheDocument();
    });
  });
});

describe('DepositDetailsWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render deposit details component', async () => {
    await act(async () => {
      renderWithProviders(<DepositDetailsWrapper />);
    });

    expect(screen.getByTestId('deposit-details-component')).toBeInTheDocument();
  });

  it('should handle submit success and call onContinue', async () => {
    mockStitchClient.saveDepositDetails.mockResolvedValue({ success: true });

    const onContinue = vi.fn();

    await act(async () => {
      renderWithProviders(<DepositDetailsWrapper onContinue={onContinue} />);
    });

    const continueButton = screen.getByTestId('deposit-continue');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    await waitFor(() => {
      expect(mockStitchClient.saveDepositDetails).toHaveBeenCalled();
      expect(onContinue).toHaveBeenCalled();
    });
  });

  it('should handle submit with API errors', async () => {
    mockStitchClient.saveDepositDetails.mockResolvedValue({
      errors: [{ field: 'amount', message: 'Amount is required' }],
    });

    await act(async () => {
      renderWithProviders(<DepositDetailsWrapper />);
    });

    const continueButton = screen.getByTestId('deposit-continue');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('deposit-error')).toHaveTextContent(
        'Amount is required'
      );
    });
  });

  it('should handle network error during submit', async () => {
    mockStitchClient.saveDepositDetails.mockRejectedValue(
      new Error('Network error')
    );

    await act(async () => {
      renderWithProviders(<DepositDetailsWrapper />);
    });

    const continueButton = screen.getByTestId('deposit-continue');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('deposit-error')).toHaveTextContent(
        'Network error. Please try again.'
      );
    });
  });

  it('should call onBack when back is clicked', async () => {
    const onBack = vi.fn();

    await act(async () => {
      renderWithProviders(<DepositDetailsWrapper onBack={onBack} />);
    });

    const backButton = screen.getByTestId('deposit-back');
    await act(async () => {
      fireEvent.click(backButton);
    });

    expect(onBack).toHaveBeenCalled();
  });
});

describe('BankDetailsWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render bank details component', async () => {
    await act(async () => {
      renderWithProviders(<BankDetailsWrapper />);
    });

    expect(screen.getByTestId('bank-details-component')).toBeInTheDocument();
  });

  it('should handle submit success and call onContinue', async () => {
    mockStitchClient.saveBankDetails.mockResolvedValue({ success: true });

    const onContinue = vi.fn();

    await act(async () => {
      renderWithProviders(<BankDetailsWrapper onContinue={onContinue} />);
    });

    const continueButton = screen.getByTestId('bank-continue');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    await waitFor(() => {
      expect(mockStitchClient.saveBankDetails).toHaveBeenCalled();
      expect(onContinue).toHaveBeenCalled();
    });
  });

  it('should handle submit with API errors', async () => {
    mockStitchClient.saveBankDetails.mockResolvedValue({
      errors: [{ field: 'ifsc', message: 'Invalid IFSC code' }],
    });

    await act(async () => {
      renderWithProviders(<BankDetailsWrapper />);
    });

    const continueButton = screen.getByTestId('bank-continue');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('bank-error')).toHaveTextContent(
        'Invalid IFSC code'
      );
    });
  });

  it('should handle network error during submit', async () => {
    mockStitchClient.saveBankDetails.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      renderWithProviders(<BankDetailsWrapper />);
    });

    const continueButton = screen.getByTestId('bank-continue');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('bank-error')).toHaveTextContent(
        'Network error. Please try again.'
      );
    });
  });

  it('should call onBack when back is clicked', async () => {
    const onBack = vi.fn();

    await act(async () => {
      renderWithProviders(<BankDetailsWrapper onBack={onBack} />);
    });

    const backButton = screen.getByTestId('bank-back');
    await act(async () => {
      fireEvent.click(backButton);
    });

    expect(onBack).toHaveBeenCalled();
  });
});

describe('SubmitStepWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should auto-submit on mount', async () => {
    mockStitchClient.submitFD.mockResolvedValue({
      applicationId: 'APP-123456',
    });

    await act(async () => {
      renderWithProviders(<SubmitStepWrapper />);
    });

    await waitFor(() => {
      expect(mockStitchClient.submitFD).toHaveBeenCalledTimes(1);
    });
  });

  it('should prevent duplicate submissions with hasSubmittedRef', async () => {
    mockStitchClient.submitFD.mockResolvedValue({
      applicationId: 'APP-123456',
    });

    const { rerender } = render(
      <MemoryRouter>
        <ApiBankingTheme>
          <AuthenticationProvider>
            <SubmitStepWrapper />
          </AuthenticationProvider>
        </ApiBankingTheme>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockStitchClient.submitFD).toHaveBeenCalledTimes(1);
    });

    // Re-render should not trigger another submission
    rerender(
      <MemoryRouter>
        <ApiBankingTheme>
          <AuthenticationProvider>
            <SubmitStepWrapper />
          </AuthenticationProvider>
        </ApiBankingTheme>
      </MemoryRouter>
    );

    // Should still be 1 call, not 2
    expect(mockStitchClient.submitFD).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors during submit', async () => {
    mockStitchClient.submitFD.mockResolvedValue({
      errors: [{ field: 'general', message: 'Submission failed' }],
    });

    await act(async () => {
      renderWithProviders(<SubmitStepWrapper />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('submit-error')).toHaveTextContent(
        'Submission failed'
      );
    });
  });

  it('should handle network error during submit', async () => {
    mockStitchClient.submitFD.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      renderWithProviders(<SubmitStepWrapper />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('submit-error')).toHaveTextContent(
        'Network error. Please try again.'
      );
    });
  });

  it('should update applicationId state on success', async () => {
    mockStitchClient.submitFD.mockResolvedValue({
      applicationId: 'APP-123456',
    });

    await act(async () => {
      renderWithProviders(<SubmitStepWrapper />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('application-id')).toHaveTextContent(
        'APP-123456'
      );
    });
  });
});

describe('OtpStepWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render OTP modal when isOpen is true', async () => {
    await act(async () => {
      renderWithProviders(<OtpStepWrapper isOpen={true} />);
    });

    expect(screen.getByTestId('otp-modal')).toBeInTheDocument();
  });

  it('should not render OTP modal when isOpen is false', async () => {
    await act(async () => {
      renderWithProviders(<OtpStepWrapper isOpen={false} />);
    });

    expect(screen.queryByTestId('otp-modal')).not.toBeInTheDocument();
  });

  it('should handle OTP submission success', async () => {
    mockStitchClient.exchangeToken.mockResolvedValue({
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
    });

    const onContinue = vi.fn();

    await act(async () => {
      renderWithProviders(
        <OtpStepWrapper isOpen={true} onContinue={onContinue} />
      );
    });

    const otpSubmitButton = screen.getByTestId('otp-submit');
    await act(async () => {
      fireEvent.click(otpSubmitButton);
    });

    await waitFor(() => {
      expect(mockStitchClient.exchangeToken).toHaveBeenCalled();
      expect(onContinue).toHaveBeenCalled();
    });
  });

  it('should handle OTP submission with API errors', async () => {
    mockStitchClient.exchangeToken.mockResolvedValue({
      errors: [{ field: 'otp', message: 'Invalid OTP' }],
    });

    await act(async () => {
      renderWithProviders(<OtpStepWrapper isOpen={true} />);
    });

    const otpSubmitButton = screen.getByTestId('otp-submit');
    await act(async () => {
      fireEvent.click(otpSubmitButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('otp-error')).toHaveTextContent('Invalid OTP');
    });
  });

  it('should handle network error during OTP submission', async () => {
    mockStitchClient.exchangeToken.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      renderWithProviders(<OtpStepWrapper isOpen={true} />);
    });

    const otpSubmitButton = screen.getByTestId('otp-submit');
    await act(async () => {
      fireEvent.click(otpSubmitButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('otp-error')).toHaveTextContent(
        'Network error. Please try again.'
      );
    });
  });

  it('should call onOtpSubmit callback if provided', async () => {
    mockStitchClient.exchangeToken.mockResolvedValue({
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
    });

    const onOtpSubmit = vi.fn();

    await act(async () => {
      renderWithProviders(
        <OtpStepWrapper isOpen={true} onOtpSubmit={onOtpSubmit} />
      );
    });

    const otpSubmitButton = screen.getByTestId('otp-submit');
    await act(async () => {
      fireEvent.click(otpSubmitButton);
    });

    await waitFor(() => {
      expect(onOtpSubmit).toHaveBeenCalledWith('123456');
    });
  });
});
