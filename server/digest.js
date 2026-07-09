import "dotenv/config";
import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "subscribers.json");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "EduMaster Africa <hello@edumaster.africa>";
if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not set. Add it to .env to send digests.");
  process.exit(1);
}
const resend = new Resend(RESEND_API_KEY);

async function main() {
  let list = [];
  try {
    list = JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    console.error("No subscribers.json found. Run the server first to collect subscribers.");
    process.exit(1);
  }
  let sent = 0;
  for (const s of list) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: s.email,
        subject: "This week on EduMaster Africa 📚",
        html: `<p>Hi ${s.name || "there"}, here's your weekly study boost...</p>`,
      });
      sent++;
    } catch (e) {
      console.error(`Failed for ${s.email}:`, e?.message || e);
    }
  }
  console.log(`Digest sent to ${sent}/${list.length} subscribers.`);
}
main();
