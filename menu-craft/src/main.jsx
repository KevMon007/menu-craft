import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './Home.jsx';
// Importamos el proveedor de notificaciones globales que creaste
import { NotificationProvider } from './components/ToastNotification.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envolvemos la aplicación entera aquí */}
    <NotificationProvider>
      <Home />
    </NotificationProvider>
  </StrictMode>,
);