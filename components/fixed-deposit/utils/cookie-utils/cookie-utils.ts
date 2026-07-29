// Cookie utility for Fixed Deposit journey
// Handles httpOnly cookie reading (where accessible) and client-side cookie management

export const COOKIE_NAMES = {
  SESSION_ID: 'fd_session_id',
  ACCESS_TOKEN: 'fd_access_token',
} as const;

export interface CookieOptions {
  maxAge?: number; // in seconds
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const DEFAULT_OPTIONS: CookieOptions = {
  path: '/',
  sameSite: 'strict',
  secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
};

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const found = cookies.find((cookie) => {
    const [cookieName] = cookie.split('=');
    return cookieName.trim() === name;
  });
  if (found) {
    const [, ...cookieValueParts] = found.split('=');
    return decodeURIComponent(cookieValueParts.join('='));
  }
  return null;
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return;

  const opts = { ...DEFAULT_OPTIONS, ...options };
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.maxAge !== undefined) {
    cookie += `; max-age=${opts.maxAge}`;
  }

  if (opts.expires) {
    cookie += `; expires=${opts.expires.toUTCString()}`;
  }

  if (opts.path) {
    cookie += `; path=${opts.path}`;
  }

  if (opts.domain) {
    cookie += `; domain=${opts.domain}`;
  }

  if (opts.secure) {
    cookie += '; secure';
  }

  if (opts.sameSite) {
    cookie += `; samesite=${opts.sameSite}`;
  }

  document.cookie = cookie;
}

export function deleteCookie(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
  setCookie(name, '', {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  });
}

export function clearAllCookies(): void {
  Object.values(COOKIE_NAMES).forEach((name) => {
    deleteCookie(name);
  });
}

export function hasSessionCookie(): boolean {
  return getCookie(COOKIE_NAMES.SESSION_ID) !== null;
}

export function hasAccessTokenCookie(): boolean {
  return getCookie(COOKIE_NAMES.ACCESS_TOKEN) !== null;
}
