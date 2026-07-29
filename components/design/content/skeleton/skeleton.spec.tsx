import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './skeleton.js';

describe('Skeleton', () => {
  it('renders with default text variant', () => {
    render(<Skeleton />);
    const el = screen.getByTestId('skeleton');
    expect(el).toBeTruthy();
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies custom width and height as inline styles', () => {
    render(<Skeleton width="200px" height="24px" />);
    const el = screen.getByTestId('skeleton');
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('24px');
  });

  it('applies custom className', () => {
    render(<Skeleton className="custom-class" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toContain('custom-class');
  });

  it('applies rectangular variant class', () => {
    render(<Skeleton variant="rectangular" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toContain('rectangular');
  });

  it('has aria-hidden for accessibility', () => {
    render(<Skeleton />);
    const el = screen.getByTestId('skeleton');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});
