import React from 'react';
import { render } from '@testing-library/react';
import { Paragraph } from './paragraph.js';
import styles from './paragraph.module.scss';

describe('Paragraph Component', () => {
  it('should render the paragraph with default styles', () => {
    const { container } = render(<Paragraph>Hello World</Paragraph>);
    const paragraph = container.querySelector('p');

    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass(styles.paragraph);
  });

  it('should render the paragraph with lead variant styles', () => {
    const { container } = render(<Paragraph variant="lead">Lead Text</Paragraph>);
    const paragraph = container.querySelector('p');

    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass(styles.lead);
  });

  it('should render the paragraph with muted variant styles', () => {
    const { container } = render(<Paragraph variant="muted">Muted Text</Paragraph>);
    const paragraph = container.querySelector('p');

    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass(styles.muted);
  });
});