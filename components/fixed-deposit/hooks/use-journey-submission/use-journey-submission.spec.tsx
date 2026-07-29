import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useJourneySubmission,
  useTermsFetch,
  useLoginAuthorize,
  useTokenExchange,
  useJourneyConfig,
} from './use-journey-submission.js';

describe('useJourneySubmission', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('initial state', () => {
    it('should start with isLoading as false', () => {
      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );
      expect(result.current.isLoading).toBe(false);
    });

    it('should start with empty errors array', () => {
      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );
      expect(result.current.errors).toEqual([]);
    });
  });

  describe('submit function', () => {
    it('should make fetch call with correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/api/test' })
      );

      await act(async () => {
        await result.current.submit({ data: 'test' });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/test',
        expect.any(Object)
      );
    });

    it('should use PUT method by default', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      await act(async () => {
        await result.current.submit({ data: 'test' });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should use specified HTTP method', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', method: 'POST' })
      );

      await act(async () => {
        await result.current.submit({ data: 'test' });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should include Content-Type and Client-Id headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', clientId: 'my-client-id' })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Client-Id': 'my-client-id',
          }),
        })
      );
    });

    it('should NOT include Authorization header when requiresAuth is false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', requiresAuth: false })
      );

      await act(async () => {
        await result.current.submit({}, 'some-token');
      });

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });

    it('should NOT include Authorization header when requiresAuth is true but no accessToken', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', requiresAuth: true })
      );

      await act(async () => {
        await result.current.submit({});
      });

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });

    it('should include Bearer token when requiresAuth is true and accessToken is provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', requiresAuth: true })
      );

      await act(async () => {
        await result.current.submit({}, 'my-access-token');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-access-token',
          }),
        })
      );
    });

    it('should NOT include body for GET requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', method: 'GET' })
      );

      await act(async () => {
        await result.current.submit({ some: 'data' });
      });

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.body).toBeUndefined();
    });

    it('should include JSON body for PUT requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', method: 'PUT' })
      );

      const data = { field: 'value' };
      await act(async () => {
        await result.current.submit(data);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(data),
        })
      );
    });

    it('should include JSON body for POST requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', method: 'POST' })
      );

      const data = { field: 'value' };
      await act(async () => {
        await result.current.submit(data);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(data),
        })
      );
    });

    it('should include credentials: include for cookies', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: 'include',
        })
      );
    });
  });

  describe('success handling', () => {
    it('should return true on successful response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      let success: boolean = false;
      await act(async () => {
        success = await result.current.submit({});
      });

      expect(success).toBe(true);
    });

    it('should return true when response does not have success field', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'some data' }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      let success: boolean = false;
      await act(async () => {
        success = await result.current.submit({});
      });

      expect(success).toBe(true);
    });

    it('should call onSuccess callback with response data', async () => {
      const responseData = { data: 'test', id: 123 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseData),
      });

      const onSuccess = vi.fn();
      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', onSuccess })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(onSuccess).toHaveBeenCalledWith(responseData);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should return false when response.ok is false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            errors: [{ field: 'general', message: 'Server error' }],
          }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      let success: boolean = true;
      await act(async () => {
        success = await result.current.submit({});
      });

      expect(success).toBe(false);
    });

    it('should return false when response has success: false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            errors: [{ field: 'amount', message: 'Invalid amount' }],
          }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      let success: boolean = true;
      await act(async () => {
        success = await result.current.submit({});
      });

      expect(success).toBe(false);
    });

    it('should populate errors state from response.errors', async () => {
      const errors = [
        { field: 'mobile', message: 'Invalid mobile number' },
        { field: 'pan', message: 'Invalid PAN' },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ errors }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(result.current.errors).toEqual(errors);
    });

    it('should use default error when no errors array in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(result.current.errors).toEqual([
        { field: 'general', message: 'An error occurred' },
      ]);
    });

    it('should call onError callback with errors', async () => {
      const errors = [{ field: 'amount', message: 'Invalid amount' }];
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ errors }),
      });

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', onError })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(onError).toHaveBeenCalledWith(errors);
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      let success: boolean = true;
      await act(async () => {
        success = await result.current.submit({});
      });

      expect(success).toBe(false);
      expect(result.current.errors).toEqual([
        { field: 'general', message: 'Network error. Please try again.' },
      ]);
    });

    it('should call onError callback on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test', onError })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(onError).toHaveBeenCalledWith([
        { field: 'general', message: 'Network error. Please try again.' },
      ]);
    });
  });

  describe('loading state', () => {
    it('should set isLoading to true during submit', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValueOnce(promise);

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.submit({});
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Resolve the promise to complete the test
      await act(async () => {
        resolvePromise!({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      });
    });

    it('should set isLoading to false after successful submit', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoading to false after failed submit', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({ errors: [{ field: 'general', message: 'Error' }] }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoading to false after network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('clearErrors', () => {
    it('should clear errors array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({ errors: [{ field: 'general', message: 'Error' }] }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(result.current.errors).toHaveLength(1);

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.errors).toEqual([]);
    });
  });

  describe('errors cleared on new submit', () => {
    it('should clear previous errors when submit is called', async () => {
      // First call fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            errors: [{ field: 'mobile', message: 'Invalid' }],
          }),
      });
      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() =>
        useJourneySubmission({ endpoint: '/test' })
      );

      await act(async () => {
        await result.current.submit({});
      });

      expect(result.current.errors).toHaveLength(1);

      await act(async () => {
        await result.current.submit({});
      });

      // Errors should be cleared (and new call succeeded)
      expect(result.current.errors).toEqual([]);
    });
  });
});

describe('Helper hooks', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('useTermsFetch', () => {
    it('should use GET method', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ terms: [] }),
      });

      const { result } = renderHook(() => useTermsFetch());

      await act(async () => {
        await result.current.submit();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should call /login/terms endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ terms: [] }),
      });

      const { result } = renderHook(() => useTermsFetch());

      await act(async () => {
        await result.current.submit();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/login/terms',
        expect.any(Object)
      );
    });

    it('should not include Authorization header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ terms: [] }),
      });

      const { result } = renderHook(() => useTermsFetch());

      await act(async () => {
        await result.current.submit(undefined, 'some-token');
      });

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });

    it('should accept custom clientId', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ terms: [] }),
      });

      const { result } = renderHook(() => useTermsFetch('custom-client'));

      await act(async () => {
        await result.current.submit();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Client-Id': 'custom-client',
          }),
        })
      );
    });
  });

  describe('useLoginAuthorize', () => {
    it('should use POST method', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ otpSessionId: 'session-123' }),
      });

      const { result } = renderHook(() => useLoginAuthorize());

      await act(async () => {
        await result.current.submit({ credentials: {} });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should call /login/authorize endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ otpSessionId: 'session-123' }),
      });

      const { result } = renderHook(() => useLoginAuthorize());

      await act(async () => {
        await result.current.submit({ credentials: {} });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/login/authorize',
        expect.any(Object)
      );
    });

    it('should not include Authorization header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ otpSessionId: 'session-123' }),
      });

      const { result } = renderHook(() => useLoginAuthorize());

      await act(async () => {
        await result.current.submit({ credentials: {} }, 'some-token');
      });

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });
  });

  describe('useTokenExchange', () => {
    it('should use POST method', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          }),
      });

      const { result } = renderHook(() => useTokenExchange());

      await act(async () => {
        await result.current.submit({ otp: '123456' });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should call /login/token endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          }),
      });

      const { result } = renderHook(() => useTokenExchange());

      await act(async () => {
        await result.current.submit({ otp: '123456' });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/login/token',
        expect.any(Object)
      );
    });

    it('should not include Authorization header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          }),
      });

      const { result } = renderHook(() => useTokenExchange());

      await act(async () => {
        await result.current.submit({ otp: '123456' }, 'some-token');
      });

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });
  });

  describe('useJourneyConfig', () => {
    it('should use GET method', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ journeyType: 'fixed-deposit' }),
      });

      const { result } = renderHook(() => useJourneyConfig());

      await act(async () => {
        await result.current.submit(undefined, 'access-token');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should call /my/journey/config endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ journeyType: 'fixed-deposit' }),
      });

      const { result } = renderHook(() => useJourneyConfig());

      await act(async () => {
        await result.current.submit(undefined, 'access-token');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/my/journey/config',
        expect.any(Object)
      );
    });

    it('should include Authorization header with access token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ journeyType: 'fixed-deposit' }),
      });

      const { result } = renderHook(() => useJourneyConfig());

      await act(async () => {
        await result.current.submit(undefined, 'my-access-token');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-access-token',
          }),
        })
      );
    });

    it('should NOT include Authorization header without access token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ journeyType: 'fixed-deposit' }),
      });

      const { result } = renderHook(() => useJourneyConfig());

      await act(async () => {
        await result.current.submit();
      });

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });
  });
});
