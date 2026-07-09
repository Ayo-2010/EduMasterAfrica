import { useAuth } from '@/hooks/useAuth';

export default function SchoolAdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">School Dashboard</h1>
        <p className="text-sm text-slate-500">
          Welcome back, {user?.name}. Manage your school operations here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Students', value: '1,240' },
          { label: 'Teachers', value: '56' },
          { label: 'Classes', value: '24' },
          { label: 'Average Attendance', value: '94%' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Today Overview</h3>
          <div className="mt-4 space-y-3">
            {['8 live classes scheduled', '3 assignments due', '12 pending approvals', '5 support tickets open'].map((item, i) => (
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
            {['Add Teacher', 'Create Class', 'Post Announcement', 'Review Attendance'].map((action) => (
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
