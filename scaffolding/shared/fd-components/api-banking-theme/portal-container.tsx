import { createContext, useContext, type ReactNode } from 'react';

const PortalContainerContext = createContext<HTMLElement | null>(null);

export function usePortalContainer(): HTMLElement {
  const ctx = useContext(PortalContainerContext);
  return ctx ?? document.body;
}

export function PortalContainerProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
