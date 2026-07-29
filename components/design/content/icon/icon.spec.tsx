import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Icon } from './icon.js';
import styles from './icon.module.scss';

describe('Icon Component', () => {
  it('should render the icon with the provided children', () => {
    render(
      <Icon>
        <path d="M0 0 L10 10" />
      </Icon>
    );

    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
  });

  it('should apply interactive styles when onClick is provided', () => {
    const onClick = vi.fn();
    render(
      <Icon onClick={onClick}>
        <path d="M0 0 L10 10" />
      </Icon>
    );

    const icon = screen.getByRole('img');
    expect(icon).toHaveClass(styles.interactive);
  });

  it('should call onClick function when clicked', () => {
    const onClick = vi.fn();
    render(
      <Icon onClick={onClick}>
        <path d="M0 0 L10 10" />
      </Icon>
    );

    const icon = screen.getByRole('img');
    fireEvent.click(icon);
    expect(onClick).toHaveBeenCalled();
  });
});