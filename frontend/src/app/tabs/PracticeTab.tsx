import { Flame, Target, Check } from "lucide-react";
import { BadgeComp } from "../components/BadgeComp";
import { cbtSubjects, cbtModes } from "../data/mockData";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function PracticeTab({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-black text-xl text-foreground mb-1">Quick Practice</h2>
        <p className="text-sm text-muted-foreground">Pick a subject and start a practice session in seconds.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cbtSubjects.map(s => (
          <button key={s.name} onClick={() => onNavigate("cbt-setup")}
            className="bg-card rounded-2xl border border-border p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style={{ background: s.color }}>
              {s.icon}
            </div>
            <div className="font-bold text-foreground mb-1 group-hover:underline" style={{ textDecorationColor: s.color }}>{s.name}</div>
            <div className="text-xs text-muted-foreground">{s.years.length} years of past questions</div>
            <div className="mt-3 text-xs font-bold" style={{ color: s.color }}>Start Practice →</div>
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={18} style={{ color: "#f97316" }} />
          <div className="font-bold text-foreground">Today's Challenges</div>
        </div>
        <div className="space-y-3">
          {[
            { name: "Daily Biology Sprint", time: "10 questions · 5 min", xp: "+50 XP", done: true },
            { name: "Maths Speed Round", time: "15 questions · 8 min", xp: "+75 XP", done: false },
            { name: "Chemistry Concept Quiz", time: "20 questions · 12 min", xp: "+100 XP", done: false },
          ].map(c => (
            <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c.done ? "#dcfce7" : "#ece8e0" }}>
                  {c.done ? <Check size={14} style={{ color: "#0c6438" }} /> : <Target size={14} className="text-muted-foreground" />}
                </div>
                <div>
                  <div className={`font-bold text-sm ${c.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.time}</div>
                </div>
              </div>
              {c.done ? <BadgeComp label="Done ✓" color="#0c6438" /> : (
                <button onClick={() => onNavigate("cbt")} className="text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "#0c6438" }}>Start</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
