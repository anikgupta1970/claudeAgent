import type { ReactNode, CSSProperties } from 'react';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';
import styles from './page-layout.module.scss';

export type PageLayoutProps = {
  /**
   * The content to be rendered inside the layout.
   */
  children?: ReactNode;

  /**
   * The title of the page, injected into the document head.
   */
  title: string;

  /**
   * The meta description of the page for SEO purposes, injected into the document head.
   */
  description?: string;

  /**
   * Comma-separated keywords for the page's SEO, injected into the document head.
   */
  keywords?: string;

  /**
   * An optional class name to apply to the main layout container.
   */
  className?: string;

  /**
   * An optional style object to apply to the main layout container.
   */
  style?: CSSProperties;
};

/**
 * A responsive page layout component that wraps the main content of a page.
 * It handles setting the page title and meta tags using React Helmet, ensuring
 * proper SEO and document structure. The layout is designed to be flexible
 * and adapt to various screen sizes, providing consistent padding and maximizing
 * width on larger displays.
 * @param props The props for the PageLayout component.
 * @returns A main layout element wrapping the page content.
 */
export function PageLayout({
  children,
  title,
  description,
  keywords,
  className,
  style,
}: PageLayoutProps) {
  return (
    <main style={style} className={classNames(styles.pageLayout, className)}>
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
      </Helmet>
      {children}
    </main>
  );
}