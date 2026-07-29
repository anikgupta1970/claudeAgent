import React from 'react';
import { render } from '@testing-library/react';
import { Card } from './card.js';
import styles from './card.module.scss';

describe('Card Component', () => {
  it('should render children inside the card', () => {
    const { getByText } = render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply the interactive class when interactive prop is true', () => {
    const { container } = render(<Card interactive />);
    expect(container.querySelector(`.${styles.interactive}`)).toBeInTheDocument();
  });

  it('should render header and footer when provided', () => {
    const headerText = 'Card Header';
    const footerText = 'Card Footer';
    const { getByText } = render(
      <Card header={<div>{headerText}</div>} footer={<div>{footerText}</div>}>
        <div>Test Content</div>
      </Card>
    );
    expect(getByText(headerText)).toBeInTheDocument();
    expect(getByText(footerText)).toBeInTheDocument();
  });
});