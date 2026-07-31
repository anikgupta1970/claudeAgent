import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PortalContainerProvider } from './fd-components/api-banking-theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortalContainerProvider>
      <App />
    </PortalContainerProvider>
  </StrictMode>,
)
