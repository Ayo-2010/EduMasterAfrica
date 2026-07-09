import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, RoleName } from '@/lib/types';
import { ROLE_HIERARCHY } from '@/lib/constants';
import api from '@/lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async ({ email, password }) => {
        const { data } = await api.post<{ user: User; token: string }>('/auth/login', {
          email,
          password,
        });
        localStorage.setItem('edumaster_token', data.token);
        set({ user: data.user, token: data.token, isAuthenticated: true });
      },

      register: async ({ email, password, name }) => {
        const { data } = await api.post<{ user: User; token: string }>('/auth/register', {
          email,
          password,
          name,
          role: 'STUDENT',
        });
        localStorage.setItem('edumaster_token', data.token);
        set({ user: data.user, token: data.token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('edumaster_token');
        localStorage.removeItem('edumaster_user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateProfile: async (data) => {
        const { data: updated } = await api.patch<User>('/auth/me', data);
        set({ user: updated });
      },

      fetchMe: async () => {
        const { data } = await api.get<User>('/auth/me');
        set({ user: data, isAuthenticated: true });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'edumaster-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export function getUserRole(user: User | null): RoleName | null {
  return user?.role?.name ?? null;
}

export function hasRole(user: User | null, role: RoleName | RoleName[]): boolean {
  const current = getUserRole(user);
  if (!current) return false;
  const allowed = Array.isArray(role) ? role : [role];
  return allowed.includes(current);
}

export function getHighestRole(roles: RoleName[]): RoleName | null {
  if (roles.length === 0) return null;
  return roles.reduce((highest, current) => {
    const h = ROLE_HIERARCHY[highest] || 0;
    const c = ROLE_HIERARCHY[current] || 0;
    return c > h ? current : highest;
  });
}
