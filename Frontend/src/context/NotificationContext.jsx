import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeToast, setActiveToast] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const list = await notificationService.getNotifications();
      setNotifications(list || []);
      const unread = (list || []).filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch {
      // Graceful fallback
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignore error
    }
  };

  const showToast = (message, type = 'info') => {
    setActiveToast({ message, type, id: Date.now() });
    setTimeout(() => setActiveToast(null), 5000);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        showToast,
      }}
    >
      {children}

      {/* Floating Toast Notification Banner */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce">
          <div
            className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 text-white ${
              activeToast.type === 'success'
                ? 'bg-emerald-600'
                : activeToast.type === 'error'
                ? 'bg-rose-600'
                : 'bg-slate-900'
            }`}
          >
            <div className="flex-1 text-sm font-medium">{activeToast.message}</div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-white/80 hover:text-white text-xs font-bold px-2 py-1 bg-white/10 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
