import { useAuth } from '@/hooks/useAuth';

export default function ParentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Parent Portal</h1>
        <p className="text-sm text-slate-500">
          Welcome back, {user?.name}. Track your children's progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Children', value: '2' },
          { label: 'Average Grade', value: 'B+' },
          { label: 'Attendance', value: '96%' },
          { label: 'Pending Fees', value: '₦45,000' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Children Overview</h3>
          <div className="mt-4 space-y-3">
            {['Chidi - JSS 3', 'Amara - SS 1'].map((child, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <span className="font-medium text-slate-900">{child}</span>
                <span className="text-sm text-brand-600">View Details →</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Recent Updates</h3>
          <div className="mt-4 space-y-3">
            {['New assignment posted: Mathematics', 'Exam result released: English', 'Fee payment reminder'].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <div className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
