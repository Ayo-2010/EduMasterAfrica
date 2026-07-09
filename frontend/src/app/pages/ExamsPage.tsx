import { BookOpen, Timer, Target, ArrowRight, Trophy } from "lucide-react";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER, BLUE, RED, PURPLE } from "../constants";
import { EXAM_TYPES } from "../../lib/mock/data";
import { Page } from "../routing";

export function ExamsPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const pageFor: Record<string, Page> = { waec: "waec-prep", jamb: "jamb-cbt", neco: "neco-mock", "post-utme": "post-utme" };
  return (
    <SiteLayout onNavigate={onNavigate} activePage="exams">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: "rgba(245,166,35,0.15)", color: AMBER }}>
            <Trophy size={12} /> Exam Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Prepare for Every Major Exam</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Real past questions, timed CBT simulations, and AI-marked mock exams for every Nigerian examination.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {EXAM_TYPES.map((e) => (
            <div key={e.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: e.color + "18" }}>{e.icon}</div>
                <div>
                  <div className="font-black text-xl text-foreground">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.subtitle}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {e.subjects.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                <span className="flex items-center gap-1"><BookOpen size={12} /> {e.subjects.length} subjects</span>
                <span className="flex items-center gap-1"><Timer size={12} /> {e.years.length} years</span>
              </div>
              <button onClick={() => onNavigate(pageFor[e.id])} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white" style={{ background: e.color }}>
                Start {e.name} Prep <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-card rounded-2xl border border-border p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: G + "18", color: G }}><Target size={22} /></div>
            <div>
              <div className="font-bold text-foreground">Free CBT Practice</div>
              <div className="text-sm text-muted-foreground">Mix any subject and mode — no exam selected.</div>
            </div>
          </div>
          <button onClick={() => onNavigate("cbt-setup")} className="px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>Open CBT Practice</button>
        </div>
      </div>
    </SiteLayout>
  );
}
