import React, { type CSSProperties, type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './heading.module.scss';

/**
 * Defines the possible semantic heading levels.
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Defines the possible visual styles for the heading, corresponding to h1-h6.
 */
export type VisualHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps = {
  /**
   * The semantic heading level (1-6), which determines the HTML tag (e.g., h1, h2).
   */
  level: HeadingLevel;

  /**
   * The content to be displayed within the heading.
   */
  children?: ReactNode;

  /**
   * The visual heading style to apply, independent of the semantic level.
   * If not provided, the visual style will match the semantic level.
   * This allows, for example, an h1 tag to have the visual appearance of an h3.
   */
  visualLevel?: VisualHeadingLevel;

  /**
   * If true, applies an inverse text color, making it suitable for dark backgrounds.
   * @default false
   */
  inverseColor?: boolean;

  /**
   * An optional CSS class name to apply to the heading element for custom styling.
   */
  className?: string;

  /**
   * An optional style object to apply to the heading element.
   */
  style?: CSSProperties;
};

/**
 * A semantic and visually consistent heading component that enhances content structure and readability.
 * It allows for decoupling the semantic HTML tag (h1-h6) from its visual styling,
 * providing flexibility in design while maintaining a proper document outline.
 */
export function Heading({
  level,
  visualLevel,
  children,
  inverseColor = false,
  className,
  style,
}: HeadingProps) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  const visualStyle = visualLevel || `h${level}`;

  return (
    <Tag
      className={classNames(
        styles.heading,
        styles[visualStyle],
        { [styles.inverse]: inverseColor },
        className
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}