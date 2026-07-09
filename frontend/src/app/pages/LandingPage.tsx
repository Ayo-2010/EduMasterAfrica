import { useState } from "react";
import { Sparkles, Brain, Search, ArrowRight, Play, Check, BookOpen, Target, FileText, Mic, Download, Zap, Twitter, Youtube, Instagram, Linkedin, Shield } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "../components/Logo";
import { AvatarComp } from "../components/AvatarComp";
import { BadgeComp } from "../components/BadgeComp";
import { G, AMBER, BLUE, RED, PURPLE } from "../constants";
import { examCategories, partners, testimonials, faqs } from "../data/mockData";
import { FAQ } from "./FAQ";
import { useSubscribe } from "../../lib/api";
import { Page } from "../routing";

export function LandingPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const subscribe = useSubscribe();

  async function handleSubscribe() {
    try {
      await subscribe.mutateAsync({ email, source: "landing" });
      toast.success("Subscribed! Check your inbox for a welcome email.");
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "Subscription failed");
    }
  }

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Logo onClick={() => onNavigate("home")} />
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <button onClick={() => onNavigate("courses")} className="text-foreground/70 hover:text-foreground">Courses</button>
            <button onClick={() => onNavigate("pricing")} className="text-foreground/70 hover:text-foreground">Pricing</button>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => onNavigate("auth")} className="text-sm font-semibold px-4 py-2 rounded-lg border border-border hover:bg-muted">Sign In</button>
            <button onClick={() => onNavigate("auth")} className="text-sm font-bold px-4 py-2 rounded-lg text-white hover:opacity-90" style={{ background: G }}>Get Started Free</button>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "✕" : "☰"}</button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-3 text-sm font-semibold">
            <button onClick={() => { onNavigate("courses"); setMenuOpen(false); }} className="text-left py-2 text-foreground">Courses</button>
            <button onClick={() => { onNavigate("pricing"); setMenuOpen(false); }} className="text-left py-2 text-foreground">Pricing</button>
            <button onClick={() => { onNavigate("auth"); setMenuOpen(false); }} className="text-left py-2 text-foreground">Sign In</button>
            <button onClick={() => { onNavigate("auth"); setMenuOpen(false); }} className="w-full py-2.5 rounded-lg text-white font-bold" style={{ background: G }}>Get Started Free</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #0c6438 0%, #0a5030 60%, #073d25 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 right-16 w-40 h-40 rounded-full opacity-10" style={{ background: AMBER }} />
          <div className="absolute bottom-16 left-8 w-24 h-24 rotate-45 opacity-10" style={{ background: AMBER }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: "rgba(245,166,35,0.2)", color: AMBER }}>
              <Sparkles size={12} /> Africa's #1 Exam Prep Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: "Nunito, sans-serif" }}>
              Ace Your Exams.<br /><span style={{ color: AMBER }}>Own Your Future.</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl">
              WAEC · JAMB · NECO · Post-UTME and beyond. Practice with real past questions, get AI explanations, and track your progress to the top.
            </p>
            <div className="relative max-w-lg mb-8">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input className="w-full pl-11 pr-32 py-4 rounded-xl text-white bg-white/10 border border-white/20 placeholder-white/40 focus:outline-none focus:border-amber-400 text-sm" placeholder="Search courses, topics, past questions..." />
              <button onClick={() => onNavigate("courses")} className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-bold" style={{ background: AMBER, color: "#0d1f12" }}>Search</button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => onNavigate("auth")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90" style={{ background: AMBER, color: "#0d1f12" }}>
                Start Free <ArrowRight size={16} />
              </button>
              <button onClick={() => onNavigate("cbt-setup")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/30 text-white hover:bg-white/10">
                <Play size={16} /> Try CBT Demo
              </button>
            </div>
          </div>

          {/* Hero mockup */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">JAMB 2024 Mock</div>
                  <div className="font-black text-base text-foreground">Biology · Q 23 of 60</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold font-mono" style={{ background: "#dcfce7", color: G }}>
                  <BookOpen size={13} /> 38:14
                </div>
              </div>
              <div className="bg-muted rounded-xl p-4 text-sm text-foreground mb-4">Which organelle produces ATP through cellular respiration?</div>
              {["A. Chloroplast", "B. Nucleus", "C. Mitochondria", "D. Ribosome"].map((opt, i) => (
                <div key={i} className={`mb-2 px-4 py-3 rounded-lg text-sm font-semibold border ${i === 2 ? "text-white border-transparent" : "border-border"}`} style={i === 2 ? { background: G } : {}}>
                  {opt}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="text-xs text-muted-foreground">22 answered · 38 remaining</div>
                <button className="text-xs font-bold px-4 py-2 rounded-lg text-white" style={{ background: G }}>Next →</button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[{ value: "2.1M+", label: "Active Students" }, { value: "500K+", label: "Daily Questions Answered" }, { value: "98.2%", label: "Pass Rate (JAMB)" }, { value: "4,200+", label: "Partner Schools" }].map(s => (
              <div key={s.label} className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="text-2xl font-black text-white mb-0.5" style={{ fontFamily: "Nunito, sans-serif" }}>{s.value}</div>
                <div className="text-xs text-white/60 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: G }}>Exam Preparation</div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>Pick Your Exam. We'll Get You Ready.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Millions of past questions, organized by year, topic, and difficulty. Start in under 60 seconds.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {examCategories.map(cat => (
            <button key={cat.name} onClick={() => onNavigate("cbt-setup")}
              className="group p-5 rounded-2xl text-center transition-all hover:-translate-y-1 hover:shadow-lg border-2"
              style={{ background: cat.color, borderColor: cat.border }}>
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-black text-sm text-foreground mb-0.5">{cat.name}</div>
              <div className="text-xs text-muted-foreground">{cat.count} {cat.questions}</div>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: G }}>How It Works</div>
            <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>From Sign-Up to Success in 4 Steps</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { n: "1", title: "Create Account", desc: "Sign up free in 30 seconds. Choose your exam and class level.", icon: "👤" },
              { n: "2", title: "Take Assessment", desc: "Our AI tests your baseline and identifies weak areas instantly.", icon: "🧠" },
              { n: "3", title: "Study & Practice", desc: "Watch lessons, practice past questions, and chat with AI Tutor 24/7.", icon: "📚" },
              { n: "4", title: "Track Progress", desc: "Monitor your scores, climb the leaderboard, and predict your results.", icon: "📈" },
            ].map((s, i) => (
              <div key={s.n} className="text-center relative">
                {i < 3 && <div className="hidden lg:block absolute top-8 left-full w-8 border-t-2 border-dashed border-border z-0" />}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: "#dcfce7" }}>{s.icon}</div>
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Step {s.n}</div>
                <div className="font-black text-foreground mb-2">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI section */}
      <section className="py-20" style={{ background: "#0d1f12" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: "rgba(245,166,35,0.15)", color: AMBER }}>
              <Brain size={12} /> EduMaster AI
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6" style={{ fontFamily: "Nunito, sans-serif" }}>
              Your Personal AI Tutor.<br /><span style={{ color: AMBER }}>Always Available.</span>
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed">Ask anything. Get step-by-step explanations, practice questions, essay feedback, and a personalized study plan — tailored to your curriculum.</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[{ icon: <BookOpen size={15} />, text: "Explain any concept" }, { icon: <Target size={15} />, text: "Solve Maths problems" }, { icon: <FileText size={15} />, text: "Mark your essays" }, { icon: <Mic size={15} />, text: "Voice questions" }, { icon: <Download size={15} />, text: "Summarize PDFs" }, { icon: <Zap size={15} />, text: "Generate flashcards" }].map(f => (
                <div key={f.text} className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <span style={{ color: AMBER }}>{f.icon}</span>
                  <span className="text-sm text-white/80 font-semibold">{f.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate("auth")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ background: AMBER, color: "#0d1f12" }}>
              Try AI Tutor Free <ArrowRight size={16} />
            </button>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs" style={{ background: G }}>AI</div>
              <div><div className="text-white font-bold text-sm">EduMaster AI</div><div className="text-xs text-green-400">● Online</div></div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-end"><div className="bg-white/10 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs">Explain the nitrogen cycle for WAEC Biology</div></div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">AI</div>
                <div className="text-white/80 text-sm leading-relaxed bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm max-w-xs">
                  The nitrogen cycle:<br /><br />
                  <strong className="text-white">1. Fixation</strong> — Bacteria: N₂ → NH₃<br />
                  <strong className="text-white">2. Nitrification</strong> — NH₃ → NO₃⁻<br />
                  <strong className="text-white">3. Assimilation</strong> — Plants absorb nitrates<br />
                  <strong className="text-white">4. Denitrification</strong> — NO₃⁻ → N₂
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
                <div className="text-white/80 text-sm bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm">Want me to generate practice questions? 🎯</div>
              </div>
            </div>
            <div className="flex gap-2">
              <input className="flex-1 bg-white/10 text-white text-sm px-4 py-2.5 rounded-xl border border-white/10 placeholder-white/30 focus:outline-none" placeholder="Ask EduMaster AI..." />
              <button onClick={() => onNavigate("auth")} className="px-3 py-2.5 rounded-xl text-sm font-bold" style={{ background: AMBER, color: "#0d1f12" }}>→</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: G }}>Student Stories</div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Real Results, Real Students</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map(t => (
            <div key={t.name} className="bg-card rounded-2xl p-5 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-3">{[1,2,3,4,5].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <AvatarComp initials={t.avatar} size="sm" color={G} />
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.role}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border"><BadgeComp label={t.score} color={G} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">Trusted by educational institutions across Africa</div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {partners.map(p => (
              <div key={p} className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-muted-foreground hover:text-foreground hover:border-green-300 transition-colors cursor-pointer">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: G }}>FAQ</div>
          <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Frequently Asked Questions</h2>
        </div>
        <FAQ />
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-2xl mb-2">📬</div>
          <h2 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif" }}>Stay Ahead of the Exam</h2>
          <p className="text-sm text-muted-foreground mb-6">Get weekly WAEC/JAMB tips, new past questions, and scholarship alerts — free.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <button onClick={handleSubscribe} type="button" disabled={subscribe.isPending} className="px-5 py-3 rounded-xl font-bold text-sm text-white whitespace-nowrap" style={{ background: G }}>Subscribe →</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 mx-4 sm:mx-6 max-w-7xl lg:mx-auto rounded-3xl my-16" style={{ background: "linear-gradient(135deg, #0c6438 0%, #073d25 100%)" }}>
        <div className="text-center px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>Start Free. Stay Ahead.</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">Join 2.1 million students. No credit card needed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate("auth")} className="px-8 py-4 rounded-xl font-black text-sm hover:opacity-90" style={{ background: AMBER, color: "#0d1f12" }}>Create Free Account →</button>
            <button onClick={() => onNavigate("pricing")} className="px-8 py-4 rounded-xl font-bold text-sm border-2 border-white/30 text-white hover:bg-white/10">View Pricing</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0d1f12" }} className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <Logo />
              <p className="text-white/50 text-sm mt-3 leading-relaxed">Africa's most comprehensive educational platform. From primary school to university entrance examinations.</p>
              <div className="flex items-center gap-3 mt-5">
                {[Twitter, Youtube, Instagram, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"><Icon size={16} /></button>
                ))}
              </div>
            </div>
            {[
              { title: "Platform", links: [{name:"Courses",page:"courses"},{name:"CBT Practice",page:"cbt-setup"},{name:"AI Tutor",page:"ai-tutor"},{name:"Leaderboard",page:"leaderboard"},{name:"Certificates",page:"certificates"}] },
              { title: "Exams", links: [{name:"WAEC Prep",page:"waec-prep"},{name:"JAMB CBT",page:"jamb-cbt"},{name:"NECO Mock",page:"neco-mock"},{name:"Post-UTME",page:"post-utme"},{name:"Scholarships",page:"scholarships"}] },
              { title: "Company", links: [{name:"About Us",page:"about"},{name:"Blog",page:"blog"},{name:"Careers",page:"careers"},{name:"Contact",page:"contact"},{name:"Privacy Policy",page:"privacy"}] },
            ].map(col => (
              <div key={col.title}>
                <div className="font-bold text-white text-sm mb-4">{col.title}</div>
                <div className="space-y-2.5">
                  {col.links.map(l => (
                    <button key={l.name} onClick={() => onNavigate(l.page as Page)} className="block text-sm text-white/50 hover:text-white transition-colors">{l.name}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <div>© 2025 EduMaster Africa Ltd. All rights reserved.</div>
            <div className="flex items-center gap-2"><Shield size={12} /> <span>NDPR & GDPR Compliant · Secured by SSL</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
