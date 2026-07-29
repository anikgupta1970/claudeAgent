import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './checkbox.js';
import styles from './checkbox.module.scss';

describe('Checkbox Component', () => {
  it('should render the checkbox with a label', () => {
    const labelText = 'Accept Terms';
    render(<Checkbox id="terms" label={labelText} />);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toBeInTheDocument();
  });

  it('should toggle the checkbox state when clicked', () => {
    const onChange = vi.fn();
    render(<Checkbox id="toggle" onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should apply the disabled styles when the checkbox is disabled', () => {
    const labelText = 'Test Disabled';
    render(<Checkbox id="disabled-test" label={labelText} disabled />);
    // The 'label' element itself gets the styles.disabled class
    const labelElement = screen.getByText(labelText).closest('label');
    expect(labelElement).toHaveClass(styles.disabled);
  });
});