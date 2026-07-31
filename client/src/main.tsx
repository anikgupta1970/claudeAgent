import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PortalContainerProvider } from '@api-banking/design.api-banking-theme';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortalContainerProvider>
      <App />
    </PortalContainerProvider>
  </StrictMode>
);
