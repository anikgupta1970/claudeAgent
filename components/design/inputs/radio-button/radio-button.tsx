import React, { type ReactNode, type ChangeEvent } from 'react';
import classNames from 'classnames';
import styles from './radio-button.module.scss';

export type RadioButtonProps = {
  /**
   * A unique identifier for the radio button input, used to associate the label.
   */
  id: string;

  /**
   * The name for the radio group, which groups multiple radio buttons, allowing only one to be selected at a time.
   */
  name: string;

  /**
   * The value to be submitted with the form when this radio button is selected.
   */
  value: string;

  /**
   * The content to be displayed as the label for the radio button. Can be a string or any React element.
   */
  label: ReactNode;

  /**
   * Specifies whether the radio button is currently selected.
   */
  checked?: boolean;

  /**
   * A callback function that is executed when the radio button's state changes.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;

  /**
   * If true, the radio button will be rendered in a disabled state, making it non-interactive.
   */
  disabled?: boolean;

  /**
   * An optional CSS class name to apply to the root element for custom styling.
   */
  className?: string;

  /**
   * Optional inline styles to apply to the root element.
   */
  style?: React.CSSProperties;
};

/**
 * A custom, accessible radio button component with theme-aware styling.
 * It provides clear visual states for checked, unchecked, and disabled options,
 * ensuring a consistent and intuitive user experience across forms.
 */
export function RadioButton({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  className,
  style,
}: RadioButtonProps) {
  return (
    <div className={classNames(styles.container, className)} style={style}>
      <label htmlFor={id} className={styles.labelWrapper}>
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={styles.nativeInput}
        />
        <span className={styles.customRadio} />
        {label}
      </label>
    </div>
  );
}