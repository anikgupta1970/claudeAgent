import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Button } from './button.js';

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--spacing-large)',
  padding: 'var(--spacing-large)',
  alignItems: 'center',
  backgroundColor: 'var(--colors-surface-background)',
};

/**
 * Showcases the different visual appearances of the button, relevant to a login flow.
 */
export const ButtonVariations = () => (
  <ApiBankingTheme>
    <div style={wrapperStyle}>
      <Button appearance="primary" onClick={() => alert('Primary clicked')}>
        Continue
      </Button>
      <Button appearance="secondary" onClick={() => alert('Secondary clicked')}>
        Accept
      </Button>
      <Button appearance="tertiary" onClick={() => alert('Tertiary clicked')}>
        Cancel
      </Button>
    </div>
  </ApiBankingTheme>
);

/**
 * Demonstrates the button's disabled state across all appearances.
 */
export const DisabledButtons = () => (
  <ApiBankingTheme>
    <div style={wrapperStyle}>
      <Button appearance="primary" disabled>
        Continue
      </Button>
      <Button appearance="secondary" disabled>
        Accept
      </Button>
      <Button appearance="tertiary" disabled>
        Cancel
      </Button>
    </div>
  </ApiBankingTheme>
);

/**
 * Demonstrates how the button can be rendered as a link for navigation.
 */
export const LinkAsButton = () => (
  <ApiBankingTheme>
    <MemoryRouter>
      <div style={wrapperStyle}>
        <Button href="/terms-and-conditions" appearance="primary">
          Read Terms
        </Button>
        <Button
          href="https://pixabay.com/get/g49b75d6205601694f493b0b1e3f627023f38f0c3fb25876c332e98de7b8df3c9903dec9a3d38c8dbf1d6cc6963972a10d259b7d9d3f1fb2001ae97f22fb7e365_1280.jpg"
          external
          appearance="secondary"
        >
          View Document
        </Button>
      </div>
    </MemoryRouter>
  </ApiBankingTheme>
);

/**
 * A realistic use case mimicking the buttons in a consent modal from the login flow.
 */
export const ConsentModalButtons = () => (
  <ApiBankingTheme>
    <div
      style={{
        ...wrapperStyle,
        backgroundColor: 'var(--colors-surface-primary)',
        borderRadius: 'var(--borders-radius-large)',
        width: 'fit-content',
        boxShadow: 'var(--effects-shadows-large)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-medium)',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <Button
          appearance="tertiary"
          onClick={() => alert('Action Cancelled')}
        >
          Cancel
        </Button>
        <Button
          appearance="secondary"
          onClick={() => alert('Action Accepted')}
        >
          Accept
        </Button>
      </div>
    </div>
  </ApiBankingTheme>
);