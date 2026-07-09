# Sistema Global de Notificaciones (Toasts)

Este módulo proporciona un sistema de alertas flotantes reutilizables (Toasts) diseñado con **Tailwind CSS**. Su objetivo es dar retroalimentación visual inmediata al usuario cuando realiza acciones clave en la aplicación.

## Cómo utilizarlo

El sistema está conectado de forma global mediante un `NotificationProvider`, por lo que puedes disparar alertas desde **cualquier componente o página** del frontend usando el hook `useNotification`.

### 1: Importar el hook global
En la parte superior de tu archivo de página o componente, importa el hook que conecta con el servicio central de alertas:

```jsx
import { useNotification } from '../components/ToastNotification.jsx';