import { useState } from "react";
import { Award, FileText, LogOut } from "lucide-react";
import { toast } from "sonner";
import { BadgeComp } from "../components/BadgeComp";
import { AvatarComp } from "../components/AvatarComp";
import { ProgressBar } from "../components/ProgressBar";
import { Logo } from "../components/Logo";
import { BLUE, G, PURPLE, RED, AMBER } from "../constants";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function TeacherPortal({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "classes", label: "My Classes", icon: "👥" },
    { id: "cbt", label: "Create CBT", icon: "📝" },
    { id: "grades", label: "Gradebook", icon: "🏆" },
  ];

  const students = [
    { name: "Adaeze Okonkwo", score: 88, subject: "Biology", status: "passed" },
    { name: "Emeka Osei", score: 72, subject: "Biology", status: "passed" },
    { name: "Fatimah Bello", score: 54, subject: "Biology", status: "failed" },
    { name: "Tunde Adesanya", score: 91, subject: "Biology", status: "passed" },
    { name: "Amara Nwosu", score: 68, subject: "Biology", status: "passed" },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="border-b border-border bg-card px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
        <Logo onClick={() => onNavigate("home")} />
        <div className="flex items-center gap-2">
          <BadgeComp label="Teacher" color={BLUE} />
          <AvatarComp initials="TO" size="sm" color={BLUE} />
          <button onClick={() => onNavigate("home")} className="ml-2 text-muted-foreground hover:text-foreground"><LogOut size={16} /></button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Teacher Portal</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Mr. Taiwo Adewale · Biology · SS2A &amp; SS3B</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-border">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === t.id ? "text-green-700" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              style={activeTab === t.id ? { borderColor: G } : {}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Students", value: "147", icon: "👥", color: BLUE },
                { label: "Avg Class Score", value: "71.4%", icon: "📊", color: G },
                { label: "Exams This Month", value: "8", icon: "📋", color: PURPLE },
                { label: "Assignments Due", value: "3", icon: "⏰", color: RED },
              ].map(c => (
                <div key={c.label} className="bg-card rounded-2xl border border-border p-5">
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="text-2xl font-black text-foreground mb-0.5" style={{ fontFamily: "Nunito, sans-serif" }}>{c.value}</div>
                  <div className="text-xs text-muted-foreground font-semibold">{c.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border font-bold text-foreground">Recent Student Performance — Biology Test</div>
              <div className="divide-y divide-border">
                {students.map(s => (
                  <div key={s.name} className="px-5 py-3 flex items-center gap-4">
                    <AvatarComp initials={s.name.split(" ").map(n => n[0]).join("")} size="sm" color={G} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground">{s.name}</div>
                    </div>
                    <div className="w-24 hidden sm:block"><ProgressBar value={s.score} color={s.score >= 70 ? G : s.score >= 50 ? AMBER : RED} /></div>
                    <div className="font-black text-sm w-12 text-right" style={{ color: s.score >= 70 ? G : s.score >= 50 ? AMBER : RED }}>{s.score}%</div>
                    <BadgeComp label={s.status} color={s.status === "passed" ? G : RED} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "cbt" && (
          <div className="max-w-lg">
            <h2 className="font-black text-xl text-foreground mb-4">Create New CBT Exam</h2>
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              {[{ label: "Exam Title", placeholder: "SS2 Biology Mid-Term Test" }, { label: "Class", placeholder: "SS2A" }, { label: "Duration (minutes)", placeholder: "45" }].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">{f.label}</label>
                  <input className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Number of Questions</label>
                <div className="flex gap-2">
                  {[20, 40, 60].map(n => <button key={n} className="px-4 py-2 rounded-lg text-sm font-bold border border-border hover:bg-muted">{n}</button>)}
                </div>
              </div>
              <button onClick={() => toast.success("Exam created! Share the code with your students.")}
                className="w-full py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>
                Generate Exam with AI →
              </button>
            </div>
          </div>
        )}

        {(activeTab === "classes" || activeTab === "grades") && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-4xl mb-3">🏗️</div>
            <div className="font-bold text-foreground mb-1">{activeTab === "classes" ? "Class Management" : "Gradebook"}</div>
            <p className="text-sm text-muted-foreground max-w-xs">Full portal available for school license holders. Contact your administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
}
