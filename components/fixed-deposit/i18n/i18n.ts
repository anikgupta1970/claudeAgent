import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { en } from '@api-banking/fixed-deposit.language-packs';

export const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'ma', label: 'मराठी' },
];

export function initI18n(backendUrl: string) {
  const instance = i18next.createInstance();

  instance
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      supportedLngs: ['en', 'hi', 'gu', 'ma'],
      partialBundledLanguages: true,
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: { translation: en },
      },
      backend: {
        loadPath: `${backendUrl}/translations/{{lng}}`,
      },
      react: {
        useSuspense: false,
      },
    });

  return instance;
}
