import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { faqs } from "../data/mockData";
import { Page } from "../routing";

const EXTRA = [
  { q: "How do I start an exam?", a: "Go to CBT Practice, pick a subject and mode, then tap Start Exam. You can answer at your own pace in Practice mode, or take a timed Exam/Mock mode that feels like the real thing." },
  { q: "Are the lessons video-based?", a: "No. Our lessons are concise reading + worked-example modules with practice exercises and AI feedback — built for low-data, fast revision on any device." },
  { q: "How does the AI Tutor grade my work?", a: "The AI reads your answer, checks it against the mark scheme, highlights strengths and gaps, and suggests the exact topics to revise next." },
  { q: "Can I use EduMaster on my phone?", a: "Yes — the site is fully responsive and our mobile apps (coming soon) will add offline downloads for lessons and question packs." },
  { q: "How do I earn a certificate?", a: "Finish every lesson in a course and we automatically issue a verifiable Certificate of Completion you can download and share." },
  { q: "How do I cancel my subscription?", a: "Open Profile → Billing and cancel anytime. You keep Pro features until the end of the paid period." },
  { q: "Will I get spam from the newsletter?", a: "Never. We send a weekly digest of exam tips, new questions and scholarships. Unsubscribe in one click from any email." },
];

const CATEGORIES = [
  { name: "General", items: faqs },
  { name: "Using EduMaster", items: EXTRA },
];

export function FaqPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <SiteLayout onNavigate={onNavigate} activePage="faq">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: "rgba(245,166,35,0.15)", color: AMBER }}>
            <HelpCircle size={12} /> Help Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-2">Everything you need to know about studying with EduMaster Africa.</p>
        </div>

        <div className="space-y-8">
          {CATEGORIES.map((cat) => (
            <div key={cat.name}>
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">{cat.name}</h2>
              <div className="space-y-2">
                {cat.items.map((item) => {
                  const key = cat.name + item.q;
                  const isOpen = open === key;
                  return (
                    <div key={key} className="bg-card rounded-2xl border border-border overflow-hidden">
                      <button onClick={() => setOpen(isOpen ? null : key)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
                        <span className="font-semibold text-foreground text-sm">{item.q}</span>
                        <ChevronDown size={16} className={`flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} style={{ color: G }} />
                      </button>
                      {isOpen && <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-card rounded-2xl border border-border p-8 text-center">
          <h3 className="text-xl font-black text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif" }}>Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-5">Our support team replies within 24 hours.</p>
          <button onClick={() => onNavigate("contact")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>
            Contact Support <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}
