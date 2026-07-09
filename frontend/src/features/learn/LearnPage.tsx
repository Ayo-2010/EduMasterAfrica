import { useState, useEffect } from "react";
import { BookMarked, Clock, Network, FileText, Sparkles } from "lucide-react";
import { SmartNote, EmphasisLegend } from "./SmartNote";
import { KnowledgeDiagram } from "./KnowledgeDiagram";
import { quadraticEquationsLesson } from "./data";
import { EMPHASIS_STYLES, type EmphasisCategory } from "./types";
import { useMe } from "../../lib/api";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function LearnPage({ onNavigate }: { onNavigate?: (p: Page, courseId?: string) => void }) {
  const lesson = quadraticEquationsLesson;
  const [activeId, setActiveId] = useState<string | null>(null);
  const { data: user } = useMe();
  const storageKey = `edumaster.notes.${user?.id || "guest"}`;
  const [myNotes, setMyNotes] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setMyNotes(saved);
    } catch {
      /* ignore storage errors (private mode / quota) */
    }
  }, [storageKey]);

  function saveNotes(value: string) {
    setMyNotes(value);
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      /* ignore storage errors (private mode / quota) */
    }
  }

  const usedCategories = Array.from(
    new Set(lesson.keywords.map((k) => k.category))
  ) as EmphasisCategory[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--primary)" }}>
            <BookMarked size={14} /> {lesson.curriculum} · {lesson.subject}
          </div>
          <h1 className="mt-1 font-black text-2xl text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>
            {lesson.topic}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {lesson.difficulty}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              Bloom: {lesson.bloomLevel}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              <Clock size={12} /> {lesson.note.readingMinutes} min read
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ background: "var(--primary)" }}>
          <Sparkles size={13} /> Notes & Diagram (no video)
        </span>
      </div>

      {/* Video-free banner */}
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
        <FileText size={18} className="mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
        <p className="text-muted-foreground">
          This lesson replaces video with <span className="font-semibold text-foreground">emphasised notes</span> and an{" "}
          <span className="font-semibold text-foreground">interactive knowledge diagram</span>. Keywords are colour-coded by type and
          thickened by importance — tap any <span className="font-semibold" style={{ color: "var(--primary)" }}>keyword</span> to see its
          place in the diagram. Optimised for low data usage and offline study.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Smart note */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-foreground">
              <FileText size={16} style={{ color: "var(--primary)" }} /> Smart Note
            </h2>
          </div>
          <SmartNote note={lesson.note} keywords={lesson.keywords} onKeywordActivate={setActiveId} />
          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Emphasis legend</div>
            <EmphasisLegend categories={usedCategories} />
          </div>
        </section>

        {/* Knowledge diagram */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Network size={16} style={{ color: "var(--primary)" }} />
            <h2 className="font-bold text-foreground">Knowledge Diagram</h2>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            How this topic connects to what you already know. Colour = type, thickness = importance. Numbers show your mastery.
          </p>
          <KnowledgeDiagram diagram={lesson.diagram} activeId={activeId} />
        </section>
      </div>

      {/* Sample related items (offline) */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Past Questions", value: "14 WAEC · 9 JAMB", icon: "📋" },
          { label: "Flashcards", value: "17 cards generated", icon: "🃏" },
          { label: "Mock Exam", value: "Quadratics mini-test", icon: "🎯" },
        ].map((c) => (
          <button
            key={c.label}
            onClick={() => onNavigate?.("cbt-setup")}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-shadow hover:shadow-md"
          >
            <span className="text-xl">{c.icon}</span>
            <div>
              <div className="text-sm font-bold text-foreground">{c.label}</div>
              <div className="text-xs text-muted-foreground">{c.value}</div>
            </div>
          </button>
        ))}
      </div>

      {/* My offline notes (persisted locally) */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center gap-2">
          <FileText size={16} style={{ color: "var(--primary)" }} />
          <h2 className="font-bold text-foreground">My Notes</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Saved offline</span>
        </div>
        <textarea
          value={myNotes}
          onChange={(e) => saveNotes(e.target.value)}
          placeholder="Jot down your own notes for this topic. Saved on this device and available offline."
          className="h-32 w-full resize-y rounded-xl border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="mt-2 text-xs text-muted-foreground">{myNotes.length} characters saved on this device.</div>
      </div>
    </div>
  );
}
