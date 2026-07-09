import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_DISPLAY_NAMES } from '@/lib/constants';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button onClick={onToggleSidebar} className="lg:hidden rounded-lg p-2 hover:bg-slate-100">
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="hidden md:flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Search className="mr-2 h-4 w-4" />
          Search...
          <kbd className="ml-4 rounded bg-slate-200 px-1.5 py-0.5 text-xs">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-slate-900">{user?.name}</div>
            <div className="text-xs text-slate-500">
              {ROLE_DISPLAY_NAMES[user?.role?.name ?? ''] || user?.role?.name}
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
