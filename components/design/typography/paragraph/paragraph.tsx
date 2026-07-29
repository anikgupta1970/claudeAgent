import type { ReactNode, CSSProperties } from 'react';
import React from 'react';
import classNames from 'classnames';
import styles from './paragraph.module.scss';

export type ParagraphProps = {
  /**
   * The HTML element to render.
   * For example: 'p', 'span', 'div'.
   * @default 'p'
   */
  element?: 'p' | 'span' | 'div';

  /**
   * The content of the paragraph.
   */
  children?: ReactNode;

  /**
   * The visual variant of the paragraph.
   * 'lead' for larger, introductory text.
   * 'muted' for less prominent, secondary text.
   * @default 'default'
   */
  variant?: 'default' | 'lead' | 'muted';

  /**
   * Additional class names to apply to the paragraph.
   */
  className?: string;

  /**
   * Inline styles to apply to the paragraph.
   */
  style?: CSSProperties;
};

/**
 * A versatile and accessible paragraph component that prioritizes readability and consistent typography.
 * It uses theme-based styles for a consistent look and feel across the application.
 */
export function Paragraph({
  element: Component = 'p',
  children,
  variant = 'default',
  className,
  style,
}: ParagraphProps) {
  return (
    <Component
      className={classNames(
        styles.paragraph,
        {
          [styles.lead]: variant === 'lead',
          [styles.muted]: variant === 'muted',
        },
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
}