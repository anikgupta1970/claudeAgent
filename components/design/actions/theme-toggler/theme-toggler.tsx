import { useThemeController } from '@api-banking/design.api-banking-theme';
import { Icon } from '@api-banking/design.content.icon';
import classNames from 'classnames';
import React, { type CSSProperties } from 'react';

import { MoonIcon } from './moon-icon.js';
import styles from './theme-toggler.module.scss';
import { SunIcon } from './sun-icon.js';

export type ThemeTogglerProps = {
  /**
   * Additional class name for the component.
   */
  className?: string;
  /**
   * Inline styles for the component.
   */
  style?: CSSProperties;
};

/**
 * An aesthetically pleasing theme toggler that allows users to switch between light and dark themes.
 * It provides clear visual feedback of the current theme and incorporates a smooth transition when switching.
 * @param className Optional CSS class to apply to the component.
 * @param style Optional inline styles to apply to the component.
 */
export function ThemeToggler({ className, style }: ThemeTogglerProps) {
  const { themeMode, toggleTheme } = useThemeController();
  const isDark = themeMode === 'dark';

  return (
    <button
      type="button"
      className={classNames(styles.themeToggler, { [styles.dark]: isDark }, className)}
      onClick={() => toggleTheme()}
      style={style}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      <div className={styles.iconsWrapper}>
        <Icon size="16px" color={!isDark ? 'var(--colors-primary-default)' : 'var(--colors-text-secondary)'}>
          <SunIcon data-testid="sun-icon" />
        </Icon>
        <Icon size="16px" color={isDark ? 'var(--colors-primary-default)' : 'var(--colors-text-secondary)'}>
          <MoonIcon data-testid="moon-icon" />
        </Icon>
      </div>
      <span className={styles.knob} />
    </button>
  );
}