import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Login } from './login.js';

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          step1: {
            title: 'Open Fixed Deposit',
            customerDetails: 'Customer Details',
            mobileNumber: 'Mobile Number',
            mobileHelpText: 'For testing purposes Mobile Number: 9876543210',
            dateOfBirth: 'Date of Birth',
            dobHelpText: 'For testing purposes DOB: 01/01/1990 (MM/DD/YYYY)',
            dobPlaceholder: 'MM/DD/YYYY',
            pan: 'PAN Number',
            panPlaceholder: 'e.g. ABCDE1234F',
            panHelpText: 'Enter your 10-character PAN number.',
            verifyUsing: 'Verify using',
            debitCardNumber: 'Debit Card Number',
            debitCardPlaceholder: '1234 5678 9012 3456',
            debitCardHelpText: 'Enter your 16-digit debit card number.',
            ucic: 'UCIC',
            ucicPlaceholder: 'e.g. 1234567890',
            ucicHelpText: 'Enter your UCIC',
            password: 'Password',
            passwordPlaceholder: 'Enter password',
            passwordHelpText: 'Enter your password',
            loading: 'Loading...',
            termsText: 'For full details read our',
            termsLink: 'Terms and Conditions',
            privacyLink: 'Privacy Policy',
            continue: 'Continue',
            processing: 'Processing...',
            errors: {
              validMobileRequired: 'Valid mobile number required',
              dobRequired: 'DOB required',
              panRequired: 'PAN required',
              debitCardRequired: 'Debit card number required',
              ucicRequired: 'UCIC required',
              passwordRequired: 'Password required',
            },
          },
          common: {
            consentDetails: 'Consent Details',
            summary: 'Summary',
            viewDocument: 'View document',
            cancel: 'Cancel',
            accept: 'Accept',
            and: 'and',
          },
        },
      },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export const InteractiveLogin = () => {
  return (
    <MemoryRouter>
      <ApiBankingTheme>
        <Login
          onContinue={(data) => {
            alert(
              `Continue button clicked!\n\n` +
                `Form Data:\n${
                JSON.stringify(data, null, 2)}`
            );
          }}
        />
      </ApiBankingTheme>
    </MemoryRouter>
  );
};

export const LoginWithDobPanToggle = () => {
  return (
    <MemoryRouter>
      <ApiBankingTheme>
        <Login
          credentials="mobile_dob_pan"
          onContinue={(data) => {
            alert(
              `Continue button clicked!\n\n` +
                `Form Data:\n${
                JSON.stringify(data, null, 2)}`
            );
          }}
        />
      </ApiBankingTheme>
    </MemoryRouter>
  );
};