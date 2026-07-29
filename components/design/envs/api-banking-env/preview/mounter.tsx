import React from 'react';
import { createMounter } from '@teambit/react.mounter';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { StitchClientProvider } from '@api-banking/stitch.stitch-client';

/**
 * The React provider for the API Banking environment.
 * This provider wraps all component compositions with the ApiBankingTheme
 * and StitchClientProvider, ensuring consistent styling and API access
 * across all components under this environment.
 * @param {object} props - The properties for the provider.
 * @param {React.ReactNode} props.children - The child components to be rendered within the theme.
 * @returns {React.ReactElement} A React element with the theme applied.
 */
export function ApiBankingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StitchClientProvider mock>
      <ApiBankingTheme>{children}</ApiBankingTheme>
    </StitchClientProvider>
  );
}

/**
 * The entry for the app (preview runtime) that renders your component previews.
 * This mounter wraps compositions with the ApiBankingProvider.
 * @see https://bit.dev/docs/react-env/component-previews#composition-mounter
 */
export default createMounter(ApiBankingProvider) as any;
