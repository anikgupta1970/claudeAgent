import type { ChangeEvent, FocusEvent, CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './text-input.module.scss';

export type TextInputProps = {
  /**
   * Unique identifier for the input field.
   */
  id: string;
  /**
   * The current value of the input field.
   */
  value: string;
  /**
   * Callback function executed when the input value changes.
   */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Callback function executed when the input gains focus.
   */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback function executed when the input loses focus.
   */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * The placeholder text for the input field.
   */
  placeholder?: string;
  /**
   * The type of the input field.
   * @default 'text'
   */
  type?: 'text' | 'password' | 'number' | 'email' | 'tel';
  /**
   * The name of the input field, submitted with a form.
   */
  name?: string;
  /**
   * Optional class name to apply to the component's root element.
   */
  className?: string;
  /**
   * Optional inline styles to apply to the component's root element.
   */
  style?: CSSProperties;
  /**
   * If true, the input field will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, the input field will be read-only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If true, the input will be styled to indicate an error.
   * @default false
   */
  error?: boolean;
  /**
   * A React node to display on the left side of the input.
   */
  leftAdornment?: ReactNode;
  /**
   * A React node to display on the right side of the input.
   */
  rightAdornment?: ReactNode;
  /**
   * The maximum length (in characters) of the input value.
   */
  maxLength?: number;
};

/**
 * A foundational text input component for various form fields.
 * It supports adornments, different states, and is styled according to the theme.
 */
export function TextInput({
  id,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  type = 'text',
  name,
  className,
  style,
  disabled = false,
  readOnly = false,
  error = false,
  leftAdornment,
  rightAdornment,
  maxLength,
}: TextInputProps) {
  const wrapperClasses = classNames(
    styles.inputWrapper,
    {
      [styles.error]: error && !disabled,
      [styles.disabled]: disabled,
    },
    className
  );

  return (
    <div className={wrapperClasses} style={style}>
      {leftAdornment && (
        <span className={styles.adornment}>{leftAdornment}</span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={styles.input}
        aria-invalid={error}
        maxLength={maxLength}
      />
      {rightAdornment && (
        <span className={styles.adornment}>{rightAdornment}</span>
      )}
    </div>
  );
}