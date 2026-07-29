import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { ThemeToggler } from './theme-toggler.js';
import styles from './theme-toggler.module.scss';

// Do not mock useThemeController; instead, wrap the component with ApiBankingTheme
// which provides the real theme context.

describe('ThemeToggler', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ApiBankingTheme>{component}</ApiBankingTheme>);
  };

  it('should render the theme toggler button in light mode initially', () => {
    renderWithTheme(<ThemeToggler />);
    const button = screen.getByRole('button', { name: 'Switch to dark mode' });

    expect(button).toBeInTheDocument();
    // ApiBankingTheme defaults to light mode, so the .dark class should not be present initially.
    expect(button).not.toHaveClass(styles.dark);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAccessibleName('Switch to dark mode');
  });

  it('should switch to dark mode when clicked', () => {
    renderWithTheme(<ThemeToggler />);
    const button = screen.getByRole('button');

    // Initial state: light mode
    expect(button).not.toHaveClass(styles.dark);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAccessibleName('Switch to dark mode');

    fireEvent.click(button);

    // After click: should be dark mode
    // The component will re-render internally due to context change
    expect(button).toHaveClass(styles.dark);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAccessibleName('Switch to light mode');
  });

  it('should switch back to light mode when clicked again', () => {
    renderWithTheme(<ThemeToggler />); // Starts in light mode

    const button = screen.getByRole('button');

    // Click once to go to dark mode
    fireEvent.click(button);
    expect(button).toHaveClass(styles.dark);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAccessibleName('Switch to light mode');

    // Click again to go back to light mode
    fireEvent.click(button);

    expect(button).not.toHaveClass(styles.dark);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAccessibleName('Switch to dark mode');
  });

  it('should render the sun and moon icons', () => {
    renderWithTheme(<ThemeToggler />);
    const sunIcon = screen.getByTestId('sun-icon');
    const moonIcon = screen.getByTestId('moon-icon');

    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
  });

  it('should render in dark mode if ApiBankingTheme is initialized with dark mode', () => {
    render(<ApiBankingTheme initialTheme="dark"><ThemeToggler /></ApiBankingTheme>);
    const button = screen.getByRole('button', { name: 'Switch to light mode' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(styles.dark);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAccessibleName('Switch to light mode');
  });

  it('should switch from dark to light mode when clicked if initially dark', () => {
    render(<ApiBankingTheme initialTheme="dark"><ThemeToggler /></ApiBankingTheme>);
    const button = screen.getByRole('button');

    // Initial state: dark mode
    expect(button).toHaveClass(styles.dark);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAccessibleName('Switch to light mode');

    fireEvent.click(button);

    // After click: should be light mode
    expect(button).not.toHaveClass(styles.dark);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAccessibleName('Switch to dark mode');
  });
});