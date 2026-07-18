import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => setNotification(null);

  useEffect(() => {
    if (notification && notification.type !== 'loading') {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const styles = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    loading: 'bg-blue-100 border-blue-500 text-blue-800 animate-pulse',
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, closeNotification }}
    >
      {children}

      {notification && (
        <div
          className={`fixed bottom-5 right-5 flex items-center p-4 border-l-4 rounded shadow-lg max-w-sm z-50 transition-all ${styles[notification.type]}`}
        >
          <div className="flex-1 mr-3 text-sm font-semibold">
            {notification.type === 'loading' && '⏳ '}
            {notification.type === 'success' && '✅ '}
            {notification.type === 'error' && '❌ '}
            {notification.message}
          </div>
          {notification.type !== 'loading' && (
            <button
              onClick={closeNotification}
              className="text-gray-500 hover:text-gray-800 text-xs font-bold px-1"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
