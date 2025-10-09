import { useState, useEffect } from "react";

export type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type?: "info" | "warning" | "success" | "error";
};

// Initial mock data - will be replaced with API calls
const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "New Event Created",
    message: "Annual General Meeting scheduled for next week",
    time: "2 hours ago",
    unread: true,
    type: "info",
  },
  {
    id: 2,
    title: "Subscription Expiring",
    message: "5 dealers have subscriptions expiring this month",
    time: "5 hours ago",
    unread: true,
    type: "warning",
  },
  {
    id: 3,
    title: "New Dealer Added",
    message: "Rajesh Kumar joined as a new dealer",
    time: "1 day ago",
    unread: false,
    type: "success",
  },
];

// API functions - currently using mock data, will be replaced with actual API calls
export const notificationsAPI = {
  getAll: async (): Promise<Notification[]> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/notifications').then(res => res.json());
    return Promise.resolve(initialNotifications);
  },

  markAsRead: async (id: number): Promise<void> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    return Promise.resolve();
  },

  markAllAsRead: async (): Promise<void> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/notifications/read-all', { method: 'POST' });
    return Promise.resolve();
  },

  delete: async (id: number): Promise<void> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    return Promise.resolve();
  },
};

// Custom hook for managing notifications state
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsAPI.getAll();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      );
    } catch (err) {
      setError("Failed to mark notification as read");
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      setError("Failed to mark all notifications as read");
      throw err;
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError("Failed to delete notification");
      throw err;
    }
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => n.unread).length;
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    refetch: fetchNotifications,
  };
}
