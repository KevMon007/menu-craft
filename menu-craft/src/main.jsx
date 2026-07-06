import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
// Importamos tu proveedor de notificaciones globales
import { NotificationProvider } from './components/ToastNotification.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envolvemos la aplicación entera aquí */}
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </StrictMode>,
);
