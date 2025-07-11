import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
 const clientId = "627812142753-bde51a0nu2cop3ji87n7qrd3tqlkok9j.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <GoogleOAuthProvider clientId={clientId}>
   <App />
  </GoogleOAuthProvider>
  </StrictMode>,
)
