import React from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Heading } from './heading.js';

export const AllHeadingLevels = () => (
  <ApiBankingTheme>
    <div style={{ padding: 'var(--spacing-large)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-medium)' }}>
      <Heading level={1}>Login</Heading>
      <Heading level={2}>Customer Details</Heading>
      <Heading level={3}>Validate using</Heading>
      <Heading level={4}>Terms and Conditions</Heading>
      <Heading level={5}>For testing purposes</Heading>
      <Heading level={6}>Please read the full details below</Heading>
    </div>
  </ApiBankingTheme>
);

export const VisualLevelOverride = () => (
  <ApiBankingTheme>
    <div style={{ padding: 'var(--spacing-large)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-small)' }}>
      <Heading level={1} visualLevel="h3">
        Page Title (H1 Tag, H3 Style)
      </Heading>
      <p style={{ fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-secondary)', margin: '0 0 var(--spacing-large) 0' }}>
        This is a semantic H1, important for accessibility and SEO, but visually styled as an H3 to match the design hierarchy.
      </p>
      <Heading level={3}>
        Section Title (H3 Tag, H3 Style)
      </Heading>
      <p style={{ fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-secondary)', margin: 0 }}>
        This is a standard H3 for visual comparison.
      </p>
    </div>
  </ApiBankingTheme>
);

export const InverseColorHeading = () => (
  <ApiBankingTheme>
    <div
      style={{
        backgroundColor: 'var(--colors-primary-default)',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--borders-radius-large)',
        maxWidth: '600px',
      }}
    >
      <Heading level={2} inverseColor>
        Enter OTP
      </Heading>
      <p style={{ fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-inverse)' }}>
        This heading uses the `inverseColor` prop for high contrast and readability on dark, branded backgrounds.
      </p>
    </div>
  </ApiBankingTheme>
);