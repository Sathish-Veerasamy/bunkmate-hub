import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  token?: string;
}

export interface Tenant {
  id: string;
  org_name: string;
  org_type?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setTenant: (tenant: Tenant) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tenant: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      setTenant: (tenant) => set({ tenant }),
      logout: () => {
        // Clear all auth-related data from storage
        localStorage.removeItem('auth-storage');
        sessionStorage.clear();
        set({ user: null, token: null, tenant: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
