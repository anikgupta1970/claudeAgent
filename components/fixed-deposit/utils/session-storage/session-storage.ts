// Session storage utility for Fixed Deposit journey
// Uses sessionStorage (tab-scoped, clears on close for banking security)
// Falls back to in-memory Map when sessionStorage is unavailable (e.g., cross-origin iframes)

export const STORAGE_KEYS = {
  FORM_DATA: 'fd_form_data',
  CURRENT_STEP: 'fd_current_step',
  ACCESS_TOKEN: 'fd_access_token', // Fallback if cookies disabled
  CUSTOMER_ID: 'fd_customer_id',
  REFRESH_TOKEN: 'fd_refresh_token',
  TIMESTAMP: 'fd_timestamp',
} as const;

// Session expiry time in milliseconds (1 hour to match token expiry)
const SESSION_EXPIRY_MS = 60 * 60 * 1000;

export interface StoredFormData {
  [key: string]: unknown;
}

// In-memory fallback when sessionStorage is blocked (cross-origin iframes, Safari ITP)
const memoryStore = new Map<string, string>();

let _isSessionStorageAvailable: boolean | null = null;

function isSessionStorageAvailable(): boolean {
  if (_isSessionStorageAvailable !== null) return _isSessionStorageAvailable;
  try {
    const testKey = '__storage_test__';
    window.sessionStorage.setItem(testKey, testKey);
    window.sessionStorage.removeItem(testKey);
    _isSessionStorageAvailable = true;
    return true;
  } catch {
    _isSessionStorageAvailable = false;
    return false;
  }
}

function storageGetItem(key: string): string | null {
  if (isSessionStorageAvailable()) {
    return sessionStorage.getItem(key);
  }
  return memoryStore.get(key) ?? null;
}

function storageSetItem(key: string, value: string): void {
  if (isSessionStorageAvailable()) {
    sessionStorage.setItem(key, value);
  } else {
    memoryStore.set(key, value);
  }
}

function storageRemoveItem(key: string): void {
  if (isSessionStorageAvailable()) {
    sessionStorage.removeItem(key);
  } else {
    memoryStore.delete(key);
  }
}

export function saveFormData(data: StoredFormData): boolean {
  try {
    storageSetItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(data));
    storageSetItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
    return true;
  } catch {
    return false;
  }
}

export function getFormData(): StoredFormData | null {
  try {
    const data = storageGetItem(STORAGE_KEYS.FORM_DATA);
    if (!data) return null;
    return JSON.parse(data) as StoredFormData;
  } catch {
    return null;
  }
}

export function clearFormData(): void {
  storageRemoveItem(STORAGE_KEYS.FORM_DATA);
  storageRemoveItem(STORAGE_KEYS.TIMESTAMP);
}

export function saveCurrentStep(step: number): boolean {
  try {
    storageSetItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
    storageSetItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
    return true;
  } catch {
    return false;
  }
}

export function getCurrentStep(): number | null {
  try {
    const step = storageGetItem(STORAGE_KEYS.CURRENT_STEP);
    if (!step) return null;
    const parsed = parseInt(step, 10);
    return Number.isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

export function saveAccessToken(token: string): boolean {
  try {
    storageSetItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    storageSetItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
    return true;
  } catch {
    return false;
  }
}

export function getAccessToken(): string | null {
  try {
    return storageGetItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
}

export function saveCustomerId(id: string): boolean {
  try {
    storageSetItem(STORAGE_KEYS.CUSTOMER_ID, id);
    storageSetItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
    return true;
  } catch {
    return false;
  }
}

export function getCustomerId(): string | null {
  try {
    return storageGetItem(STORAGE_KEYS.CUSTOMER_ID);
  } catch {
    return null;
  }
}

export function saveRefreshToken(token: string): boolean {
  try {
    storageSetItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    storageSetItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
    return true;
  } catch {
    return false;
  }
}

export function getRefreshToken(): string | null {
  try {
    return storageGetItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    return null;
  }
}

export function isExpired(): boolean {
  try {
    const timestamp = storageGetItem(STORAGE_KEYS.TIMESTAMP);
    if (!timestamp) return true;

    const savedTime = parseInt(timestamp, 10);
    if (Number.isNaN(savedTime)) return true;

    return Date.now() - savedTime > SESSION_EXPIRY_MS;
  } catch {
    return true;
  }
}

export function clearAll(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    storageRemoveItem(key);
  });
}

export function hasStoredSession(): boolean {
  if (isExpired()) return false;

  // Check if there's either saved form data or a saved step > 0
  const formData = getFormData();
  const step = getCurrentStep();

  const hasFormData = formData !== null && Object.keys(formData).length > 0;
  const hasStep = step !== null && step > 0;

  return hasFormData || hasStep;
}
