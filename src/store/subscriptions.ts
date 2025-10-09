import { useState, useEffect } from "react";

export type SubscriptionStatus = "active" | "expiring" | "expired";

export type Subscription = {
  id: number;
  dealerName: string;
  dealershipName: string;
  membershipNo: string;
  renewalDate: string;
  status: SubscriptionStatus;
  amount: number;
};

// Initial mock data - will be replaced with API calls
const initialSubscriptions: Subscription[] = [
  {
    id: 1,
    dealerName: "Rajesh Kumar",
    dealershipName: "Kumar Petroleum Services",
    membershipNo: "DDPWA001",
    renewalDate: "2026-03-31",
    status: "active",
    amount: 5000,
  },
  {
    id: 2,
    dealerName: "Priya Sharma",
    dealershipName: "Sharma Fuel Station",
    membershipNo: "DDPWA002",
    renewalDate: "2025-12-31",
    status: "active",
    amount: 5000,
  },
  {
    id: 3,
    dealerName: "Mohammed Ali",
    dealershipName: "Ali Petro Center",
    membershipNo: "DDPWA003",
    renewalDate: "2025-06-30",
    status: "expiring",
    amount: 5000,
  },
  {
    id: 4,
    dealerName: "Lakshmi Devi",
    dealershipName: "Devi Fuel Solutions",
    membershipNo: "DDPWA004",
    renewalDate: "2025-03-15",
    status: "expired",
    amount: 5000,
  },
];

// API functions - currently using mock data, will be replaced with actual API calls
export const subscriptionsAPI = {
  getAll: async (): Promise<Subscription[]> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/subscriptions').then(res => res.json());
    return Promise.resolve(initialSubscriptions);
  },

  getById: async (id: number): Promise<Subscription | undefined> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/subscriptions/${id}`).then(res => res.json());
    return Promise.resolve(initialSubscriptions.find((s) => s.id === id));
  },

  getByDealerId: async (dealerId: number): Promise<Subscription[]> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/subscriptions?dealerId=${dealerId}`).then(res => res.json());
    return Promise.resolve(initialSubscriptions);
  },

  create: async (
    subscription: Omit<Subscription, "id">
  ): Promise<Subscription> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/subscriptions', { method: 'POST', body: JSON.stringify(subscription) }).then(res => res.json());
    const newSubscription = { ...subscription, id: Date.now() };
    return Promise.resolve(newSubscription);
  },

  update: async (
    id: number,
    subscription: Partial<Subscription>
  ): Promise<Subscription> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(subscription) }).then(res => res.json());
    const existing = initialSubscriptions.find((s) => s.id === id);
    return Promise.resolve({ ...existing!, ...subscription });
  },

  renew: async (id: number): Promise<Subscription> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/subscriptions/${id}/renew`, { method: 'POST' }).then(res => res.json());
    const existing = initialSubscriptions.find((s) => s.id === id);
    const renewalDate = new Date();
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    return Promise.resolve({
      ...existing!,
      status: "active",
      renewalDate: renewalDate.toISOString().split("T")[0],
    });
  },
};

// Custom hook for managing subscriptions state
export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionsAPI.getAll();
      setSubscriptions(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch subscriptions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSubscription = async (subscription: Omit<Subscription, "id">) => {
    try {
      const newSubscription = await subscriptionsAPI.create(subscription);
      setSubscriptions((prev) => [...prev, newSubscription]);
      return newSubscription;
    } catch (err) {
      setError("Failed to add subscription");
      throw err;
    }
  };

  const updateSubscription = async (
    id: number,
    subscription: Partial<Subscription>
  ) => {
    try {
      const updated = await subscriptionsAPI.update(id, subscription);
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return updated;
    } catch (err) {
      setError("Failed to update subscription");
      throw err;
    }
  };

  const renewSubscription = async (id: number) => {
    try {
      const renewed = await subscriptionsAPI.renew(id);
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? renewed : s)));
      return renewed;
    } catch (err) {
      setError("Failed to renew subscription");
      throw err;
    }
  };

  const getStats = () => {
    return {
      active: subscriptions.filter((s) => s.status === "active").length,
      expiring: subscriptions.filter((s) => s.status === "expiring").length,
      expired: subscriptions.filter((s) => s.status === "expired").length,
      total: subscriptions.length,
    };
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    addSubscription,
    updateSubscription,
    renewSubscription,
    getStats,
    refetch: fetchSubscriptions,
  };
}
