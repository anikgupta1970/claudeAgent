import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { StitchClientProvider } from '@api-banking/stitch.stitch-client';
import { FixedDepositFlowApp } from './fixed-deposit-flow-app.js';

/**
 * Renders the complete authentication flow application.
 * This composition allows for a full interactive walkthrough of the login process,
 * from entering customer details to OTP verification.
 */
export const FixedDepositFlowAppFlow = () => {
  return (
    <MemoryRouter>
      <StitchClientProvider>
        <ApiBankingTheme>
          <FixedDepositFlowApp />
        </ApiBankingTheme>
      </StitchClientProvider>
    </MemoryRouter>
  );
};