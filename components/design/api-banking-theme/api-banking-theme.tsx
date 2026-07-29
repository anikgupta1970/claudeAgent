import { ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { mergeTokenSchema, DeepPartial } from '@bitdesign/sparks.sparks-theme';
import { ApiBankingThemeProvider } from './api-banking-theme-provider.js';
import { ApiBankingThemeSchema } from './api-banking-theme-tokens.js';
import { ThemeContext, ThemeContextValue, ThemeMode } from './theme-controller.js';
import { PortalContainerProvider } from './portal-container.js';
import { themeOptions } from './theme-options.js';
import styles from './api-banking-theme.module.scss';

export type ApiBankingThemeProps = {
  /**
   * a root ReactNode for the component tree 
   * applied with the theme.
   */
  children?: ReactNode;

  /**
   * inject a class name to override to the theme.
   * this allows people to affect your theme. remove to avoid.
   */
  className?: string;

  /**
   * override tokens in the schema
   */
  overrides?: DeepPartial<ApiBankingThemeSchema>,

  /**
   * preset of the theme.
   */
  initialTheme?: ThemeMode;

  /**
   * style tags to include.
   */
  style?: React.CSSProperties,
};

/**
 * a theme for the ApiBanking organization.
 * it provides tokens, fonts and general styling for all components.
 */
export function ApiBankingTheme({ children, initialTheme, overrides, className, style, ...rest }: ApiBankingThemeProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialTheme || 'light');
  
  // Cast themeOptions.dark to Partial<ApiBankingThemeSchema> to satisfy mergeTokenSchema's parameter type.
  // We assume mergeTokenSchema can handle DeepPartial structures at runtime even if its type signature is stricter.
  const currentPresetTokens = themeMode === 'dark' ? (themeOptions.dark as Partial<ApiBankingThemeSchema>) : {};

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, []);

  const themeContextValue: ThemeContextValue = {
    themeMode,
    toggleTheme,
    setThemeMode,
  };

  const themeOverrides = mergeTokenSchema(currentPresetTokens, (overrides ?? {}) as Partial<ApiBankingThemeSchema>) as Partial<ApiBankingThemeSchema>;
  
  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ApiBankingThemeProvider.ThemeProvider
        className={classNames(styles.apiBankingTheme, className)}
        overrides={themeOverrides}
        style={style}
        {...rest}
      >
        <PortalContainerProvider>
          {children}
        </PortalContainerProvider>
      </ApiBankingThemeProvider.ThemeProvider>
    </ThemeContext.Provider>
  );
}