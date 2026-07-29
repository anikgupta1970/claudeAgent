import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BasicHeader } from './header.composition.js';

it('should render the header', () => {
  const { container } = render(
    <MemoryRouter>
      <BasicHeader />
    </MemoryRouter>
  );
  const header = container.querySelector('header');
  expect(header).toBeTruthy();
});
