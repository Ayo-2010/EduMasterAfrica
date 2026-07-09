import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useMe, useCourse } from "../lib/api";
import { G, AMBER } from "./constants";
import { pageForPath, pathForPage, Page } from "./routing";

import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { PricingPage } from "./pages/PricingPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { CBTSetup } from "./pages/CBTSetup";
import { CBTExam } from "./pages/CBTExam";
import { CoursesPage } from "./pages/CoursesPage";
import { TeacherPortal } from "./pages/TeacherPortal";
import { ParentPortal } from "./pages/ParentPortal";
import { ProfilePage } from "./pages/ProfilePage";
import { CoursePlayerPage } from "./pages/CoursePlayerPage";
import { LearnPage } from "../features/learn/LearnPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import SchoolAdminDashboard from "./pages/SchoolAdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import { Logo } from "./components/Logo";
import AdminLayout from "./components/AdminLayout";

import { AiTutorPage } from "./pages/AiTutorPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { ExamsPage } from "./pages/ExamsPage";
import { ExamPrepPage } from "./pages/ExamPrepPage";
import { ScholarshipsPage } from "./pages/ScholarshipsPage";
import { AboutPage } from "./pages/AboutPage";
import { BlogPage } from "./pages/BlogPage";
import { CareersPage } from "./pages/CareersPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { FaqPage } from "./pages/FaqPage";

const ADMIN_PAGES = new Set<Page>(["admin", "super-admin", "school-admin", "teacher", "parent"]);
const MARKETING_PAGES = new Set<Page>([
  "about", "blog", "careers", "contact", "privacy", "faq", "ai-tutor", "leaderboard",
  "certificates", "exams", "waec-prep", "jamb-cbt", "neco-mock", "post-utme", "scholarships", "pricing", "auth",
]);
const EXAM_PAGE_ID: Partial<Record<Page, string>> = {
  "waec-prep": "waec", "jamb-cbt": "jamb", "neco-mock": "neco", "post-utme": "post-utme",
};

export default function App() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const { page, courseId } = pageForPath(location.pathname);

  const [darkMode, setDarkMode] = useState(false);

  const navigate = useCallback((p: Page, cid?: string | number) => {
    routerNavigate(pathForPage(p, cid));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [routerNavigate]);

  const courseQuery = useCourse(page === "course" ? courseId ?? null : null);
  const selectedCourse = page === "course" ? (courseQuery.data as any) : undefined;

  const { data: me } = useMe();
  const isSuperAdmin = (me as any)?.role === "SUPER_ADMIN";
  const isSchoolAdmin = (me as any)?.role === "SCHOOL_ADMIN";
  const isTeacher = (me as any)?.role === "TEACHER";
  const isParent = (me as any)?.role === "PARENT";

  const allTabs: { id: Page; label: string }[] = [
    { id: "home", label: "🏠 Home" },
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "courses", label: "📚 Courses" },
    { id: "cbt-setup", label: "🎯 CBT Practice" },
    { id: "profile", label: "👤 Profile" },
    ...(isSuperAdmin ? [{ id: "super-admin" as Page, label: "🛡️ Super Admin" }] : []),
    ...(isSchoolAdmin ? [{ id: "school-admin" as Page, label: "🏫 School Admin" }] : []),
    ...(isTeacher ? [{ id: "teacher" as Page, label: "👨‍🏫 Teacher" }] : []),
    ...(isParent ? [{ id: "parent" as Page, label: "👨‍👩‍👧 Parent" }] : []),
  ];

  const renderAdminPage = () => {
    if (page === "admin" && isSuperAdmin) return <AdminDashboard onNavigate={navigate} />;
    if (page === "admin" && !isSuperAdmin) return <AccessDenied onNavigate={navigate} msg="Admin access required" sub="You need a Super Admin account to view this page." />;
    if (page === "super-admin" && isSuperAdmin) return <SuperAdminDashboard />;
    if (page === "super-admin" && !isSuperAdmin) return <AccessDenied onNavigate={navigate} msg="Access denied" sub="Super Admin only." />;
    if (page === "school-admin" && isSchoolAdmin) return <SchoolAdminDashboard />;
    if (page === "school-admin" && !isSchoolAdmin) return <AccessDenied onNavigate={navigate} msg="Access denied" sub="School Admin only." />;
    if (page === "teacher" && isTeacher) return <TeacherDashboard />;
    if (page === "teacher" && !isTeacher) return <AccessDenied onNavigate={navigate} msg="Access denied" sub="Teacher only." />;
    if (page === "parent" && isParent) return <ParentDashboard />;
    if (page === "parent" && !isParent) return <AccessDenied onNavigate={navigate} msg="Access denied" sub="Parent only." />;
    return null;
  };

  const isAdminPage = ADMIN_PAGES.has(page);
  const showTabs = !isAdminPage && !MARKETING_PAGES.has(page);

  return (
    <div className={`size-full ${darkMode ? "dark" : ""}`} style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Nunito', system-ui, sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .page-tabs {
          position: fixed; bottom: 1.25rem; left: 50%; transform: translateX(-50%);
          z-index: 100; display: flex; gap: 0.375rem; align-items: center;
          background: rgba(13,31,18,0.92); backdrop-filter: blur(12px);
          padding: 0.5rem; border-radius: 9999px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
          max-width: calc(100vw - 2rem); overflow-x: auto; scrollbar-width: none;
        }
        .page-tabs::-webkit-scrollbar { display: none; }
        .page-tab {
          padding: 0.4rem 0.875rem; border-radius: 9999px; font-size: 0.7rem;
          font-weight: 700; cursor: pointer; transition: all 0.2s;
          color: rgba(255,255,255,0.55); white-space: nowrap; border: none;
          background: transparent; flex-shrink: 0;
        }
        .page-tab.active { background: ${G}; color: white; }
        .page-tab:not(.active):hover { color: white; background: rgba(255,255,255,0.1); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        .animate-bounce { animation: bounce 1.2s infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>

      <Toaster position="top-right" richColors expand={false} />

      {isAdminPage ? (
        <AdminLayout>
          {renderAdminPage()}
        </AdminLayout>
      ) : (
        <>
          {page === "home" && <LandingPage onNavigate={navigate} />}
          {page === "auth" && <AuthPage onNavigate={navigate} />}
          {page === "pricing" && <PricingPage onNavigate={navigate} />}
          {page === "dashboard" && <StudentDashboard onNavigate={navigate} />}
          {page === "cbt-setup" && <CBTSetup onNavigate={navigate} />}
          {page === "cbt" && <CBTExam onNavigate={navigate} />}
          {page === "courses" && <CoursesPage onNavigate={navigate} />}
          {page === "teacher" && <TeacherPortal onNavigate={navigate} />}
          {page === "parent" && <ParentPortal onNavigate={navigate} />}
          {page === "profile" && <ProfilePage onNavigate={navigate} />}
          {page === "course" && <CoursePlayerPage course={selectedCourse} onNavigate={navigate} />}
          {page === "learn" && <LearnPage onNavigate={navigate} />}

          {page === "ai-tutor" && <AiTutorPage onNavigate={navigate} />}
          {page === "leaderboard" && <LeaderboardPage onNavigate={navigate} />}
          {page === "certificates" && <CertificatesPage onNavigate={navigate} />}
          {page === "exams" && <ExamsPage onNavigate={navigate} />}
          {(page === "waec-prep" || page === "jamb-cbt" || page === "neco-mock" || page === "post-utme") && <ExamPrepPage examId={EXAM_PAGE_ID[page]!} onNavigate={navigate} />}
          {page === "scholarships" && <ScholarshipsPage onNavigate={navigate} />}
          {page === "about" && <AboutPage onNavigate={navigate} />}
          {page === "blog" && <BlogPage onNavigate={navigate} />}
          {page === "careers" && <CareersPage onNavigate={navigate} />}
          {page === "contact" && <ContactPage onNavigate={navigate} />}
          {page === "privacy" && <PrivacyPage onNavigate={navigate} />}
          {page === "faq" && <FaqPage onNavigate={navigate} />}

          {showTabs && (
            <nav className="page-tabs">
              <button onClick={() => setDarkMode(!darkMode)} className="page-tab" title="Toggle dark mode">
                {darkMode ? "☀️" : "🌙"}
              </button>
              <div className="w-px h-4 bg-white/20 mx-0.5" />
              {allTabs.map((tab) => (
                <button key={tab.id} onClick={() => navigate(tab.id)} className={`page-tab ${page === tab.id ? "active" : ""}`}>
                  {tab.label}
                </button>
              ))}
            </nav>
          )}
        </>
      )}
    </div>
  );
}

function AccessDenied({ onNavigate, msg, sub }: { onNavigate: (p: Page, courseId?: string) => void; msg: string; sub: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-body">
      <div className="text-center space-y-4">
        <div className="text-5xl">🚫</div>
        <h2 className="font-black text-2xl text-foreground">{msg}</h2>
        <p className="text-muted-foreground">{sub}</p>
        <button onClick={() => onNavigate("dashboard")} className="px-4 py-2 rounded-full text-white font-bold" style={{ background: G }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
