import type { TopicLesson } from "./types";

// ─── OFFLINE SAMPLE: WAEC Mathematics — Quadratic Equations ───
// This is hand-authored local content standing in for what will later live in
// the CMS + Learning Knowledge Graph. It exercises every emphasis category and
// level so the renderer + diagram can be reviewed end to end.

export const quadraticEquationsLesson: TopicLesson = {
  id: "waec-math-quadratic-equations",
  subject: "Mathematics",
  curriculum: "WAEC",
  topic: "Quadratic Equations",
  bloomLevel: "Apply",
  difficulty: "Moderate",
  keywords: [
    { id: "qe", term: "Quadratic equation", category: "concept", level: 3, gloss: "An equation where the highest power of the unknown is 2." },
    { id: "std", term: "Standard form", category: "formula", level: 3, gloss: "The form ax² + bx + c = 0 used for all quadratic equations." },
    { id: "a", term: "a", category: "keyTerm", level: 2, gloss: "Coefficient of x². Must not be zero." },
    { id: "b", term: "b", category: "keyTerm", level: 1, gloss: "Coefficient of x." },
    { id: "c", term: "c", category: "keyTerm", level: 1, gloss: "Constant term." },
    { id: "ane0", term: "a ≠ 0", category: "caution", level: 2, gloss: "If a = 0 the equation becomes linear, not quadratic." },
    { id: "degree", term: "degree 2", category: "concept", level: 2, gloss: "The largest exponent of x is 2." },
    { id: "factor", term: "Factorization", category: "concept", level: 3, gloss: "Writing the quadratic as a product of two binomials." },
    { id: "compsq", term: "Completing the square", category: "concept", level: 2, gloss: "Re-writing as (x + p)² = q to solve." },
    { id: "formula", term: "Quadratic formula", category: "formula", level: 3, gloss: "General solution for any quadratic in standard form." },
    { id: "qf", term: "x = (−b ± √(b²−4ac)) / 2a", category: "formula", level: 3, gloss: "The quadratic formula." },
    { id: "graph", term: "Graphical method", category: "concept", level: 1, gloss: "Finding roots where the parabola crosses the x-axis." },
    { id: "disc", term: "Discriminant", category: "keyTerm", level: 3, gloss: "b² − 4ac. Decides the nature of the roots." },
    { id: "dpos", term: "discriminant > 0", category: "example", level: 2, gloss: "Two distinct real roots." },
    { id: "dzero", term: "discriminant = 0", category: "example", level: 2, gloss: "One repeated real root." },
    { id: "dneg", term: "discriminant < 0", category: "example", level: 2, gloss: "No real roots (roots are complex)." },
    { id: "pm", term: "±", category: "caution", level: 3, gloss: "Always include BOTH signs — two roots, unless discriminant is 0." },
  ],
  note: {
    id: "note-quadratic",
    title: "Quadratic Equations",
    summary:
      "How to recognise, solve, and interpret quadratic equations using factorization, completing the square, and the formula.",
    readingMinutes: 6,
    blocks: [
      { type: "h2", text: "What is a Quadratic Equation?" },
      {
        type: "p",
        text: "A [[qe|quadratic equation]] is any equation that can be rearranged into [[std|standard form ax² + bx + c = 0]], where [[a|a]], [[b|b]] and [[c|c]] are real numbers and [[ane0|a ≠ 0]]. The [[degree|highest power of x is 2]].",
      },
      {
        type: "callout",
        tone: "caution",
        text: "If [[a|a]] = 0 the x² term disappears and the equation becomes [[ane0|linear, not quadratic]]. Always check this first.",
      },
      { type: "h2", text: "Methods of Solving" },
      {
        type: "list",
        items: [
          "[[factor|Factorization]] — rewrite as a product of two brackets, e.g. (x − 2)(x + 3) = 0.",
          "[[compsq|Completing the square]] — turn the left side into a perfect square.",
          "[[formula|Quadratic formula]] — use [[qf|x = (−b ± √(b²−4ac)) / 2a]] for any quadratic.",
          "[[graph|Graphical method]] — read the x-intercepts of the parabola y = ax² + bx + c.",
        ],
      },
      { type: "h3", text: "The Discriminant" },
      {
        type: "p",
        text: "Inside the formula, [[disc|b² − 4ac]] is the [[disc|discriminant]]. It predicts the nature of the roots before you solve:",
      },
      {
        type: "list",
        items: [
          "[[dpos|Discriminant > 0]] → two distinct real roots.",
          "[[dzero|Discriminant = 0]] → one repeated real root.",
          "[[dneg|Discriminant < 0]] → no real roots (complex conjugate pair).",
        ],
      },
      {
        type: "example",
        prompt: "Solve 2x² − 4x − 6 = 0.",
        steps: [
          "Identify [[a|a]] = 2, [[b|b]] = −4, [[c|c]] = −6.",
          "Check the [[disc|discriminant]]: (−4)² − 4(2)(−6) = 16 + 48 = 64 (> 0, so two real roots).",
          "Apply [[qf|x = (4 ± √64) / 4]] = (4 ± 8) / 4.",
          "Roots: x = 3 and x = −1.",
        ],
      },
      {
        type: "callout",
        tone: "caution",
        text: "Never drop the [[pm|± sign]] in the formula. Two roots are expected unless the [[disc|discriminant]] is exactly 0.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "In WAEC, factorisation is usually fastest when roots are integers. Reach for the [[formula|formula]] when factorising is slow.",
      },
    ],
  },
  diagram: {
    nodes: [
      { id: "algebra", label: "Algebra", category: "topic", importance: 0.9 },
      { id: "qe", label: "Quadratic Equations", category: "concept", importance: 1, focal: true, mastery: 41 },
      { id: "lineq", label: "Linear Equations", category: "topic", importance: 0.7, mastery: 88 },
      { id: "indices", label: "Indices & Surds", category: "topic", importance: 0.55, mastery: 72 },
      { id: "factor", label: "Factorization", category: "concept", importance: 0.85, mastery: 63 },
      { id: "compsq", label: "Completing Square", category: "concept", importance: 0.7, mastery: 38 },
      { id: "formula", label: "Quadratic Formula", category: "formula", importance: 0.9, mastery: 55 },
      { id: "disc", label: "Discriminant", category: "keyTerm", importance: 0.85, mastery: 47 },
      { id: "poly", label: "Polynomials", category: "topic", importance: 0.6, mastery: 70 },
      { id: "funcgraph", label: "Functions & Graphs", category: "topic", importance: 0.62, mastery: 59 },
    ],
    edges: [
      { from: "algebra", to: "qe", relation: "prerequisite", weight: 3 },
      { from: "lineq", to: "qe", relation: "prerequisite", weight: 2 },
      { from: "indices", to: "qe", relation: "prerequisite", weight: 2 },
      { from: "qe", to: "factor", relation: "leadsTo", weight: 3 },
      { from: "qe", to: "compsq", relation: "leadsTo", weight: 2 },
      { from: "qe", to: "formula", relation: "leadsTo", weight: 3 },
      { from: "qe", to: "disc", relation: "leadsTo", weight: 3 },
      { from: "poly", to: "qe", relation: "related", weight: 1 },
      { from: "qe", to: "funcgraph", relation: "related", weight: 1 },
    ],
  },
};

export const topicLessons: TopicLesson[] = [quadraticEquationsLesson];
