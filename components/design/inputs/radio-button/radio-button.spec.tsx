import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioButton } from './radio-button.js';
import styles from './radio-button.module.scss';

describe('RadioButton', () => {
  it('should render the radio button with the provided label', () => {
    const labelText = 'Test Label';
    render(
      <RadioButton
        id="testId"
        name="testName"
        value="testValue"
        label={labelText}
        onChange={() => {}}
      />
    );

    const labelElement = screen.getByText(labelText);
    expect(labelElement).toBeInTheDocument();
  });

  it('should call onChange when the radio button is clicked', () => {
    const onChange = vi.fn();
    render(
      <RadioButton
        id="testId"
        name="testName"
        value="testValue"
        label="Test Label"
        onChange={onChange}
      />
    );

    const inputElement = screen.getByRole('radio') as HTMLInputElement;
    fireEvent.click(inputElement);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when the disabled prop is true', () => {
    render(
      <RadioButton
        id="testId"
        name="testName"
        value="testValue"
        label="Test Label"
        onChange={() => {}}
        disabled={true}
      />
    );

    const inputElement = screen.getByRole('radio') as HTMLInputElement;
    expect(inputElement).toBeDisabled();
    const labelWrapper = inputElement.closest(`.${styles.labelWrapper}`);
    expect(labelWrapper).toHaveClass(styles.labelWrapper);
  });
});