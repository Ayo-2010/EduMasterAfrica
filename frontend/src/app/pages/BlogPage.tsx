import { Clock, User, ArrowRight } from "lucide-react";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { BLOG_POSTS } from "../../lib/mock/data";
import { Page } from "../routing";

export function BlogPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [featured, ...rest] = BLOG_POSTS;
  return (
    <SiteLayout onNavigate={onNavigate} activePage="blog">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: "rgba(245,166,35,0.15)", color: AMBER }}>
            <span>📝</span> EduMaster Blog
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Study Tips, Guides & News</h1>
          <p className="text-muted-foreground mt-2">Exam strategies, scholarship alerts and success stories from across Africa.</p>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate("blog")}>
          <div className="h-48 flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${G}22, ${AMBER}22)` }}>📚</div>
          <div className="p-6">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary" style={{ color: G }}>{featured.category}</span>
            <h2 className="text-xl font-black text-foreground mt-3 mb-2">{featured.title}</h2>
            <p className="text-sm text-muted-foreground mb-3">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User size={12} /> {featured.author}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {featured.readMins} min read</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary" style={{ color: G }}>{p.category}</span>
              <h3 className="font-bold text-foreground mt-3 mb-2 leading-snug">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{p.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={12} /> {p.readMins} min</span>
                <button className="flex items-center gap-1 font-bold" style={{ color: G }}>Read <ArrowRight size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
