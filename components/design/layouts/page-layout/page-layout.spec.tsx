import React from 'react';
import { render } from '@testing-library/react';
import { PageLayout } from './page-layout.js';
import styles from './page-layout.module.scss';

describe('PageLayout', () => {
  it('should render children', () => {
    const { container } = render(
      <PageLayout title="Test Page">
        <div>Test Content</div>
      </PageLayout>
    );
    expect(container.querySelector(`.${styles.pageLayout}`)?.textContent).toContain('Test Content');
  });

  it('should apply the provided className to the main container', () => {
    const customClassName = 'custom-layout';
    const { container } = render(
      <PageLayout title="Test Page" className={customClassName}>
        <div>Test Content</div>
      </PageLayout>
    );
    expect(container.querySelector(`.${customClassName}`)).toBeInTheDocument();
  });

  it('should render with the default pageLayout class', () => {
    const { container } = render(
      <PageLayout title="Test Page">
        <div>Test Content</div>
      </PageLayout>
    );
    expect(container.querySelector(`.${styles.pageLayout}`)).toBeInTheDocument();
  });

  it('should render main element as the root', () => {
    const { container } = render(
      <PageLayout title="Test Page">
        <div>Test Content</div>
      </PageLayout>
    );
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('should render with description prop provided', () => {
    const { container } = render(
      <PageLayout title="Test Page" description="This is a test description">
        <div>Test Content</div>
      </PageLayout>
    );

    // Component should render successfully with description
    expect(container.querySelector(`.${styles.pageLayout}`)).toBeInTheDocument();
    expect(container.textContent).toContain('Test Content');
  });

  it('should render with keywords prop provided', () => {
    const { container } = render(
      <PageLayout title="Test Page" keywords="test, keywords, example">
        <div>Test Content</div>
      </PageLayout>
    );

    // Component should render successfully with keywords
    expect(container.querySelector(`.${styles.pageLayout}`)).toBeInTheDocument();
    expect(container.textContent).toContain('Test Content');
  });

  it('should render with both description and keywords props provided', () => {
    const { container } = render(
      <PageLayout
        title="Test Page"
        description="This is a test description"
        keywords="test, keywords, example"
      >
        <div>Test Content</div>
      </PageLayout>
    );

    // Component should render successfully with both props
    expect(container.querySelector(`.${styles.pageLayout}`)).toBeInTheDocument();
  });

  it('should render without description and keywords props', () => {
    const { container } = render(
      <PageLayout title="Test Page">
        <div>Test Content</div>
      </PageLayout>
    );

    // Component should render successfully without meta props
    expect(container.querySelector(`.${styles.pageLayout}`)).toBeInTheDocument();
  });

  it('should apply style prop to the main container', () => {
    const { container } = render(
      <PageLayout title="Test Page" style={{ padding: '20px' }}>
        <div>Test Content</div>
      </PageLayout>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    const { container } = render(
      <PageLayout title="Test Page">
        <div>First Child</div>
        <div>Second Child</div>
      </PageLayout>
    );

    expect(container.textContent).toContain('First Child');
    expect(container.textContent).toContain('Second Child');
  });
});