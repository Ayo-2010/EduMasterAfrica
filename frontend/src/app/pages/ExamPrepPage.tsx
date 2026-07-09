import { useState } from "react";
import { BookOpen, Timer, Play, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { EXAM_TYPES } from "../../lib/mock/data";
import { Page } from "../routing";

export function ExamPrepPage({ examId, onNavigate }: { examId: string; onNavigate: (p: Page, courseId?: string) => void }) {
  const exam = EXAM_TYPES.find((e) => e.id === examId) || EXAM_TYPES[0];
  const [subject, setSubject] = useState<string | null>(null);

  return (
    <SiteLayout onNavigate={onNavigate} activePage={("waec-prep" as Page)}>
      <div style={{ background: `linear-gradient(135deg, ${exam.color} 0%, #073d25 100%)` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-white">
          <div className="text-5xl mb-4">{exam.icon}</div>
          <div className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">{exam.subtitle}</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>{exam.name} Preparation</h1>
          <p className="text-white/80 max-w-xl">Practice real past questions, simulate the real exam environment, and track your readiness with AI-marked mock exams.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => onNavigate("cbt-setup")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ background: AMBER, color: "#0d1f12" }}><Play size={16} /> Start CBT Practice</button>
            <button onClick={() => onNavigate("courses")} className="px-6 py-3 rounded-xl font-bold text-sm border-2 border-white/30 hover:bg-white/10">Browse Courses</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">Choose a subject to practice</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exam.subjects.map((s) => (
            <button key={s} onClick={() => { setSubject(s); onNavigate("cbt-setup"); toast.success(`Opening ${s} practice…`); }}
              className={`p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md ${subject === s ? "border-green-600 bg-green-50" : "bg-card border-border"}`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-foreground">{s}</div>
                <BookOpen size={18} style={{ color: exam.color }} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">Past questions, quizzes & mock exams</div>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {[
            { icon: <Timer size={20} />, title: "Timed Exam Mode", desc: "Replicate real exam conditions with countdowns." },
            { icon: <CheckCircle2 size={20} />, title: "Instant Feedback", desc: "See correct answers and explanations immediately." },
            { icon: <Sparkles size={20} />, title: "AI Insights", desc: "Identify weak topics and get a personalised plan." },
          ].map((f) => (
            <div key={f.title} className="bg-card rounded-2xl border border-border p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: G + "18", color: G }}>{f.icon}</div>
              <div className="font-bold text-foreground mb-1">{f.title}</div>
              <div className="text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-card rounded-2xl border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-foreground">Ready for a full {exam.name} mock exam?</div>
          <button onClick={() => onNavigate("cbt-setup")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: exam.color }}>Take Mock <ArrowRight size={16} /></button>
        </div>
      </div>
    </SiteLayout>
  );
}
