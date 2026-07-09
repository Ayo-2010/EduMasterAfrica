import { Shield } from "lucide-react";
import { SiteLayout } from "../components/SiteLayout";
import { G } from "../constants";
import { Page } from "../routing";

const SECTIONS = [
  { title: "1. Information We Collect", body: "We collect information you provide directly (name, email, school, exam targets) and usage data such as courses viewed, questions attempted, and performance. We do not sell your personal data." },
  { title: "2. How We Use Your Data", body: "Your data is used to personalise learning, track progress, generate leaderboards, send you exam tips and product updates you opted into, and improve our platform. Aggregated, anonymised data may be used for research." },
  { title: "3. Cookies & Tracking", body: "We use essential cookies to keep you signed in and optional analytics cookies to understand usage. You can disable non-essential cookies in your browser; core features will still work." },
  { title: "4. Data Security", body: "We use encryption in transit (SSL/TLS), hashed passwords, and role-based access controls. We comply with the Nigeria Data Protection Regulation (NDPR) and GDPR for users in scope." },
  { title: "5. Children's Privacy", body: "EduMaster is used by learners under 18. For users under 13, we require parental consent and limit marketing communication. Parents may request access to or deletion of their child's data." },
  { title: "6. Your Rights", body: "You may request access to, correction of, or deletion of your personal data at any time by contacting privacy@edumaster.africa. You may also unsubscribe from marketing emails in one click." },
  { title: "7. Third-Party Services", body: "We use trusted processors for email delivery (e.g. Resend), payments (Paystack/Flutterwave), and hosting. Each is bound by data-processing agreements consistent with this policy." },
  { title: "8. Changes to This Policy", body: "We may update this policy as our services evolve. Material changes will be communicated via email or in-app notice at least 14 days before they take effect." },
];

export function PrivacyPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  return (
    <SiteLayout onNavigate={onNavigate} activePage="privacy">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: G }}><Shield size={22} /></div>
          <div>
            <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Privacy Policy</h1>
            <p className="text-xs text-muted-foreground">Last updated: 1 July 2025</p>
          </div>
        </div>
        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold text-foreground mb-2">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
