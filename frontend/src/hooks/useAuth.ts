import { useAuthStore } from '@/contexts/AuthContext';
import type { RoleName } from '@/lib/types';
import { hasRole } from '@/contexts/AuthContext';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const setUser = useAuthStore((s) => s.setUser);

  const role = user?.role?.name ?? null;

  return {
    user,
    token,
    isAuthenticated,
    role,
    login,
    register,
    logout,
    fetchMe,
    updateProfile,
    setUser,
    canAccess: (roles: RoleName | RoleName[]) => hasRole(user, roles),
  };
}
