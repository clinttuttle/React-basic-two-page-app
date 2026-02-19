
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AsgardeoProvider } from '@asgardeo/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AsgardeoProvider
      clientId="r1Z2yWIIffEiKYPXc3xGqoHv_2Qa"
      baseUrl="https://api.asgardeo.io/t/neworg2"
      signInRedirectURL="http://localhost:5173/"
      signOutRedirectURL="http://localhost:5173/"
      scopes="openid profile"
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
)