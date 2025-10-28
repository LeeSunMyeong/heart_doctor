import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: number) => void;
  setUnreadCount: (count: number) => void;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setNotifications: (notifications: Notification[]) => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount });
  },

  addNotification: (notification: Notification) => {
    const { notifications } = get();
    set({
      notifications: [notification, ...notifications],
      unreadCount: notification.isRead ? get().unreadCount : get().unreadCount + 1,
    });
  },

  markAsRead: (notificationId: number) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map((n) =>
      n.id === notificationId ? { ...n, isRead: true, readTime: new Date().toISOString() } : n
    );
    const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;
    set({ notifications: updatedNotifications, unreadCount });
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      isRead: true,
      readTime: n.readTime || new Date().toISOString(),
    }));
    set({ notifications: updatedNotifications, unreadCount: 0 });
  },

  deleteNotification: (notificationId: number) => {
    const { notifications } = get();
    const notification = notifications.find((n) => n.id === notificationId);
    const updatedNotifications = notifications.filter((n) => n.id !== notificationId);
    const unreadCount = notification && !notification.isRead ? get().unreadCount - 1 : get().unreadCount;
    set({ notifications: updatedNotifications, unreadCount });
  },

  setUnreadCount: (count: number) => {
    set({ unreadCount: count });
  },

  clearError: () => {
    set({ error: null });
  },
}));
