import React from 'react';
import { render } from '@testing-library/react';
import { Flex } from './flex.js';

describe('Flex Component', () => {
  it('should render children', () => {
    const { getByText } = render(
      <Flex>
        <div>Test Child</div>
      </Flex>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});