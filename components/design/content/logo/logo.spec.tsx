import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Logo } from './logo.js';

describe('Logo Component', () => {
  it('should render the default logo with name', () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );
    const nameElement = screen.getByText('API Banking');
    expect(nameElement).toBeInTheDocument();
  });

  it('should render the logo with a custom name', () => {
    render(
      <MemoryRouter>
        <Logo name="Custom Bank" />
      </MemoryRouter>
    );
    const nameElement = screen.getByText('Custom Bank');
    expect(nameElement).toBeInTheDocument();
  });

  it('should render the logo with a slogan', () => {
    render(
      <MemoryRouter>
        <Logo slogan="Your trusted partner" />
      </MemoryRouter>
    );
    const sloganElement = screen.getByText('Your trusted partner');
    expect(sloganElement).toBeInTheDocument();
  });
});