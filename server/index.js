import "dotenv/config";
import express from "express";
import cors from "cors";
import { Resend } from "resend";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "subscribers.json");

const PORT = process.env.PORT || 8787;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "EduMaster Africa <hello@edumaster.africa>";
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

if (!resend) {
  console.warn("[subscribe] RESEND_API_KEY not set — emails will be logged but not sent. Subscribers are still stored.");
}

async function loadSubscribers() {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveSubscribers(list) {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(list, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, resend: !!resend }));

app.get("/subscribers", async (_req, res) => {
  const list = await loadSubscribers();
  res.json({ count: list.length, subscribers: list });
});

app.post("/subscribe", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const name = req.body?.name || "";
  const source = req.body?.source || "website";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, message: "Please enter a valid email address." });
  }
  const list = await loadSubscribers();
  const existing = list.find((s) => s.email === email);
  if (existing) {
    return res.json({ ok: true, alreadySubscribed: true, message: "You're already subscribed!" });
  }
  const subscriber = { email, name, source, createdAt: new Date().toISOString() };
  list.push(subscriber);
  await saveSubscribers(list);

  if (resend) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to EduMaster Africa 🎓",
        html: welcomeEmail(name || "there"),
      });
    } catch (e) {
      console.error("[subscribe] Resend error:", e?.message || e);
    }
  } else {
    console.log(`[subscribe] NEW subscriber stored: ${email}`);
  }
  res.json({ ok: true, alreadySubscribed: false, message: "Subscribed! Check your inbox for a welcome email." });
});

app.post("/digest", async (req, res) => {
  const list = await loadSubscribers();
  if (list.length === 0) return res.json({ ok: true, sent: 0, message: "No subscribers." });
  if (!resend) {
    console.log(`[digest] Would send to ${list.length} subscribers (Resend not configured).`);
    return res.json({ ok: true, sent: list.length, simulated: true });
  }
  let sent = 0;
  for (const s of list) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: s.email,
        subject: "This week on EduMaster Africa 📚",
        html: digestEmail(s.name || "there"),
      });
      sent++;
    } catch (e) {
      console.error(`[digest] failed for ${s.email}:`, e?.message || e);
    }
  }
  res.json({ ok: true, sent });
});

app.listen(PORT, () => {
  console.log(`Subscription server running on http://localhost:${PORT} (Resend: ${resend ? "on" : "off"})`);
});

function welcomeEmail(name) {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;color:#0d1f12">
    <div style="background:#0c6438;padding:24px;border-radius:16px 16px 0 0;color:#fff">
      <h1 style="margin:0;font-size:20px">Welcome to EduMaster Africa, ${name}!</h1>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #eee;border-radius:0 0 16px 16px">
      <p>You're now subscribed to weekly WAEC/JAMB tips, new past questions and scholarship alerts — free.</p>
      <p><a href="http://localhost:5173/courses" style="background:#0c6438;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;display:inline-block">Start Practicing →</a></p>
      <p style="color:#5c6b5e;font-size:13px">You can unsubscribe anytime. © EduMaster Africa</p>
    </div>
  </div>`;
}

function digestEmail(name) {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;color:#0d1f12">
    <div style="background:#0c6438;padding:24px;border-radius:16px 16px 0 0;color:#fff">
      <h1 style="margin:0;font-size:20px">Your weekly study boost, ${name} 📚</h1>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #eee;border-radius:0 0 16px 16px">
      <ul style="line-height:1.8">
        <li>🔥 <b>Tip of the week:</b> Practice 20 past questions daily — consistency beats cramming.</li>
        <li>📝 New JAMB 2024 mock papers added to CBT Practice.</li>
        <li>🎓 3 new scholarships close this month — check the Scholarships page.</li>
      </ul>
      <p><a href="http://localhost:5173/exams" style="background:#0c6438;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;display:inline-block">Open Exam Center →</a></p>
      <p style="color:#5c6b5e;font-size:13px">You're receiving this because you subscribed to EduMaster Africa. <a href="http://localhost:5173/contact">Unsubscribe</a>.</p>
    </div>
  </div>`;
}
