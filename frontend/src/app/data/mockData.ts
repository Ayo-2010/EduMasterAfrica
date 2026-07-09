import { G, PURPLE, BLUE, AMBER, RED } from "../constants";

export const subjectProgress = [
  { subject: "Maths", score: 74, mastery: 74, predicted: 81 },
  { subject: "Biology", score: 88, mastery: 88, predicted: 91 },
  { subject: "Chemistry", score: 61, mastery: 61, predicted: 68 },
  { subject: "Physics", score: 55, mastery: 55, predicted: 63 },
  { subject: "English", score: 92, mastery: 92, predicted: 94 },
  { subject: "Lit", score: 79, mastery: 79, predicted: 83 },
];

export const radarData = [
  { topic: "Algebra", score: 85 }, { topic: "Calculus", score: 58 },
  { topic: "Genetics", score: 91 }, { topic: "Ecology", score: 76 },
  { topic: "Organic Chem", score: 62 }, { topic: "Mechanics", score: 51 },
];

export const weeklyStudy = [
  { day: "Mon", hours: 2.5, target: 3 }, { day: "Tue", hours: 3.0, target: 3 },
  { day: "Wed", hours: 1.5, target: 3 }, { day: "Thu", hours: 4.0, target: 3 },
  { day: "Fri", hours: 3.5, target: 3 }, { day: "Sat", hours: 5.0, target: 4 },
  { day: "Sun", hours: 2.0, target: 2 },
];

export const scoreHistory = [
  { week: "Wk 1", score: 58 }, { week: "Wk 2", score: 63 },
  { week: "Wk 3", score: 61 }, { week: "Wk 4", score: 69 },
  { week: "Wk 5", score: 72 }, { week: "Wk 6", score: 74 },
  { week: "Wk 7", score: 70 }, { week: "Wk 8", score: 78 },
];

export const leaderboard = [
  { id: "l1", rank: 1, name: "Chisom Adeyemi", xp: 12840, school: "FGGC Bwari", state: "FCT", avatar: "CA", streak: 32 },
  { id: "l2", rank: 2, name: "Emeka Osei", xp: 11720, school: "King's College Lagos", state: "Lagos", avatar: "EO", streak: 28 },
  { id: "l3", rank: 3, name: "Fatimah Bello", xp: 10950, school: "GGSS Kano", state: "Kano", avatar: "FB", streak: 21 },
  { id: "l4", rank: 4, name: "Tunde Adesanya", xp: 10400, school: "CHS Ibadan", state: "Oyo", avatar: "TA", streak: 19 },
  { id: "l5", rank: 5, name: "Demo Student", xp: 9880, school: "Queens College Lagos", state: "Lagos", avatar: "DS", streak: 14 },
  { id: "l6", rank: 6, name: "Amara Nwosu", xp: 9650, school: "FGC Enugu", state: "Enugu", avatar: "AN", streak: 11 },
  { id: "l7", rank: 7, name: "Suleiman Garba", xp: 9340, school: "Govt Sec Sch Kaduna", state: "Kaduna", avatar: "SG", streak: 9 },
  { id: "l8", rank: 8, name: "Taiwo Adewale", xp: 9120, school: "CMS Grammar Bariga", state: "Lagos", avatar: "TW", streak: 15 },
];

export const enrolledCourses = [
  { id: 1, title: "WAEC Mathematics Complete", category: "WAEC", lessons: 48, completed: 31, color: G, instructor: "Dr. Akin Okafor" },
  { id: 2, title: "JAMB Biology Masterclass", category: "JAMB", lessons: 36, completed: 36, color: PURPLE, instructor: "Prof. Ngozi Eze" },
  { id: 3, title: "English Language & Lit", category: "WAEC", lessons: 40, completed: 18, color: BLUE, instructor: "Mrs. Adaku Bello" },
  { id: 4, title: "Physics: From Basics to JAMB", category: "JAMB", lessons: 44, completed: 8, color: AMBER, instructor: "Mr. Ibrahim Musa" },
];

export const allCourses = [
  { id: 1, title: "WAEC Mathematics Complete", category: "WAEC", lessons: 48, enrolled: 12400, rating: 4.9, badge: "Bestseller", color: G, instructor: "Dr. Akin Okafor", price: "Free" },
  { id: 2, title: "JAMB Biology Masterclass", category: "JAMB", lessons: 36, enrolled: 8900, rating: 4.8, badge: "Top Rated", color: PURPLE, instructor: "Prof. Ngozi Eze", price: "\u20A62,500/mo" },
  { id: 3, title: "English Language & Lit", category: "WAEC", lessons: 40, enrolled: 10200, rating: 4.7, badge: null, color: BLUE, instructor: "Mrs. Adaku Bello", price: "Free" },
  { id: 4, title: "NECO Chemistry Deep Dive", category: "NECO", lessons: 32, enrolled: 5600, rating: 4.6, badge: null, color: RED, instructor: "Mr. Seun Adeyemi", price: "\u20A61,500/mo" },
  { id: 5, title: "Physics: From Basics to JAMB", category: "JAMB", lessons: 44, enrolled: 7300, rating: 4.8, badge: "New", color: AMBER, instructor: "Mr. Ibrahim Musa", price: "\u20A62,000/mo" },
  { id: 6, title: "Post-UTME Crash Course", category: "Post-UTME", lessons: 20, enrolled: 15000, rating: 4.9, badge: "Bestseller", color: "#0891b2", instructor: "Team EduMaster", price: "\u20A63,000" },
  { id: 7, title: "Common Entrance Prep", category: "Primary", lessons: 28, enrolled: 4200, rating: 4.5, badge: null, color: "#16a34a", instructor: "Mrs. Patience Obi", price: "Free" },
  { id: 8, title: "SAT & Scholarship Prep", category: "International", lessons: 52, enrolled: 3100, rating: 4.7, badge: "New", color: "#db2777", instructor: "Dr. Chuka Nweze", price: "\u20A65,000/mo" },
  { id: 9, title: "WAEC Chemistry Mastery", category: "WAEC", lessons: 38, enrolled: 6800, rating: 4.6, badge: null, color: "#d97706", instructor: "Dr. Kunle Bello", price: "Free" },
  { id: 10, title: "JAMB Mathematics 2025", category: "JAMB", lessons: 50, enrolled: 9400, rating: 4.9, badge: "Bestseller", color: G, instructor: "Prof. Emeka Osei", price: "\u20A62,500/mo" },
  { id: 11, title: "NECO Biology Essentials", category: "NECO", lessons: 30, enrolled: 4100, rating: 4.5, badge: null, color: PURPLE, instructor: "Mrs. Amara Nwosu", price: "\u20A61,000/mo" },
  { id: 12, title: "IELTS Preparation Course", category: "International", lessons: 45, enrolled: 2800, rating: 4.8, badge: "Top Rated", color: BLUE, instructor: "Mr. Dave Eze", price: "\u20A66,000/mo" },
];

export const examCategories = [
  { name: "WAEC", icon: "\uD83D\uDCCB", count: "24,000+", color: "#dcfce7", border: G, questions: "questions" },
  { name: "JAMB", icon: "\uD83C\uDFAF", count: "18,500+", color: "#fef9c3", border: "#ca8a04", questions: "questions" },
  { name: "NECO", icon: "\uD83D\uDCDA", count: "12,000+", color: "#dbeafe", border: BLUE, questions: "questions" },
  { name: "NABTEB", icon: "\uD83D\uDD27", count: "8,400+", color: "#fce7f3", border: "#db2777", questions: "questions" },
  { name: "Post-UTME", icon: "\uD83C\uDFDB\uFE0F", count: "31,000+", color: "#ede9fe", border: PURPLE, questions: "questions" },
  { name: "Common Entrance", icon: "\u2B50", count: "5,200+", color: "#fff7ed", border: "#ea580c", questions: "questions" },
];

export const cbtSubjects = [
  { name: "Biology", icon: "📖", color: G, years: ["2023", "2022", "2021", "2020", "2019"] },
  { name: "Chemistry", icon: "🧠", color: RED, years: ["2023", "2022", "2021", "2020"] },
  { name: "Mathematics", icon: "🎓", color: AMBER, years: ["2023", "2022", "2021", "2020", "2019"] },
  { name: "Physics", icon: "⚡", color: BLUE, years: ["2023", "2022", "2021", "2020"] },
  { name: "English", icon: "📖", color: PURPLE, years: ["2023", "2022", "2021"] },
  { name: "Literature", icon: "📖", color: "#0891b2", years: ["2023", "2022", "2021"] },
];

export const cbtModes = [
  { id: "practice", label: "Practice Mode", desc: "Study at your own pace. See answers immediately.", icon: "📖" },
  { id: "exam", label: "Exam Mode", desc: "Timed. Realistic exam experience. No hints.", icon: "⏱️" },
  { id: "challenge", label: "Challenge Mode", desc: "Compete with others in real time.", icon: "⚡" },
  { id: "mock", label: "Mock Exam", desc: "Full-length simulation. Replicate exam day.", icon: "🎯" },
];

export const cbtQs = [
  {
    id: 1, subject: "Biology",
    text: "The process by which plants manufacture their own food using sunlight, water, and carbon dioxide is called:",
    options: [{ id: "A", text: "Respiration" }, { id: "B", text: "Photosynthesis" }, { id: "C", text: "Transpiration" }, { id: "D", text: "Osmosis" }],
    correct: "B",
    explanation: "Photosynthesis occurs in chloroplasts. Light energy converts CO₂ + H₂O → glucose + O₂. This is the reverse of respiration.",
  },
  {
    id: 2, subject: "Biology",
    text: "Which organelle is known as the 'powerhouse of the cell' and is responsible for ATP production?",
    options: [{ id: "A", text: "Chloroplast" }, { id: "B", text: "Nucleus" }, { id: "C", text: "Mitochondria" }, { id: "D", text: "Ribosome" }],
    correct: "C",
    explanation: "Mitochondria carry out cellular respiration, converting glucose and oxygen into ATP, water, and CO₂.",
  },
  {
    id: 3, subject: "Mathematics",
    text: "If 2x + 3 = 11, what is the value of x?",
    options: [{ id: "A", text: "3" }, { id: "B", text: "4" }, { id: "C", text: "5" }, { id: "D", text: "7" }],
    correct: "B",
    explanation: "2x + 3 = 11 → 2x = 8 → x = 4. Always isolate the variable by performing inverse operations.",
  },
  {
    id: 4, subject: "Chemistry",
    text: "What is the chemical formula for sulfuric acid?",
    options: [{ id: "A", text: "HCl" }, { id: "B", text: "H₂SO₃" }, { id: "C", text: "H₂SO₄" }, { id: "D", text: "H₂S" }],
    correct: "C",
    explanation: "Sulfuric acid is H₂SO₄. It is a strong diprotic acid and one of the most widely produced industrial chemicals.",
  },
  {
    id: 5, subject: "Physics",
    text: "A car travels 120 km in 2 hours. What is its average speed?",
    options: [{ id: "A", text: "40 km/h" }, { id: "B", text: "60 km/h" }, { id: "C", text: "80 km/h" }, { id: "D", text: "100 km/h" }],
    correct: "B",
    explanation: "Average speed = total distance ÷ time = 120 km ÷ 2 h = 60 km/h.",
  },
];

export const notifications = [
  { id: 1, type: "achievement", text: "You earned the 'Streak Master' badge! 🔥", time: "2 min ago", read: false },
  { id: 2, type: "exam", text: "WAEC Biology Mock starts in 3 hours. Don't forget!", time: "1 hr ago", read: false },
  { id: 3, type: "rank", text: "You moved up to #5 on the National Leaderboard 🎉", time: "3 hrs ago", read: true },
  { id: 4, type: "course", text: "New lesson added: Quadratic Equations – Advanced", time: "Yesterday", read: true },
  { id: 5, type: "ai", text: "Your AI study plan for July is ready. Check it out.", time: "Yesterday", read: true },
];

export const faqs = [
  { q: "Is EduMaster Africa free to use?", a: "Yes! We have a robust free tier covering thousands of past questions, video lessons, and basic AI tutoring. Premium plans unlock unlimited CBT practice, advanced AI features, and full course access." },
  { q: "Which exams does EduMaster cover?", a: "We cover WAEC, NECO, NABTEB, JAMB, BECE, Post-UTME, Common Entrance, SAT, IELTS, Cambridge, and more. New exams are added regularly based on student demand." },
  { q: "How does the AI Tutor work?", a: "EduMaster AI is trained on the Nigerian and international curriculum. It understands natural language questions, explains concepts step-by-step, solves math problems, marks essays, and adapts to your learning level over time." },
  { q: "Can my school use EduMaster?", a: "Absolutely. Our School License gives administrators tools to manage students, upload school-specific exams, track class performance, generate report cards, and communicate with parents. Contact us for institutional pricing." },
  { q: "Can I use EduMaster offline?", a: "Our mobile apps (Android and iOS) support offline mode. Download lessons, notes, and question packs while connected — then study anywhere, even without internet." },
  { q: "Is my data safe?", a: "We use end-to-end encryption, JWT authentication, and comply with GDPR and NDPR regulations. We never sell student data. Parental consent is required for users under 13." },
];

export const partners = ["WAEC", "NUC", "UNN", "UNILAG", "ABU Zaria", "OAU Ile-Ife", "Ministry of Education", "NERDC", "JAMB Board", "British Council"];

export const testimonials = [
  { name: "Ngozi Okafor", role: "SS3 Student, Lagos", text: "EduMaster helped me score 312 in JAMB. The CBT practice mode is exactly like the real exam. I practiced 400 past questions in 2 weeks!", score: "312/400 JAMB", avatar: "NO" },
  { name: "Ibrahim Musa", role: "Graduate, Kano", text: "I was struggling with Chemistry until I found the AI tutor. It explains every step in detail and generates practice questions instantly.", score: "A1 Chemistry", avatar: "IM" },
  { name: "Blessing Eze", role: "Parent, Enugu", text: "As a parent, I love the progress reports. I can see exactly what my daughter is studying, her scores, and how she ranks nationally.", score: "Parent Portal", avatar: "BE" },
  { name: "Chukwuemeka Nze", role: "Teacher, Anambra", text: "Creating CBT exams for my SS2 class used to take hours. Now I do it in minutes with AI-generated questions and automatic grading.", score: "Teacher Portal", avatar: "CN" },
];

export const aiReplies: Record<string, string> = {
  default: "Great question! Let me break that down for you step by step...",
  photosynthesis: "**Photosynthesis** is the process by which plants convert light energy into chemical energy:\n\n6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nIt occurs in two stages:\n1. **Light reactions** (thylakoid) — capture light, produce ATP and NADPH\n2. **Calvin cycle** (stroma) — uses ATP + NADPH to fix CO₂ into glucose\n\nWant me to generate practice questions on this? 📝",
  jamb: "For JAMB 2025, focus on these high-yield areas:\n\n**Biology**: Cell division, genetics, ecology, reproduction\n**Chemistry**: Electrochemistry, organic reactions, equilibrium\n**Physics**: Waves, electricity, mechanics\n**Maths**: Algebra, trigonometry, statistics\n\nI recommend 40 questions/day for 6 weeks. Want me to build your personalized study timetable? 📅",
  plan: "I'll create a personalized 45-day WAEC study plan for you:\n\n**Week 1–2**: English & Literature (high marks, fast gains)\n**Week 3–4**: Biology & Chemistry (your weakest subjects)\n**Week 5–6**: Mathematics (daily problem sets)\n**Week 7**: Mock exams + review\n\nShall I schedule daily reminders and track your progress? ✅",
};
