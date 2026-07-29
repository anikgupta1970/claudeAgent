import React from 'react';
import { render } from '@testing-library/react';
import { Heading } from './heading.js';
import styles from './heading.module.scss';

describe('Heading Component', () => {
  it('should render the correct heading level', () => {
    const { container } = render(<Heading level={1}>Test Heading</Heading>);
    const headingElement = container.querySelector('h1');
    expect(headingElement).toBeInTheDocument();
  });

  it('should apply the inverse color class when inverseColor is true', () => {
    const { container } = render(<Heading level={2} inverseColor>Test Heading</Heading>);
    const headingElement = container.querySelector('h2');
    expect(headingElement).toHaveClass(styles.inverse);
  });

  it('should apply a custom class name', () => {
    const customClassName = 'custom-heading';
    const { container } = render(<Heading level={3} className={customClassName}>Test Heading</Heading>);
    const headingElement = container.querySelector('h3');
    expect(headingElement).toHaveClass(customClassName);
  });
});