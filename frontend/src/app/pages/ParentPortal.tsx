import { useState } from "react";
import { toast } from "sonner";
import { Download, Flame, LogOut } from "lucide-react";
import { AvatarComp } from "../components/AvatarComp";
import { ProgressBar } from "../components/ProgressBar";
import { BadgeComp } from "../components/BadgeComp";
import { Logo } from "../components/Logo";
import { useMe, useAttempts } from "../../lib/api";
import { G, PURPLE, BLUE, AMBER, RED } from "../constants";
import { subjectProgress } from "../data/mockData";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function ParentPortal({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const { data: user } = useMe();
  const attemptsQuery = useAttempts();
  const child = {
    name: (user as any)?.name || "Your Child",
    class: (user as any)?.class || "—",
    school: (user as any)?.school || "—",
    streak: 0,
  };

  const masteryData = subjectProgress;

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="border-b border-border bg-card px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
        <Logo onClick={() => onNavigate("home")} />
        <div className="flex items-center gap-2">
          <BadgeComp label="Parent" color={PURPLE} />
          <AvatarComp initials="BE" size="sm" color={PURPLE} />
          <button onClick={() => onNavigate("home")} className="ml-2 text-muted-foreground hover:text-foreground"><LogOut size={16} /></button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8 p-5 bg-card rounded-2xl border border-border">
          <AvatarComp initials={child.name.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase()} size="lg" />
          <div>
            <div className="font-black text-xl text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>{child.name}</div>
            <div className="text-sm text-muted-foreground">{child.class} · {child.school}</div>
            <div className="flex items-center gap-2 mt-1">
              <Flame size={14} style={{ color: "#f97316" }} />
              <span className="text-xs font-bold text-orange-600">{child.streak}-day study streak</span>
            </div>
          </div>
          <div className="ml-auto hidden sm:block">
            <button onClick={() => toast.info("Report downloaded!")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-muted">
              <Download size={14} /> Download Report
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Avg. Score", value: "74.8%", trend: "+3.2%", color: G },
            { label: "Study Hours/Week", value: "21.5h", trend: "+2h", color: BLUE },
            { label: "National Rank", value: "#5", trend: "↑3 spots", color: AMBER },
            { label: "Questions Practiced", value: "1,247", trend: "This month", color: PURPLE },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">{s.label}</div>
              <div className="text-2xl font-black text-foreground mb-0.5" style={{ fontFamily: "Nunito, sans-serif" }}>{s.value}</div>
              <div className="text-xs font-semibold" style={{ color: s.color }}>{s.trend}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="font-bold text-foreground mb-4">Subject Performance</div>
            <div className="space-y-3">
             {masteryData.map(s => (
                <div key={s.subject} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-semibold text-foreground">{s.subject}</div>
                  <div className="flex-1"><ProgressBar value={s.mastery} color={s.mastery >= 80 ? G : s.mastery >= 65 ? AMBER : RED} /></div>
                  <div className="w-10 text-right text-sm font-bold" style={{ color: s.mastery >= 80 ? G : s.mastery >= 65 ? AMBER : RED }}>{s.mastery}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="font-bold text-foreground mb-4">Recent Activity</div>
            <div className="space-y-3">
              {(
                attemptsQuery.data && attemptsQuery.data.length
                  ? attemptsQuery.data.slice(0, 5).map((a: any) => ({
                      text: `${a.completedAt ? "Completed" : "Started"} ${a.mode} — ${a.completedAt ? a.score + "%" : "in progress"}`,
                      time: new Date(a.completedAt || a.startedAt).toLocaleString(),
                      icon: a.completedAt ? "🎯" : "📝",
                    }))
                  : [
                      { text: "Completed WAEC Biology Mock — 88%", time: "Today, 9:14 AM", icon: "🎯" },
                      { text: "Studied Chemistry for 1h 45m", time: "Yesterday, 8:00 PM", icon: "📚" },
                      { text: "Earned 'Streak Master' badge", time: "2 days ago", icon: "🏅" },
                      { text: "JAMB Practice — 74% (Maths)", time: "3 days ago", icon: "📊" },
                      { text: "Joined study group: Physics SS3", time: "4 days ago", icon: "👥" },
                    ]
              ).map((a: { text: string; time: string; icon: string }, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{a.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{a.text}</div>
                    <div className="text-xs text-muted-foreground">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
