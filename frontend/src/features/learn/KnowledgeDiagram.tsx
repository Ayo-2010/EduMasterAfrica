import { useMemo, useState } from "react";
import { EMPHASIS_STYLES, type KnowledgeDiagram as Diagram, type EdgeRelation, type KnowledgeNode } from "./types";

const RELATION_COLOR: Record<EdgeRelation, string> = {
  prerequisite: "#f59e0b",
  leadsTo: "#0c6438",
  related: "#94a3b8",
};

const RELATION_LABEL: Record<EdgeRelation, string> = {
  prerequisite: "Prerequisite",
  leadsTo: "Builds into",
  related: "Related",
};

function nodeColor(n: KnowledgeNode): string {
  if (n.category === "topic") return "#64748b";
  return EMPHASIS_STYLES[n.category].color;
}

function nodeRadius(n: KnowledgeNode): number {
  return 16 + n.importance * 14 + (n.focal ? 6 : 0);
}

// Deterministic radial layout: focal node centre, others fanned out by relation.
function layout(diagram: Diagram) {
  const focal = diagram.nodes.find((n) => n.focal) ?? diagram.nodes[0];
  const others = diagram.nodes.filter((n) => n.id !== focal.id);
  const W = 560;
  const H = 440;
  const cx = W / 2;
  const cy = H / 2;
  const R = 165;

  const groups: Record<EdgeRelation, KnowledgeNode[]> = { prerequisite: [], leadsTo: [], related: [] };
  for (const n of others) {
    const edge = diagram.edges.find((e) => (e.from === focal.id && e.to === n.id) || (e.to === focal.id && e.from === n.id));
    groups[edge?.relation ?? "related"].push(n);
  }

  const angleRanges: Record<EdgeRelation, [number, number]> = {
    leadsTo: [-50, 50],
    prerequisite: [130, 230],
    related: [250, 290],
  };

  const pos = new Map<string, { x: number; y: number }>();
  pos.set(focal.id, { x: cx, y: cy });
  (Object.keys(groups) as EdgeRelation[]).forEach((rel) => {
    const list = groups[rel];
    const [a0, a1] = angleRanges[rel];
    list.forEach((n, i) => {
      const t = list.length === 1 ? 0.5 : i / (list.length - 1);
      const deg = a0 + (a1 - a0) * t;
      const rad = (deg * Math.PI) / 180;
      pos.set(n.id, { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) });
    });
  });
  return { pos, focal, W, H };
}

export function KnowledgeDiagram({ diagram, activeId }: { diagram: Diagram; activeId?: string | null }) {
  const { pos, focal, W, H } = useMemo(() => layout(diagram), [diagram]);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const focus = hover ?? selected ?? activeId ?? null;
  const neighbors = useMemo(() => {
    if (!focus) return null;
    const set = new Set<string>([focus]);
    diagram.edges.forEach((e) => {
      if (e.from === focus) set.add(e.to);
      if (e.to === focus) set.add(e.from);
    });
    return set;
  }, [focus, diagram.edges]);

  const selectedNode = diagram.nodes.find((n) => n.id === (selected ?? activeId));

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#f7f4ef] to-[#eef5f0]">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Knowledge diagram">
          {/* edges */}
          {diagram.edges.map((e, i) => {
            const p1 = pos.get(e.from)!;
            const p2 = pos.get(e.to)!;
            const dim = neighbors ? !(neighbors.has(e.from) && neighbors.has(e.to)) : false;
            const isFocusEdge = focus && (e.from === focus || e.to === focus);
            return (
              <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={RELATION_COLOR[e.relation]}
                strokeWidth={e.weight * 1.6 + 0.5}
                strokeOpacity={dim ? 0.12 : isFocusEdge ? 1 : 0.6}
                strokeLinecap="round"
              />
            );
          })}

          {/* nodes */}
          {diagram.nodes.map((n) => {
            const p = pos.get(n.id)!;
            const r = nodeRadius(n);
            const color = nodeColor(n);
            const dim = neighbors ? !neighbors.has(n.id) : false;
            const isFocus = focus === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${p.x},${p.y})`}
                className="cursor-pointer"
                opacity={dim ? 0.25 : 1}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setSelected(n.id)}
              >
                {n.focal && <circle r={r + 6} fill="none" stroke={color} strokeWidth={2} strokeDasharray="4 4" opacity={0.7} />}
                <circle
                  r={r}
                  fill={color}
                  stroke={isFocus ? "#0d1f12" : "#fff"}
                  strokeWidth={isFocus ? 3 : 2}
                />
                {n.mastery !== undefined && (
                  <text textAnchor="middle" dy={4} fontSize={11} fontWeight={800} fill="#fff">
                    {n.mastery}
                  </text>
                )}
                <text
                  textAnchor="middle"
                  y={r + 14}
                  fontSize={11}
                  fontWeight={600}
                  fill={n.focal ? "#0d1f12" : "#475569"}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* relation legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {(Object.keys(RELATION_COLOR) as EdgeRelation[]).map((rel) => (
          <span key={rel} className="flex items-center gap-1.5">
            <span className="inline-block h-1 w-6 rounded-full" style={{ background: RELATION_COLOR[rel] }} />
            {RELATION_LABEL[rel]}
          </span>
        ))}
        <span className="ml-auto italic">Node size = importance · numbers = your mastery %</span>
      </div>

      {/* selected node detail */}
      {selectedNode && (
        <div className="mt-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: nodeColor(selectedNode) }} />
            <span className="font-bold text-foreground">{selectedNode.label}</span>
            {selectedNode.focal && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">Current topic</span>
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Importance</div>
              <div className="font-bold" style={{ color: nodeColor(selectedNode) }}>
                {Math.round(selectedNode.importance * 100)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Your mastery</div>
              <div className="font-bold text-foreground">{selectedNode.mastery !== undefined ? `${selectedNode.mastery}%` : "—"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { RELATION_LABEL };
