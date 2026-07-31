import type { CSSProperties } from 'react';
import {
  Select as AriaSelect,
  SelectValue,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
} from 'react-aria-components';
import type { Key } from 'react-aria-components';
import { usePortalContainer } from '@api-banking/design.api-banking-theme';
import styles from './select.module.scss';

export type SelectOption = {
  /**
   * The value of the option, submitted with forms.
   */
  value: string;
  /**
   * The display label shown to the user.
   */
  label: string;
};

export type SelectProps = {
  /**
   * Unique identifier for the select field.
   */
  id: string;
  /**
   * The currently selected value.
   */
  value: string;
  /**
   * Callback function executed when the selected value changes.
   */
  onChange: (value: string) => void;
  /**
   * The list of options to display in the dropdown.
   */
  options: SelectOption[];
  /**
   * The placeholder text shown when no value is selected.
   */
  placeholder?: string;
  /**
   * Optional class name to apply to the component's root element.
   */
  className?: string;
  /**
   * Optional inline styles to apply to the component's root element.
   */
  style?: CSSProperties;
  /**
   * If true, the select field will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, the select will be styled to indicate an error.
   * @default false
   */
  error?: boolean;
  /**
   * The name of the select field, submitted with a form.
   */
  name?: string;
  /**
   * If true, the dropdown will be rendered via a portal to document.body.
   * This is useful when the select is inside a container with overflow: hidden.
   * React Aria Popover handles portaling natively, so this prop is accepted
   * for backward compatibility but has no effect.
   * @default false
   */
  usePortal?: boolean;
};

/**
 * A dropdown select component for choosing from a list of options.
 * It supports different states and is styled according to the theme.
 */
export function Select({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className,
  style,
  disabled = false,
  error = false,
  name,
  usePortal: _usePortal,
}: SelectProps) {
  const portalContainer = usePortalContainer();

  return (
    <AriaSelect
      selectedKey={value || null}
      onSelectionChange={(key: Key | null) => key !== null && onChange(String(key))}
      placeholder={placeholder}
      isDisabled={disabled}
      isInvalid={error && !disabled}
      name={name}
      id={id}
      className={`${styles.selectContainer}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Button className={styles.selectTrigger}>
        <SelectValue className={({ isPlaceholder }) => isPlaceholder ? styles.selectPlaceholder : styles.selectValue} />
        <span className={styles.selectArrow}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </span>
      </Button>
      <Popover className={styles.selectPopover} UNSTABLE_portalContainer={portalContainer}>
        <ListBox className={styles.selectOptions}>
          {options.map((opt) => (
            <ListBoxItem key={opt.value} id={opt.value} className={styles.selectOption}>
              {opt.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
