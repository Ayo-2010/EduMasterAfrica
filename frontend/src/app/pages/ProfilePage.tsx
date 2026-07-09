import { useState } from "react";
import { LogOut, Moon, Sun } from "lucide-react";
import { AMBER, G } from "../constants";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function ProfilePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="border-b border-border bg-card px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-muted">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => onNavigate("dashboard")} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
            <LogOut size={16} />
          </button>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-black text-white mb-4" style={{ background: AMBER }}>ME</div>
          <div className="font-black text-xl text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>Demo Student</div>
          <div className="text-sm text-muted-foreground">student@example.com</div>
        </div>
      </div>
    </div>
  );
}
