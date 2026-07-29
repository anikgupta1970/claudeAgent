import type { LabelHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './label.module.scss';

export type LabelProps = {
  /**
   * The content to be rendered inside the label.
   */
  children?: ReactNode;
  /**
   * Optional class name to apply to the label element.
   */
  className?: string;
} & LabelHTMLAttributes<HTMLLabelElement>;

/**
 * A clear and concise label component primarily for form elements.
 * It adheres to the theme's specific styles for form labels, including font-size, weight, and color.
 * @param {LabelProps} props The properties for the component.
 * @example
 * <Label htmlFor="username">Username</Label>
 */
export function Label({ children, className, ...rest }: LabelProps) {
  return (
    <label {...rest} className={classNames(styles.label, className)}>
      {children}
    </label>
  );
}