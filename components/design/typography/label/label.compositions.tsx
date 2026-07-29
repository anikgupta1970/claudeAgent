import React from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Label } from './label.js';

const formElementStyles: React.CSSProperties = {
  display: 'block',
  width: '100%',
  maxWidth: '300px',
  padding: '10px',
  marginTop: '4px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontFamily: 'sans-serif',
};

const wrapperStyles: React.CSSProperties = {
  padding: '20px',
};

export const LabelForMobileNumber = () => (
  <ApiBankingTheme>
    <div style={wrapperStyles}>
      <Label htmlFor="mobile-number">Mobile Number *</Label>
      <input
        id="mobile-number"
        type="tel"
        style={formElementStyles}
        placeholder="9876543210"
      />
    </div>
  </ApiBankingTheme>
);

export const LabelForValidationMethod = () => (
  <ApiBankingTheme>
    <div style={wrapperStyles}>
      <Label>Validate using *</Label>
      <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'sans-serif',
          }}
        >
          <input type="radio" name="validation" value="dob" defaultChecked />
          Date of Birth
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'sans-serif',
          }}
        >
          <input type="radio" name="validation" value="pan" />
          PAN Number
        </label>
      </div>
    </div>
  </ApiBankingTheme>
);

export const LabelForDateOfBirth = () => (
  <ApiBankingTheme>
    <div style={wrapperStyles}>
      <Label htmlFor="dob">Date of Birth *</Label>
      <input
        id="dob"
        type="text"
        style={formElementStyles}
        placeholder="MM/DD/YYYY"
      />
    </div>
  </ApiBankingTheme>
);