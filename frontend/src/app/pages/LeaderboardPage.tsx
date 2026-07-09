import { Trophy, Medal, Flame, Crown } from "lucide-react";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { useLeaderboard } from "../../lib/api";
import { Page } from "../routing";

export function LeaderboardPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const { data, isLoading } = useLeaderboard();
  const rows: any[] = data || [];
  const top = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <SiteLayout onNavigate={onNavigate} activePage="leaderboard">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: "rgba(245,166,35,0.15)", color: AMBER }}>
            <Trophy size={12} /> National Rankings
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Leaderboard</h1>
          <p className="text-muted-foreground mt-2">Climb the ranks by practicing. Every exam and lesson earns XP.</p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-20">Loading rankings…</div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
              {[top[1], top[0], top[2]].map((u, i) => {
                if (!u) return <div key={i} />;
                const medal = i === 1 ? "#cbd5e1" : i === 0 ? AMBER : "#b45309";
                const heights = ["mt-6", "", "mt-12"];
                return (
                  <div key={u.id} className={`flex flex-col items-center ${heights[i]}`}>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-lg" style={{ background: G }}>{u.avatar || u.name.slice(0, 2).toUpperCase()}</div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: medal, color: "#fff" }}>{i === 0 ? <Crown size={14} /> : i + 1}</div>
                    </div>
                    <div className="font-bold text-sm mt-2 text-foreground text-center">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.xp.toLocaleString()} XP</div>
                  </div>
                );
              })}
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-12 px-5 py-3 text-xs font-black uppercase tracking-wide text-muted-foreground border-b border-border">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Student</div>
                <div className="col-span-3 hidden sm:block">School</div>
                <div className="col-span-2">XP</div>
                <div className="col-span-1 text-right"><Flame size={14} className="ml-auto" /></div>
              </div>
              {rows.map((u) => (
                <div key={u.id} className={`grid grid-cols-12 px-5 py-3.5 items-center text-sm border-b border-border last:border-0 ${u.name.includes("(You)") ? "bg-secondary/60" : "hover:bg-muted/40"}`}>
                  <div className="col-span-1 font-black text-foreground">{u.rank}</div>
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ background: u.rank <= 3 ? AMBER : G }}>{u.avatar || u.name.slice(0, 2).toUpperCase()}</div>
                    <div className="min-w-0"><div className="font-semibold text-foreground truncate">{u.name}</div><div className="text-xs text-muted-foreground truncate">{u.state}</div></div>
                  </div>
                  <div className="col-span-3 hidden sm:block text-muted-foreground truncate">{u.school}</div>
                  <div className="col-span-2 font-bold" style={{ color: G }}>{u.xp.toLocaleString()}</div>
                  <div className="col-span-1 text-right text-muted-foreground">{u.streak}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
