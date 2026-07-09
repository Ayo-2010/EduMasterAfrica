import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "../components/SiteLayout";
import { G, AMBER } from "../constants";
import { Page } from "../routing";

export function ContactPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "General", message: "" });
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill in all fields"); return; }
    setSent(true);
    toast.success("Message sent! We'll reply within 24 hours.");
    setForm({ name: "", email: "", subject: "General", message: "" });
  }

  return (
    <SiteLayout onNavigate={onNavigate} activePage="contact">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: "rgba(245,166,35,0.15)", color: AMBER }}>
            <MessageSquare size={12} /> Get in touch
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Contact Us</h1>
          <p className="text-muted-foreground mt-2">Questions, partnerships, or support — we're here to help.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            {[
              { icon: <Mail size={18} />, t: "Email", d: "hello@edumaster.africa" },
              { icon: <Phone size={18} />, t: "Phone", d: "+234 800 000 0000" },
              { icon: <MapPin size={18} />, t: "Office", d: "14 Ahmadu Bello Way, Lagos, Nigeria" },
            ].map((c) => (
              <div key={c.t} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: G + "18", color: G }}>{c.icon}</div>
                <div><div className="text-xs font-bold text-muted-foreground uppercase">{c.t}</div><div className="font-semibold text-foreground">{c.d}</div></div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 bg-card rounded-2xl border border-border p-6">
            {sent ? null : null}
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Subject</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm">
                  {["General", "Support", "Partnerships", "Schools", "Careers"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none" placeholder="How can we help?" />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white" style={{ background: G }}>
                <Send size={15} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
