import { useAuth } from '@/hooks/useAuth';

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="text-sm text-slate-500">
          Welcome back, {user?.name}. Here's your teaching overview.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'My Classes', value: '6' },
          { label: 'Students', value: '180' },
          { label: 'Assignments', value: '4 due today' },
          { label: 'Live Classes', value: '2 upcoming' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Today's Schedule</h3>
          <div className="mt-4 space-y-3">
            {['Mathematics - JSS 2A (8:00 AM)', 'English Language - JSS 3B (10:00 AM)', 'Physics - SS 1 (12:00 PM)'].map((item, i) => (
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
            {['Create Lesson', 'Post Assignment', 'Grade Submissions', 'Start Live Class'].map((action) => (
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
