import { Code2, GraduationCap, Heart, Globe2, ArrowRight, Briefcase } from "lucide-react";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { Page } from "../routing";

const ROLES = [
  { title: "Frontend Engineer", team: "Product", location: "Remote / Lagos", type: "Full-time" },
  { title: "Curriculum Designer (Science)", team: "Education", location: "Abuja", type: "Full-time" },
  { title: "AI Tutor Trainer", team: "Education", location: "Remote", type: "Contract" },
  { title: "School Partnerships Lead", team: "Sales", location: "Ibadan", type: "Full-time" },
  { title: "Customer Support Specialist", team: "Operations", location: "Remote", type: "Full-time" },
];

export function CareersPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  return (
    <SiteLayout onNavigate={onNavigate} activePage="careers">
      <div style={{ background: "linear-gradient(135deg, #0c6438 0%, #073d25 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-white text-center">
          <div className="text-xs font-black uppercase tracking-widest text-white/60 mb-3">Careers</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>Build the future of African education</h1>
          <p className="text-white/80">We're a small, mission-driven team that ships fast and cares deeply about learners.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: <GraduationCap size={20} />, t: "Real impact", d: "Your work reaches millions of students." },
            { icon: <Globe2 size={20} />, t: "Remote-friendly", d: "Work from anywhere in Africa." },
            { icon: <Heart size={20} />, t: "Mission-led", d: "Education equity is our north star." },
          ].map((v) => (
            <div key={v.t} className="bg-card rounded-2xl border border-border p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: G + "18", color: G }}>{v.icon}</div>
              <div className="font-bold text-foreground">{v.t}</div>
              <div className="text-sm text-muted-foreground">{v.d}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-black text-foreground mb-5" style={{ fontFamily: "Nunito, sans-serif" }}>Open Roles</h2>
        <div className="space-y-3">
          {ROLES.map((r) => (
            <div key={r.title} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white" style={{ background: AMBER }}><Briefcase size={18} /></div>
                <div>
                  <div className="font-bold text-foreground">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.team} · {r.location} · {r.type}</div>
                </div>
              </div>
              <button onClick={() => onNavigate("contact")} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: G }}>Apply <ArrowRight size={15} /></button>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
