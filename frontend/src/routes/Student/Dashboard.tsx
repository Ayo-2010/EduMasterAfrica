import { useAuth } from '@/hooks/useAuth';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hi, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-slate-500">Continue where you left off.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Courses Enrolled', value: '8' },
          { label: 'Completed', value: '45%' },
          { label: 'Upcoming Exams', value: '2' },
          { label: 'Streak', value: '12 days' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Continue Learning</h3>
          <div className="mt-4 space-y-3">
            {['Physics - Waves & Optics', 'Mathematics - Calculus', 'English - Essay Writing'].map((course, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <div className="font-medium text-slate-900">{course}</div>
                  <div className="text-xs text-slate-500">Lesson {3 + i} of 12</div>
                </div>
                <div className="h-2 w-24 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-brand-500" style={{ width: `${30 + i * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Achievements</h3>
          <div className="mt-4 space-y-3">
            {['Perfect Attendance', 'Quiz Master', 'Early Bird'].map((achievement, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">🏆</div>
                <span className="text-sm font-medium text-slate-700">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
