import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UiComponentRegistry,
  createFactory,
} from '@frontend/backend-ui.component-registry';
import { Login, type LoginFormData } from '@api-banking/authentication.login';
import { OtpModal } from '@api-banking/authentication.overlays.otp-modal';
import { DepositDetails } from '@api-banking/fixed-deposit.wizard.deposit-details';
import { BankDetails } from '@api-banking/fixed-deposit.wizard.bank-details';
import { PreviewStep } from '@api-banking/fixed-deposit.wizard.preview-step';
import { SubmitForm } from '@api-banking/fixed-deposit.wizard.submit-form';
import { FundingStep } from '@api-banking/fixed-deposit.wizard.funding-step';
import {
  useJourneyContext,
  type ValidationError,
} from '@api-banking/fixed-deposit.hooks.use-journey-context';
import { useStitchClientWithFallback } from '@api-banking/stitch.stitch-client';

type ComponentFactory = any;
type StepperComponent = React.ComponentType<any>;

// Combined Login + OTP wrapper - OTP is part of the Login step
const LoginWithOtpWrapper = ({
  onContinue,
  credentials,
  ...restProps
}: any) => {
  const { t } = useTranslation();
  const [showOtp, setShowOtp] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<ValidationError[]>([]);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpErrors, setOtpErrors] = useState<ValidationError[]>([]);

  const {
    updateFormData,
    formData,
    terms,
    setTerms,
    isLoadingTerms,
    setLoadingTerms,
    setAccessToken,
    setRefreshToken,
    setCustomerId,
    setCustomerAccounts,
    otpSessionId,
    setOtpSessionId,
    otpHint,
    setOtpHint,
    otpLength,
    setOtpLength,
    setOtpMaxAttempts,
    setServerErrors,
    clearServerErrors,
  } = useJourneyContext();

  // API client with auto-mock for Bit Cloud previews
  const stitchClient = useStitchClientWithFallback();

  // Fetch terms on mount
  useEffect(() => {
    const fetchTerms = async () => {
      setLoadingTerms(true);
      try {
        const response = await stitchClient.getLoginTerms() as any;
        if ('terms' in response && response.terms) {
          setTerms(response.terms);
        }
      } catch (error) {
        // Use default terms if fetch fails
        setTerms([]);
      } finally {
        setLoadingTerms(false);
      }
    };

    fetchTerms();
  }, [stitchClient, setTerms, setLoadingTerms]);

  // Login authorization submission
  const handleAuthorize = useCallback(
    async (data: LoginFormData) => {
      setIsLoginLoading(true);
      setLoginErrors([]);

      try {
        const response = await stitchClient.authorize(data) as any;

        if ('errors' in response && response.errors) {
          setLoginErrors(response.errors);
          setServerErrors('login', response.errors);
          return;
        }

        if ('sessionId' in response) {
          // Store OTP session metadata
          setOtpSessionId(response.sessionId);
          setOtpHint(response.hint || null);
          setOtpLength(response.otpLength || 6);
          setOtpMaxAttempts(response.maxAttempts || 3);
          clearServerErrors('login');
          setShowOtp(true); // Show OTP modal after successful authorization
        }
      } catch (error) {
        const networkError = [
          { field: 'general', message: t('common.networkError') },
        ];
        setLoginErrors(networkError);
        setServerErrors('login', networkError);
      } finally {
        setIsLoginLoading(false);
      }
    },
    [
      stitchClient,
      setOtpSessionId,
      setOtpHint,
      setOtpLength,
      setOtpMaxAttempts,
      clearServerErrors,
      setServerErrors,
      t,
    ]
  );

  // OTP token exchange submission
  const handleTokenExchange = useCallback(
    async (otp: string) => {
      setIsOtpLoading(true);
      setOtpErrors([]);

      try {
        const response = await stitchClient.exchangeToken({
          sessionId: otpSessionId!,
          otp,
        }) as any;

        if ('errors' in response && response.errors) {
          setOtpErrors(response.errors);
          setServerErrors('otp', response.errors);
          return;
        }

        if ('accessToken' in response) {
          // Store refresh token from stubs
          setRefreshToken(response.refreshToken);

          // Get login credentials for finding the real customer
          const loginCredential = formData.login?.credential || {};
          // Normalize mobile number: API expects E.164 format like "+919876543210"
          let mobile = loginCredential.mobile || '';
          if (mobile && !mobile.startsWith('+')) {
            // Add + and country code if not present
            if (!mobile.startsWith('91')) {
              mobile = `+91${mobile}`; // Add +91 for India
            } else {
              mobile = `+${mobile}`; // Add + prefix
            }
          }
          const {dob} = loginCredential;
          const {pan} = loginCredential;

          // Decode JWT to extract customerId from stubs token (for token generation)
          let stubsCustomerId: string | null = null;
          try {
            const payload = JSON.parse(atob(response.accessToken.split('.')[1]));
            stubsCustomerId = payload.customerId || payload.sub || null;
          } catch {
            // JWT decode failed
          }

          // Generate Stitch API token from stubs customerId
          // The stubs token isn't valid for real Stitch API calls
          let effectiveToken = response.accessToken;
          if (stubsCustomerId) {
            try {
              const stitchTokenResponse = await stitchClient.generateStitchToken(stubsCustomerId);
              if ('access_token' in stitchTokenResponse && stitchTokenResponse.access_token) {
                effectiveToken = stitchTokenResponse.access_token;
              }
            } catch {
              // Token generation failed, fallback to stubs token (works with mock server)
            }
          }

          // Store the effective token (Stitch token if available, otherwise stubs token)
          setAccessToken(effectiveToken);

          // Find the real customer using the Stitch token to get the correct customerId
          let realCustomerId: string | null = null;
          if (mobile) {
            try {
              const findResponse = await stitchClient.findCustomerWithToken(
                { mobile, ...(dob && { dob }), ...(pan && { pan }) },
                effectiveToken
              );
              if (findResponse.customerId) {
                realCustomerId = findResponse.customerId;
              }
            } catch {
              // Find failed, fallback to stubs customerId
              realCustomerId = stubsCustomerId;
            }
          } else {
            realCustomerId = stubsCustomerId;
          }

          // Store the real customerId
          setCustomerId(realCustomerId);

          // Fetch customer accounts if customerId is available
          if (realCustomerId) {
            stitchClient
              .getCustomerAccounts(
                {
                  customerId: realCustomerId,
                  permission: 'debit',
                  currency: 'INR',
                },
                effectiveToken
              )
              .then((accountsResponse: any) => {
                if ('errors' in accountsResponse) {
                  return;
                }
                setCustomerAccounts(accountsResponse);
              })
              .catch(() => {
                // Silently fail - payoutAccountId will be empty
              });
          }

          clearServerErrors('otp');

          setShowOtp(false);
          onContinue?.(); // Advance to next step after OTP verification
        }
      } catch (error) {
        const networkError = [
          { field: 'general', message: t('common.networkError') },
        ];
        setOtpErrors(networkError);
        setServerErrors('otp', networkError);
      } finally {
        setIsOtpLoading(false);
      }
    },
    [
      stitchClient,
      otpSessionId,
      formData.login,
      setAccessToken,
      setRefreshToken,
      setCustomerId,
      setCustomerAccounts,
      clearServerErrors,
      setServerErrors,
      onContinue,
      t,
    ]
  );

  if (showOtp) {
    return (
      <OtpModal
        isOpen
        hint={otpHint || undefined}
        otpLength={otpLength}
        serverErrors={otpErrors}
        isSubmitting={isOtpLoading}
        onOtpSubmit={async (otp: string) => {
          updateFormData('otp', { otp });
          await handleTokenExchange(otp);
        }}
        onClose={() => setShowOtp(false)}
      />
    );
  }

  return (
    <Login
      {...restProps}
      credentials={credentials}
      terms={terms.length > 0 ? terms : undefined}
      isLoadingTerms={isLoadingTerms}
      serverErrors={loginErrors}
      isSubmitting={isLoginLoading}
      onContinue={async (data: LoginFormData) => {
        updateFormData('login', data);
        await handleAuthorize(data);
      }}
    />
  );
};

const loginPageFactory: ComponentFactory = createFactory<any, any>(
  'LoginPage',
  ({ schema: { props } }) => <LoginWithOtpWrapper {...props} />,
  () => ({ valid: true, errors: [], warnings: [] })
);

const otpModalFactory: ComponentFactory = createFactory<any, any>(
  'OtpModal',
  ({ schema: { props } }) => <OtpModal {...props} />,
  () => ({ valid: true, errors: [], warnings: [] })
);

const createStepperFactory = (
  StepperComp: StepperComponent
): ComponentFactory =>
  createFactory<any, any>(
    'Stepper',
    ({ schema: { props, children } }) => (
      <StepperComp {...props}>{children}</StepperComp>
    ),
    () => ({ valid: true, errors: [], warnings: [] })
  );

const previewStepFactory: ComponentFactory = createFactory<any, any>(
  'PreviewStep',
  ({ schema: { props } }) => <PreviewStep {...props} />,
  () => ({ valid: true, errors: [], warnings: [] })
);

const fundingStepFactory: ComponentFactory = createFactory<any, any>(
  'FundingStep',
  ({ schema: { props } }) => <FundingStep {...props} />,
  () => ({ valid: true, errors: [], warnings: [] })
);

// Wrapper for OtpModal to handle API call (standalone, not part of login flow)
const OtpStepWrapper = ({ onContinue, onOtpSubmit, ...restProps }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrorsState] = useState<ValidationError[]>([]);

  const {
    updateFormData,
    formData,
    otpSessionId,
    setAccessToken,
    setRefreshToken,
    setCustomerId,
    setCustomerAccounts,
    setServerErrors,
    clearServerErrors,
  } = useJourneyContext();

  // API client with auto-mock for Bit Cloud previews
  const stitchClient = useStitchClientWithFallback();

  const handleOtpSubmit = useCallback(
    async (otp: string) => {
      setIsLoading(true);
      setServerErrorsState([]);

      try {
        const response = await stitchClient.exchangeToken({
          sessionId: otpSessionId!,
          otp,
        }) as any;

        if ('errors' in response && response.errors) {
          setServerErrorsState(response.errors);
          setServerErrors('otp', response.errors);
          return;
        }

        if ('accessToken' in response) {
          setRefreshToken(response.refreshToken);

          // Get login credentials for finding the real customer
          const loginCredential = formData.login?.credential || {};
          // Normalize mobile number: API expects E.164 format like "+919876543210"
          let mobile = loginCredential.mobile || '';
          if (mobile && !mobile.startsWith('+')) {
            // Add + and country code if not present
            if (!mobile.startsWith('91')) {
              mobile = `+91${mobile}`; // Add +91 for India
            } else {
              mobile = `+${mobile}`; // Add + prefix
            }
          }
          const {dob} = loginCredential;
          const {pan} = loginCredential;

          // Decode JWT to extract customerId from stubs token (for token generation)
          let stubsCustomerId: string | null = null;
          try {
            const payload = JSON.parse(atob(response.accessToken.split('.')[1]));
            stubsCustomerId = payload.customerId || payload.sub || null;
          } catch {
            // JWT decode failed
          }

          // Generate Stitch API token from stubs customerId
          let effectiveToken = response.accessToken;
          if (stubsCustomerId) {
            try {
              const stitchTokenResponse = await stitchClient.generateStitchToken(stubsCustomerId);
              if ('access_token' in stitchTokenResponse && stitchTokenResponse.access_token) {
                effectiveToken = stitchTokenResponse.access_token;
              }
            } catch {
              // Token generation failed, fallback to stubs token (works with mock server)
            }
          }

          // Store the effective token
          setAccessToken(effectiveToken);

          // Find the real customer using the Stitch token
          let realCustomerId: string | null = null;
          if (mobile) {
            try {
              const findResponse = await stitchClient.findCustomerWithToken(
                { mobile, ...(dob && { dob }), ...(pan && { pan }) },
                effectiveToken
              );
              if (findResponse.customerId) {
                realCustomerId = findResponse.customerId;
              }
            } catch {
              realCustomerId = stubsCustomerId;
            }
          } else {
            realCustomerId = stubsCustomerId;
          }

          // Store the real customerId
          setCustomerId(realCustomerId);

          // Fetch customer accounts if customerId is available
          if (realCustomerId) {
            stitchClient
              .getCustomerAccounts(
                {
                  customerId: realCustomerId,
                  permission: 'debit',
                  currency: 'INR',
                },
                effectiveToken
              )
              .then((accountsResponse: any) => {
                if ('errors' in accountsResponse) {
                  return;
                }
                setCustomerAccounts(accountsResponse);
              })
              .catch(() => {
                // Silently fail - payoutAccountId will be empty
              });
          }

          clearServerErrors('otp');
          onContinue?.();
        }
      } catch (error) {
        const networkError = [
          { field: 'general', message: 'Network error. Please try again.' },
        ];
        setServerErrorsState(networkError);
        setServerErrors('otp', networkError);
      } finally {
        setIsLoading(false);
      }
    },
    [
      stitchClient,
      otpSessionId,
      formData.login,
      setAccessToken,
      setRefreshToken,
      setCustomerId,
      setCustomerAccounts,
      clearServerErrors,
      setServerErrors,
      onContinue,
    ]
  );

  return (
    <OtpModal
      {...restProps}
      serverErrors={serverErrors}
      isSubmitting={isLoading}
      onOtpSubmit={async (otp: string) => {
        updateFormData('otp', { otp });
        onOtpSubmit?.(otp);
        await handleOtpSubmit(otp);
      }}
    />
  );
};

const otpStepFactory: ComponentFactory = createFactory<any, any>(
  'OtpStep',
  ({ schema: { props } }) => <OtpStepWrapper {...props} />,
  () => ({ valid: true, errors: [], warnings: [] })
);

// Wrapper for DepositDetails to handle API call with Bearer token
const DepositDetailsWrapper = ({ onContinue, onBack, ...restProps }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrorsState] = useState<ValidationError[]>([]);
  const [customerData, setCustomerData] = useState<{ fullName: string; dateOfBirth: string; pan: string } | undefined>(undefined);

  const {
    updateFormData,
    accessToken,
    customerId,
    customerAccounts,
    setCustomerAccounts,
    setServerErrors,
    clearServerErrors,
    formData,
  } = useJourneyContext();

  // API client with auto-mock for Bit Cloud previews
  const stitchClient = useStitchClientWithFallback();

  // Fetch customer profile
  useEffect(() => {
    if (!customerId || !accessToken || customerData) return;

    stitchClient
      .getProfile(customerId, accessToken)
      .then((profile: any) => {
        if ('errors' in profile) return;
        setCustomerData({
          fullName: profile.name || '',
          dateOfBirth: profile.dob || '',
          pan: profile.pan || '',
        });
        // Also persist to login formData so other steps can use it
        updateFormData('login', {
          ...formData.login,
          fullName: profile.name || '',
          dateOfBirth: profile.dob || '',
          pan: profile.pan || '',
          mobileNumber: profile.mobile || '',
          email: profile.email || '',
        });
      })
      .catch(() => {
        // Silently fail - customerData will remain undefined
      });
  }, [customerId, accessToken, customerData, stitchClient]);

  useEffect(() => {
    if (!customerId || !accessToken || customerAccounts.length > 0) {
      return;
    }

    stitchClient
      .getCustomerAccounts(
        {
          customerId,
          permission: 'debit',
          currency: 'INR',
        },
        accessToken
      )
      .then((accountsResponse: any) => {
        if ('errors' in accountsResponse) {
          return;
        }
        setCustomerAccounts(accountsResponse);
      })
      .catch(() => {
        // Silently fail - calculator payoutAccountId can remain empty
      });
  }, [
    stitchClient,
    customerId,
    accessToken,
    customerAccounts.length,
    setCustomerAccounts,
  ]);

  const handleSubmit = useCallback(
    async (data: any) => {
      setIsLoading(true);
      setServerErrorsState([]);

      try {
        const response = await stitchClient.saveDepositDetails(
          data,
          accessToken || ''
        ) as any;

        if ('errors' in response && response.errors) {
          setServerErrorsState(response.errors);
          setServerErrors('deposit', response.errors);
          return;
        }

        clearServerErrors('deposit');
        onContinue?.();
      } catch (error) {
        const networkError = [
          { field: 'general', message: 'Network error. Please try again.' },
        ];
        setServerErrorsState(networkError);
        setServerErrors('deposit', networkError);
      } finally {
        setIsLoading(false);
      }
    },
    [stitchClient, accessToken, clearServerErrors, setServerErrors, onContinue]
  );

  return (
    <DepositDetails
      {...restProps}
      initialData={formData.deposit}
      customerData={customerData}
      isLoadingProfile={!customerData && !!customerId && !!accessToken}
      serverErrors={serverErrors}
      isSubmitting={isLoading}
      onBack={onBack}
      onContinue={async (data: any) => {
        updateFormData('deposit', data);
        await handleSubmit(data);
      }}
    />
  );
};

const depositDetailsWrapperFactory: ComponentFactory = createFactory<any, any>(
  'DepositDetailsWrapper',
  ({ schema: { props } }) => <DepositDetailsWrapper {...props} />,
  () => ({ valid: true, errors: [], warnings: [] })
);

// Wrapper for BankDetails to handle API call with Bearer token
const BankDetailsWrapper = ({ onContinue, onBack, ...restProps }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrorsState] = useState<ValidationError[]>([]);

  const {
    updateFormData,
    accessToken,
    setServerErrors,
    clearServerErrors,
    formData,
  } = useJourneyContext();

  // API client with auto-mock for Bit Cloud previews
  const stitchClient = useStitchClientWithFallback();

  const handleSubmit = useCallback(
    async (data: any) => {
      setIsLoading(true);
      setServerErrorsState([]);

      try {
        // Serialize otherBankAccount object to JSON string for the API
        const apiData = {
          ...data,
          otherBankAccount: data.otherBankAccount
            ? JSON.stringify(data.otherBankAccount)
            : undefined,
        };
        const response = await stitchClient.saveBankDetails(
          apiData,
          accessToken || ''
        ) as any;

        if ('errors' in response && response.errors) {
          setServerErrorsState(response.errors);
          setServerErrors('bank', response.errors);
          return;
        }

        clearServerErrors('bank');
        onContinue?.();
      } catch (error) {
        const networkError = [
          { field: 'general', message: 'Network error. Please try again.' },
        ];
        setServerErrorsState(networkError);
        setServerErrors('bank', networkError);
      } finally {
        setIsLoading(false);
      }
    },
    [stitchClient, accessToken, clearServerErrors, setServerErrors, onContinue]
  );

  return (
    <BankDetails
      {...restProps}
      initialData={formData.bank}
      fdAmount={formData.deposit?.amount ? Number(formData.deposit.amount) : undefined}
      serverErrors={serverErrors}
      isSubmitting={isLoading}
      onBack={onBack}
      onContinue={async (data: any) => {
        updateFormData('bank', data);
        await handleSubmit(data);
      }}
    />
  );
};

const bankDetailsWrapperFactory: ComponentFactory = createFactory<any, any>(
  'BankDetailsWrapper',
  ({ schema: { props } }) => <BankDetailsWrapper {...props} />,
  () => ({ valid: true, errors: [], warnings: [] })
);

// Wrapper for SubmitStep to handle final API call with Bearer token
const SubmitStepWrapper = (props: any) => {
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrorsState] = useState<ValidationError[]>([]);
  const hasSubmittedRef = React.useRef(false);

  const { accessToken } = useJourneyContext();

  // API client with auto-mock for Bit Cloud previews
  const stitchClient = useStitchClientWithFallback();

  // Auto-submit on mount (only once)
  useEffect(() => {
    const submitFD = async () => {
      if (hasSubmittedRef.current) return;
      hasSubmittedRef.current = true;

      setIsLoading(true);
      setServerErrorsState([]);

      try {
        const response = await stitchClient.submitFD(accessToken || '') as any;

        if ('errors' in response && response.errors) {
          setServerErrorsState(response.errors);
          return;
        }

        if ('applicationId' in response) {
          setApplicationId(response.applicationId);
        }
      } catch (error) {
        const networkError = [
          { field: 'general', message: 'Network error. Please try again.' },
        ];
        setServerErrorsState(networkError);
      } finally {
        setIsLoading(false);
      }
    };

    submitFD();
  }, [stitchClient, accessToken]);

  return (
    <SubmitForm
      {...props}
      applicationId={applicationId}
      isSubmitting={isLoading}
      serverErrors={serverErrors}
    />
  );
};

const submitStepWrapperFactory: ComponentFactory = createFactory<any, any>(
  'SubmitStepWrapper',
  ({ schema: { props } }) => <SubmitStepWrapper {...props} />,
  () => ({ valid: true, errors: [], warnings: [] })
);

export type CreateStepsRegistryOptions = {
  Stepper: StepperComponent;
};

// Export wrappers for testing purposes
export const testWrappers = {
  LoginWithOtpWrapper,
  OtpStepWrapper,
  DepositDetailsWrapper,
  BankDetailsWrapper,
  SubmitStepWrapper,
};

/**
 * Creates and returns a configured UiComponentRegistry with all journey components registered.
 * @param options - Configuration options including the Stepper component
 */
export function createStepsRegistry(
  options: CreateStepsRegistryOptions
): UiComponentRegistry {
  const { Stepper } = options;
  const registry = new UiComponentRegistry({ onMissing: 'warn' as any });
  registry.register('LoginPage', loginPageFactory);
  registry.register('OtpModal', otpModalFactory);
  registry.register('Stepper', createStepperFactory(Stepper));
  registry.register('OtpStep', otpStepFactory);
  registry.register('DepositDetails', depositDetailsWrapperFactory);
  registry.register('BankDetails', bankDetailsWrapperFactory);
  registry.register('PreviewStep', previewStepFactory);
  registry.register('FundingStep', fundingStepFactory);
  registry.register('SubmitStep', submitStepWrapperFactory);
  return registry;
}
