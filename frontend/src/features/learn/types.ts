// Offline-first data model for the "Smart Notes + Knowledge Diagram" learning
// experience. Everything here is plain local data — no API, no DB. The shapes
// below are intentionally close to what will become Prisma models later, so
// moving this to the database is a mechanical translation step.

// ─── EMPHASIS SYSTEM ──────────────────────────────────────────
// Keywords inside a note are emphasised by (a) a semantic CATEGORY -> colour
// and (b) an EMPHASIS LEVEL -> thickness (font weight + underline weight).
// This is what makes a note scannable without video.

export type EmphasisCategory =
  | "definition" // what a term IS
  | "concept" // core idea to understand
  | "formula" // equation / rule
  | "keyTerm" // a named part (coefficient, root, …)
  | "caution" // common mistake / must-remember condition
  | "example" // worked / illustrative case
  | "examTip"; // WAEC/JAMB-specific hint

export type EmphasisLevel = 1 | 2 | 3; // 1 light … 3 heaviest

export interface EmphasisStyle {
  category: EmphasisCategory;
  label: string;
  color: string; // semantic colour
  description: string;
}

// Single source of truth for category colours + labels.
export const EMPHASIS_STYLES: Record<EmphasisCategory, EmphasisStyle> = {
  definition: {
    category: "definition",
    label: "Definition",
    color: "#2563eb",
    description: "What a term means",
  },
  concept: {
    category: "concept",
    label: "Concept",
    color: "#0c6438",
    description: "Core idea to understand",
  },
  formula: {
    category: "formula",
    label: "Formula",
    color: "#7c3aed",
    description: "Equation or rule",
  },
  keyTerm: {
    category: "keyTerm",
    label: "Key Term",
    color: "#f59e0b",
    description: "Named part of an expression",
  },
  caution: {
    category: "caution",
    label: "Caution",
    color: "#e84545",
    description: "Common mistake / condition",
  },
  example: {
    category: "example",
    label: "Example",
    color: "#0891b2",
    description: "Worked or illustrative case",
  },
  examTip: {
    category: "examTip",
    label: "Exam Tip",
    color: "#db2777",
    description: "WAEC / JAMB hint",
  },
};

// Thickness of a keyword = font weight + underline weight, driven by level.
export const EMPHASIS_WEIGHT: Record<
  EmphasisLevel,
  { fontWeight: number; underline: number; fontScale: number; label: string }
> = {
  1: { fontWeight: 500, underline: 0, fontScale: 1, label: "Light" },
  2: { fontWeight: 700, underline: 2, fontScale: 1, label: "Medium" },
  3: { fontWeight: 900, underline: 3, fontScale: 1.04, label: "Strong" },
};

// ─── KEYWORD REGISTRY ─────────────────────────────────────────
// Each emphasised word in a note references one of these. Mirrors a future
// `Keyword` table: id, term, category, level, gloss, topicId.

export interface Keyword {
  id: string;
  term: string; // canonical label
  category: EmphasisCategory;
  level: EmphasisLevel;
  gloss: string; // short explanation shown on hover
}

// ─── SMART NOTE ───────────────────────────────────────────────
// A note is a list of blocks. Inline emphasis uses the token syntax
//   [[keywordId|display text]]
// which the renderer replaces with a styled, interactive span.

export type NoteBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; tone: "tip" | "caution" | "note"; text: string }
  | { type: "example"; prompt: string; steps: string[] };

export interface SmartNote {
  id: string;
  title: string;
  summary: string;
  readingMinutes: number;
  blocks: NoteBlock[];
}

// ─── KNOWLEDGE DIAGRAM ────────────────────────────────────────
// Graph of related topics. Node colour = category, node radius + edge
// stroke-width = importance / weight. Mirrors future `TopicNode` +
// `TopicEdge` tables backed by the Learning Knowledge Graph.

export type NodeCategory = EmphasisCategory | "topic";

export interface KnowledgeNode {
  id: string;
  label: string;
  category: NodeCategory;
  importance: number; // 0..1 -> radius + emphasis
  mastery?: number; // 0..100, optional learner state
  focal?: boolean; // the current topic
}

export type EdgeRelation = "prerequisite" | "leadsTo" | "related";

export interface KnowledgeEdge {
  from: string;
  to: string;
  relation: EdgeRelation;
  weight: number; // 1..3 -> edge thickness
}

export interface KnowledgeDiagram {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

// ─── TOPIC LESSON (offline aggregate) ─────────────────────────
// One row of a future `TopicLesson` aggregate: note + keywords + graph +
// light metadata. This is the page payload, fully offline for now.

export interface TopicLesson {
  id: string;
  subject: string;
  curriculum: string; // e.g. "WAEC"
  topic: string;
  bloomLevel: string; // Bloom's taxonomy level
  difficulty: "Beginner" | "Easy" | "Moderate" | "Challenging" | "Advanced";
  keywords: Keyword[];
  note: SmartNote;
  diagram: KnowledgeDiagram;
}

// Inline token parser shared by renderer + editor.
export const EMPHASIS_TOKEN = /\[\[([a-zA-Z0-9_!><=]+)\|([^\]]+)\]\]/g;
