import {
  COOKIE_NAMES,
  getCookie,
  setCookie,
  deleteCookie,
  clearAllCookies,
  hasSessionCookie,
  hasAccessTokenCookie,
} from './cookie-utils.js';

describe('cookie-utils', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  });

  describe('setCookie and getCookie', () => {
    it('should set and get a cookie', () => {
      setCookie('test_cookie', 'test_value');
      expect(getCookie('test_cookie')).toBe('test_value');
    });

    it('should return null for non-existent cookie', () => {
      expect(getCookie('non_existent')).toBeNull();
    });

    it('should handle special characters in value', () => {
      setCookie('special', 'value=with;special&chars');
      expect(getCookie('special')).toBe('value=with;special&chars');
    });
  });

  describe('deleteCookie', () => {
    it('should delete an existing cookie', () => {
      setCookie('to_delete', 'value');
      expect(getCookie('to_delete')).toBe('value');
      deleteCookie('to_delete');
      expect(getCookie('to_delete')).toBeNull();
    });
  });

  describe('clearAllCookies', () => {
    it('should clear all FD-related cookies', () => {
      setCookie(COOKIE_NAMES.SESSION_ID, 'session123');
      setCookie(COOKIE_NAMES.ACCESS_TOKEN, 'token456');
      clearAllCookies();
      expect(getCookie(COOKIE_NAMES.SESSION_ID)).toBeNull();
      expect(getCookie(COOKIE_NAMES.ACCESS_TOKEN)).toBeNull();
    });
  });

  describe('hasSessionCookie', () => {
    it('should return false when no session cookie exists', () => {
      expect(hasSessionCookie()).toBe(false);
    });

    it('should return true when session cookie exists', () => {
      setCookie(COOKIE_NAMES.SESSION_ID, 'session123');
      expect(hasSessionCookie()).toBe(true);
    });
  });

  describe('hasAccessTokenCookie', () => {
    it('should return false when no access token cookie exists', () => {
      expect(hasAccessTokenCookie()).toBe(false);
    });

    it('should return true when access token cookie exists', () => {
      setCookie(COOKIE_NAMES.ACCESS_TOKEN, 'token123');
      expect(hasAccessTokenCookie()).toBe(true);
    });
  });
});
