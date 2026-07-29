import React from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { InputGroup } from './input-group.js';

const compositionWrapperStyle: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '400px',
  backgroundColor: 'var(--colors-surface-primary)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  borderRadius: 'var(--borders-radius-large)',
};

// --- Mobile Input Composition ---
const mobileInputContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid var(--borders-default-color, #ccc)',
  borderRadius: 'var(--borders-radius-medium, 4px)',
  backgroundColor: 'var(--colors-surface-background, white)',
};

const mobilePrefixStyle: React.CSSProperties = {
  padding: '10px 12px',
  color: 'var(--colors-text-secondary, #666)',
  borderRight: '1px solid var(--borders-default-color, #ccc)',
  fontFamily: 'var(--typography-font-family, sans-serif)',
  fontSize: 'var(--typography-sizes-body-default, 16px)',
  backgroundColor: 'var(--colors-surface-secondary)',
  borderTopLeftRadius: 'var(--borders-radius-medium, 4px)',
  borderBottomLeftRadius: 'var(--borders-radius-medium, 4px)',
};

const mobileInputStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  border: 'none',
  backgroundColor: 'transparent',
  outline: 'none',
  fontFamily: 'var(--typography-font-family, sans-serif)',
  fontSize: 'var(--typography-sizes-body-default, 16px)',
  color: 'var(--colors-text-default, black)',
};

export const MobileInputGroup = () => (
  <ApiBankingTheme>
    <div style={compositionWrapperStyle}>
      <InputGroup
        label="Mobile Number *"
        inputId="mobile-number-prefix"
        helpText="For testing purposes Mobile Number: 9876543210"
      >
        <div style={mobileInputContainerStyle}>
          <span style={mobilePrefixStyle}>+91</span>
          <input
            id="mobile-number-prefix"
            type="tel"
            style={mobileInputStyle}
            defaultValue="9876543210"
          />
        </div>
      </InputGroup>
    </div>
  </ApiBankingTheme>
);

// --- Date Input Composition ---
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const inputWithIconContainerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const inputWithIconStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 40px 10px 10px',
  border: '1px solid var(--borders-default-color, #ccc)',
  borderRadius: 'var(--borders-radius-medium, 4px)',
  fontFamily: 'var(--typography-font-family, sans-serif)',
  fontSize: 'var(--typography-sizes-body-default, 16px)',
  boxSizing: 'border-box',
  backgroundColor: 'var(--colors-surface-background, white)',
  color: 'var(--colors-text-default, black)',
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  color: 'var(--colors-text-secondary, #666)',
  pointerEvents: 'none',
};

export const DateInputGroup = () => (
  <ApiBankingTheme>
    <div style={compositionWrapperStyle}>
      <InputGroup
        label="Date of Birth *"
        inputId="dob-icon"
        helpText="For testing purposes DOB: 01/01/1990 (MM/DD/YYYY)"
      >
        <div style={inputWithIconContainerStyle}>
          <input
            id="dob-icon"
            type="text"
            style={inputWithIconStyle}
            placeholder="MM/DD/YYYY"
          />
          <span style={iconStyle}>
            <CalendarIcon />
          </span>
        </div>
      </InputGroup>
    </div>
  </ApiBankingTheme>
);

export const DateInputGroupWithError = () => (
  <ApiBankingTheme>
    <div style={compositionWrapperStyle}>
      <InputGroup
        label="Date of Birth *"
        inputId="dob-error"
        errorText="A valid date of birth is required."
      >
        <div style={inputWithIconContainerStyle}>
          <input
            id="dob-error"
            type="text"
            style={{
              ...inputWithIconStyle,
              borderColor: 'var(--colors-status-negative-default)',
            }}
            placeholder="MM/DD/YYYY"
            defaultValue="invalid-date"
          />
          <span style={iconStyle}>
            <CalendarIcon />
          </span>
        </div>
      </InputGroup>
    </div>
  </ApiBankingTheme>
);