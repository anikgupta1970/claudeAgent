import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import React, { useState } from 'react';
import { TextInput } from './text-input.js';

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
  </svg>
);

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

export const BasicTextInput = () => {
  const [value, setValue] = useState('');
  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <TextInput
          id="basic-text-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter your details"
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};

export const InputWithStates = () => {
  const [errorValue, setErrorValue] = useState('invalid.email@domain.com');

  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <TextInput
          id="error-input"
          value={errorValue}
          onChange={(e) => setErrorValue(e.target.value)}
          placeholder="Error state"
          error
        />
        <TextInput
          id="disabled-input"
          value="Cannot be edited"
          onChange={() => {}}
          placeholder="Disabled"
          disabled
        />
        <TextInput
          id="password-input"
          value="password123"
          onChange={() => {}}
          type="password"
          placeholder="Password"
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};

export const InputsWithAdornments = () => {
  const [mobileValue, setMobileValue] = useState('9876543210');
  const [dobValue, setDobValue] = useState('');

  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <TextInput
          id="mobile-number"
          name="mobile"
          type="tel"
          value={mobileValue}
          onChange={(e) => setMobileValue(e.target.value)}
          leftAdornment="+91"
          placeholder="Mobile Number"
        />
        <TextInput
          id="date-of-birth"
          name="dob"
          value={dobValue}
          onChange={(e) => setDobValue(e.target.value)}
          placeholder="MM/DD/YYYY"
          rightAdornment={<CalendarIcon />}
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};