import type { CSSProperties } from 'react';
import styles from './skeleton.module.scss';

export type SkeletonProps = {
  /** Visual variant. 'text' for inline text placeholders, 'rectangular' for block areas. */
  variant?: 'text' | 'rectangular';
  /** Width of the skeleton. Accepts CSS values like '100%', '200px'. */
  width?: string;
  /** Height of the skeleton. Accepts CSS values. */
  height?: string;
  /** Additional class name. */
  className?: string;
  /** Additional inline styles. */
  style?: CSSProperties;
};

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  style,
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${styles[variant]}${className ? ` ${className}` : ''}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
      data-testid="skeleton"
    />
  );
}
