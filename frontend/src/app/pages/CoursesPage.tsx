import { useState } from "react";
import { Search, BookOpen, Users, Star, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "../components/Logo";
import { BadgeComp } from "../components/BadgeComp";
import { useCourses } from "../../lib/api";
import { G, BLUE, AMBER, RED, PURPLE } from "../constants";
import { allCourses } from "../data/mockData";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function CoursesPage({ onNavigate }: { onNavigate: (p: Page, courseId?: string) => void }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const coursesQuery = useCourses();
  const courses = (coursesQuery.data as any[]) || [];
  const filters = ["All", "WAEC", "JAMB", "NECO", "Post-UTME", "Primary", "International"];
  const filtered = courses.length ? courses.filter(c => (filter === "All" || c.category === filter) && (search === "" || c.title.toLowerCase().includes(search.toLowerCase()))) : allCourses.filter(c => (filter === "All" || c.category === filter) && (search === "" || c.title.toLowerCase().includes(search.toLowerCase())));

  if (coursesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background font-body">
        <header className="bg-card border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <Logo onClick={() => onNavigate("home")} />
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("auth")} className="text-sm font-semibold px-3 py-2 rounded-lg border border-border hover:bg-muted hidden sm:block">Sign In</button>
            <button onClick={() => onNavigate("dashboard")} className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: G }}>Dashboard</button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center text-muted-foreground">Loading courses…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="bg-card border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
        <Logo onClick={() => onNavigate("home")} />
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <button onClick={() => onNavigate("home")} className="text-muted-foreground hover:text-foreground">Home</button>
          <button onClick={() => onNavigate("pricing")} className="text-muted-foreground hover:text-foreground">Pricing</button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("auth")} className="text-sm font-semibold px-3 py-2 rounded-lg border border-border hover:bg-muted hidden sm:block">Sign In</button>
          <button onClick={() => onNavigate("dashboard")} className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: G }}>Dashboard</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: G }}>Course Library</div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2" style={{ fontFamily: "Nunito, sans-serif" }}>Find Your Course</h1>
          <p className="text-muted-foreground max-w-xl">Expert-crafted courses for every major exam. Taught by Nigeria's top educators.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search courses..." />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-2 rounded-full text-xs font-bold transition-all"
                style={filter === f ? { background: G, color: "#fff" } : { background: "#ece8e0", color: "#5c6b5e" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-5">{filtered.length} courses found</div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(course => (
            <div key={course.id} onClick={() => onNavigate("course", String(course.id))}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="h-2" style={{ background: course.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: course.color }}>📖</div>
                  {course.badge && <BadgeComp label={course.badge} color={course.badge === "New" ? BLUE : course.badge === "Bestseller" ? AMBER : G} />}
                </div>
                <h3 className="font-bold text-sm text-foreground mb-0.5 leading-snug group-hover:underline">{course.title}</h3>
                <div className="text-xs text-muted-foreground mb-1">{course.instructor}</div>
                <div className="text-xs font-semibold mb-3" style={{ color: course.color }}>{course.category}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><BookOpen size={10} /> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Users size={10} /> {(course.enrolled / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">{course.rating}</span>
                  </div>
                  <div className="font-black text-sm" style={{ color: course.color }}>{course.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">🔍</div>
            <div className="font-bold text-foreground mb-1">No courses found</div>
            <div className="text-sm text-muted-foreground">Try a different search or filter.</div>
          </div>
        )}
      </div>
    </div>
  );
}
