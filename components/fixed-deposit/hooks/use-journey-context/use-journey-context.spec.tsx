import { renderHook, act , render, screen } from '@testing-library/react';

import React, { ReactNode } from 'react';
import { AuthenticationProvider, useJourneyContext, ValidationError, Term, JourneyConfig } from './use-journey-context.js';

vi.mock('@api-banking/stitch.stitch-client', () => ({
    useStitchClientWithFallback: () => ({
        setTokenProvider: vi.fn(),
        refreshAccessToken: vi.fn(),
    }),
    StitchClientProvider: ({ children }: { children: React.ReactNode }) => children,
    isTokenExpiringSoon: () => false,
}));

describe('useJourneyContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthenticationProvider>{children}</AuthenticationProvider>
  );

  describe('Provider', () => {
    it('should render children correctly', () => {
      render(
        <AuthenticationProvider>
          <div data-testid="child">Test Child</div>
        </AuthenticationProvider>
      );
      expect(screen.getByTestId('child')).toHaveTextContent('Test Child');
    });

    it('should accept custom clientId prop', () => {
      const { result } = renderHook(() => useJourneyContext(), {
        wrapper: ({ children }) => (
          <AuthenticationProvider clientId="custom-client-id">{children}</AuthenticationProvider>
        ),
      });
      expect(result.current.clientId).toBe('custom-client-id');
    });

    it('should use default clientId when not provided', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      // Default is 'test-client-id' from process.env fallback
      expect(result.current.clientId).toBe('test-client-id');
    });
  });

  describe('useJourneyContext hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test since we expect an error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useJourneyContext());
      }).toThrow('useJourneyContext must be used within an AuthenticationProvider');

      consoleSpy.mockRestore();
    });

    it('should return context value with all expected properties', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      // Check all properties exist
      expect(result.current).toHaveProperty('formData');
      expect(result.current).toHaveProperty('updateFormData');
      expect(result.current).toHaveProperty('token');
      expect(result.current).toHaveProperty('setToken');
      expect(result.current).toHaveProperty('terms');
      expect(result.current).toHaveProperty('setTerms');
      expect(result.current).toHaveProperty('isLoadingTerms');
      expect(result.current).toHaveProperty('setLoadingTerms');
      expect(result.current).toHaveProperty('accessToken');
      expect(result.current).toHaveProperty('setAccessToken');
      expect(result.current).toHaveProperty('refreshToken');
      expect(result.current).toHaveProperty('setRefreshToken');
      expect(result.current).toHaveProperty('otpSessionId');
      expect(result.current).toHaveProperty('setOtpSessionId');
      expect(result.current).toHaveProperty('otpHint');
      expect(result.current).toHaveProperty('setOtpHint');
      expect(result.current).toHaveProperty('otpLength');
      expect(result.current).toHaveProperty('setOtpLength');
      expect(result.current).toHaveProperty('otpMaxAttempts');
      expect(result.current).toHaveProperty('setOtpMaxAttempts');
      expect(result.current).toHaveProperty('sessionId');
      expect(result.current).toHaveProperty('setSessionId');
      expect(result.current).toHaveProperty('serverErrors');
      expect(result.current).toHaveProperty('setServerErrors');
      expect(result.current).toHaveProperty('clearServerErrors');
      expect(result.current).toHaveProperty('isSubmitting');
      expect(result.current).toHaveProperty('setSubmitting');
      expect(result.current).toHaveProperty('journeyConfig');
      expect(result.current).toHaveProperty('setJourneyConfig');
      expect(result.current).toHaveProperty('clientId');
    });
  });

  describe('formData management', () => {
    it('should start with empty formData', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.formData).toEqual({});
    });

    it('should update formData for a specific step', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.updateFormData('login', { mobile: '1234567890' });
      });

      expect(result.current.formData.login).toEqual({ mobile: '1234567890' });
    });

    it('should merge new data with existing formData', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.updateFormData('login', { mobile: '1234567890' });
      });

      act(() => {
        result.current.updateFormData('deposit', { amount: 10000 });
      });

      expect(result.current.formData).toEqual({
        login: { mobile: '1234567890' },
        deposit: { amount: 10000 },
      });
    });

    it('should allow multiple steps to store independent form data', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.updateFormData('step1', { field1: 'value1' });
        result.current.updateFormData('step2', { field2: 'value2' });
        result.current.updateFormData('step3', { field3: 'value3' });
      });

      expect(result.current.formData.step1).toEqual({ field1: 'value1' });
      expect(result.current.formData.step2).toEqual({ field2: 'value2' });
      expect(result.current.formData.step3).toEqual({ field3: 'value3' });
    });

    it('should overwrite formData for the same step', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.updateFormData('login', { mobile: '1234567890' });
      });

      act(() => {
        result.current.updateFormData('login', { mobile: '9876543210', pan: 'ABCDE1234F' });
      });

      expect(result.current.formData.login).toEqual({ mobile: '9876543210', pan: 'ABCDE1234F' });
    });
  });

  describe('token management', () => {
    it('should start with null token', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.token).toBeNull();
    });

    it('should update token via setToken', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setToken('my-token-123');
      });

      expect(result.current.token).toBe('my-token-123');
    });

    it('should start with null accessToken', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.accessToken).toBeNull();
    });

    it('should update accessToken via setAccessToken', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setAccessToken('access-token-456');
      });

      expect(result.current.accessToken).toBe('access-token-456');
    });

    it('should allow clearing accessToken by setting to null', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setAccessToken('access-token-456');
      });

      act(() => {
        result.current.setAccessToken(null);
      });

      expect(result.current.accessToken).toBeNull();
    });

    it('should start with null refreshToken', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.refreshToken).toBeNull();
    });

    it('should update refreshToken via setRefreshToken', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setRefreshToken('refresh-token-789');
      });

      expect(result.current.refreshToken).toBe('refresh-token-789');
    });
  });

  describe('terms management', () => {
    it('should start with empty terms array', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.terms).toEqual([]);
    });

    it('should update terms via setTerms', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      const mockTerms: Term[] = [
        { id: 'term1', summary: 'Term 1', documentUrl: 'https://example.com/term1' },
        { id: 'term2', summary: 'Term 2', content: 'Inline content for term 2' },
      ];

      act(() => {
        result.current.setTerms(mockTerms);
      });

      expect(result.current.terms).toEqual(mockTerms);
    });

    it('should start with isLoadingTerms as false', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.isLoadingTerms).toBe(false);
    });

    it('should update isLoadingTerms via setLoadingTerms', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setLoadingTerms(true);
      });

      expect(result.current.isLoadingTerms).toBe(true);

      act(() => {
        result.current.setLoadingTerms(false);
      });

      expect(result.current.isLoadingTerms).toBe(false);
    });
  });

  describe('OTP session metadata', () => {
    it('should start with null otpSessionId', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.otpSessionId).toBeNull();
    });

    it('should update otpSessionId via setOtpSessionId', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setOtpSessionId('session-abc-123');
      });

      expect(result.current.otpSessionId).toBe('session-abc-123');
    });

    it('should start with null otpHint', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.otpHint).toBeNull();
    });

    it('should update otpHint via setOtpHint', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setOtpHint('****1234');
      });

      expect(result.current.otpHint).toBe('****1234');
    });

    it('should start with default otpLength of 6', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.otpLength).toBe(6);
    });

    it('should update otpLength via setOtpLength', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setOtpLength(4);
      });

      expect(result.current.otpLength).toBe(4);
    });

    it('should start with default otpMaxAttempts of 3', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.otpMaxAttempts).toBe(3);
    });

    it('should update otpMaxAttempts via setOtpMaxAttempts', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setOtpMaxAttempts(5);
      });

      expect(result.current.otpMaxAttempts).toBe(5);
    });
  });

  describe('legacy sessionId', () => {
    it('should start with null sessionId', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.sessionId).toBeNull();
    });

    it('should update sessionId via setSessionId', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setSessionId('legacy-session-id');
      });

      expect(result.current.sessionId).toBe('legacy-session-id');
    });
  });

  describe('serverErrors management', () => {
    it('should start with empty serverErrors', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.serverErrors).toEqual({});
    });

    it('should set serverErrors for a specific step via setServerErrors', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      const errors: ValidationError[] = [
        { field: 'mobile', message: 'Invalid mobile number' },
      ];

      act(() => {
        result.current.setServerErrors('login', errors);
      });

      expect(result.current.serverErrors.login).toEqual(errors);
    });

    it('should namespace errors by step ID', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      const loginErrors: ValidationError[] = [
        { field: 'mobile', message: 'Invalid mobile' },
      ];
      const depositErrors: ValidationError[] = [
        { field: 'amount', message: 'Invalid amount' },
      ];

      act(() => {
        result.current.setServerErrors('login', loginErrors);
        result.current.setServerErrors('deposit', depositErrors);
      });

      expect(result.current.serverErrors.login).toEqual(loginErrors);
      expect(result.current.serverErrors.deposit).toEqual(depositErrors);
    });

    it('should clear serverErrors for a specific step via clearServerErrors', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      const errors: ValidationError[] = [
        { field: 'mobile', message: 'Invalid mobile' },
      ];

      act(() => {
        result.current.setServerErrors('login', errors);
      });

      expect(result.current.serverErrors.login).toEqual(errors);

      act(() => {
        result.current.clearServerErrors('login');
      });

      expect(result.current.serverErrors.login).toBeUndefined();
    });

    it('should only clear the specified step errors, not others', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      const loginErrors: ValidationError[] = [{ field: 'mobile', message: 'Invalid mobile' }];
      const depositErrors: ValidationError[] = [{ field: 'amount', message: 'Invalid amount' }];

      act(() => {
        result.current.setServerErrors('login', loginErrors);
        result.current.setServerErrors('deposit', depositErrors);
      });

      act(() => {
        result.current.clearServerErrors('login');
      });

      expect(result.current.serverErrors.login).toBeUndefined();
      expect(result.current.serverErrors.deposit).toEqual(depositErrors);
    });

    it('should overwrite existing errors for the same step', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      const initialErrors: ValidationError[] = [{ field: 'mobile', message: 'Invalid mobile' }];
      const newErrors: ValidationError[] = [{ field: 'pan', message: 'Invalid PAN' }];

      act(() => {
        result.current.setServerErrors('login', initialErrors);
      });

      act(() => {
        result.current.setServerErrors('login', newErrors);
      });

      expect(result.current.serverErrors.login).toEqual(newErrors);
    });
  });

  describe('submission state', () => {
    it('should start with isSubmitting as false', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should update isSubmitting via setSubmitting', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });

      act(() => {
        result.current.setSubmitting(true);
      });

      expect(result.current.isSubmitting).toBe(true);

      act(() => {
        result.current.setSubmitting(false);
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('journey config', () => {
    it('should start with null journeyConfig', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      expect(result.current.journeyConfig).toBeNull();
    });

    it('should update journeyConfig via setJourneyConfig', () => {
      const { result } = renderHook(() => useJourneyContext(), { wrapper });
      const mockConfig: JourneyConfig = {
        journeyType: 'fixed-deposit',
        requiredAggregates: [{ key: 'deposit', label: 'Deposit Details', fields: {} }],
        stepTitles: ['Login', 'Deposit Details', 'Bank Details', 'Preview', 'Submit'],
        components: {
          login: { id: 'login', type: 'LoginPage' },
        },
        layout: {
          type: 'stepper',
          children: [{ componentId: 'login' }],
        },
      };

      act(() => {
        result.current.setJourneyConfig(mockConfig);
      });

      expect(result.current.journeyConfig).toEqual(mockConfig);
    });
  });
});
