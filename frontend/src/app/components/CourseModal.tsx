import { useState } from "react";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import { BadgeComp } from "./BadgeComp";
import { G } from "../constants";

type Page = "home" | "auth" | "pricing" | "dashboard" | "cbt-setup" | "cbt" | "courses" | "teacher" | "parent" | "profile" | "course" | "learn";

export function CourseModal({ course, onClose, onNavigate, onEnroll }: { course: any; onClose: () => void; onNavigate: (p: Page, courseId?: string) => void; onEnroll?: (id: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-lg border border-border shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="h-3" style={{ background: course.color }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <BadgeComp label={course.category} color={course.color} />
              <h2 className="font-black text-xl text-foreground mt-2">{course.title}</h2>
              <p className="text-sm text-muted-foreground">by {course.instructor}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Lessons", value: String(course.lessons) },
              { label: "Students", value: `${(course.enrolled / 1000).toFixed(1)}k` },
              { label: "Rating", value: String(course.rating) + " ★" },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-muted/50">
                <div className="font-black text-lg text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-5">
            {["HD video lessons with downloadable notes", "AI-generated practice questions per topic", "Progress tracking and mastery scores", "Certificate of completion", "Lifetime access to updates"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check size={14} style={{ color: G }} />
                {f}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="font-black text-2xl" style={{ color: G }}>{course.price}</div>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-muted">Preview</button>
              <button onClick={async () => {
                try { if (onEnroll && course.id) await onEnroll(String(course.id)); toast.success("Enrolled! Course added to your library."); }
                catch (e: any) { toast.error(e?.message || "Enrollment failed"); }
                onClose(); onNavigate("dashboard");
              }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: course.color }}>
                Enroll Now →
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
