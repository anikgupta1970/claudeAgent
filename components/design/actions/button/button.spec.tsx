import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './button.js';
import styles from './button.module.scss';

describe('Button', () => {
  it('should render children', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const onClick = vi.fn();
    const { container } = render(<Button onClick={onClick}>Click me</Button>);
    const button = container.querySelector(`.${styles.button}`);
    if (button) {
      fireEvent.click(button);
    }
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render as a link when href is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <Button href="/test">Click me</Button>
      </MemoryRouter>
    );
    const link = container.querySelector(`.${styles.button}`);
    expect(link?.getAttribute('href')).toBe('/test');
  });

  it('should apply disabled styles when disabled', () => {
    const { container } = render(<Button disabled>Click me</Button>);
    const button = container.querySelector(`.${styles.button}`);
    expect(button).toHaveClass(styles.disabled);
  });
});