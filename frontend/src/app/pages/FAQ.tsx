import { faqs } from "../data/mockData";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function FAQ() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((item, i) => (
        <div key={i} className="bg-card rounded-2xl border border-border p-5">
          <div className="font-bold text-sm text-foreground mb-2">{item.q}</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
        </div>
      ))}
    </div>
  );
}
