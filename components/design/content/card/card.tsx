import type { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './card.module.scss';

export type CardProps = {
  /**
   * The main content of the card.
   */
  children?: ReactNode;

  /**
   * Optional content to be placed in the card's header section.
   * This section is visually distinct and appears at the top of the card.
   */
  header?: ReactNode;

  /**
   * Optional content to be placed in the card's footer section.
   * This section is visually distinct and appears at the bottom of the card.
   */
  footer?: ReactNode;

  /**
   * The visual style of the card.
   * 'elevated': A card with a shadow, appearing raised from the surface.
   * 'outlined': A card with a simple border and no shadow.
   * @default 'elevated'
   */
  variant?: 'elevated' | 'outlined';

  /**
   * If true, adds a subtle lift and shadow effect on hover, indicating the card is clickable.
   * @default false
   */
  interactive?: boolean;

  /**
   * Additional class name to apply to the card container.
   */
  className?: string;

  /**
   * Additional inline styles to apply to the card container.
   */
  style?: CSSProperties;

  /**
   * Optional click handler for the card.
   */
  onClick?: () => void;
};

/**
 * A versatile container for content that provides structure and visual grouping.
 * The Card component can be configured with distinct header and footer sections,
 * and supports multiple visual styles with a modern, clean aesthetic.
 */
export function Card({
  children,
  header,
  footer,
  variant = 'elevated',
  interactive = false,
  className,
  style,
  onClick,
}: CardProps) {
  return (
    <div
      className={classNames(
        styles.card,
        styles[variant],
        { [styles.interactive]: interactive },
        className
      )}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {header && <header className={styles.header}>{header}</header>}
      {children && <main className={styles.content}>{children}</main>}
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  );
}