import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import React, { useState } from 'react';
import { Select } from './select.js';

const CompositionWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '20px',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      backgroundColor: 'var(--colors-surface-background)',
    }}
  >
    {children}
  </div>
);

const maturityOptions = [
  { value: 'DO_NOT_RENEW', label: 'Do Not Renew' },
  { value: 'RENEW_PRINCIPAL', label: 'Renew Principal' },
  { value: 'RENEW_PRINCIPAL_AND_INTEREST', label: 'Renew Principal and Interest' },
];

const relationshipOptions = [
  { value: 'daughter', label: 'Daughter' },
  { value: 'partner', label: 'Partner' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'son', label: 'Son' },
  { value: 'spouse', label: 'Spouse' },
];

export const BasicSelect = () => {
  const [value, setValue] = useState('');
  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <Select
          id="basic-select"
          value={value}
          onChange={setValue}
          options={maturityOptions}
          placeholder="Select maturity instruction"
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};

export const SelectWithValue = () => {
  const [value, setValue] = useState('RENEW_PRINCIPAL');
  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <Select
          id="select-with-value"
          value={value}
          onChange={setValue}
          options={maturityOptions}
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};

export const SelectWithStates = () => {
  const [errorValue, setErrorValue] = useState('');

  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <Select
          id="error-select"
          value={errorValue}
          onChange={setErrorValue}
          options={relationshipOptions}
          placeholder="Error state"
          error
        />
        <Select
          id="disabled-select"
          value="spouse"
          onChange={() => {}}
          options={relationshipOptions}
          disabled
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};
