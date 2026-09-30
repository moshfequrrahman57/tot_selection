import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
import App2 from './App2.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>

      <App/>

    </AuthProvider>
    
  </StrictMode>,
);