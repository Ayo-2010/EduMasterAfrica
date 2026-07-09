import { useState } from "react";
import { Eye, EyeOff, Globe, Check } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "../components/Logo";
import { G, AMBER } from "../constants";
import { useLogin, useRegister } from "../../lib/api";
import { Page } from "../routing";

const ROLE_TO_BACKEND: Record<string, string> = {
  student: "STUDENT",
  teacher: "TEACHER",
  parent: "PARENT",
  school: "SCHOOL_ADMIN",
};

function roleToPage(role: string): Page {
  switch (role) {
    case "SUPER_ADMIN": return "super-admin";
    case "SCHOOL_ADMIN": return "school-admin";
    case "TEACHER": return "teacher";
    case "PARENT": return "parent";
    default: return "dashboard";
  }
}

export function AuthPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", school: "" });
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      if (mode === "login") {
        const result: any = await loginMutation.mutateAsync({ email: form.email, password: form.password });
        localStorage.setItem("token", result.token);
        onNavigate(roleToPage(result.user?.role || "student"));
        toast.success("Welcome back!");
      } else {
        const result: any = await registerMutation.mutateAsync({ ...form, role: ROLE_TO_BACKEND[role] || "STUDENT" });
        localStorage.setItem("token", result.token);
        toast.success("Account created! Redirecting you…");
        onNavigate(roleToPage(result.user?.role || "student"));
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    }
  }

  const roles: { id: string; label: string; icon: string }[] = [
    { id: "student", label: "Student", icon: "🎓" },
    { id: "teacher", label: "Teacher", icon: "👨‍🏫" },
    { id: "parent", label: "Parent", icon: "👪" },
    { id: "school", label: "School", icon: "🏫" },
  ];

  return (
    <div className="min-h-screen bg-background flex font-body">
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12 text-white" style={{ background: "linear-gradient(160deg, #0c6438 0%, #073d25 100%)" }}>
        <Logo onClick={() => onNavigate("home")} />
        <div>
          <div className="text-4xl font-black mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>
            Your Journey to<br /><span style={{ color: AMBER }}>Academic Excellence</span><br />Starts Here.
          </div>
          <p className="text-white/70 mb-8">Join 2.1 million students preparing for WAEC, JAMB, NECO and beyond.</p>
          <div className="space-y-3">
            {["Access 80,000+ past questions", "AI tutor available 24/7", "Track your progress in real time", "Free to start — no card required"].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm text-white/80">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: AMBER }}>
                  <Check size={12} color="#0d1f12" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-white/40">© 2025 EduMaster Africa</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo onClick={() => onNavigate("home")} /></div>
          <div className="mb-8">
            <h1 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>
              {mode === "login" ? "Sign in to your account" : "Create your free account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-bold" style={{ color: G }}>
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>

          {mode === "register" && (
            <div className="mb-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">I am a</div>
              <div className="grid grid-cols-4 gap-2">
                {roles.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-bold border-2 transition-all ${role === r.id ? "text-white border-green-600 bg-green-50" : "border-border text-muted-foreground hover:border-green-300"}`}
                    style={role === r.id ? { background: G } : {}}>
                    <span className="text-lg">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Full Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm" placeholder="Full name" required />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm" placeholder="Email" required />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-card text-sm" placeholder="Password" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {mode === "register" && (
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">School (optional)</label>
                <input value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm" placeholder="School" />
              </div>
            )}

            <button type="submit" disabled={loginMutation.isPending || registerMutation.isPending}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white" style={{ background: G }}>
              {loginMutation.isPending || registerMutation.isPending ? "Processing..." : mode === "login" ? "Sign In" : "Create Free Account"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Google", "Microsoft"].map(p => (
                <button key={p} onClick={() => { onNavigate("dashboard"); }}
                  className="py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted">
                  {p}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By continuing you agree to our{" "}
            <span className="underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
