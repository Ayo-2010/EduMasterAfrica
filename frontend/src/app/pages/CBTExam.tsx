import { useState, useEffect } from "react";
import { ChevronLeft, AlarmClock, RefreshCw, Bookmark, Play, Check, X, ChevronRight, Sparkles, Brain } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSubmitAttempt } from "../../lib/api";
import { cbtQs } from "../data/mockData";
import { G, AMBER, RED } from "../constants";
import { ProgressBar } from "../components/ProgressBar";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function CBTExam({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(45 * 60);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();
  const cached: any = queryClient.getQueryData(['currentAttempt']) || (() => { try { return JSON.parse(localStorage.getItem('edumaster_current_attempt') || 'null'); } catch { return null; } })();
  const attempt: any = cached;
  const submitMutation = useSubmitAttempt();
  const questions: any[] = attempt?.questions?.length ? attempt.questions : cbtQs;
  const total = questions.length;
  const [result, setResult] = useState<{ score: number; xp?: number } | null>(null);

  async function finishExam() {
    if (attempt) {
      try {
        const res = await submitMutation.mutateAsync({
          attemptId: attempt.attemptId,
          answers: Object.entries(selected).map(([k, optId]) => ({ questionId: questions[+k].id, optionId: optId })),
        }) as { score: number; xpEarned: number };
        setResult({ score: res.score, xp: res.xpEarned });
        setSubmitted(true);
      } catch {
        toast.error("Failed to submit exam");
      }
    } else {
      setSubmitted(true);
    }
  }

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerColor = seconds < 300 ? RED : seconds < 900 ? AMBER : G;
  const question = questions[currentQ];
  const chosen = selected[currentQ];
  const answeredCount = Object.keys(selected).length;

  if (submitted) {
    const correct = result ? Math.round((result.score / 100) * total) : Object.keys(selected).filter(k => selected[+k] === questions[+k]?.correct).length;
    const pct = result ? result.score : Math.round((correct / total) * 100);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 font-body">
        <div className="bg-card rounded-3xl p-8 max-w-lg w-full border border-border shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-4" style={{ background: pct >= 60 ? "#dcfce7" : "#fee2e2" }}>
              {pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "📚"}
            </div>
            <div className="text-5xl font-black mb-2" style={{ fontFamily: "Nunito, sans-serif", color: pct >= 70 ? G : pct >= 50 ? AMBER : RED }}>{pct}%</div>
            <div className="text-lg font-semibold text-muted-foreground">{correct} of {total} correct</div>
            <div className="text-sm text-muted-foreground mt-1">
              {pct >= 80 ? "Outstanding! You're on track for A1." : pct >= 60 ? "Good work! Keep pushing — you can do better." : "Keep practicing — every attempt makes you better."}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[{ label: "Correct", value: correct, color: G }, { label: "Wrong", value: total - correct, color: RED }, { label: "Score", value: `${pct}%`, color: AMBER }].map(s => (
              <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: `${s.color}15` }}>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-muted-foreground font-semibold">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-6">
            {questions.map((q, i) => {
              const ans = selected[i];
              const isRight = !result && ans === q.correct;
              const neutral = !!result;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl text-sm" style={{ background: neutral ? "var(--muted)" : isRight ? "#dcfce7" : "#fee2e2" }}>
                  {neutral ? <span className="mt-0.5 flex-shrink-0 w-3.5" /> : isRight ? <Check size={14} style={{ color: G }} className="mt-0.5 flex-shrink-0" /> : <X size={14} style={{ color: RED }} className="mt-0.5 flex-shrink-0" />}
                  <div className={`font-semibold truncate ${neutral ? "text-foreground" : isRight ? "text-green-800" : "text-red-700"}`}>Q{i + 1}: {q.text.slice(0, 60)}...</div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setSubmitted(false); setSelected({}); setCurrentQ(0); setSeconds(45 * 60); setRevealed(false); setFlagged(new Set()); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm border border-border hover:bg-muted transition-colors">
              Try Again
            </button>
            <button onClick={() => { onNavigate("dashboard"); toast.success(`+${Math.round(pct * 0.5)} XP earned!`); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="sticky top-0 z-20 bg-card border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ChevronLeft size={16} /> Exit
        </button>
        <div className="hidden sm:block text-sm font-bold text-muted-foreground">WAEC Biology · 2023</div>
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-sm font-bold border-2"
          style={{ color: timerColor, borderColor: timerColor, background: `${timerColor}12`, fontFamily: "JetBrains Mono, monospace" }}>
          <AlarmClock size={14} /> {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Q {currentQ + 1} / {total}</div>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${((currentQ + 1) / total) * 100}%`, background: G }} />
              </div>
              <button onClick={() => setFlagged(f => { const n = new Set(f); n.has(currentQ) ? n.delete(currentQ) : n.add(currentQ); return n; })}
                className={`p-1.5 rounded-lg transition-colors ${flagged.has(currentQ) ? "text-amber-500 bg-amber-50" : "text-muted-foreground hover:bg-muted"}`}>
                <Bookmark size={15} />
              </button>
            </div>

            <p className="font-semibold text-base text-foreground leading-relaxed mb-5">{question.text}</p>

            <div className="space-y-3">
              {question.options.map((opt: { id: string; text: string }) => {
                const isChosen = chosen === opt.id;
                const isRight = opt.id === question.correct;
                let style: React.CSSProperties = { borderColor: "var(--border)", background: "var(--card)" };
                let txt = "text-foreground";
                if (revealed) {
                  if (isRight) { style = { borderColor: G, background: "#dcfce7" }; txt = "text-green-800"; }
                  else if (isChosen) { style = { borderColor: RED, background: "#fee2e2" }; txt = "text-red-700"; }
                } else if (isChosen) {
                  style = { borderColor: G, background: "#dcfce7" }; txt = "text-green-800";
                }
                return (
                  <button key={opt.id} onClick={() => !revealed && setSelected(s => ({ ...s, [currentQ]: opt.id }))}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all text-sm font-semibold ${txt} ${!revealed ? "hover:border-green-400 hover:bg-green-50" : ""}`}
                    style={style}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                      style={{ background: (isChosen || (revealed && isRight)) ? G : "#ece8e0", color: (isChosen || (revealed && isRight)) ? "#fff" : "#5c6b5e" }}>
                      {opt.id}
                    </span>
                    {opt.text}
                    {revealed && isRight && <Check size={15} className="ml-auto text-green-600" />}
                    {revealed && isChosen && !isRight && <X size={15} className="ml-auto text-red-500" />}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className="mt-5 p-4 rounded-xl border-l-4" style={{ background: "#dcfce7", borderColor: G }}>
                <div className="font-bold text-sm text-green-800 mb-1 flex items-center gap-2"><Sparkles size={13} /> Explanation</div>
                <p className="text-sm text-green-900 leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => { setCurrentQ(q => Math.max(0, q - 1)); setRevealed(false); }} disabled={currentQ === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border border-border hover:bg-muted disabled:opacity-40">
              <ChevronLeft size={15} /> Prev
            </button>
            <div className="flex gap-2">
              {chosen && !revealed && (
                <button onClick={() => setRevealed(true)} className="px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-colors"
                  style={{ borderColor: AMBER, color: AMBER }}>
                  Show Answer
                </button>
              )}
              {currentQ < total - 1 ? (
                <button onClick={() => { setCurrentQ(q => q + 1); setRevealed(false); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: G }}>
                  Next <ChevronRight size={15} />
                </button>
              ) : (
                <button onClick={() => finishExam()}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: RED }}>
                  Submit Exam
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="font-bold text-sm mb-3 text-foreground">Navigator</div>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, i) => {
                const ans = selected[i]; const isCurr = i === currentQ; const flag = flagged.has(i);
                return (
                  <button key={i} onClick={() => { setCurrentQ(i); setRevealed(false); }}
                    className="w-9 h-9 rounded-lg text-xs font-black transition-all relative"
                    style={{ background: isCurr ? G : ans ? "#dcfce7" : "#ece8e0", color: isCurr ? "#fff" : ans ? "#166534" : "#5c6b5e", border: isCurr ? `2px solid ${G}` : "2px solid transparent" }}>
                    {i + 1}
                    {flag && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ background: AMBER }} />}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 space-y-1">
              {[{ color: G, text: "Current" }, { color: "#dcfce7", text: "Answered" }, { color: "#ece8e0", text: "Unanswered" }, { color: AMBER, text: "Flagged" }].map(l => (
                <div key={l.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ background: l.color }} /> {l.text}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>{answeredCount} answered</span><span>{total - answeredCount} left</span>
            </div>
            <ProgressBar value={(answeredCount / total) * 100} />
            <button onClick={() => finishExam()} className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-white" style={{ background: RED }}>
              Submit Exam
            </button>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="font-bold text-sm mb-2 text-foreground flex items-center gap-2"><Brain size={13} style={{ color: G }} /> AI Hint</div>
            <p className="text-xs text-muted-foreground mb-3">Stuck? Get a nudge without seeing the answer.</p>
            <button onClick={() => toast.info("Hint: Consider the organelle that generates energy for the cell.")}
              className="w-full py-2 rounded-lg text-xs font-bold border-2 transition-colors" style={{ borderColor: G, color: G }}>
              Get a Hint →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
