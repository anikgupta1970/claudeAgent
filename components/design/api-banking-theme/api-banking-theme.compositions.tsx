import { TokenViewer } from '@bitdesign/sparks.sparks-theme';
import { ReactNode } from 'react';
import { useTheme } from './api-banking-theme-provider.js';
import { ApiBankingTheme } from './api-banking-theme.js';
import { useThemeController } from './theme-controller.js';

function ViewTokens() {
  const theme = useTheme();

  return <TokenViewer theme={theme} />;
}

function ThemeWrapper({ children }: { children: ReactNode }) {
    const { themeMode, toggleTheme } = useThemeController();

    const buttonStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        padding: '8px 16px',
        backgroundColor: 'var(--colors-primary-default)',
        color: 'var(--colors-text-inverse)',
        border: 'none',
        borderRadius: 'var(--borders-radius-medium)',
        cursor: 'pointer',
        zIndex: 1000,
    };

    return (
        <div>
            {children}
            <button style={buttonStyle} onClick={toggleTheme}>
                Toggle to {themeMode === 'light' ? 'Dark' : 'Light'} Mode
            </button>
        </div>
    );
}


export const LightTheme = () => {
  return (
    <ApiBankingTheme>
        <ThemeWrapper>
            <ViewTokens />
        </ThemeWrapper>
    </ApiBankingTheme>
  );
};

export const DarkTheme = () => {
  return (
    <ApiBankingTheme initialTheme='dark'>
        <ThemeWrapper>
            <ViewTokens />
        </ThemeWrapper>
    </ApiBankingTheme>
  );
};