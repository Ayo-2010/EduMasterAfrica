import { useState } from "react";
import { ChevronLeft, Download, Play, Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { G, AMBER } from "../constants";
import { useCompleteLesson, useEnrollCourse } from "../../lib/api";
import { Page } from "../routing";

export function CoursePlayerPage({ course, onNavigate, onEnroll }: { course: any; onNavigate: (p: Page, courseId?: string) => void; onEnroll?: (id: string) => void }) {
  const [activeLesson, setActiveLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [localDone, setLocalDone] = useState<Record<number, boolean>>({});
  const completeLesson = useCompleteLesson();
  const enroll = useEnrollCourse();

  if (!course) {
    return (
      <div className="min-h-screen bg-background font-body flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <div className="font-black text-xl text-foreground mb-2">Course not found</div>
          <button onClick={() => onNavigate("courses")} className="text-sm font-bold px-6 py-2.5 rounded-xl text-white" style={{ background: G }}>Browse Courses</button>
        </div>
      </div>
    );
  }

  const lessonList: any[] = course.lessonList || [];
  const baseCompleted = course.completedLessons || 0;
  const isDone = (i: number) => i < baseCompleted || localDone[i];
  const completedCount = lessonList.filter((_, i) => isDone(i)).length;
  const pct = lessonList.length ? Math.round((completedCount / lessonList.length) * 100) : 0;
  const currentLesson = lessonList[activeLesson];

  function markComplete() {
    const id = currentLesson.id;
    if (isDone(activeLesson)) {
      if (activeLesson < lessonList.length - 1) setActiveLesson(activeLesson + 1);
      return;
    }
    setLocalDone((d) => ({ ...d, [activeLesson]: true }));
    completeLesson.mutate(
      { courseId: String(course.id), lessonId: id },
      { onSuccess: (res: any) => {
          toast.success(res.completed ? "Course completed! 🎉 Certificate earned." : "Lesson complete! +10 XP");
          if (activeLesson < lessonList.length - 1) setActiveLesson(activeLesson + 1);
        },
        onError: () => toast.error("Could not save progress"),
      }
    );
  }

  function handleEnroll() {
    if (onEnroll) onEnroll(String(course.id));
    else enroll.mutate(String(course.id), { onSuccess: () => toast.success("Enrolled! Start learning."), onError: (e: any) => toast.error(e.message) });
  }

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <header className="border-b border-border bg-card px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("courses")} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ChevronLeft size={16} /> Back
          </button>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="hidden sm:block">
            <div className="font-bold text-sm text-foreground truncate max-w-md">{course.title}</div>
            <div className="text-xs text-muted-foreground">{course.instructor}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-bold text-muted-foreground hidden sm:block">{pct}% complete</div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted">
            <Play size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${sidebarOpen ? "w-72" : "w-0"} border-r border-border bg-card overflow-y-auto transition-all duration-300 flex-shrink-0 hidden md:block`}>
          <div className="p-4">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Course Content</div>
            <div className="space-y-1">
              {lessonList.map((lesson, i) => (
                <button key={lesson.id} onClick={() => setActiveLesson(i)}
                  className={"w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 " + (activeLesson === i ? "bg-muted font-bold" : "hover:bg-muted/50 text-muted-foreground")}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={{ background: isDone(i) ? G : "rgba(0,0,0,0.05)", color: isDone(i) ? "#fff" : "#5c6b5e" }}>
                    {isDone(i) ? <Check size={12} /> : lesson.id}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs">{lesson.title}</div>
                    <div className="text-xs text-muted-foreground">{lesson.type === "quiz" ? "Quiz" : lesson.type === "practice" ? "Practice" : "Reading"} · {lesson.minutes} min</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 sm:p-8">
            {!course.enrolled && (
              <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4">
                <div className="text-sm text-amber-900 font-semibold">You're previewing this course. Enroll to track progress and earn a certificate.</div>
                <button onClick={handleEnroll} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white whitespace-nowrap" style={{ background: G }}>Enroll Free</button>
              </div>
            )}

            <div className="aspect-video rounded-2xl border border-border flex items-center justify-center mb-6" style={{ background: course.color + "12" }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: course.color + "22", color: course.color }}>
                  <Play size={28} className="fill-current" />
                </div>
                <div className="font-bold text-foreground mb-1">{currentLesson ? `Lesson ${activeLesson + 1}` : "Course"}</div>
                <div className="text-sm text-muted-foreground">{currentLesson?.title}</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h1 className="font-black text-xl text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>{currentLesson?.title}</h1>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-xl text-xs font-bold border border-border hover:bg-muted">
                  <Download size={14} className="inline mr-1" /> Notes
                </button>
                <button onClick={markComplete} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: course.color }}>
                  {isDone(activeLesson) ? (activeLesson < lessonList.length - 1 ? "Next Lesson →" : "Finish Course") : "Mark Complete"}
                </button>
              </div>
            </div>

            {currentLesson && (
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{currentLesson.content}</p>

                {currentLesson.exercise && (
                  <div className="mt-6 p-5 bg-muted/50 rounded-xl border border-border">
                    <div className="font-bold text-sm text-foreground mb-3 flex items-center gap-2"><Play size={13} style={{ color: G }} /> Practice Exercise</div>
                    <p className="text-sm text-foreground mb-3">{currentLesson.exercise.question}</p>
                    <div className="space-y-2">
                      {currentLesson.exercise.options.map((opt: string, i: number) => (
                        <div key={i} className="px-4 py-2.5 rounded-lg border border-border text-sm">{String.fromCharCode(65 + i)}. {opt}</div>
                      ))}
                    </div>
                    <button onClick={() => toast.success(`Correct answer: ${String.fromCharCode(65 + currentLesson.exercise.answer)} — ${currentLesson.exercise.explanation}`)}
                      className="mt-3 px-4 py-2 rounded-lg text-xs font-bold border-2" style={{ borderColor: AMBER, color: AMBER }}>
                      Reveal Answer
                    </button>
                  </div>
                )}

                <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="font-bold text-sm text-foreground mb-2">Key Takeaways</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><Check size={14} style={{ color: G }} className="mt-0.5 flex-shrink-0" /> Core concepts and definitions for this topic</li>
                    <li className="flex items-start gap-2"><Check size={14} style={{ color: G }} className="mt-0.5 flex-shrink-0" /> Step-by-step worked examples</li>
                    <li className="flex items-start gap-2"><Check size={14} style={{ color: G }} className="mt-0.5 flex-shrink-0" /> Common exam questions and how to solve them</li>
                    <li className="flex items-start gap-2"><Check size={14} style={{ color: G }} className="mt-0.5 flex-shrink-0" /> Practice exercises to test your understanding</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
