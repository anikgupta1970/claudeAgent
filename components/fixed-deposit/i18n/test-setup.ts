import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

let initialized = false;

// Initialize i18next for tests with the provided translations.
// Call this at the top of spec files that test translated components.
export function setupTestI18n(translations?: Record<string, unknown>) {
  if (initialized) return;
  initialized = true;
  i18next
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      resources: translations ? {
        en: {
          translation: translations,
        },
      } : undefined,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}
