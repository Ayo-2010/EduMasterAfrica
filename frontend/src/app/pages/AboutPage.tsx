import { Target, Heart, Globe2, Users, ArrowRight } from "lucide-react";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { Page } from "../routing";
import { partners } from "../data/mockData";

export function AboutPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  return (
    <SiteLayout onNavigate={onNavigate} activePage="about">
      <div style={{ background: "linear-gradient(135deg, #0c6438 0%, #073d25 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-white text-center">
          <div className="text-xs font-black uppercase tracking-widest text-white/60 mb-3">Our Mission</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-5" style={{ fontFamily: "Nunito, sans-serif" }}>Equal access to excellent education for every African child.</h1>
          <p className="text-white/80 text-lg">EduMaster Africa was founded by educators and engineers who believed exam success shouldn't depend on where you live or what you can afford.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-3 gap-5 mb-14">
          {[
            { icon: <Target size={22} />, stat: "2.1M+", label: "Students served" },
            { icon: <Globe2 size={22} />, stat: "36", label: "States covered" },
            { icon: <Users size={22} />, stat: "4,200+", label: "Partner schools" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-6 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: G + "18", color: G }}>{s.icon}</div>
              <div className="text-2xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>{s.stat}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
          <div>
            <h2 className="text-2xl font-black text-foreground mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Starting with a single set of WAEC past questions shared on a forum, EduMaster grew into a full learning platform used by millions. We combine expert-created lessons, a vast question bank, and AI tutoring to give every student a personal coach.</p>
            <p className="text-muted-foreground leading-relaxed">Today we work with schools, teachers and parents across the continent — and we're just getting started.</p>
          </div>
          <div className="space-y-4">
            {[
              { icon: <Heart size={18} />, title: "Student-first", desc: "Every feature starts with what helps a learner succeed." },
              { icon: <Target size={18} />, title: "Rigorous", desc: "Curriculum-aligned content reviewed by subject experts." },
              { icon: <Globe2 size={18} />, title: "Accessible", desc: "Free tier, offline mode and low-data experiences." },
            ].map((v) => (
              <div key={v.title} className="flex gap-3 bg-card rounded-xl border border-border p-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: AMBER + "22", color: AMBER }}>{v.icon}</div>
                <div><div className="font-bold text-foreground">{v.title}</div><div className="text-sm text-muted-foreground">{v.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Trusted across Africa</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {partners.map((p) => <div key={p} className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-bold text-muted-foreground">{p}</div>)}
        </div>

        <div className="mt-14 text-center">
          <button onClick={() => onNavigate("auth")} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-white" style={{ background: G }}>Join EduMaster Free <ArrowRight size={16} /></button>
        </div>
      </div>
    </SiteLayout>
  );
}
