import React from 'react';
// Importamos el gancho para usar las alertas
import { useNotification } from './components/ToastNotification.jsx'; 

function Home() {
  const { showNotification } = useNotification();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-2xl bg-white p-8 shadow-lg text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800">MenuCraft</h1>
        <p className="mt-4 text-lg text-gray-600 mb-6">🚧 En construcción 🚧</p>
        
        {/* Botones de prueba para validar tu tarea de ClickUp */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => showNotification('¡Categoría guardada con éxito!', 'success')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Probar Éxito (Success)
          </button>
          
          <button 
            onClick={() => showNotification('Error al subir la imagen del platillo.', 'error')}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Probar Error
          </button>
          
          <button 
            onClick={() => showNotification('Guardando cambios...', 'loading')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Probar Proceso (Loading)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;