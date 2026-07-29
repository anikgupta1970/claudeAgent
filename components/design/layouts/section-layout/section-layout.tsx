import type { ReactNode, CSSProperties } from 'react';
import classNames from 'classnames';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import styles from './section-layout.module.scss';

/**
 * Defines the props for the SectionLayout component.
 */
export type SectionLayoutProps = {
  /**
   * The main title of the section. If a string is provided, it will be rendered as an h4 heading.
   * For more control, a custom ReactNode can be passed.
   */
  title?: ReactNode;

  /**
   * A subtitle that appears below the title, providing additional context.
   * Can be a string or a custom ReactNode.
   */
  subtitle?: ReactNode;

  /**
   * A caption for smaller, supplementary information, displayed below the subtitle.
   * If a string is provided, it will be rendered as muted text.
   */
  caption?: ReactNode;

  /**
   * The main content of the section.
   */
  children?: ReactNode;

  /**
   * An optional CSS class name to apply to the section container for custom styling.
   */
  className?: string;

  /**
   * An optional style object to apply to the section container.
   */
  style?: CSSProperties;
};

/**
 * SectionLayout organizes content into distinct, visually separated sections.
 * It is ideal for creating clear information hierarchies on a page, with optional headers and consistent spacing.
 */
export function SectionLayout({
  title,
  subtitle,
  caption,
  children,
  className,
  style,
}: SectionLayoutProps) {
  const hasHeader = title || subtitle || caption;

  return (
    <section
      className={classNames(styles.sectionLayout, className)}
      style={style}
    >
      {hasHeader && (
        <header className={styles.header}>
          {title &&
            (typeof title === 'string' ? <Heading level={4}>{title}</Heading> : title)}
          {subtitle &&
            (typeof subtitle === 'string' ? (
              <Paragraph className={styles.subtitle}>{subtitle}</Paragraph>
            ) : (
              subtitle
            ))}
          {caption &&
            (typeof caption === 'string' ? (
              <Paragraph variant="muted" className={styles.caption}>
                {caption}
              </Paragraph>
            ) : (
              caption
            ))}
        </header>
      )}
      {children && <div className={styles.content}>{children}</div>}
    </section>
  );
}