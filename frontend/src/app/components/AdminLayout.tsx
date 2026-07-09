import { AdminShell } from './AdminShell';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}