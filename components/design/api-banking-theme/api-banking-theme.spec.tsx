import React from 'react';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { ApiBankingTheme, type ApiBankingThemeProps } from './api-banking-theme.js';
import { useThemeController } from './theme-controller.js';
import { usePortalContainer, PortalContainerProvider } from './portal-container.js';

// Test component to access theme context
const ThemeConsumer = () => {
  const { themeMode, setThemeMode, toggleTheme } = useThemeController();
  return (
    <div>
      <span data-testid="theme-mode">{themeMode}</span>
      <button data-testid="set-dark" onClick={() => setThemeMode('dark')}>Set Dark</button>
      <button data-testid="set-light" onClick={() => setThemeMode('light')}>Set Light</button>
      <button data-testid="toggle-theme" onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

// Test component to access portal container
const PortalConsumer = () => {
  const container = usePortalContainer();
  return <div data-testid="portal-container-tag">{container.tagName}</div>;
};

describe('ApiBankingTheme', () => {
  it('renders with the correct children', () => {
    const { getByText } = render(
      <ApiBankingTheme>Hello world!</ApiBankingTheme>
    );
    const rendered = getByText('Hello world!');
    expect(rendered).toBeTruthy();
  });

  it('applies the custom class name to its root element', () => {
    const { container } = render(
      <ApiBankingTheme className="custom-class">Hello world!</ApiBankingTheme>
    );
    // ApiBankingTheme renders a div, and 'apiBankingTheme' is applied to it, along with 'className'.
    // container.firstChild will be this div. We can check if it has the custom class.
    expect(container.querySelector('div.custom-class')).toBeTruthy();
  });

  it('renders with dark theme settings (base class present)', () => {
    const { container } = render(
      <ApiBankingTheme initialTheme="dark">Hello world!</ApiBankingTheme>
    );
    // The 'apiBankingTheme' class is always present. This test ensures the component renders its root div.
    expect(container.querySelector('div.apiBankingTheme')).toBeTruthy();
  });

  it('provides theme context with default light mode', () => {
    render(
      <ApiBankingTheme>
        <ThemeConsumer />
      </ApiBankingTheme>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('provides theme context with dark mode when initialTheme is dark', () => {
    render(
      <ApiBankingTheme initialTheme="dark">
        <ThemeConsumer />
      </ApiBankingTheme>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it('setThemeMode callback sets theme to dark', () => {
    render(
      <ApiBankingTheme>
        <ThemeConsumer />
      </ApiBankingTheme>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');

    fireEvent.click(screen.getByTestId('set-dark'));

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it('setThemeMode callback sets theme to light', () => {
    render(
      <ApiBankingTheme initialTheme="dark">
        <ThemeConsumer />
      </ApiBankingTheme>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');

    fireEvent.click(screen.getByTestId('set-light'));

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('toggleTheme callback switches from light to dark', () => {
    render(
      <ApiBankingTheme>
        <ThemeConsumer />
      </ApiBankingTheme>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it('toggleTheme callback switches from dark to light', () => {
    render(
      <ApiBankingTheme initialTheme="dark">
        <ThemeConsumer />
      </ApiBankingTheme>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('provides all theme functions to children via context', () => {
    render(
      <ApiBankingTheme>
        <ThemeConsumer />
      </ApiBankingTheme>
    );

    // Verify all controls are accessible
    expect(screen.getByTestId('theme-mode')).toBeInTheDocument();
    expect(screen.getByTestId('set-dark')).toBeInTheDocument();
    expect(screen.getByTestId('set-light')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-theme')).toBeInTheDocument();
  });

  it('renders with overrides prop merged with tokens', () => {
    // Use type assertion since Partial doesn't make nested properties optional
    const overrides = {
      colors: {
        primary: {
          default: '#FF0000'
        }
      }
    } as ApiBankingThemeProps['overrides'];

    const { container } = render(
      <ApiBankingTheme overrides={overrides}>
        Hello world!
      </ApiBankingTheme>
    );

    // The component should render successfully with overrides
    expect(container.querySelector('div.apiBankingTheme')).toBeTruthy();
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });
});

describe('useThemeController', () => {
  it('throws error when used outside ApiBankingTheme', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useThemeController());
    }).toThrow('useThemeController must be used within an ApiBankingTheme component');

    consoleSpy.mockRestore();
  });
});

describe('PortalContainerProvider', () => {
  it('provides portal container to children', () => {
    render(
      <ApiBankingTheme>
        <PortalConsumer />
      </ApiBankingTheme>
    );

    // The portal container should be a DIV element
    expect(screen.getByTestId('portal-container-tag')).toBeInTheDocument();
  });

  it('usePortalContainer returns document.body when used outside provider', () => {
    render(<PortalConsumer />);

    // Should fallback to BODY when no provider
    expect(screen.getByTestId('portal-container-tag')).toHaveTextContent('BODY');
  });

  it('creates portal container div with correct id', () => {
    const { container } = render(
      <ApiBankingTheme>
        <div>Test</div>
      </ApiBankingTheme>
    );

    const portalDiv = container.querySelector('#portal-container');
    expect(portalDiv).toBeInTheDocument();
  });
});