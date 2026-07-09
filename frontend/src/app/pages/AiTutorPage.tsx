import { useState, useRef, useEffect } from "react";
import { Sparkles, Brain, Send, BookOpen, Target, FileText, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { useAiChat, useGenerateQuestions, useMe } from "../../lib/api";
import { Page } from "../routing";

type Page2 = Page;

interface Msg { id: number; role: "user" | "ai"; text: string; }

const SUGGESTIONS = [
  "Explain photosynthesis for WAEC Biology",
  "Give me a 6-week JAMB study plan",
  "Solve: If 2x + 3 = 11, find x",
  "What is the difference between mitosis and meiosis?",
];

export function AiTutorPage({ onNavigate }: { onNavigate: (p: Page2, courseId?: string) => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, role: "ai", text: "Hi! I'm EduMaster AI 🤖 Ask me anything about your subjects, and I'll explain step by step, solve problems, or generate practice questions." },
  ]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const chat = useAiChat();
  const gen = useGenerateQuestions();
  const meQ = useMe();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text: string) {
    const t = text.trim();
    if (!t) return;
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", text: t }]);
    setInput("");
    try {
      const res = await chat.mutateAsync(t);
      setMessages((m) => [...m, { id: id + 1, role: "ai", text: (res as any).reply }]);
    } catch {
      toast.error("AI is unavailable right now. Try again.");
    }
  }

  async function generatePractice() {
    try {
      const res = await gen.mutateAsync({ subject, topic: "Mixed", count: 5 });
      const qs = (res as any).questions as any[];
      const text = `Here are 5 ${subject} practice questions:\n\n` + qs.map((q, i) => `${i + 1}. ${q.text}\n   ${q.options.map((o: any) => o.id + ") " + o.text).join("   ")}\n   Answer: ${q.correct} — ${q.explanation}`).join("\n\n");
      setMessages((m) => [...m, { id: Date.now(), role: "ai", text }]);
    } catch {
      toast.error("Could not generate questions.");
    }
  }

  return (
    <SiteLayout onNavigate={onNavigate} activePage="ai-tutor">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: "rgba(245,166,35,0.15)", color: AMBER }}>
            <Brain size={12} /> EduMaster AI Tutor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Your Personal AI Tutor. Always Available.</h1>
          <p className="text-muted-foreground mt-2">Explain concepts, solve problems, mark essays, and build study plans — tailored to your curriculum.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl border border-border h-[60vh] flex flex-col">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs" style={{ background: G }}>AI</div>
                <div>
                  <div className="font-bold text-sm text-foreground">EduMaster AI</div>
                  <div className="text-xs text-green-600">● Online</div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {chat.isPending && <div className="text-xs text-muted-foreground px-2">AI is typing…</div>}
                <div ref={endRef} />
              </div>
              <div className="p-4 border-t border-border flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Ask anything about your subjects…"
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button onClick={() => send(input)} disabled={chat.isPending} className="px-4 py-3 rounded-xl text-white disabled:opacity-50" style={{ background: G }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="font-bold text-sm mb-3 text-foreground flex items-center gap-2"><Sparkles size={14} style={{ color: G }} /> Quick Prompts</div>
              <div className="space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="w-full text-left text-sm px-3 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-foreground/80">{s}</button>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="font-bold text-sm mb-3 text-foreground">Generate Practice</div>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full mb-3 px-3 py-2.5 rounded-xl border border-border bg-background text-sm">
                {["Mathematics", "Biology", "Chemistry", "Physics", "English", "Literature"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <button onClick={generatePractice} disabled={gen.isPending} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-50" style={{ background: AMBER, color: "#0d1f12" }}>
                {gen.isPending ? <><Loader2 size={14} className="animate-spin" /> Generating…</> : <><Zap size={14} /> 5 Questions</>}
              </button>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 grid grid-cols-2 gap-2 text-xs">
              {[{ icon: <BookOpen size={14} />, t: "Explain concepts" }, { icon: <Target size={14} />, t: "Solve problems" }, { icon: <FileText size={14} />, t: "Mark essays" }, { icon: <Zap size={14} />, t: "Flashcards" }].map((f) => (
                <div key={f.t} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-foreground/80"><span style={{ color: G }}>{f.icon}</span>{f.t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
