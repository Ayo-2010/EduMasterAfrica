export type Page =
  | "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt"
  | "courses" | "course" | "teacher" | "parent" | "profile" | "learn"
  | "admin" | "school-admin" | "super-admin"
  | "ai-tutor" | "leaderboard" | "certificates" | "exams"
  | "waec-prep" | "jamb-cbt" | "neco-mock" | "post-utme"
  | "scholarships" | "about" | "blog" | "careers" | "contact" | "privacy" | "faq";

export const PAGE_PATHS: Record<Page, string> = {
  home: "/",
  auth: "/auth",
  pricing: "/pricing",
  dashboard: "/dashboard",
  "cbt-setup": "/cbt",
  cbt: "/cbt/exam",
  courses: "/courses",
  course: "/courses/x",
  teacher: "/teacher",
  parent: "/parent",
  profile: "/profile",
  learn: "/learn",
  admin: "/admin",
  "school-admin": "/school-admin",
  "super-admin": "/super-admin",
  "ai-tutor": "/ai-tutor",
  leaderboard: "/leaderboard",
  certificates: "/certificates",
  exams: "/exams",
  "waec-prep": "/waec-prep",
  "jamb-cbt": "/jamb-cbt",
  "neco-mock": "/neco-mock",
  "post-utme": "/post-utme",
  scholarships: "/scholarships",
  about: "/about",
  blog: "/blog",
  careers: "/careers",
  contact: "/contact",
  privacy: "/privacy",
  faq: "/faq",
};

export function pathForPage(page: Page, courseId?: string | number): string {
  if (page === "course") return `/courses/${courseId ?? ""}`;
  return PAGE_PATHS[page];
}

export function pageForPath(pathname: string): { page: Page; courseId?: string } {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const parts = clean.split("/").filter(Boolean);

  if (parts.length === 0) return { page: "home" };
  if (parts[0] === "courses" && parts[1]) return { page: "course", courseId: parts[1] };

  const lookup: Record<string, Page> = {
    auth: "auth",
    pricing: "pricing",
    dashboard: "dashboard",
    cbt: "cbt-setup",
    courses: "courses",
    teacher: "teacher",
    parent: "parent",
    profile: "profile",
    learn: "learn",
    admin: "admin",
    "school-admin": "school-admin",
    "super-admin": "super-admin",
    "ai-tutor": "ai-tutor",
    leaderboard: "leaderboard",
    certificates: "certificates",
    exams: "exams",
    "waec-prep": "waec-prep",
    "jamb-cbt": "jamb-cbt",
    "neco-mock": "neco-mock",
    "post-utme": "post-utme",
    scholarships: "scholarships",
    about: "about",
    blog: "blog",
    careers: "careers",
    contact: "contact",
    privacy: "privacy",
    faq: "faq",
  };

  if (clean === "/cbt/exam") return { page: "cbt" };
  const p = lookup[parts[0]];
  if (p) return { page: p };
  return { page: "home" };
}
