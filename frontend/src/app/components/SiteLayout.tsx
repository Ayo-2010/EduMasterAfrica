import { useState } from "react";
import { ChevronDown, Menu, X, GraduationCap } from "lucide-react";
import { Logo } from "../components/Logo";
import { G, AMBER } from "../constants";
import { Page } from "../routing";

interface NavItem {
  label: string;
  page: Page;
  children?: { label: string; page: Page }[];
}

const NAV: NavItem[] = [
  { label: "Courses", page: "courses" },
  { label: "CBT Practice", page: "cbt-setup" },
  { label: "AI Tutor", page: "ai-tutor" },
  {
    label: "Exams",
    page: "exams",
    children: [
      { label: "WAEC Prep", page: "waec-prep" },
      { label: "JAMB CBT", page: "jamb-cbt" },
      { label: "NECO Mock", page: "neco-mock" },
      { label: "Post-UTME", page: "post-utme" },
    ],
  },
  { label: "Leaderboard", page: "leaderboard" },
  { label: "Certificates", page: "certificates" },
  { label: "Scholarships", page: "scholarships" },
  {
    label: "Company",
    page: "about",
    children: [
      { label: "About Us", page: "about" },
      { label: "Blog", page: "blog" },
      { label: "Careers", page: "careers" },
      { label: "Contact", page: "contact" },
      { label: "Privacy Policy", page: "privacy" },
    ],
  },
];

export function SiteLayout({ onNavigate, activePage, children }: { onNavigate: (p: Page, courseId?: string) => void; activePage?: Page; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  const go = (p: Page, courseId?: string) => {
    onNavigate(p, courseId);
    setMobileOpen(false);
    setOpenDrop(null);
  };

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Logo onClick={() => go("home")} />
          <div className="hidden lg:flex items-center gap-1 text-sm font-semibold">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDrop(item.label)}
                  onMouseLeave={() => setOpenDrop(null)}
                >
                  <button
                    onClick={() => setOpenDrop(openDrop === item.label ? null : item.label)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${activePage === item.page ? "text-foreground" : "text-foreground/70 hover:text-foreground"}`}
                  >
                    {item.label} <ChevronDown size={14} />
                  </button>
                  {openDrop === item.label && (
                    <div className="absolute left-0 top-full mt-1 w-52 bg-card rounded-xl border border-border shadow-xl p-2 z-50">
                      {item.children.map((c) => (
                        <button key={c.page} onClick={() => go(c.page)} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-foreground/80 hover:bg-muted hover:text-foreground">
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.label}
                  onClick={() => go(item.page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${activePage === item.page ? "text-foreground" : "text-foreground/70 hover:text-foreground"}`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => go("auth")} className="text-sm font-semibold px-4 py-2 rounded-lg border border-border hover:bg-muted">Sign In</button>
            <button onClick={() => go("auth")} className="text-sm font-bold px-4 py-2 rounded-lg text-white hover:opacity-90" style={{ background: G }}>Get Started Free</button>
          </div>
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
            {NAV.map((item) => (
              <div key={item.label}>
                <button onClick={() => (item.children ? setOpenDrop(openDrop === item.label ? null : item.label) : go(item.page))} className="w-full text-left py-2.5 px-2 font-semibold text-foreground flex items-center justify-between">
                  {item.label} {item.children && <ChevronDown size={14} />}
                </button>
                {item.children && openDrop === item.label && (
                  <div className="pl-4 pb-2">
                    {item.children.map((c) => (
                      <button key={c.page} onClick={() => go(c.page)} className="block w-full text-left py-2 px-2 text-sm text-muted-foreground hover:text-foreground">{c.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 mt-3 pt-3 border-t border-border">
              <button onClick={() => go("auth")} className="flex-1 text-sm font-semibold py-2.5 rounded-lg border border-border">Sign In</button>
              <button onClick={() => go("auth")} className="flex-1 text-sm font-bold py-2.5 rounded-lg text-white" style={{ background: G }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      <footer style={{ background: "#0d1f12" }} className="pt-16 pb-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 font-black text-lg" style={{ fontFamily: "Nunito, sans-serif" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: G }}><GraduationCap size={16} /></div>
                <span style={{ color: G }}>EduMaster</span>
                <span style={{ color: AMBER }}>Africa</span>
              </div>
              <p className="text-white/50 text-sm mt-3 leading-relaxed">Africa's most comprehensive exam-prep platform. From primary school to university entrance.</p>
            </div>
            {[
              { title: "Learn", links: [["Courses", "courses"], ["CBT Practice", "cbt-setup"], ["AI Tutor", "ai-tutor"], ["Leaderboard", "leaderboard"], ["Certificates", "certificates"]] as [string, Page][] },
              { title: "Exams", links: [["WAEC Prep", "waec-prep"], ["JAMB CBT", "jamb-cbt"], ["NECO Mock", "neco-mock"], ["Post-UTME", "post-utme"], ["All Exams", "exams"]] as [string, Page][] },
              { title: "Opportunities", links: [["Scholarships", "scholarships"], ["Blog", "blog"], ["Pricing", "pricing"], ["FAQ", "faq"]] as [string, Page][] },
              { title: "Company", links: [["About Us", "about"], ["Careers", "careers"], ["Contact", "contact"], ["Privacy Policy", "privacy"]] as [string, Page][] },
            ].map((col) => (
              <div key={col.title}>
                <div className="font-bold text-white text-sm mb-4">{col.title}</div>
                <div className="space-y-2.5">
                  {col.links.map(([name, page]) => (
                    <button key={name} onClick={() => go(page)} className="block text-sm text-white/50 hover:text-white transition-colors">{name}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <div>© {new Date().getFullYear()} EduMaster Africa Ltd. All rights reserved.</div>
            <div className="flex items-center gap-3">
              <button onClick={() => go("privacy")} className="hover:text-white/60">Privacy</button>
              <button onClick={() => go("contact")} className="hover:text-white/60">Contact</button>
              <span>NDPR & GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
