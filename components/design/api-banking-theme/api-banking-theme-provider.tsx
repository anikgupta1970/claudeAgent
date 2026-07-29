import { createTheme } from '@bitdesign/sparks.sparks-theme';
import { ApiBankingThemeSchema, apiBankingThemeTokens } from './api-banking-theme-tokens.js';

/**
 * creating and declaring the api-banking theme.
 * define the theme schema as a type variable for proper type completions.
 */
export const ApiBankingThemeProvider = createTheme<ApiBankingThemeSchema>({
  tokens: apiBankingThemeTokens,
});

/**
 * a react hook for contextual access to design token
 * from components.
 */
export const { useTheme } = ApiBankingThemeProvider;