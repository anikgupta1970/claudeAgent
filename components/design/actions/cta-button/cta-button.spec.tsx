import { Button } from '@api-banking/design.actions.button';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CtaButton } from './cta-button.js';
import styles from './cta-button.module.scss';

describe('CtaButton', () => {
  it('should render with primary appearance and apply custom styles', () => {
    render(
      <MemoryRouter>
        <CtaButton appearance="primary">Continue</CtaButton>
      </MemoryRouter>
    );
    const button = screen.getByText('Continue');
    expect(button).toHaveClass(styles.primary);
  });

  it('should render with secondary appearance', () => {
    render(
      <MemoryRouter>
        <CtaButton appearance="secondary">Accept</CtaButton>
      </MemoryRouter>
    );
    const button = screen.getByText('Accept');
    expect(button.closest('button')).toBeInTheDocument();
  });

  it('should render as a link when href is provided', () => {
    render(
      <MemoryRouter>
        <CtaButton href="/terms">Read Terms</CtaButton>
      </MemoryRouter>
    );
    const link = screen.getByText('Read Terms');
    expect(link.closest('a')).toHaveAttribute('href', '/terms');
  });
});