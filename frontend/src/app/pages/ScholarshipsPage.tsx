import { useState } from "react";
import { Award, MapPin, GraduationCap, CalendarClock, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { SCHOLARSHIPS } from "../../lib/mock/data";
import { useSubscribe } from "../../lib/api";
import { Page } from "../routing";

export function ScholarshipsPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [email, setEmail] = useState("");
  const sub = useSubscribe();

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    try {
      await sub.mutateAsync({ email, source: "scholarships" });
      toast.success("Subscribed! We'll alert you to new scholarships.");
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "Subscription failed");
    }
  }

  return (
    <SiteLayout onNavigate={onNavigate} activePage="scholarships">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: "rgba(245,166,35,0.15)", color: AMBER }}>
            <Award size={12} /> Funding Your Education
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Scholarships & Bursaries</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Curated opportunities for Nigerian and African students — updated regularly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {SCHOLARSHIPS.map((s) => (
            <div key={s.id} className="bg-card rounded-2xl border border-border p-6 flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white" style={{ background: G }}><GraduationCap size={20} /></div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-foreground">{s.level}</span>
              </div>
              <div className="font-black text-foreground mb-1">{s.name}</div>
              <div className="text-xs text-muted-foreground mb-3">{s.provider}</div>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{s.excerpt}</p>
              <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-2"><Award size={13} style={{ color: AMBER }} /> {s.amount}</div>
                <div className="flex items-center gap-2"><MapPin size={13} /> {s.region}</div>
                <div className="flex items-center gap-2"><CalendarClock size={13} /> Closes {new Date(s.deadline).toLocaleDateString()}</div>
              </div>
              <button onClick={() => toast.success("Application link opened (demo)")} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: G }}>
                Apply Now <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-card rounded-2xl border border-border p-8 text-center">
          <h2 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif" }}>Never miss a deadline</h2>
          <p className="text-sm text-muted-foreground mb-5">Get scholarship alerts, tips and new openings in your inbox.</p>
          <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <button type="submit" disabled={sub.isPending} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>
              <Send size={15} /> Alert Me
            </button>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}
