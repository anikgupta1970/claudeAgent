import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import { FixedDepositFlowApp } from './fixed-deposit-flow-app.js';

setupTestI18n(en);

// Mock I18nProvider to use global i18next (initialized by setupTestI18n)
// instead of creating a new instance that fetches from a backend URL
vi.mock('@api-banking/fixed-deposit.i18n', async () => {
  const actual = await vi.importActual('@api-banking/fixed-deposit.i18n');
  return {
    ...actual,
    I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('FixedDepositFlowApp', () => {
  it('renders LoginPage initially', async () => {
    render(
      <MemoryRouter>
        <FixedDepositFlowApp />
      </MemoryRouter>
    );
    // Credentials mode is 'mobile_dob_pan', which shows mobile + radio toggle (DOB selected by default)
    expect(await screen.findByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(await screen.findByText(/Verify using/i)).toBeInTheDocument();
    expect(await screen.findByLabelText('Date Picker')).toBeInTheDocument();
  });
});