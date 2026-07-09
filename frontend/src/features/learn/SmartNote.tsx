import { useState, type ReactNode } from "react";
import {
  EMPHASIS_STYLES,
  EMPHASIS_WEIGHT,
  EMPHASIS_TOKEN,
  type Keyword,
  type SmartNote,
  type NoteBlock,
  type EmphasisCategory,
} from "./types";

// Renders a single emphasis token as an interactive keyword span.
// Colour = semantic category, thickness = emphasis level (font weight + underline).
function EmphasisSpan({
  kw,
  text,
  onActivate,
}: {
  kw: Keyword;
  text: string;
  onActivate?: (id: string) => void;
}) {
  const style = EMPHASIS_STYLES[kw.category];
  const weight = EMPHASIS_WEIGHT[kw.level];
  const [open, setOpen] = useState(false);

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => {
        setOpen(true);
        onActivate?.(kw.id);
      }}
      onKeyDown={(e) => e.key === "Enter" && onActivate?.(kw.id)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative cursor-pointer rounded px-0.5 transition-colors"
      style={{
        color: style.color,
        fontWeight: weight.fontWeight,
        borderBottom: weight.underline ? `${weight.underline}px solid ${style.color}` : "none",
        textDecoration: "none",
        backgroundColor: open ? `${style.color}14` : "transparent",
      }}
    >
      {text}
      {open && (
        <span
          className="absolute left-0 top-full z-30 mt-1 w-56 rounded-xl border border-border bg-card p-3 text-xs font-normal shadow-xl"
          style={{ color: "var(--foreground)" }}
        >
          <span className="mb-1 flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: style.color }} />
            <span className="font-bold" style={{ color: style.color }}>
              {style.label}
            </span>
            <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {weight.label}
            </span>
          </span>
          <span className="block leading-relaxed text-muted-foreground">{kw.gloss}</span>
        </span>
      )}
    </span>
  );
}

// Parse a string with [[id|text]] tokens into React nodes.
function renderWithEmphasis(
  text: string,
  keywordMap: Map<string, Keyword>,
  onActivate?: (id: string) => void
): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  EMPHASIS_TOKEN.lastIndex = 0;
  let i = 0;
  while ((m = EMPHASIS_TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [full, id, display] = m;
    const kw = keywordMap.get(id);
    if (kw) out.push(<EmphasisSpan key={i++} kw={kw} text={display} onActivate={onActivate} />);
    else out.push(<span key={i++}>{display}</span>);
    last = m.index + full.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Block({ block, keywordMap, onActivate }: { block: NoteBlock; keywordMap: Map<string, Keyword>; onActivate?: (id: string) => void }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-6 mb-2 font-black text-lg text-foreground">{block.text}</h2>;
    case "h3":
      return <h3 className="mt-4 mb-1.5 font-bold text-base text-foreground">{block.text}</h3>;
    case "p":
      return (
        <p className="leading-relaxed text-foreground/90">
          {renderWithEmphasis(block.text, keywordMap, onActivate)}
        </p>
      );
    case "list":
      return (
        <ul className="my-2 space-y-1.5 pl-1">
          {block.items.map((it, idx) => (
            <li key={idx} className="flex gap-2 leading-relaxed text-foreground/90">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--primary)" }} />
              <span>{renderWithEmphasis(it, keywordMap, onActivate)}</span>
            </li>
          ))}
        </ul>
      );
    case "callout": {
      const tone =
        block.tone === "caution"
          ? { color: "#e84545", bg: "#fef2f2", label: "Caution" }
          : block.tone === "tip"
            ? { color: "#db2777", bg: "#fdf2f8", label: "Exam Tip" }
            : { color: "#0c6438", bg: "#f0fdf4", label: "Note" };
      return (
        <div className="my-3 rounded-xl border-l-4 p-3 text-sm" style={{ borderColor: tone.color, background: tone.bg }}>
          <div className="mb-1 font-bold" style={{ color: tone.color }}>
            {tone.label}
          </div>
          <div className="leading-relaxed text-foreground/90">{renderWithEmphasis(block.text, keywordMap, onActivate)}</div>
        </div>
      );
    }
    case "example":
      return (
        <div className="my-3 rounded-xl border border-border bg-muted/40 p-4">
          <div className="mb-2 text-xs font-black uppercase tracking-wide" style={{ color: "var(--chart-4)" }}>
            Worked Example
          </div>
          <div className="mb-2 font-semibold text-foreground">{block.prompt}</div>
          <ol className="space-y-1">
            {block.steps.map((s, idx) => (
              <li key={idx} className="flex gap-2 leading-relaxed text-foreground/90">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "var(--chart-4)" }}>
                  {idx + 1}
                </span>
                <span>{renderWithEmphasis(s, keywordMap, onActivate)}</span>
              </li>
            ))}
          </ol>
        </div>
      );
  }
}

export function SmartNote({
  note,
  keywords,
  onKeywordActivate,
}: {
  note: SmartNote;
  keywords: Keyword[];
  onKeywordActivate?: (id: string) => void;
}) {
  const keywordMap = new Map(keywords.map((k) => [k.id, k]));
  return (
    <article className="space-y-1 text-[15px]">
      {note.blocks.map((b, i) => (
        <Block key={i} block={b} keywordMap={keywordMap} onActivate={onKeywordActivate} />
      ))}
    </article>
  );
}

// Legend showing the colour + thickness system used across notes.
export function EmphasisLegend({ categories }: { categories: EmphasisCategory[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {categories.map((c) => {
        const s = EMPHASIS_STYLES[c];
        return (
          <div key={c} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: s.color }} />
            <span className="font-semibold" style={{ color: s.color }}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
