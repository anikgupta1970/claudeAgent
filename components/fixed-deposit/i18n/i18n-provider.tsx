import React, { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18n, SUPPORTED_LANGUAGES } from './i18n.js';

export type I18nProviderProps = {
  backendUrl: string;
  children: React.ReactNode;
};

export function I18nProvider({ backendUrl, children }: I18nProviderProps) {
  const i18nInstance = useMemo(() => initI18n(backendUrl), [backendUrl]);

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
}

export { SUPPORTED_LANGUAGES };
