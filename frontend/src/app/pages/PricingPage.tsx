import { useState } from "react";
import { Check, X } from "lucide-react";
import { Logo } from "../components/Logo";
import { G, PURPLE, AMBER, RED, BLUE } from "../constants";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function PricingPage({ onNavigate }: { onNavigate: ( p: Page, courseId?: string) => void }) {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Free", price: "₦0", annualPrice: "₦0", period: "", color: "#374151", bg: "#f9fafb",
      desc: "Great for getting started",
      features: ["1,000+ practice questions", "Basic CBT practice mode", "3 AI Tutor questions/day", "Limited course access", "Progress tracking"],
      missing: ["Unlimited questions", "Exam mode & mock exams", "Full AI Tutor", "All courses", "Certificate", "Offline access"],
      cta: "Get Started Free",
    },
    {
      name: "Premium", price: "₦2,500", annualPrice: "₦1,800", period: "/mo", color: G, bg: "#dcfce7",
      desc: "Everything you need to ace your exams",
      features: ["Unlimited past questions", "All CBT modes (Practice, Exam, Mock)", "Unlimited AI Tutor", "All 200+ courses", "Certificates of completion", "Offline learning (mobile)", "Performance analytics", "Priority support"],
      missing: [],
      cta: "Start Premium →",
      highlight: true,
    },
    {
      name: "School", price: "₦150k", annualPrice: "₦120k", period: "/yr per class", color: PURPLE, bg: "#ede9fe",
      desc: "For institutions and school administrators",
      features: ["Everything in Premium", "Student management dashboard", "Custom CBT exam builder", "Class performance analytics", "Report card generation", "Parent portal access", "Bulk student enrollment", "Dedicated account manager", "API access"],
      missing: [],
      cta: "Contact Sales →",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20 px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo onClick={() => onNavigate("home")} />
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("auth")} className="text-sm font-semibold px-4 py-2 rounded-lg border border-border hover:bg-muted">Sign In</button>
          <button onClick={() => onNavigate("auth")} className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: G }}>Get Started</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: G }}>Pricing</div>
          <h1 className="text-4xl font-black text-foreground mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">Start free. Upgrade when you're ready. No hidden fees.</p>
          <div className="inline-flex items-center gap-2 p-1 rounded-full border border-border bg-muted">
            <button onClick={() => setAnnual(false)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${!annual ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${annual ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}>
              Annual <span className="text-xs ml-1" style={{ color: G }}>Save 28%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl border-2 overflow-hidden ${plan.highlight ? "shadow-2xl scale-105" : ""}`}
              style={{ borderColor: plan.highlight ? G : "var(--border)" }}>
              {plan.highlight && <div className="py-2 text-center text-xs font-black text-white" style={{ background: G }}>MOST POPULAR</div>}
              <div className="p-6 bg-card">
                <div className="mb-4">
                  <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-lg" style={{ background: plan.bg }}>{plan.name === "Free" ? "🆓" : plan.name === "Premium" ? "⭐" : "🏫"}</div>
                  <div className="font-black text-lg text-foreground">{plan.name}</div>
                  <div className="text-xs text-muted-foreground">{plan.desc}</div>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-black text-foreground">{annual ? plan.annualPrice : plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <button
                  onClick={() => {/* placeholder */}}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 mb-6"
                  style={plan.highlight ? { background: G, color: "#fff" } : plan.name === "School" ? { background: PURPLE, color: "#fff" } : { background: "transparent", border: "2px solid var(--border)", color: "var(--foreground)" }}
                >
                  {plan.cta}
                </button>
                <div className="space-y-2">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs text-foreground">
                      <Check size={13} style={{ color: plan.color }} className="flex-shrink-0 mt-0.5" /> {f}
                    </div>
                  ))}
                  {plan.missing.map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <X size={13} className="flex-shrink-0 mt-0.5" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm mb-4">Trusted payment providers. Cancel anytime.</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {["Paystack", "Flutterwave", "Stripe", "Monnify"].map(p => (
              <div key={p} className="px-4 py-2 rounded-lg border border-border bg-card text-xs font-bold text-muted-foreground">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
