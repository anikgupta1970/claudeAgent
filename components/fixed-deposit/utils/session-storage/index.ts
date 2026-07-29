export {
  STORAGE_KEYS,
  saveFormData,
  getFormData,
  clearFormData,
  saveCurrentStep,
  getCurrentStep,
  saveAccessToken,
  getAccessToken,
  saveCustomerId,
  getCustomerId,
  saveRefreshToken,
  getRefreshToken,
  isExpired,
  clearAll,
  hasStoredSession,
} from './session-storage.js';
export type { StoredFormData } from './session-storage.js';
