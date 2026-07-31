import React, { type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './checkbox.module.scss';

/**
 * Properties for the Checkbox component.
 */
export type CheckboxProps = {
  /**
   * A unique identifier for the checkbox input. Essential for accessibility.
   */
  id: string;
  /**
   * The current checked state of the checkbox.
   */
  checked?: boolean;
  /**
   * Callback function triggered when the checkbox state changes.
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * The content to be displayed as the label for the checkbox. Can be a string or any React node.
   */
  label?: ReactNode;
  /**
   * If true, the checkbox will be disabled and non-interactive.
   */
  disabled?: boolean;
  /**
   * An optional CSS class name to apply to the root element.
   */
  className?: string;
  /**
   * An optional style object to apply to the root element.
   */
  style?: CSSProperties;
};

/**
 * A custom, accessible checkbox component with theme-aligned styling.
 * It provides distinct visual states for checked, unchecked, and disabled.
 */
export function Checkbox({
  id,
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  style,
}: CheckboxProps) {
  const wrapperClasses = classNames(
    styles.checkboxWrapper,
    { [styles.disabled]: disabled },
    className
  );

  return (
    <label htmlFor={id} className={wrapperClasses} style={style}>
      <input
        id={id}
        type="checkbox"
        className={styles.nativeInput}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={styles.customCheckbox}>
        <svg
          className={styles.checkmark}
          viewBox="0 0 10 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.5 4.5L3.83333 7L8.5 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label && <span className={styles.labelContent}>{label}</span>}
    </label>
  );
}