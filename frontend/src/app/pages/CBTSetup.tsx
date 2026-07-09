import { useState } from "react";
import { ChevronLeft, Check, Play, RefreshCw, BookOpen, Brain, GraduationCap, Zap, AlarmClock } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "../components/Logo";
import { useSubjects, useStartAttempt } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { cbtSubjects, cbtModes } from "../data/mockData";
import { G } from "../constants";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function CBTSetup({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [subject, setSubject] = useState<string | null>(null);
  const [year, setYear] = useState<string>("2023");
  const [mode, setMode] = useState<string>("practice");
  const [step, setStep] = useState(1);
  const startAttemptMutation = useStartAttempt();
  const subjectsQuery = useSubjects();
  const queryClient = useQueryClient();
  const availableSubjects = (subjectsQuery.data as any[])?.map(s => s.name) || [];
  const subjectList = cbtSubjects.filter(s => availableSubjects.length === 0 || availableSubjects.includes(s.name));
  const selectedSubject = cbtSubjects.find(s => s.name === subject);

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="border-b border-border bg-card px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
        <Logo />
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "text-white" : "bg-muted text-muted-foreground"}`}
                style={step >= s ? { background: G } : {}}>
                {step > s ? <Check size={14} /> : s}
              </div>
              <span className={`text-sm font-semibold ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "Subject" : s === 2 ? "Settings" : "Start"}
              </span>
              {s < 3 && <div className="flex-1 h-px bg-border w-8 sm:w-16" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>Choose a Subject</h1>
            <p className="text-muted-foreground text-sm mb-6">Select the subject you want to practice today.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {subjectList.map(s => (
                <button key={s.name} onClick={() => setSubject(s.name)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${subject === s.name ? "text-white" : "bg-card border-border"}`}
                  style={subject === s.name ? { background: s.color, borderColor: s.color } : {}}>
                  <div className={`mb-2`} style={subject !== s.name ? { color: s.color } : {}}>{s.icon}</div>
                  <div className={`font-bold text-sm ${subject === s.name ? "text-white" : "text-foreground"}`}>{s.name}</div>
                  <div className={`text-xs ${subject === s.name ? "text-white/70" : "text-muted-foreground"}`}>{s.years.length} years</div>
                </button>
              ))}
            </div>
            <button onClick={() => subject && setStep(2)} disabled={!subject}
              className="mt-6 px-6 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40 transition-all"
              style={{ background: G }}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && selectedSubject && (
          <div>
            <h1 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>Configure Your Session</h1>
            <p className="text-muted-foreground text-sm mb-6">{subject} · Customise your practice.</p>

            <div className="space-y-6">
              <div>
                <div className="text-sm font-bold text-foreground mb-3">Year / Paper</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSubject.years.map(y => (
                    <button key={y} onClick={() => setYear(y)}
                      className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
                      style={year === y ? { background: selectedSubject.color, color: "#fff" } : { background: "#ece8e0", color: "#5c6b5e" }}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-foreground mb-3">Mode</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {cbtModes.map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${mode === m.id ? "border-green-600 bg-green-50" : "border-border bg-card"}`}>
                      <div className="text-xl mb-1">{m.icon}</div>
                      <div className={`font-bold text-sm ${mode === m.id ? "text-green-800" : "text-foreground"}`}>{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl font-bold text-sm border border-border hover:bg-muted">← Back</button>
              <button onClick={() => setStep(3)} className="px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>Review →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>Ready to Start!</h1>
            <p className="text-muted-foreground text-sm mb-6">Review your session details below.</p>
            <div className="bg-card rounded-2xl border border-border p-6 mb-6 space-y-4">
              {[
                { label: "Subject", value: subject || "" },
                { label: "Year", value: year },
                { label: "Mode", value: cbtModes.find(m2 => m2.id === mode)?.label || "" },
                { label: "Questions", value: "5 questions (demo)" },
                { label: "Duration", value: mode === "practice" ? "Untimed" : "45 minutes" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-semibold">{row.label}</span>
                  <span className="font-bold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-5 py-3 rounded-xl font-bold text-sm border border-border hover:bg-muted">← Back</button>
              <button onClick={              async () => {
                try {
                  const result = await startAttemptMutation.mutateAsync({ subject: subject!, mode, questionCount: 10 });
                  queryClient.setQueryData(['currentAttempt'], result);
                  try { localStorage.setItem('edumaster_current_attempt', JSON.stringify(result)); } catch {}
                  onNavigate("cbt");
                } catch (error: any) {
                  if (String(error?.message || "").toLowerCase().includes("sign in")) {
                    toast.error("Please sign in to start an exam");
                    onNavigate("auth");
                  } else {
                    toast.error("Failed to start exam");
                  }
                }
              }}
                disabled={startAttemptMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white"
                style={{ background: G }}>
                {startAttemptMutation.isPending ? <><RefreshCw size={16} className="animate-spin" /> Loading...</> : <><Play size={16} /> Start Exam</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
