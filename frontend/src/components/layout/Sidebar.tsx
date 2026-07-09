import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuItem } from '@/data/sidebarConfigs';
import { ChevronRight, ChevronDown, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/permissions';
import { MENU_MAP } from '@/data/sidebarConfigs';

interface SidebarProps {
  items: MenuItem[];
}

function SidebarItem({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const hasChildren = !!item.children && item.children.length > 0;
  const baseClasses = cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    depth > 0 ? 'pl-11' : 'pl-3'
  );

  if (hasChildren && item.href) {
    // Should not happen in config, but handle defensively
  }

  if (hasChildren) {
    const isChildActive = item.children?.some((child) => location.pathname.startsWith(child.href || ''));
    return (
      <div key={item.key}>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            baseClasses,
            'w-full justify-between text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            isChildActive && 'bg-slate-100 text-slate-900'
          )}
        >
          <span className="flex items-center gap-3">
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.label}
          </span>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {open && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <SidebarItem key={child.key} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!item.href) return null;

  return (
    <NavLink
      key={item.key}
      to={item.href}
      className={({ isActive }) =>
        cn(baseClasses, isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
      }
      end={depth === 0}
    >
      {item.icon && <item.icon className="h-4 w-4" />}
      {item.label}
      {item.badge && (
        <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">{item.badge}</span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ items }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = user?.role?.name ?? '';
  const menu = items.length > 0 ? items : (MENU_MAP[role] || []);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-2 font-bold text-lg text-brand-700">
          <GraduationCap className="h-6 w-6" />
          <span>EduMaster</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {menu.map((item) => (
            <SidebarItem key={item.key} item={item} />
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}


