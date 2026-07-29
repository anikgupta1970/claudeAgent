import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Link } from './link.js';
import styles from './link.module.scss';

describe('Link Component', () => {
  describe('internal links', () => {
    it('should render an internal link with the correct text and href', () => {
      render(
        <MemoryRouter>
          <Link href="/home">Home</Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Home' });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', '/home');
    });

    it('should use RouterLink for internal links', () => {
      render(
        <MemoryRouter>
          <Link href="/dashboard">Dashboard</Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Dashboard' });
      expect(linkElement.tagName).toBe('A');
      expect(linkElement).toHaveAttribute('href', '/dashboard');
    });

    it('should call onClick when internal link is clicked', () => {
      const handleClick = vi.fn();
      render(
        <MemoryRouter>
          <Link href="/home" onClick={handleClick}>
            Home
          </Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Home' });
      fireEvent.click(linkElement);
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('external links', () => {
    it('should render an external link with the correct text and href', () => {
      render(
        <Link href="https://example.com" external target="_blank">
          Example
        </Link>
      );
      const linkElement = screen.getByRole('link', { name: 'Example' });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', 'https://example.com');
      expect(linkElement).toHaveAttribute('target', '_blank');
      expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should automatically add rel="noopener noreferrer" for target="_blank"', () => {
      render(
        <Link href="https://example.com" external target="_blank">
          External Link
        </Link>
      );
      const linkElement = screen.getByRole('link', { name: 'External Link' });
      expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not add rel for external link without target="_blank"', () => {
      render(
        <Link href="https://example.com" external target="_self">
          External Link
        </Link>
      );
      const linkElement = screen.getByRole('link', { name: 'External Link' });
      expect(linkElement).not.toHaveAttribute('rel');
    });

    it('should respect custom rel prop', () => {
      render(
        <Link href="https://example.com" external target="_blank" rel="author">
          External Link
        </Link>
      );
      const linkElement = screen.getByRole('link', { name: 'External Link' });
      expect(linkElement).toHaveAttribute('rel', 'author');
    });

    it('should call onClick when external link is clicked', () => {
      const handleClick = vi.fn();
      render(
        <Link href="https://example.com" external onClick={handleClick}>
          External
        </Link>
      );
      const linkElement = screen.getByRole('link', { name: 'External' });
      fireEvent.click(linkElement);
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should render as span when disabled', () => {
      render(
        <MemoryRouter>
          <Link href="/home" disabled>
            Disabled Link
          </Link>
        </MemoryRouter>
      );
      const element = screen.getByRole('link', { name: 'Disabled Link' });
      expect(element.tagName).toBe('SPAN');
    });

    it('should have aria-disabled="true" when disabled', () => {
      render(
        <MemoryRouter>
          <Link href="/home" disabled>
            Disabled Link
          </Link>
        </MemoryRouter>
      );
      const element = screen.getByRole('link', { name: 'Disabled Link' });
      expect(element).toHaveAttribute('aria-disabled', 'true');
    });

    it('should apply disabled styles when disabled', () => {
      render(
        <MemoryRouter>
          <Link href="/home" disabled>
            Disabled Link
          </Link>
        </MemoryRouter>
      );
      const element = screen.getByRole('link', { name: 'Disabled Link' });
      expect(element).toHaveClass(styles.disabled);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <MemoryRouter>
          <Link href="/home" disabled onClick={handleClick}>
            Disabled Link
          </Link>
        </MemoryRouter>
      );
      const element = screen.getByRole('link', { name: 'Disabled Link' });
      fireEvent.click(element);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have tabIndex -1 by default when disabled', () => {
      render(
        <MemoryRouter>
          <Link href="/home" disabled>
            Disabled Link
          </Link>
        </MemoryRouter>
      );
      const element = screen.getByRole('link', { name: 'Disabled Link' });
      expect(element).toHaveAttribute('tabIndex', '-1');
    });

    it('should respect custom tabIndex when disabled', () => {
      render(
        <MemoryRouter>
          <Link href="/home" disabled tabIndex={0}>
            Disabled Link
          </Link>
        </MemoryRouter>
      );
      const element = screen.getByRole('link', { name: 'Disabled Link' });
      expect(element).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('styling', () => {
    it('should apply default link class', () => {
      render(
        <MemoryRouter>
          <Link href="/home">Home</Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Home' });
      expect(linkElement).toHaveClass(styles.link);
    });

    it('should not apply default link class when noStyles is true', () => {
      render(
        <MemoryRouter>
          <Link href="/home" noStyles>
            Home
          </Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Home' });
      expect(linkElement).not.toHaveClass(styles.link);
    });

    it('should apply custom className', () => {
      render(
        <MemoryRouter>
          <Link href="/home" className="custom-class">
            Home
          </Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Home' });
      expect(linkElement).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(
        <MemoryRouter>
          <Link href="/home" style={{ color: 'rgb(255, 0, 0)' }}>
            Home
          </Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Home' });
      expect(linkElement).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });

    it('should apply both custom className and default link class', () => {
      render(
        <MemoryRouter>
          <Link href="/home" className="custom-class">
            Home
          </Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Home' });
      expect(linkElement).toHaveClass(styles.link);
      expect(linkElement).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('should have default role="link"', () => {
      render(
        <MemoryRouter>
          <Link href="/home">Home</Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Home' });
      expect(linkElement).toBeInTheDocument();
    });

    it('should respect custom role', () => {
      render(
        <MemoryRouter>
          <Link href="/home" role="button">
            Home
          </Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('button', { name: 'Home' });
      expect(linkElement).toBeInTheDocument();
    });

    it('should respect custom tabIndex', () => {
      render(
        <MemoryRouter>
          <Link href="/home" tabIndex={-1}>
            Home
          </Link>
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link', { name: 'Home' });
      expect(linkElement).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('children', () => {
    it('should render children content', () => {
      render(
        <MemoryRouter>
          <Link href="/home">
            <span data-testid="child">Child Content</span>
          </Link>
        </MemoryRouter>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should render without children', () => {
      render(
        <MemoryRouter>
          <Link href="/home" />
        </MemoryRouter>
      );
      const linkElement = screen.getByRole('link');
      expect(linkElement).toBeInTheDocument();
    });
  });
});
