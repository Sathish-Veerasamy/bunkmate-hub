import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id?: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Tenant {
  tenantId: string | number;
  name: string;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  setTenant: (tenant: Tenant) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      setTenant: (tenant) => set({ tenant }),
      logout: () => set({ user: null, tenant: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
