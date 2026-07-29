import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Link } from './link.js';

const compositionWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-medium)',
  padding: 'var(--spacing-large)',
  alignItems: 'flex-start',
  fontFamily: 'var(--typography-font-family)',
  color: 'var(--colors-text-primary)',
  backgroundColor: 'var(--colors-surface-background)',
  minHeight: '150px',
};

const textStyle: React.CSSProperties = {
  fontSize: 'var(--typography-sizes-body-default)',
};

export const LinkVariations = () => {
  return (
    <ApiBankingTheme>
      <MemoryRouter>
        <div style={compositionWrapperStyle}>
          <h4>Default Internal Link</h4>
          <Link href="/home">Navigate to Home</Link>

          <h4>External Link</h4>
          <Link
            href="https://pixabay.com/get/ge3c3c47564bdaa30b8abc2a26dedc7ab86098332e9e1cce62dc380b45704baa06d031fe7e8f22452f3ae085ec102e017cbf2f816e0475edafb34c1d892375f15_1280.jpg"
            external
            target="_blank"
          >
            View Document (opens in new tab)
          </Link>

          <h4>Link without default styles</h4>
          <Link href="/unstyled" noStyles>
            Unstyled Link
          </Link>
        </div>
      </MemoryRouter>
    </ApiBankingTheme>
  );
};

export const DisabledLink = () => {
  return (
    <ApiBankingTheme>
      <MemoryRouter>
        <div style={compositionWrapperStyle}>
          <h4>Disabled Link</h4>
          <Link href="/this-wont-navigate" disabled>
            This is a disabled link
          </Link>
        </div>
      </MemoryRouter>
    </ApiBankingTheme>
  );
};

export const InlineTextLink = () => {
  return (
    <ApiBankingTheme>
      <MemoryRouter>
        <div style={compositionWrapperStyle}>
          <h4>Link within text (as seen in Login flow)</h4>
          <p style={textStyle}>
            For full details read our{' '}
            <Link href="/terms-and-conditions">Terms and Conditions</Link> and{' '}
            <Link href="/privacy-policy">Privacy Policy</Link>.
          </p>
        </div>
      </MemoryRouter>
    </ApiBankingTheme>
  );
};