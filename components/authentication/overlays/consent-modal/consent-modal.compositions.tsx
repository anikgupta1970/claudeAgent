import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Button } from '@api-banking/design.actions.button';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ConsentModal } from './consent-modal.js';

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          common: {
            consentDetails: 'Consent Details',
            summary: 'Summary',
            viewDocument: 'View document',
            cancel: 'Cancel',
            accept: 'Accept',
          },
        },
      },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export const BasicConsentModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleAgree = () => {
    alert('User Agreed');
    setIsOpen(false);
  };

  const handleDisagree = () => {
    alert('User Disagreed/Cancelled');
    setIsOpen(false);
  };

  return (
    <MemoryRouter>
      <ApiBankingTheme>
        <div
          style={{
            padding: 'var(--spacing-xl)',
            minHeight: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--colors-surface-background)',
          }}
        >
          {!isOpen && (
            <Button onClick={() => setIsOpen(true)} appearance="primary">
              Show Consent Modal
            </Button>
          )}
          <ConsentModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Consent Details"
            summary="I/we have read, understood, and hereby accept the Privacy Policy."
            documentLink="https://pixabay.com/get/g3a7f6207282de90657451b124fc932ae604ab96df73e6f18739d0769cd097169d977ffaa5860eb3c14401873b0051ce5b096a99e1028a66294faaeb0bd55509f_1280.jpg"
            onAgree={handleAgree}
            onDisagree={handleDisagree}
          />
        </div>
      </ApiBankingTheme>
    </MemoryRouter>
  );
};

export const AnotherConsentModalExample = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <MemoryRouter>
      <ApiBankingTheme>
        <div
          style={{
            padding: 'var(--spacing-xl)',
            minHeight: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--colors-surface-background)',
          }}
        >
          {!isOpen && (
            <Button onClick={() => setIsOpen(true)} appearance="primary">
              Show Data Processing Modal
            </Button>
          )}
          <ConsentModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Data Processing Agreement"
            summary={
              <span>
                By clicking 'Accept', you agree to our updated Terms of Service.
                This includes our policies on data collection, usage, and
                sharing with third-party partners for service improvement and
                marketing purposes.
              </span>
            }
            documentLink="https://pixabay.com/get/g67ba1d7f9f8e9708900e0ac77ef075cb4d0a74fe38ca0ce4f158c3fb51069d7d6c32e83ac97ffdc8cb7656d48a1adeb33fe280257cabb1ac9ce78bf2f401326d_1280.jpg"
            onAgree={() => {
              alert('Agreed!');
              setIsOpen(false);
            }}
            onDisagree={() => {
              alert('Cancelled!');
              setIsOpen(false);
            }}
          />
        </div>
      </ApiBankingTheme>
    </MemoryRouter>
  );
};