import React from 'react';
import { render } from '@testing-library/react';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { SectionLayout } from './section-layout.js';
import styles from './section-layout.module.scss';

describe('SectionLayout', () => {
  it('should render the title, subtitle, and caption when provided as strings', () => {
    const { container } = render(
      <SectionLayout
        title="Section Title"
        subtitle="Section Subtitle"
        caption="Section Caption"
      >
        <div>Section Content</div>
      </SectionLayout>
    );

    const titleElement = container.querySelector(`.${styles.header} > h4`);
    const subtitleElement = container.querySelector(`.${styles.header} > .${styles.subtitle}`);
    const captionElement = container.querySelector(`.${styles.header} > .${styles.caption}`);

    expect(titleElement?.textContent).toBe('Section Title');
    expect(subtitleElement?.textContent).toBe('Section Subtitle');
    expect(captionElement?.textContent).toBe('Section Caption');
  });

  it('should render the title, subtitle, and caption when provided as ReactNodes', () => {
    const title = <Heading level={2}>Custom Title</Heading>;
    const subtitle = <Paragraph>Custom Subtitle</Paragraph>;
    const caption = <Paragraph variant="muted">Custom Caption</Paragraph>;

    const { container } = render(
      <SectionLayout title={title} subtitle={subtitle} caption={caption}>
        <div>Section Content</div>
      </SectionLayout>
    );

    expect(container.querySelector(`.${styles.header} > h2`)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.header} > p`)).toBeInTheDocument();
  });

  it('should render children within the content section', () => {
    const { container } = render(
      <SectionLayout>
        <div data-testid="content">Section Content</div>
      </SectionLayout>
    );

    const contentElement = container.querySelector('[data-testid="content"]');
    expect(contentElement).toBeInTheDocument();
  });
});