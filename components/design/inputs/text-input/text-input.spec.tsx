import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TextInput } from './text-input.js';

describe('TextInput', () => {
  it('should render the input with the provided placeholder', () => {
    const { getByPlaceholderText } = render(
      <TextInput
        id="test-input"
        value=""
        onChange={() => {}}
        placeholder="Enter your name"
      />
    );
    const inputElement = getByPlaceholderText('Enter your name');
    expect(inputElement).toBeInTheDocument();
  });

  it('should update the value when the input changes', () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <TextInput id="test-input" value="" onChange={onChange} placeholder="Enter text" />
    );
    const inputElement = getByRole('textbox') as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: 'new value' } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should apply the error class when the error prop is true', () => {
    const { container } = render(
      <TextInput
        id="test-input"
        value=""
        onChange={() => {}}
        placeholder="Enter text"
        error={true}
      />
    );
    const wrapperElement = container.querySelector('.inputWrapper');
    expect(wrapperElement).toHaveClass('error');
  });
});