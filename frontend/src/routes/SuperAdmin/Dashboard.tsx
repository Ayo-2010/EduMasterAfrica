import { useAuth } from '@/hooks/useAuth';

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-sm text-slate-500">
          Welcome back, {user?.name}. Here's what's happening across EduMaster Africa.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: '12,450', change: '+12%' },
          { label: 'Schools', value: '234', change: '+5%' },
          { label: 'Courses', value: '1,890', change: '+8%' },
          { label: 'Revenue', value: '₦4.2M', change: '+18%' },
          { label: 'Pending Reviews', value: '56', change: '-3%' },
          { label: 'Support Tickets', value: '12', change: '-8%' },
          { label: 'Active Exams', value: '8', change: '0%' },
          { label: 'System Health', value: '99.9%', change: '+0.1%' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              <span className={stat.change.startsWith('+') ? 'text-brand-600' : 'text-red-600'}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Recent Activity</h3>
          <div className="mt-4 space-y-3">
            {['New school registered: Greenfield Academy', 'Teacher profile updated: Mr. Adeyemi', 'New exam created: WAEC Mock 2026', 'Payment received: ₦150,000'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <div className="h-2 w-2 rounded-full bg-brand-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Quick Actions</h3>
          <div className="mt-4 space-y-2">
            {['Review Questions', 'Manage Schools', 'Create Announcement', 'View Audit Logs'].map((action) => (
              <button key={action} className="w-full text-left rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
