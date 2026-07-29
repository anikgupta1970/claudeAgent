import React from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { ThemeToggler } from './theme-toggler.js';

export const InteractiveThemeToggler = () => {
  return (
    <ApiBankingTheme>
      <div
        style={{
          backgroundColor: 'var(--colors-surface-background)',
          color: 'var(--colors-text-primary)',
          padding: 'var(--spacing-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-large)',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '250px',
          fontFamily: 'var(--typography-font-family)',
          transition: 'background-color var(--interactions-transitions-duration-fast), color var(--interactions-transitions-duration-fast)',
          borderRadius: 'var(--borders-radius-large)',
          border: 'var(--borders-default-width) var(--borders-default-style) var(--borders-default-color)'
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--typography-sizes-heading-h3)',
            fontWeight: 'var(--typography-font-weight-bold)',
          }}
        >
          Live Theme Preview
        </h3>
        <p style={{ margin: 0, color: 'var(--colors-text-secondary)', fontSize: 'var(--typography-sizes-body-default)'}}>
          Click the toggler below to switch between light and dark modes.
        </p>
        <div style={{ paddingTop: 'var(--spacing-medium)' }}>
          <ThemeToggler />
        </div>
      </div>
    </ApiBankingTheme>
  );
};

export const ThemeTogglerInHeader = () => {
  return (
    <ApiBankingTheme>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--spacing-medium) var(--spacing-large)',
          backgroundColor: 'var(--colors-surface-primary)',
          color: 'var(--colors-text-primary)',
          fontFamily: 'var(--typography-font-family)',
          boxShadow: 'var(--effects-shadows-medium)',
          borderRadius: 'var(--borders-radius-medium)'
        }}
      >
        <div
          style={{
            fontSize: 'var(--typography-sizes-heading-h5)',
            fontWeight: 'var(--typography-font-weight-bold)',
            color: 'var(--colors-text-primary)',
          }}
        >
          My Application
        </div>
        <ThemeToggler />
      </header>
    </ApiBankingTheme>
  );
};

export const StandaloneThemeToggler = () => {
    return (
        <ApiBankingTheme>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-large)' }}>
                <ThemeToggler />
            </div>
        </ApiBankingTheme>
    );
};