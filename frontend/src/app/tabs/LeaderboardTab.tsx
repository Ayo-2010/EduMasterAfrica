import { useState } from "react";
import { Flame } from "lucide-react";
import { AvatarComp } from "../components/AvatarComp";
import { ProgressBar } from "../components/ProgressBar";
import { BadgeComp } from "../components/BadgeComp";
import { useMe, useLeaderboard } from "../../lib/api";
import { G, AMBER, RED, PURPLE, BLUE } from "../constants";
import { leaderboard } from "../data/mockData";

export function LeaderboardTab() {
  const [filter, setFilter] = useState<"national" | "state" | "school">("national");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">("alltime");

  const { data: user } = useMe();
  const leaderboardQuery = useLeaderboard();
  const data = leaderboardQuery.data && leaderboardQuery.data.length ? leaderboardQuery.data : leaderboard;

  if (leaderboardQuery.isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="font-black text-xl text-foreground">Leaderboard</h2>
        <div className="bg-card rounded-2xl border border-border p-10 text-center text-muted-foreground">Loading leaderboard…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <h2 className="font-black text-xl text-foreground">Leaderboard</h2>
        <div className="flex flex-wrap gap-2">
          {(["national", "state", "school"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize"
              style={filter === f ? { background: G, color: "#fff" } : { background: "#ece8e0", color: "#5c6b5e" }}>
              {f === "national" ? "🌍 National" : f === "state" ? "📍 State" : "🏫 School"}
            </button>
          ))}
          {(["weekly", "monthly", "alltime"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={period === p ? { background: AMBER, color: "#0d1f12" } : { background: "#ece8e0", color: "#5c6b5e" }}>
              {p === "weekly" ? "Week" : p === "monthly" ? "Month" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-2">
        {[data[1], data[0], data[2]].map((entry, podiumPos) => {
           const heights = ["h-24", "h-32", "h-20"];
           const medals = ["🥈", "🥇", "🥉"];
           return (
             <div key={entry.id || entry.rank} className={`flex flex-col items-center ${podiumPos === 1 ? "order-2" : podiumPos === 0 ? "order-1" : "order-3"}`}>
               <AvatarComp initials={entry.name ? entry.name.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase() : "??"} size="lg" color={[AMBER, "#c0c0c0", "#cd7f32"][entry.rank - 1]} />
              <div className="text-xs font-bold text-center mt-1 truncate max-w-full px-1">{entry.name.split(" ")[0]}</div>
              <div className="text-lg">{medals[podiumPos === 1 ? 0 : podiumPos === 0 ? 1 : 2]}</div>
              <div className={`w-full rounded-t-xl mt-2 flex items-end justify-center pb-2 ${heights[podiumPos === 1 ? 1 : podiumPos === 0 ? 0 : 2]}`}
                style={{ background: [AMBER + "40", "#c0c0c040", "#cd7f3240"][podiumPos === 1 ? 0 : podiumPos === 0 ? 1 : 2] }}>
                <div className="text-xs font-black">{entry.xp.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {data.map(entry => {
            const isMe = entry.id === user?.id;
            return (
              <div
                key={entry.id || entry.rank}
                className={`flex items-center gap-3 px-5 py-3.5 ${isMe ? "border-l-4" : ""}`}
                style={isMe ? { borderLeftColor: AMBER, background: "#fffbeb" } : undefined}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={entry.rank <= 3 ? { background: [AMBER, "#c0c0c0", "#cd7f32"][entry.rank - 1], color: "#fff" } : { background: "#ece8e0", color: "#5c6b5e" }}>
                  {entry.rank}
                </div>
                <AvatarComp initials={entry.name ? entry.name.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase() : "??"} size="sm" color={isMe ? AMBER : G} />
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm truncate ${isMe ? "text-amber-700" : "text-foreground"}`}>
                    {entry.name}{isMe ? " (You)" : ""}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{entry.school}</div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame size={12} style={{ color: "#f97316" }} /> {entry.streak}d
                </div>
                <div className="font-black text-sm" style={{ fontFamily: "JetBrains Mono, monospace", color: isMe ? AMBER : G }}>
                   {entry.xp.toLocaleString()}
                 </div>
               </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
