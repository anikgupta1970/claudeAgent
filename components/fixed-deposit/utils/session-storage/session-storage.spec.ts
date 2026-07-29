import {
  STORAGE_KEYS,
  saveFormData,
  getFormData,
  clearFormData,
  saveCurrentStep,
  getCurrentStep,
  saveAccessToken,
  getAccessToken,
  isExpired,
  clearAll,
  hasStoredSession,
} from './session-storage.js';

describe('session-storage', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  describe('saveFormData and getFormData', () => {
    it('should save and retrieve form data', () => {
      const testData = { depositDetails: { amount: '10000' }, bankDetails: { branch: 'test' } };
      expect(saveFormData(testData)).toBe(true);
      expect(getFormData()).toEqual(testData);
    });

    it('should return null when no data is stored', () => {
      expect(getFormData()).toBeNull();
    });
  });

  describe('clearFormData', () => {
    it('should clear stored form data', () => {
      saveFormData({ test: 'data' });
      clearFormData();
      expect(getFormData()).toBeNull();
    });
  });

  describe('saveCurrentStep and getCurrentStep', () => {
    it('should save and retrieve current step', () => {
      expect(saveCurrentStep(2)).toBe(true);
      expect(getCurrentStep()).toBe(2);
    });

    it('should return null when no step is stored', () => {
      expect(getCurrentStep()).toBeNull();
    });
  });

  describe('saveAccessToken and getAccessToken', () => {
    it('should save and retrieve access token', () => {
      const token = 'test-token-123';
      expect(saveAccessToken(token)).toBe(true);
      expect(getAccessToken()).toBe(token);
    });

    it('should return null when no token is stored', () => {
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('isExpired', () => {
    it('should return true when no timestamp exists', () => {
      expect(isExpired()).toBe(true);
    });

    it('should return false for fresh session', () => {
      saveFormData({ test: 'data' });
      expect(isExpired()).toBe(false);
    });

    it('should return true for expired session', () => {
      // Manually set an old timestamp (2 hours ago)
      const oldTime = Date.now() - 2 * 60 * 60 * 1000;
      sessionStorage.setItem(STORAGE_KEYS.TIMESTAMP, oldTime.toString());
      expect(isExpired()).toBe(true);
    });
  });

  describe('clearAll', () => {
    it('should clear all storage keys', () => {
      saveFormData({ test: 'data' });
      saveCurrentStep(3);
      saveAccessToken('token');
      clearAll();
      expect(getFormData()).toBeNull();
      expect(getCurrentStep()).toBeNull();
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('hasStoredSession', () => {
    it('should return false when no data exists', () => {
      expect(hasStoredSession()).toBe(false);
    });

    it('should return true when valid form data exists', () => {
      saveFormData({ test: 'data' });
      expect(hasStoredSession()).toBe(true);
    });

    it('should return true when valid step exists (step > 0)', () => {
      // Save a step > 0 and a timestamp (to avoid expiry)
      saveCurrentStep(2);
      expect(hasStoredSession()).toBe(true);
    });

    it('should return false when only step 0 exists', () => {
      saveCurrentStep(0);
      expect(hasStoredSession()).toBe(false);
    });

    it('should return false when session is expired', () => {
      saveFormData({ test: 'data' });
      // Set old timestamp
      const oldTime = Date.now() - 2 * 60 * 60 * 1000;
      sessionStorage.setItem(STORAGE_KEYS.TIMESTAMP, oldTime.toString());
      expect(hasStoredSession()).toBe(false);
    });

    it('should return false for empty form data', () => {
      saveFormData({});
      expect(hasStoredSession()).toBe(false);
    });
  });
});
