import React, { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import { Logo, type LogoProps } from '@api-banking/design.content.logo';
import { Select, type SelectOption } from '@api-banking/design.inputs.select';
import styles from './header.module.scss';

export type HeaderProps = {
  /**
   * Props forwarded to the Logo component displayed on the left side of the header.
   */
  logoProps?: LogoProps;

  /**
   * The list of available languages for the dropdown.
   * @default [{ value: 'en', label: 'English' }]
   */
  languages?: SelectOption[];

  /**
   * The currently selected language value.
   * @default 'en'
   */
  selectedLanguage?: string;

  /**
   * Callback fired when the language selection changes.
   */
  onLanguageChange?: (language: string) => void;

  /**
   * Optional content to render between the logo and the language selector.
   */
  children?: ReactNode;

  /**
   * Custom class name applied to the root header element.
   */
  className?: string;

  /**
   * Custom inline styles applied to the root header element.
   */
  style?: CSSProperties;
};

const defaultLanguages: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
];

/**
 * A top-level header component with the brand logo on the left and a language
 * selector dropdown on the right. Supports customizing the logo, available
 * languages, and injecting additional content in between.
 */
export function Header({
  logoProps,
  languages = defaultLanguages,
  selectedLanguage: controlledLanguage,
  onLanguageChange,
  children,
  className,
  style,
}: HeaderProps) {
  const [internalLanguage, setInternalLanguage] = useState(
    languages[0]?.value ?? 'en'
  );

  const currentLanguage = controlledLanguage ?? internalLanguage;

  const handleLanguageChange = (value: string) => {
    if (onLanguageChange) {
      onLanguageChange(value);
    } else {
      setInternalLanguage(value);
    }
  };

  return (
    <header className={classNames(styles.header, className)} style={style}>
      <div className={styles.left}>
        <Logo minimal {...logoProps} />
      </div>
      {children && <div className={styles.center}>{children}</div>}
      <div className={styles.right}>
        <Select
          id="header-language-select"
          value={currentLanguage}
          onChange={handleLanguageChange}
          options={languages}
        />
      </div>
    </header>
  );
}
