import React, { useState } from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Checkbox } from './checkbox.js';

const CompositionWrapper = ({
  children,
  width = '450px',
}: {
  children: React.ReactNode;
  width?: string;
}) => (
  <div
    style={{
      padding: 'var(--spacing-large)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-large)',
      backgroundColor: 'var(--colors-surface-background)',
      width,
      borderRadius: 'var(--borders-radius-medium)',
      border: '1px solid var(--colors-surface-secondary)',
    }}
  >
    {children}
  </div>
);

export const CheckboxStates = () => (
  <ApiBankingTheme>
    <CompositionWrapper>
      <Checkbox id="default-unchecked" label="Default Unchecked" />
      <Checkbox id="default-checked" checked label="Default Checked" />
      <Checkbox id="disabled-unchecked" disabled label="Disabled Unchecked" />
      <Checkbox id="disabled-checked" checked disabled label="Disabled Checked" />
    </CompositionWrapper>
  </ApiBankingTheme>
);

export const InteractiveConsentCheckboxes = () => {
  const [isPolicyAccepted, setPolicyAccepted] = useState(false);
  const [isProductsConsented, setProductsConsented] = useState(false);

  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <Checkbox
          id="privacy-policy"
          checked={isPolicyAccepted}
          onChange={(e) => setPolicyAccepted(e.target.checked)}
          label="I/we have read, understood, and hereby accept the Privacy Policy of the bank."
        />
        <Checkbox
          id="requested-products"
          checked={isProductsConsented}
          onChange={(e) => setProductsConsented(e.target.checked)}
          label="I/we hereby give consent (V.1.0) in relation to Requested Products"
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};

export const CheckboxWithRichLabel = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleLinkClick = (e: React.MouseEvent) => {
    // Prevent the checkbox from toggling when the link is clicked
    e.stopPropagation();
    // In a real app, this would navigate. Here, we'll just alert.
    alert('Navigating to Terms and Conditions...');
  };

  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <Checkbox
          id="terms-agreement"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          label={
            <span>
              I agree to the{' '}
              <a
                href="#"
                onClick={handleLinkClick}
                style={{
                  color: 'var(--colors-text-primary)',
                  textDecoration: 'underline',
                }}
              >
                Terms and Conditions
              </a>
              .
            </span>
          }
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};