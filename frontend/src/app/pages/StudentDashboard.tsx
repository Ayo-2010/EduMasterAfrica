import { useState } from "react";
import { Shield, Users, GraduationCap } from "lucide-react";
import { G, AMBER, PURPLE, BLUE, RED } from "../constants";
import { MyCoursesTab } from "../tabs/MyCoursesTab";
import { PracticeTab } from "../tabs/PracticeTab";
import { AnalyticsTab } from "../tabs/AnalyticsTab";
import { LeaderboardTab } from "../tabs/LeaderboardTab";
import { useMe, useAiChat } from "../../lib/api";
import { AdminDashboard } from "./AdminDashboard";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn" | "admin";

export function StudentDashboard({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [activeTab, setActiveTab] = useState("courses");
  const { data: user } = useMe();
  const userRole = (user as any)?.role;
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  if (!user) {
    return (
      <div className="min-h-screen bg-background font-body flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🎓</div>
          <div className="font-black text-xl text-foreground mb-2">Your dashboard awaits</div>
          <p className="text-sm text-muted-foreground mb-6">Sign in to track courses, exams, and your leaderboard rank.</p>
          <button onClick={() => onNavigate("auth")} className="px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>Sign In</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "courses", label: "My Courses" },
    { id: "practice", label: "Practice" },
    { id: "analytics", label: "Analytics" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "ai", label: "AI Tutor" },
    ...(isSuperAdmin ? [{ id: "admin", label: "🔒 Admin" }] : []),
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={activeTab === t.id ? { background: t.id === "admin" ? PURPLE : G, color: "#fff" } : { background: "#ece8e0", color: "#5c6b5e" }}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "courses" && <MyCoursesTab onNavigate={onNavigate} />}
        {activeTab === "practice" && <PracticeTab onNavigate={onNavigate} />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "leaderboard" && <LeaderboardTab />}
        {activeTab === "ai" && <AITutorTab />}
        {activeTab === "admin" && isSuperAdmin && <AdminPlaceholder onNavigate={onNavigate} />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

function AdminPlaceholder({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [view, setView] = useState<"home" | "users" | "schools">("home");

  if (view === "users" || view === "schools") {
    return <AdminDashboard onNavigate={onNavigate} initialTab={view} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <button onClick={() => setView("users")} className="bg-card rounded-2xl border border-border p-6 text-left hover:shadow-md transition-all">
        <Users className="h-8 w-8 mb-3" style={{ color: BLUE }} />
        <h3 className="font-black text-foreground">User Management</h3>
        <p className="text-sm text-muted-foreground">Students, teachers, parents, moderators</p>
      </button>
      <button onClick={() => setView("schools")} className="bg-card rounded-2xl border border-border p-6 text-left hover:shadow-md transition-all">
        <GraduationCap className="h-8 w-8 mb-3" style={{ color: G }} />
        <h3 className="font-black text-foreground">Schools</h3>
        <p className="text-sm text-muted-foreground">View and manage registered schools</p>
      </button>
    </div>
  );
}

function AITutorTab() {
  const [input, setInput] = useState("");
  const { mutate, data, isPending } = useAiChat();

  const send = () => {
    if (!input.trim()) return;
    mutate(input);
    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="font-black text-xl text-foreground">AI Tutor</h2>
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3 min-h-[200px]">
        {data ? (
          <p className="text-foreground whitespace-pre-wrap">{(data as any)?.reply || data}</p>
        ) : (
          <p className="text-muted-foreground">Ask me anything about your subjects...</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Type your question..."
        />
        <button onClick={send} disabled={isPending} className="px-6 py-3 rounded-xl text-white font-bold" style={{ background: G }}>
          {isPending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-black text-xl text-foreground mb-4">Settings</h2>
      <div className="bg-card rounded-2xl border border-border divide-y divide-border">
        {["Account", "Notifications", "Privacy", "Help"].map((item) => (
          <button key={item} className="w-full text-left px-6 py-4 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
