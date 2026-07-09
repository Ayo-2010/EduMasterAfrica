import { allCourses } from "../../app/data/mockData";
import { getQuestionsForSubject, Question } from "./questions";

export interface Lesson {
  id: number;
  title: string;
  type: "reading" | "practice" | "quiz";
  minutes: number;
  summary: string;
  content: string;
  exercise?: { question: string; options: string[]; answer: number; explanation: string };
}

export interface Course {
  id: number;
  title: string;
  category: string;
  subject: string;
  lessons: number;
  enrolled: number;
  rating: number;
  badge: string | null;
  color: string;
  instructor: string;
  price: string;
  description: string;
  lessonList: Lesson[];
}

const TOPIC_POOLS: Record<string, string[]> = {
  Mathematics: ["Algebra Fundamentals", "Quadratic Equations", "Geometry & Angles", "Trigonometry", "Statistics & Probability", "Number Bases", "Indices & Logarithms", "Sets & Venn Diagrams", "Mensuration", "Sequences & Series"],
  Biology: ["Cell Structure", "Photosynthesis", "Genetics & Heredity", "Ecology & Ecosystems", "Circulatory System", "Nutrition in Plants & Animals", "Reproduction", "Classification of Living Things", "Plant Transport", "Hormones & Homeostasis"],
  Chemistry: ["Acids, Bases & Salts", "Atomic Structure", "The Periodic Table", "Organic Chemistry", "Electrolysis", "Chemical Bonding", "Stoichiometry", "Redox Reactions", "Rates of Reaction", "Energy Changes"],
  Physics: ["Motion & Speed", "Forces & Newton's Laws", "Electricity & Circuits", "Energy & Power", "Waves & Sound", "Heat & Temperature", "Magnetism", "Optics & Light", "Simple Machines", "Pressure"],
  English: ["Parts of Speech", "Tenses & Agreement", "Comprehension Strategies", "Vocabulary & Synonyms", "Idioms & Figures of Speech", "Letter Writing", "Essay Structure", "Phrasal Verbs", "Punctuation", "Summary Writing"],
  Literature: ["Elements of Poetry", "Drama & Stagecraft", "Prose Fiction", "Figures of Speech", "Oral Literature", "Character Analysis", "Themes & Motifs", "Setting & Atmosphere", "Narrative Voice", "Literary Appreciation"],
};

function buildContent(topic: string, subject: string): string {
  return [
    `Welcome to "${topic}". In this lesson we build a clear, exam-ready understanding of the key ideas in ${subject} around this topic.`,
    `We start with the core definitions and why they matter, then work through the standard methods examiners expect you to use. Pay attention to the worked examples — they mirror the style of real WAEC, JAMB and NECO questions.`,
    `By the end of this lesson you should be able to: define the key terms, apply the standard method to solve problems, and avoid the common mistakes students make under time pressure.`,
    `Tip: write out each formula or rule in your own words, then attempt the practice exercise before reading the explanation. Active recall is the fastest way to lock in marks.`,
  ].join("\n\n");
}

function pickExercise(subject: string, index: number): Lesson["exercise"] | undefined {
  const qs: Question[] = getQuestionsForSubject(subject);
  if (qs.length === 0) return undefined;
  const q = qs[index % qs.length];
  return {
    question: q.text,
    options: q.options.map((o) => o.text),
    answer: q.options.findIndex((o) => o.id === q.correct),
    explanation: q.explanation,
  };
}

function buildLessons(subject: string, count: number): Lesson[] {
  const pool = TOPIC_POOLS[subject] || ["Introduction", "Core Concepts", "Worked Examples", "Common Mistakes", "Exam Practice", "Revision", "Mock Questions", "Summary"];
  const lessons: Lesson[] = [];
  for (let i = 0; i < count; i++) {
    const topic = pool[i % pool.length];
    const type: Lesson["type"] = i > 0 && i % 5 === 0 ? "quiz" : i % 3 === 0 ? "practice" : "reading";
    lessons.push({
      id: i + 1,
      title: `${topic}`,
      type,
      minutes: 8 + ((i * 7) % 18),
      summary: `Master ${topic} with clear explanations and exam-style practice.`,
      content: buildContent(topic, subject),
      exercise: type !== "reading" ? pickExercise(subject, i) : undefined,
    });
  }
  return lessons;
}

function subjectForCourse(title: string, category: string): string {
  const t = title.toLowerCase();
  if (t.includes("math")) return "Mathematics";
  if (t.includes("biol")) return "Biology";
  if (t.includes("chem")) return "Chemistry";
  if (t.includes("phys")) return "Physics";
  if (t.includes("english") || t.includes("lit")) return t.includes("lit") ? "Literature" : "English";
  if (t.includes("sat") || t.includes("ielts")) return "English";
  // default by category-ish keyword
  if (t.includes("science")) return "Biology";
  return "Mathematics";
}

const DESCRIPTIONS: Record<string, string> = {
  WAEC: "Full WAEC syllabus coverage with past-question practice and AI-marked mock exams.",
  JAMB: "JAMB-style CBT practice modelled on recent UTME papers, with timed exam mode.",
  NECO: "Complete NECO preparation with topic-by-topic lessons and mock exams.",
  "Post-UTME": "Crash course for university post-UTME screening with school-specific question packs.",
  Primary: "Foundation lessons that build confidence for common entrance examinations.",
  International: "Internationally recognised exam prep (SAT, IELTS) with expert tutors.",
};

export const COURSES: Course[] = allCourses.map((c) => {
  const subject = subjectForCourse(c.title, c.category);
  return {
    ...c,
    subject,
    description: DESCRIPTIONS[c.category] || "Expert-led lessons with practice questions and AI feedback.",
    lessonList: buildLessons(subject, c.lessons),
  };
});

export function getCourseById(id: number | string): Course | undefined {
  return COURSES.find((c) => String(c.id) === String(id));
}

export const PLANS = [
  { id: "free", name: "Free", price: 0, interval: "forever", badge: "Get Started", features: ["Access to 5,000+ past questions", "3 free courses", "Basic AI tutor (10 asks/day)", "Community leaderboard", "Mobile app access"], highlighted: false },
  { id: "pro", name: "Pro", price: 2500, interval: "month", badge: "Most Popular", features: ["Unlimited CBT practice", "All courses unlocked", "Unlimited AI tutor", "Personalised study plan", "Performance analytics", "Downloadable notes", "Weekly progress report"], highlighted: true },
  { id: "premium", name: "Premium", price: 6000, interval: "month", badge: "Best Value", features: ["Everything in Pro", "Live classes with top tutors", "1-on-1 AI study coach", "Mock exam grading & feedback", "Scholarship alerts", "Certificate of completion", "Priority support"], highlighted: false },
];

export const LEADERBOARD_SEED = [
  { id: "l1", rank: 1, name: "Chisom Adeyemi", xp: 12840, school: "FGGC Bwari", state: "FCT", avatar: "CA", streak: 32 },
  { id: "l2", rank: 2, name: "Emeka Osei", xp: 11720, school: "King's College Lagos", state: "Lagos", avatar: "EO", streak: 28 },
  { id: "l3", rank: 3, name: "Fatimah Bello", xp: 10950, school: "GGSS Kano", state: "Kano", avatar: "FB", streak: 21 },
  { id: "l4", rank: 4, name: "Tunde Adesanya", xp: 10400, school: "CHS Ibadan", state: "Oyo", avatar: "TA", streak: 19 },
  { id: "l5", rank: 5, name: "Amara Nwosu", xp: 9650, school: "FGC Enugu", state: "Enugu", avatar: "AN", streak: 11 },
  { id: "l6", rank: 6, name: "Suleiman Garba", xp: 9340, school: "Govt Sec Sch Kaduna", state: "Kaduna", avatar: "SG", streak: 9 },
  { id: "l7", rank: 7, name: "Taiwo Adewale", xp: 9120, school: "CMS Grammar Bariga", state: "Lagos", avatar: "TW", streak: 15 },
  { id: "l8", rank: 8, name: "Ngozi Okafor", xp: 8880, school: "Queens College Lagos", state: "Lagos", avatar: "NO", streak: 24 },
];

export const EXAM_TYPES = [
  { id: "waec", name: "WAEC", subtitle: "West African Senior School Certificate", color: "#0c6438", icon: "📜", subjects: ["Mathematics", "English", "Biology", "Chemistry", "Physics", "Literature"], years: ["2023", "2022", "2021", "2020", "2019"] },
  { id: "jamb", name: "JAMB", subtitle: "Unified Tertiary Matriculation Exam", color: "#7c3aed", icon: "🎯", subjects: ["Mathematics", "English", "Biology", "Chemistry", "Physics"], years: ["2024", "2023", "2022", "2021", "2020"] },
  { id: "neco", name: "NECO", subtitle: "National Examinations Council", color: "#e84545", icon: "📚", subjects: ["Mathematics", "English", "Biology", "Chemistry", "Physics", "Literature"], years: ["2023", "2022", "2021", "2020"] },
  { id: "post-utme", name: "Post-UTME", subtitle: "University Screening Test", color: "#0891b2", icon: "🏛️", subjects: ["Mathematics", "English", "General Knowledge"], years: ["2024", "2023"] },
];

export const BLOG_POSTS = [
  { id: "b1", title: "How to score 300+ in JAMB: a 6-week study plan", category: "JAMB", date: "2025-06-12", readMins: 8, excerpt: "A realistic, day-by-day plan that thousands of top scorers used to cross 300 in UTME.", author: "EduMaster Team" },
  { id: "b2", title: "WAEC 2025: the 10 topics that carry the most marks", category: "WAEC", date: "2025-05-30", readMins: 6, excerpt: "We analysed the last 10 years of WAEC papers so you don't have to. Focus here first.", author: "Dr. Akin Okafor" },
  { id: "b3", title: "Understanding the new CBT interface before exam day", category: "Exam Tech", date: "2025-05-18", readMins: 5, excerpt: "Walk through the computer-based test screen so nothing surprises you on the day.", author: "Prof. Ngozi Eze" },
  { id: "b4", title: "Scholarships Nigerian students can apply for in 2025", category: "Scholarships", date: "2025-04-22", readMins: 7, excerpt: "Federal, state and private scholarships with deadlines, eligibility and links.", author: "EduMaster Team" },
  { id: "b5", title: "Note-taking methods that actually improve recall", category: "Study Skills", date: "2025-04-09", readMins: 4, excerpt: "Cornell, mind-maps and the Feynman technique — which one is right for you?", author: "Mrs. Adaku Bello" },
  { id: "b6", title: "From SS3 to admission: a parent's complete checklist", category: "Parents", date: "2025-03-28", readMins: 9, excerpt: "Everything you need to track as a parent so your child doesn't miss a step.", author: "Blessing Eze" },
];

export const SCHOLARSHIPS = [
  { id: "s1", name: "Federal Government Scholarship (BEA)", provider: "Federal Ministry of Education", amount: "Full tuition + stipend", deadline: "2025-09-30", level: "Undergraduate", region: "Nigeria", excerpt: "Bilateral Education Agreement awards for Nigerian students to study locally and abroad." },
  { id: "s2", name: "Agbami Medical & STEM Scholarship", provider: "Chevron", amount: "₦150,000 – ₦200,000", deadline: "2025-08-15", level: "University", region: "Nigeria", excerpt: "For 100–200 level students in medical, pharmacy, engineering and science courses." },
  { id: "s3", name: "MTN Foundation Scholarship", provider: "MTN Foundation", amount: "₦200,000/year", deadline: "2025-10-10", level: "Undergraduate", region: "Nigeria", excerpt: "Merit-based award for science & technology students in accredited Nigerian universities." },
  { id: "s4", name: "NNPC/TotalEnergies Scholarship", provider: "TotalEnergies", amount: "₦150,000/year", deadline: "2025-07-31", level: "Undergraduate", region: "Nigeria", excerpt: "For Nigerian students in tertiary institutions studying engineering, geosciences and related fields." },
  { id: "s5", name: "Mastercard Foundation Scholars", provider: "Mastercard Foundation", amount: "Full scholarship", deadline: "2025-11-01", level: "Undergraduate & Masters", region: "Africa", excerpt: "Comprehensive support for academically talented, economically disadvantaged African students." },
  { id: "s6", name: "Jim Ovia Foundation Leaders Scholarship", provider: "Jim Ovia Foundation", amount: "Tuition support", deadline: "2025-08-28", level: "Undergraduate", region: "Nigeria", excerpt: "For outstanding Nigerian students with leadership potential and financial need." },
];
