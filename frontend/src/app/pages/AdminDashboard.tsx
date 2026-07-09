import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Users, BookOpen, FileText, Play, Shield, Trash2 } from "lucide-react";
import { api, useMe } from "../../lib/api";
import { G, PURPLE, BLUE, AMBER, RED } from "../constants";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn" | "admin";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  school?: string;
  state?: string;
  class?: string;
  isVerified: boolean;
  createdAt: string;
}

interface AdminStats {
  users: number;
  courses: number;
  questions: number;
  attempts: number;
  schools: number;
  byRole: { role: string; count: number }[];
}

interface AdminUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export function AdminDashboard({ onNavigate, initialTab = "stats" }: { onNavigate: (p: Page) => void; initialTab?: "stats" | "users" | "schools" }) {
  const { data: me } = useMe();
  const isSuperAdmin = (me as any)?.role === "SUPER_ADMIN";
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "schools">(initialTab);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [schools, setSchools] = useState<any[]>([]);

  const loadStats = async () => {
    try {
      const res = await api<AdminStats>('/admin/stats');
      setStats(res);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load stats");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api<AdminUsersResponse>(`/admin/users?page=${page}&limit=20`);
      setUsers(res.users);
      setTotalUsers(res.total);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load users");
    }
  };

  const loadSchools = async () => {
    try {
      const res = await api<any[]>('/admin/schools');
      setSchools(res);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load schools");
    }
  };

  useEffect(() => {
    loadStats();
    loadUsers();
    loadSchools();
  }, [page]);

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await api(`/admin/users/${userId}/role?role=${role}`, { method: 'PATCH' });
      toast.success("User role updated");
      loadUsers();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update role");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api(`/admin/users/${userId}`, { method: 'DELETE' });
      toast.success("User deleted");
      loadUsers();
      loadStats();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete user");
    }
  };

  const roleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return PURPLE;
      case 'SCHOOL_ADMIN': return BLUE;
      case 'TEACHER': return AMBER;
      case 'PARENT': return G;
      default: return '#6b7280';
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      {!isSuperAdmin ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-5xl">🚫</div>
            <h2 className="font-black text-2xl text-foreground">Admin access required</h2>
            <p className="text-muted-foreground">You need a Super Admin account to view this page.</p>
            <button onClick={() => onNavigate("dashboard")} className="px-4 py-2 rounded-full text-white font-bold" style={{ background: G }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
      <>
      <header className="border-b border-border bg-card px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={20} style={{ color: PURPLE }} />
          <span className="font-black text-foreground">Admin Dashboard</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Admin tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "stats", label: "📊 Statistics" },
            { id: "users", label: "👥 Users" },
            { id: "schools", label: "🏫 Schools" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={activeTab === tab.id ? { background: PURPLE, color: "#fff" } : { background: "#ece8e0", color: "#5c6b5e" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats tab */}
        {activeTab === "stats" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: stats.users.toString(), icon: "👥", color: BLUE },
                { label: "Total Courses", value: stats.courses.toString(), icon: "📚", color: G },
                { label: "Total Questions", value: stats.questions.toString(), icon: "❓", color: AMBER },
                { label: "Total Attempts", value: stats.attempts.toString(), icon: "📝", color: RED },
              ].map(stat => (
                <div key={stat.label} className="bg-card rounded-2xl border border-border p-6">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-semibold mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Users by Role</h3>
              <div className="space-y-3">
                {stats.byRole.map(item => (
                  <div key={item.role} className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{item.role}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(item.count / Math.max(stats.users, 1)) * 100}%`, background: roleColor(item.role) }} />
                      </div>
                      <span className="text-sm font-bold text-foreground w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === "users" && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-bold text-foreground">All Users ({totalUsers})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">School</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: roleColor(user.role) }}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.school || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                            className="text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground"
                          >
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="PARENT">Parent</option>
                            <option value="SCHOOL_ADMIN">School Admin</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                          </select>
                          <button onClick={() => deleteUser(user.id)} className="p-1 hover:bg-red-50 rounded-lg">
                            <Trash2 size={14} style={{ color: RED }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalUsers > 20 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:bg-muted disabled:opacity-40">Previous</button>
                <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(totalUsers / 20)}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= totalUsers} className="px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:bg-muted disabled:opacity-40">Next</button>
              </div>
            )}
          </div>
        )}

        {/* Schools tab */}
        {activeTab === "schools" && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-bold text-foreground">All Schools ({schools.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">City</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">State</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase">Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {schools.map(school => (
                    <tr key={school.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{school.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{school.city || '—'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{school.state || '—'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{school.email || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: school.plan === 'SCHOOL' ? BLUE : school.plan === 'ENTERPRISE' ? PURPLE : G }}>
                          {school.plan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
