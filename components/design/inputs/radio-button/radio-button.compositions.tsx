import React, { useState } from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Label } from '@api-banking/design.typography.label';
import { RadioButton } from './radio-button.js';

export const ValidationMethodSelection = () => {
  const [selectedValue, setSelectedValue] = useState('dob');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', backgroundColor: 'var(--colors-surface-primary)', width: 'fit-content', borderRadius: 'var(--borders-radius-medium)' }}>
        <Label>Validate using *</Label>
        <div style={{ display: 'flex', gap: '24px', marginTop: 'var(--spacing-small)' }}>
          <RadioButton
            id="dob"
            name="validationMethod"
            value="dob"
            label="Date of Birth"
            checked={selectedValue === 'dob'}
            onChange={handleChange}
          />
          <RadioButton
            id="pan"
            name="validationMethod"
            value="pan"
            label="PAN Number"
            checked={selectedValue === 'pan'}
            onChange={handleChange}
          />
        </div>
      </div>
    </ApiBankingTheme>
  );
};

export const DisabledRadioButtons = () => {
  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', backgroundColor: 'var(--colors-surface-primary)', width: 'fit-content', borderRadius: 'var(--borders-radius-medium)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-medium)' }}>
        <Label>Disabled States</Label>
        <RadioButton
          id="disabled-unchecked"
          name="disabled-group-1"
          value="option1"
          label="Disabled and Unchecked"
          disabled
          checked={false}
          onChange={() => {}}
        />
        <RadioButton
          id="disabled-checked"
          name="disabled-group-2"
          value="option2"
          label="Disabled and Checked"
          checked
          disabled
          onChange={() => {}}
        />
      </div>
    </ApiBankingTheme>
  );
};