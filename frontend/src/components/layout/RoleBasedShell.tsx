import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Shell from './Shell';

interface RoleBasedShellProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleBasedShell({ allowedRoles, children }: RoleBasedShellProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const role = user.role.name;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export function RoleLayout({ allowed }: { allowed: string[] }) {
  return (
    <RoleBasedShell allowedRoles={allowed}>
      <Shell />
    </RoleBasedShell>
  );
}
