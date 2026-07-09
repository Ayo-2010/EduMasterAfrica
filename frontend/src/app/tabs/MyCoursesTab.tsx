import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { BadgeComp } from "../components/BadgeComp";
import { ProgressBar } from "../components/ProgressBar";
import { enrolledCourses } from "../data/mockData";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function MyCoursesTab({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xl text-foreground">My Courses</h2>
        <button onClick={() => onNavigate("courses")} className="text-sm font-bold flex items-center gap-1" style={{ color: "#0c6438" }}>Browse More <ArrowRight size={14} /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {enrolledCourses.map(c => {
          const pct = Math.round((c.completed / c.lessons) * 100);
          const done = c.completed === c.lessons;
          return (
            <div key={c.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0" style={{ background: c.color }}>📖</div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-foreground leading-snug mb-0.5">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.instructor}</div>
                </div>
                {done && <BadgeComp label="Complete ✓" color="#0c6438" />}
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{c.completed}/{c.lessons} lessons</span>
                  <span className="font-bold" style={{ color: c.color }}>{pct}%</span>
                </div>
                <ProgressBar value={pct} color={c.color} />
              </div>
              <button
                onClick={() => { toast.success(`Resuming ${c.title}`); }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: done ? "#6b7280" : c.color }}>
                {done ? "Review Course" : "Continue Learning →"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
