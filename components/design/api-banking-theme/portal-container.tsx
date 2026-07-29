import { createContext, useContext, useRef, useEffect, useState, ReactNode } from 'react';

type PortalContainerContextValue = HTMLElement | null;

const PortalContainerContext = createContext<PortalContainerContextValue>(null);

/**
 * Hook to get the portal container element.
 * Returns the portal container inside the theme, or falls back to document.body.
 */
export function usePortalContainer(): HTMLElement {
  const container = useContext(PortalContainerContext);
  return container || document.body;
}

export type PortalContainerProviderProps = {
  children: ReactNode;
};

/**
 * Provider that creates a portal container inside the theme.
 * Components using usePortalContainer() will portal their content here,
 * ensuring they inherit the theme's CSS variables.
 */
export function PortalContainerProvider({ children }: PortalContainerProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainer(containerRef.current);
    }
  }, []);

  return (
    <PortalContainerContext.Provider value={container}>
      {children}
      <div
        ref={containerRef}
        id="portal-container"
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
      />
    </PortalContainerContext.Provider>
  );
}
