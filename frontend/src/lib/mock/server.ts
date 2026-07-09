import { db, MockUser, MockAttempt, uid } from "./store";
import { COURSES, PLANS, LEADERBOARD_SEED, getCourseById } from "./data";
import { QUESTION_BANK, getQuestionsForSubject, Question, SUBJECTS } from "./questions";

export class MockApiError extends Error {}

function delay(ms = 120) {
  return new Promise((r) => setTimeout(r, ms));
}

function getUser(token?: string | null): MockUser | null {
  if (!token) return null;
  const d = db.get();
  const userId = d.tokens[token];
  if (!userId) return null;
  return d.users.find((u) => u.id === userId) || null;
}

function publicUser(u: MockUser) {
  const { password, ...rest } = u;
  return rest;
}

function buildAttemptQuestions(subject: string, count: number): MockAttempt["questions"] {
  const pool = getQuestionsForSubject(subject);
  const source = pool.length ? pool : QUESTION_BANK;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(1, Math.min(count, shuffled.length))).map((q) => ({
    id: q.id,
    subject: q.subject,
    topic: q.topic,
    text: q.text,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
  }));
}

function aiReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("photosynthesis"))
    return "**Photosynthesis** is how plants make food:\n\n6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\n1. **Light reactions** (thylakoid) capture light → ATP + NADPH\n2. **Calvin cycle** (stroma) fixes CO₂ → glucose\n\nWant me to generate practice questions on this? 📝";
  if (m.includes("jamb"))
    return "For JAMB, prioritise: Biology (cell division, genetics, ecology), Chemistry (electrochemistry, organic, equilibrium), Physics (waves, electricity, mechanics), Maths (algebra, trigonometry, statistics). Aim for 40 questions/day for 6 weeks. Want a personalised timetable? 📅";
  if (m.includes("math") || m.includes("equation") || m.includes("algebra"))
    return "Let's solve it step by step. First, write down what you know, then isolate the variable using inverse operations. For example, 2x + 3 = 11 → 2x = 8 → x = 4. Paste the exact question and I'll walk you through it. 🧮";
  if (m.includes("exam") || m.includes("study") || m.includes("plan"))
    return "Here's a 6-week plan: Weeks 1–2 English & your strongest subject (fast wins), Weeks 3–4 your weakest subjects, Week 5 daily problem sets, Week 6 mock exams + review. Want me to track it and send reminders? ✅";
  return `Great question about **${message.slice(0, 40)}${message.length > 40 ? "…" : ""}**.\n\nLet me break it down:\n\n1. Start from the definition of the key term.\n2. Apply the standard method step by step.\n3. Watch for common traps examiners set.\n\nAsk me to generate practice questions or explain any step in more detail. 📘`;
}

interface Req {
  method: string;
  path: string;
  body?: any;
  token?: string | null;
}

export async function mockRequest({ method, path, body, token }: Req): Promise<any> {
  await delay();
  const d = db.get();
  const segments = path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const user = getUser(token);

  const route = (methods: string[], pattern: string): string[] | null => {
    const p = pattern.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    if (methods.includes(method) && p.length === segments.length) {
      const params: string[] = [];
      for (let i = 0; i < p.length; i++) {
        if (p[i].startsWith(":")) params.push(segments[i]);
        else if (p[i] !== segments[i]) return null;
      }
      return params;
    }
    return null;
  };

  // ---- Auth ----
  let params = route(["POST"], "/auth/login");
  if (params !== null) {
    const u = d.users.find((x) => x.email.toLowerCase() === String(body.email).toLowerCase());
    if (!u || u.password !== body.password) throw new MockApiError("Invalid email or password");
    const tok = uid("tok");
    d.tokens[tok] = u.id;
    db.set(d);
    return { user: publicUser(u), token: tok };
  }

  params = route(["POST"], "/auth/register");
  if (params !== null) {
    const email = String(body.email).toLowerCase();
    if (d.users.some((x) => x.email.toLowerCase() === email)) throw new MockApiError("An account with this email already exists");
    const role = body.role === "teacher" || body.role === "parent" || body.role === "school" ? body.role : "student";
    const nu: MockUser = {
      id: uid("u"),
      name: body.name || "New Student",
      email,
      password: body.password,
      role,
      school: body.school,
      xp: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
    };
    d.users.push(nu);
    const tok = uid("tok");
    d.tokens[tok] = nu.id;
    db.set(d);
    return { user: publicUser(nu), token: tok };
  }

  params = route(["GET"], "/auth/me");
  if (params !== null) {
    if (!user) throw new MockApiError("Not authenticated");
    return publicUser(user);
  }

  params = route(["PATCH"], "/auth/me");
  if (params !== null) {
    if (!user) throw new MockApiError("Not authenticated");
    Object.assign(user, body);
    db.set(d);
    return publicUser(user);
  }

  // ---- Courses ----
  if (method === "GET" && segments[0] === "courses" && segments.length === 1) {
    const category = body?.category || new URLSearchParams(typeof body === "object" ? "" : "").get("category");
    let list = COURSES.map((c) => ({
      ...c,
      enrolled: user ? (d.enrollments[user.id] || []).includes(String(c.id)) : false,
      completedLessons: user ? d.progress[user.id]?.[String(c.id)] || 0 : 0,
    }));
    if (category && category !== "All") list = list.filter((c) => c.category === category);
    return list;
  }

  params = route(["GET"], "/courses/:id");
  if (params !== null) {
    const c = getCourseById(params[0]);
    if (!c) throw new MockApiError("Course not found");
    return {
      ...c,
      enrolled: user ? (d.enrollments[user.id] || []).includes(String(c.id)) : false,
      completedLessons: user ? d.progress[user.id]?.[String(c.id)] || 0 : 0,
    };
  }

  params = route(["POST"], "/courses/:id/enroll");
  if (params !== null) {
    if (!user) throw new MockApiError("Please sign in to enroll");
    const id = params[0];
    d.enrollments[user.id] = d.enrollments[user.id] || [];
    if (!d.enrollments[user.id].includes(id)) d.enrollments[user.id].push(id);
    db.set(d);
    return { ok: true };
  }

  params = route(["POST"], "/courses/:id/lessons/:lessonId/complete");
  if (params !== null) {
    if (!user) throw new MockApiError("Please sign in");
    const [courseId, lessonId] = params;
    const c = getCourseById(courseId);
    if (!c) throw new MockApiError("Course not found");
    d.progress[user.id] = d.progress[user.id] || {};
    const cur = d.progress[user.id][courseId] || 0;
    const next = Math.min(c.lessons, Math.max(cur, Number(lessonId)));
    d.progress[user.id][courseId] = next;
    // award certificate when finished
    if (next >= c.lessons) {
      d.certificates[user.id] = d.certificates[user.id] || [];
      if (!d.certificates[user.id].includes(courseId)) d.certificates[user.id].push(courseId);
      user.xp += 200;
    } else {
      user.xp += 10;
    }
    db.set(d);
    const completed = next >= c.lessons;
    return { ok: true, completedLessons: next, completed, xp: user.xp };
  }

  // ---- Questions ----
  if (method === "GET" && segments[0] === "questions" && segments.length === 1) {
    const subject = body?.subject;
    const list = subject ? getQuestionsForSubject(subject) : QUESTION_BANK;
    return list;
  }

  if (method === "GET" && segments[0] === "questions" && segments[1] === "subjects") {
    return SUBJECTS.map((name) => ({ name, count: getQuestionsForSubject(name).length }));
  }

  // ---- CBT attempts ----
  params = route(["POST"], "/cbt/attempts");
  if (params !== null) {
    if (!user) throw new MockApiError("Please sign in to start an exam");
    const subject = body.subject;
    const count = Math.min(Number(body.questionCount) || 10, getQuestionsForSubject(subject).length || QUESTION_BANK.length);
    const questions = buildAttemptQuestions(subject, count || 10);
    const attempt: MockAttempt = {
      id: uid("att"),
      attemptId: uid("att"),
      userId: user.id,
      subject,
      mode: body.mode || "practice",
      questionCount: questions.length,
      questions,
      answers: {},
      startedAt: new Date().toISOString(),
    };
    d.attempts.push(attempt);
    db.set(d);
    return { attemptId: attempt.attemptId, subject: attempt.subject, mode: attempt.mode, questions: attempt.questions, startedAt: attempt.startedAt };
  }

  const attemptParams = route(["GET"], "/cbt/attempts/:id");
  if (attemptParams !== null) {
    const att = d.attempts.find((a) => a.attemptId === attemptParams[0]);
    if (!att) throw new MockApiError("Attempt not found");
    return att;
  }

  if (method === "GET" && segments[0] === "cbt" && segments[1] === "attempts") {
    if (!user) throw new MockApiError("Not authenticated");
    return d.attempts.filter((a) => a.userId === user!.id).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }

  params = route(["POST"], "/cbt/attempts/:id/submit");
  if (params !== null) {
    const att = d.attempts.find((a) => a.attemptId === params[0]);
    if (!att) throw new MockApiError("Attempt not found");
    let correct = 0;
    for (const a of body.answers as { questionId: string; optionId: string }[]) {
      const q = att.questions.find((x) => x.id === a.questionId);
      if (q && q.correct === a.optionId) correct++;
    }
    const total = att.questions.length;
    const score = Math.round((correct / total) * 100);
    const xpEarned = Math.round(score / 2) + 20;
    att.answers = Object.fromEntries((body.answers as any[]).map((a) => [a.questionId, a.optionId]));
    att.score = score;
    att.xpEarned = xpEarned;
    att.completedAt = new Date().toISOString();
    const u = d.users.find((x) => x.id === att.userId);
    if (u) u.xp += xpEarned;
    db.set(d);
    return { score, xpEarned, correct, total, attemptId: att.attemptId, subject: att.subject, mode: att.mode };
  }

  // ---- AI ----
  if (method === "POST" && segments[0] === "ai" && segments[1] === "chat") {
    return { reply: aiReply(body.message || "") };
  }

  if (method === "POST" && segments[0] === "ai" && segments[1] === "questions") {
    const subject = body.subject || "Mathematics";
    const count = Math.min(Number(body.count) || 5, getQuestionsForSubject(subject).length || QUESTION_BANK.length);
    const qs: Question[] = [...getQuestionsForSubject(subject)].sort(() => Math.random() - 0.5).slice(0, count);
    return { questions: qs };
  }

  // ---- Analytics ----
  if (method === "GET" && segments[0] === "analytics" && segments[1] === "stats") {
    const enrolled = user ? (d.enrollments[user.id] || []).length : 0;
    const attempts = user ? d.attempts.filter((a) => a.userId === user!.id) : [];
    const completed = attempts.filter((a) => a.completedAt);
    const avg = completed.length ? Math.round(completed.reduce((s, a) => s + (a.score || 0), 0) / completed.length) : 0;
    return { enrolledCourses: enrolled, examsTaken: attempts.length, avgScore: avg, xp: user?.xp || 0, streak: user?.streak || 0 };
  }

  if (method === "GET" && segments[0] === "analytics" && segments[1] === "mastery") {
    const subjects = SUBJECTS.slice(0, 6);
    return subjects.map((s) => {
      const qs = getQuestionsForSubject(s);
      const score = 50 + Math.round(Math.random() * 45);
      return { subject: s, score, mastery: score, predicted: Math.min(99, score + 6) };
    });
  }

  if (method === "GET" && segments[0] === "analytics" && segments[1] === "leaderboard") {
    const extra = user ? [{ id: "me", rank: 0, name: user.name + " (You)", xp: user.xp, school: user.school || "—", state: user.state || "—", avatar: user.name.slice(0, 2).toUpperCase(), streak: user.streak }] : [];
    return [...extra, ...LEADERBOARD_SEED].sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }));
  }

  // ---- Payments ----
  if (method === "GET" && segments[0] === "payments" && segments[1] === "plans") return PLANS;
  if (method === "POST" && segments[0] === "payments" && (segments[1] === "paystack" || segments[1] === "flutterwave")) {
    const ref = uid("ref");
    return { reference: ref, authorization_url: `https://mock.edumaster.africa/pay/${ref}`, status: "success", amount: body.amount };
  }
  if (method === "GET" && segments[0] === "payments" && segments[1] === "verify") {
    return { status: "success", verified: true };
  }

  // ---- Newsletter / Subscriptions ----
  if (method === "POST" && segments[0] === "subscribe") {
    const email = String(body.email || "").toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new MockApiError("Please enter a valid email address");
    const existing = d.subscribers.find((s) => s.email === email);
    if (!existing) {
      d.subscribers.push({ email, name: body.name, source: body.source || "website", createdAt: new Date().toISOString() });
      db.set(d);
    }
    return { ok: true, alreadySubscribed: !!existing, message: existing ? "You're already subscribed!" : "Subscribed! Check your inbox for a welcome email." };
  }

  // ---- Certificates ----
  if (method === "GET" && segments[0] === "certificates") {
    if (!user) throw new MockApiError("Not authenticated");
    const ids = d.certificates[user.id] || [];
    return ids.map((cid) => {
      const c = getCourseById(cid);
      return { courseId: cid, title: c?.title || "Course", category: c?.category || "", instructor: c?.instructor || "", issuedAt: new Date().toISOString(), grade: "Distinction" };
    });
  }

  throw new MockApiError(`Cannot ${method} ${path}`);
}
