import React from 'react';
import { render } from '@testing-library/react';
import { Label } from './label.js';
import styles from './label.module.scss';

describe('Label', () => {
  it('should render its children', () => {
    const { getByText } = render(<Label>Test Label</Label>);
    const rendered = getByText('Test Label');
    expect(rendered).toBeTruthy();
  });

  it('should apply the label class', () => {
    const { container } = render(<Label>Test Label</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass(styles.label);
  });

  it('should apply additional classNames', () => {
    const { container } = render(<Label className="test-class">Test Label</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('test-class');
  });
});