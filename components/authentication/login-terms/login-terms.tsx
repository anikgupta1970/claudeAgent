import type { ReactNode, CSSProperties } from 'react';
import React from 'react';
import classNames from 'classnames';
import { Checkbox } from '@api-banking/design.inputs.checkbox';
import styles from './login-terms.module.scss';

/**
 * Defines the properties for the LoginTerms component.
 */
export type LoginTermsProps = {
  /**
   * A unique identifier for the checkbox input. Essential for accessibility.
   */
  id: string;

  /**
   * The current checked state of the checkbox. This is controlled by the parent component.
   */
  checked?: boolean;

  /**
   * The content to be displayed as the label for the checkbox.
   */
  label: ReactNode;

  /**
   * Callback function triggered when the user interacts with the checkbox.
   * This is intended to open a modal for consent details.
   */
  onViewDetails: () => void;

  /**
   * If true, the checkbox will be disabled and non-interactive.
   */
  disabled?: boolean;

  /**
   * An optional CSS class name to apply to the root wrapper element.
   */
  className?: string;

  /**
   * An optional style object to apply to the root wrapper element.
   */
  style?: CSSProperties;
};

/**
 * A specialized checkbox for handling user consent in flows like login.
 * It extends the base Checkbox by modifying its interaction. Instead of toggling
 * its state on click, it calls the `onViewDetails` prop, allowing a parent
 * component to display a confirmation modal before changing the checked state.
 */
export function LoginTerms({
  id,
  checked,
  label,
  onViewDetails,
  disabled,
  className,
  style,
}: LoginTermsProps) {
  /**
   * Intercepts the change event from the underlying Checkbox.
   * It prevents the default toggling behavior and instead triggers the
   * `onViewDetails` callback.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!disabled) {
      onViewDetails();
    }
  };

  return (
    <div
      className={classNames(styles.loginTerms, className)}
      style={style}
    >
      <Checkbox
        id={id}
        checked={checked}
        onChange={handleChange}
        label={label}
        disabled={disabled}
      />
    </div>
  );
}