import type { ReactNode, CSSProperties } from 'react';
import classNames from 'classnames';
import { Label } from '@api-banking/design.typography.label';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import styles from './input-group.module.scss';

export type InputGroupProps = {
  /**
   * The content of the label for the input group.
   */
  label?: ReactNode;

  /**
   * The ID of the input element, used to associate the label with the input.
   */
  inputId?: string;

  /**
   * The input component to be rendered within the group, for example a text input or a date picker.
   */
  children: ReactNode;

  /**
   * Optional helper text displayed below the input.
   */
  helpText?: ReactNode;

  /**
   * Optional error text displayed below the input. If present, it replaces the helper text.
   */
  errorText?: ReactNode;

  /**
   * Additional CSS class name to apply to the input group container.
   */
  className?: string;

  /**
   * Inline styles to apply to the input group container.
   */
  style?: CSSProperties;
};

/**
 * A flexible component to group a label, an input, and helper or error text.
 * It provides consistent spacing and styling for form elements.
 */
export function InputGroup({
  label,
  inputId,
  children,
  helpText,
  errorText,
  className,
  style,
}: InputGroupProps) {
  const hasError = !!errorText;
  const bottomText = errorText || helpText;

  return (
    <div className={classNames(styles.inputGroup, className)} style={style}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      {children}
      {bottomText && (
        <Paragraph
          variant="muted"
          className={classNames(styles.bottomText, {
            [styles.errorText]: hasError,
          })}
        >
          {bottomText}
        </Paragraph>
      )}
    </div>
  );
}