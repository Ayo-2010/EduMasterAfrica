import { Award, Download, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { useCertificates, useMe } from "../../lib/api";
import { Page } from "../routing";

export function CertificatesPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const me = useMe();
  const user: any = me.data;
  const { data, isLoading } = useCertificates();
  const certs: any[] = (data as any[]) || [];

  return (
    <SiteLayout onNavigate={onNavigate} activePage="certificates">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: "rgba(245,166,35,0.15)", color: AMBER }}>
            <Award size={12} /> Achievements
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Your Certificates</h1>
          <p className="text-muted-foreground mt-2">Finish a course to earn a verifiable certificate of completion.</p>
        </div>

        {!me.data ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Lock size={40} className="mx-auto mb-3 text-muted-foreground" />
            <div className="font-bold text-foreground mb-1">Sign in to view certificates</div>
            <p className="text-sm text-muted-foreground mb-5">Your earned certificates are saved to your account.</p>
            <button onClick={() => onNavigate("auth")} className="px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>Sign In</button>
          </div>
        ) : isLoading ? (
          <div className="text-center text-muted-foreground py-20">Loading…</div>
        ) : certs.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Award size={40} className="mx-auto mb-3" style={{ color: AMBER }} />
            <div className="font-bold text-foreground mb-1">No certificates yet</div>
            <p className="text-sm text-muted-foreground mb-5">Complete a course to earn your first certificate.</p>
            <button onClick={() => onNavigate("courses")} className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>Browse Courses <ArrowRight size={16} /></button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {certs.map((c) => (
              <div key={c.courseId} className="relative bg-gradient-to-br from-[#0c6438] to-[#073d25] rounded-2xl p-6 text-white overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10" style={{ background: AMBER }} />
                <div className="flex items-start justify-between mb-6">
                  <Award size={36} style={{ color: AMBER }} />
                  <div className="text-xs px-2 py-1 rounded-full bg-white/10">{c.grade}</div>
                </div>
                <div className="text-xs uppercase tracking-widest text-white/60 mb-1">Certificate of Completion</div>
                <div className="text-lg font-black mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>{c.title}</div>
                <div className="text-sm text-white/70 mb-6">Awarded to {user?.name} · {new Date(c.issuedAt).toLocaleDateString()}</div>
                <button onClick={() => toast.success("Certificate downloaded (demo)")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold">
                  <Download size={14} /> Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
