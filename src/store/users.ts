import { useState, useEffect } from "react";

export type UserRole = "admin" | "dealer" | "proprietor" | "organizer";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  dealership?: string;
  active: boolean;
  createdAt: string;
};

// Initial mock data - will be replaced with API calls
const initialUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@ddpwa.org",
    phone: "9876543210",
    role: "admin",
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "9876543211",
    role: "dealer",
    dealership: "Kumar Petroleum Services",
    active: true,
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "9876543212",
    role: "proprietor",
    dealership: "Sharma Fuel Station",
    active: true,
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    name: "Event Coordinator",
    email: "coordinator@ddpwa.org",
    phone: "9876543213",
    role: "organizer",
    active: true,
    createdAt: "2024-01-20",
  },
];

// API functions - currently using mock data, will be replaced with actual API calls
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/users').then(res => res.json());
    return Promise.resolve(initialUsers);
  },

  getById: async (id: number): Promise<User | undefined> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/users/${id}`).then(res => res.json());
    return Promise.resolve(initialUsers.find((u) => u.id === id));
  },

  create: async (user: Omit<User, "id" | "createdAt">): Promise<User> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/users', { method: 'POST', body: JSON.stringify(user) }).then(res => res.json());
    const newUser = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    return Promise.resolve(newUser);
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }).then(res => res.json());
    const existing = initialUsers.find((u) => u.id === id);
    return Promise.resolve({ ...existing!, ...user });
  },

  delete: async (id: number): Promise<void> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/users/${id}`, { method: 'DELETE' });
    return Promise.resolve();
  },
};

// Custom hook for managing users state
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user: Omit<User, "id" | "createdAt">) => {
    try {
      const newUser = await usersAPI.create(user);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError("Failed to add user");
      throw err;
    }
  };

  const updateUser = async (id: number, user: Partial<User>) => {
    try {
      const updated = await usersAPI.update(id, user);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (err) {
      setError("Failed to update user");
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await usersAPI.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError("Failed to delete user");
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}
