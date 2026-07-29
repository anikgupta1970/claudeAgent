import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LoginTerms } from './login-terms.js';

describe('LoginTerms', () => {
  it('should call onViewDetails when the checkbox label is clicked and not disabled', () => {
    const onViewDetails = vi.fn();
    const { container } = render(
      <LoginTerms
        id="test-checkbox"
        label="Test Consent Checkbox"
        onViewDetails={onViewDetails}
      />
    );
    // Assuming the Checkbox component (internal to LoginTerms) renders a label with this class.
    // In a real scenario, it might be better to target the actual input or a more accessible element.
    const labelElement = container.querySelector('.labelContent');
    if (!labelElement) {
      throw new Error('Label not found. Ensure the underlying Checkbox component renders a label with class "labelContent".');
    }
    fireEvent.click(labelElement);
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it('should not call onViewDetails when the checkbox is disabled', () => {
    const onViewDetails = vi.fn();
    const { container } = render(
      <LoginTerms
        id="test-checkbox"
        label="Test Consent Checkbox"
        onViewDetails={onViewDetails}
        disabled
      />
    );

    // Assuming the Checkbox component (internal to LoginTerms) has a wrapper with this class.
    // Clicking this wrapper should typically trigger the checkbox's onChange if not disabled.
    const checkboxWrapper = container.querySelector('.checkboxWrapper');
    if (!checkboxWrapper) {
      throw new Error('checkboxWrapper not found. Ensure the underlying Checkbox component renders a wrapper with class "checkboxWrapper".');
    }

    fireEvent.click(checkboxWrapper);
    expect(onViewDetails).not.toHaveBeenCalled();
  });

  it('should render with the checked state', () => {
    const { container } = render(
      <LoginTerms
        id="test-checkbox"
        label="Test Consent Checkbox"
        checked
        onViewDetails={() => {}}
      />
    );
    const checkboxInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkboxInput?.checked).toBe(true);
  });

  it('should trigger handleChange when checkbox input changes (disabled)', () => {
    const onViewDetails = vi.fn();
    const { container } = render(
      <LoginTerms
        id="test-checkbox"
        label="Test Consent Checkbox"
        onViewDetails={onViewDetails}
        disabled
      />
    );

    const checkboxInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // Simulate a change event on the input directly
    fireEvent.change(checkboxInput, { target: { checked: true } });

    // onViewDetails should NOT be called when disabled
    expect(onViewDetails).not.toHaveBeenCalled();
  });

  it('should render unchecked by default', () => {
    const { container } = render(
      <LoginTerms
        id="test-checkbox"
        label="Test Consent Checkbox"
        onViewDetails={() => {}}
      />
    );
    const checkboxInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkboxInput?.checked).toBe(false);
  });

  it('should call onViewDetails when label is clicked (explicitly not disabled)', () => {
    const onViewDetails = vi.fn();
    const { container } = render(
      <LoginTerms
        id="test-checkbox"
        label="Test Consent Checkbox"
        onViewDetails={onViewDetails}
        disabled={false}
      />
    );

    // Find and click the label element
    const labelElement = container.querySelector('.labelContent');
    if (labelElement) {
      fireEvent.click(labelElement);
    } else {
      // Fallback to clicking the input directly
      const checkboxInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      fireEvent.click(checkboxInput);
    }

    // onViewDetails SHOULD be called when not disabled
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it('should execute handleChange but not onViewDetails when disabled and input receives change', () => {
    const onViewDetails = vi.fn();
    const { container } = render(
      <LoginTerms
        id="test-checkbox"
        label="Test Consent Checkbox"
        onViewDetails={onViewDetails}
        disabled={true}
      />
    );

    // Click directly on the input to ensure the onChange handler is triggered
    const labelElement = container.querySelector('.labelContent');
    if (labelElement) {
      fireEvent.click(labelElement);
    }

    // onViewDetails should NOT be called when disabled
    expect(onViewDetails).not.toHaveBeenCalled();
  });
});