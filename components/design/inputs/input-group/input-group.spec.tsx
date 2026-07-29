import React from 'react';
import { render } from '@testing-library/react';
import { InputGroup } from './input-group.js';

describe('InputGroup', () => {
  it('should render the label when provided', () => {
    const { getByLabelText } = render(<InputGroup label="Test Label" inputId="test-id"><input type="text" id="test-id" /></InputGroup>);
    expect(getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('should render help text when provided', () => {
    const { getByText } = render(<InputGroup helpText="Test Help Text"><input type="text" /></InputGroup>);
    expect(getByText('Test Help Text')).toBeInTheDocument();
  });

  it('should render error text when provided', () => {
    const { getByText } = render(<InputGroup errorText="Test Error Text"><input type="text" /></InputGroup>);
    expect(getByText('Test Error Text')).toBeInTheDocument();
  });
});