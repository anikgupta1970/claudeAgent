import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CtaButton } from './cta-button.js';

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--spacing-large)',
  padding: 'var(--spacing-large)',
  alignItems: 'center',
  backgroundColor: 'var(--colors-surface-background)',
};

/**
 * Showcases the different visual appearances of the CTA button.
 * - `primary`: The main, attention-grabbing style for critical actions like 'Continue' or 'Submit'.
 * - `secondary` & `tertiary`: Passthrough styles from the base button for other actions.
 * - `href`: Demonstrates the button rendered as a link.
 */
export const CtaButtonAppearances = () => (
  <ApiBankingTheme>
    <MemoryRouter>
      <div style={wrapperStyle}>
        <CtaButton appearance="primary" onClick={() => alert('Submit Clicked')}>
          Submit
        </CtaButton>
        <CtaButton
          appearance="secondary"
          onClick={() => alert('Accept Clicked')}
        >
          Accept
        </CtaButton>
        <CtaButton
          appearance="tertiary"
          onClick={() => alert('Cancel Clicked')}
        >
          Cancel
        </CtaButton>
        <CtaButton appearance="primary" href="/terms" external>
          Read Terms
        </CtaButton>
      </div>
    </MemoryRouter>
  </ApiBankingTheme>
);

/**
 * Demonstrates the button's disabled state across all appearances.
 */
export const DisabledCtaButtons = () => (
  <ApiBankingTheme>
    <div style={wrapperStyle}>
      <CtaButton appearance="primary" disabled>
        Submit
      </CtaButton>
      <CtaButton appearance="secondary" disabled>
        Accept
      </CtaButton>
      <CtaButton appearance="tertiary" disabled>
        Cancel
      </CtaButton>
    </div>
  </ApiBankingTheme>
);

/**
 * A realistic use case mimicking the primary action button from the login flow.
 * The button is styled to be full-width within its container, as seen in the reference designs.
 */
export const LoginAction = () => (
  <ApiBankingTheme>
    <div
      style={{
        backgroundColor: 'var(--colors-surface-primary)',
        borderRadius: 'var(--borders-radius-large)',
        maxWidth: '420px',
        padding: 'var(--spacing-xl)',
        boxShadow: 'var(--effects-shadows-large)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-medium)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--typography-font-family)',
          fontSize: 'var(--typography-sizes-heading-h3)',
          fontWeight: 'var(--typography-font-weight-bold)',
          margin: '0 0 var(--spacing-medium) 0',
          textAlign: 'left',
        }}
      >
        Login
      </h2>
      <p
        style={{
          fontFamily: 'var(--typography-font-family)',
          color: 'var(--colors-text-secondary)',
          textAlign: 'left',
          margin: '0 0 var(--spacing-large) 0',
        }}
      >
        Once all details are filled and consents are accepted, you may continue.
      </p>
      <CtaButton
        appearance="primary"
        style={{ width: '100%' }}
        onClick={() => alert('Continuing to OTP verification...')}
      >
        Continue
      </CtaButton>
    </div>
  </ApiBankingTheme>
);