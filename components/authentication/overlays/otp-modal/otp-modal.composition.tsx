import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { OtpModal } from './otp-modal.js';

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          otp: {
            title: 'Enter OTP',
            sentToPhone: 'OTP has been sent to {{phoneNumber}}',
            sentToDevice: 'OTP has been sent to your registered device',
            testingHint: 'For testing purposes, please use OTP: {{otp}}',
            submit: 'Submit',
            verifying: 'Verifying...',
          },
        },
      },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '500px',
  backgroundColor: 'var(--colors-surface-background)',
  position: 'relative',
};

const triggerButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: 'var(--borders-radius-medium)',
  cursor: 'pointer',
  fontFamily: 'var(--typography-font-family)',
  fontSize: 'var(--typography-sizes-body-default)',
  backgroundColor: 'var(--colors-primary-default)',
  color: 'var(--colors-text-inverse)',
  fontWeight: 'var(--typography-font-weight-medium)',
};

/**
 * A basic composition that displays the OTP modal in its default open state.
 * This is useful for quickly viewing the component's appearance.
 */
export const BasicOtpModal = () => {
  return (
    <MemoryRouter>
      <ApiBankingTheme>
        <div style={containerStyle}>
          <OtpModal
            isOpen={true}
            onClose={() => console.log('Close requested')}
            phoneNumber="xxxx3210"
            onOtpSubmit={(otp) => alert(`OTP Submitted: ${otp}`)}
          />
        </div>
      </ApiBankingTheme>
    </MemoryRouter>
  );
};

/**
 * An interactive composition demonstrating the full open/close and submit flow of the OTP modal.
 */
export const InteractiveOtpModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (otp: string) => {
    alert(`OTP Submitted: ${otp}`);
    setIsOpen(false);
  };

  return (
    <MemoryRouter>
      <ApiBankingTheme>
        <div style={containerStyle}>
          <button style={triggerButtonStyle} onClick={() => setIsOpen(true)}>
            Show OTP Modal
          </button>
          <OtpModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            phoneNumber="xxxx3210"
            onOtpSubmit={handleSubmit}
          />
        </div>
      </ApiBankingTheme>
    </MemoryRouter>
  );
};