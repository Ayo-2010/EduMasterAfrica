import { useMastery } from "../../lib/api";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { ProgressBar } from "../components/ProgressBar";
import { G, AMBER, RED, PURPLE } from "../constants";
import { subjectProgress, scoreHistory, radarData, weeklyStudy } from "../data/mockData";

export function AnalyticsTab() {
  const { data: mastery } = useMastery();
  const masteryData = mastery && mastery.length ? mastery : subjectProgress;

  return (
    <div className="space-y-6">
      <h2 className="font-black text-xl text-foreground">Performance Analytics</h2>

      {/* Predicted scores */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { exam: "WAEC", predicted: "B2-A3", trend: "+5%", color: G },
          { exam: "JAMB", predicted: "284/400", trend: "+12 pts", color: AMBER },
          { exam: "Post-UTME", predicted: "68%", trend: "+4%", color: PURPLE },
        ].map(p => (
          <div key={p.exam} className="bg-card rounded-2xl border border-border p-5 text-center">
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">{p.exam} Predicted</div>
            <div className="text-3xl font-black mb-1" style={{ color: p.color }}>{p.predicted}</div>
            <div className="text-xs font-semibold" style={{ color: G }}>{p.trend} this month ↑</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score history */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="font-bold text-foreground mb-4">Score Trend (8 Weeks)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={scoreHistory}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={G} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={G} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ece8e0" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[50, 90]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v: number) => [`${v}%`, "Score"]} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke={G} strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill: G, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="font-bold text-foreground mb-4">Topic Mastery Radar</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ece8e0" />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke={G} fill={G} fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject mastery table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border font-bold text-foreground">Subject Mastery Breakdown</div>
        <div className="divide-y divide-border">
          {subjectProgress.map(s => (
            <div key={s.subject} className="px-5 py-3 flex items-center gap-4">
              <div className="w-28 font-semibold text-sm text-foreground">{s.subject}</div>
              <div className="flex-1"><ProgressBar value={s.mastery} color={s.mastery >= 80 ? G : s.mastery >= 65 ? AMBER : RED} /></div>
              <div className="w-12 text-right font-bold text-sm" style={{ color: s.mastery >= 80 ? G : s.mastery >= 65 ? AMBER : RED }}>{s.mastery}%</div>
              <div className="w-20 text-right text-xs text-muted-foreground">Predicted: {s.predicted}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Study calendar heatmap */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="font-bold text-foreground mb-4">Study Activity — June 2025</div>
        <div className="grid grid-cols-7 gap-1.5">
          {["S", "M", "T", "W", "T", "F", "S"].map(d => <div key={d} className="text-center text-xs text-muted-foreground font-bold">{d}</div>)}
          {Array.from({ length: 30 }, (_, i) => {
            const intensity = [0, 1, 3, 2, 0, 1, 2, 3, 2, 1, 0, 2, 3, 1, 2, 3, 2, 1, 3, 2, 1, 0, 3, 2, 1, 2, 3, 2, 1, 3][i];
            const opacity = [0.1, 0.3, 0.6, 1][intensity];
            return (
              <div key={i} title={`Day ${i + 1}: ${["No study", "Light", "Good", "Excellent"][intensity]}`}
                className="aspect-square rounded-sm cursor-pointer transition-transform hover:scale-110"
                style={{ background: intensity === 0 ? "#ece8e0" : G, opacity: intensity === 0 ? 1 : opacity }} />
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs text-muted-foreground">Less</span>
          {[0.15, 0.35, 0.65, 1].map(o => <div key={o} className="w-4 h-4 rounded-sm" style={{ background: G, opacity: o }} />)}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}
