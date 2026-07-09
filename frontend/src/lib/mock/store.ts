import { COURSES } from "./data";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "parent" | "school" | "SUPER_ADMIN" | "SCHOOL_ADMIN";
  school?: string;
  state?: string;
  class?: string;
  phone?: string;
  examTarget?: string;
  avatar?: string;
  xp: number;
  streak: number;
  createdAt: string;
}

export interface MockAttempt {
  id: string;
  attemptId: string;
  userId: string;
  subject: string;
  mode: string;
  questionCount: number;
  questions: { id: string; subject: string; topic: string; text: string; options: { id: string; text: string }[]; correct: string; explanation: string }[];
  answers: Record<string, string>;
  score?: number;
  xpEarned?: number;
  startedAt: string;
  completedAt?: string;
}

export interface Subscriber {
  email: string;
  name?: string;
  source: string;
  createdAt: string;
}

interface DB {
  users: MockUser[];
  tokens: Record<string, string>; // token -> userId
  enrollments: Record<string, string[]>; // userId -> courseId[]
  progress: Record<string, Record<string, number>>; // userId -> courseId -> completedLessons
  attempts: MockAttempt[];
  subscribers: Subscriber[];
  certificates: Record<string, string[]>; // userId -> courseId[]
}

const KEY = "edumaster_mock_db_v1";

function seed(): DB {
  const users: MockUser[] = [
    {
      id: "u_seed_super",
      name: "Super Admin",
      email: "superadmin@edumaster.africa",
      password: "Admin@123",
      role: "SUPER_ADMIN",
      xp: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: "u_seed_student",
      name: "Demo Student",
      email: "student@edumaster.africa",
      password: "Student@123",
      role: "student",
      school: "Queens College Lagos",
      state: "Lagos",
      class: "SS3",
      examTarget: "JAMB",
      xp: 9880,
      streak: 14,
      createdAt: new Date().toISOString(),
    },
  ];
  return {
    users,
    tokens: {},
    enrollments: { u_seed_student: ["1", "2", "3"] },
    progress: { u_seed_student: { "1": 31, "2": 36, "3": 18 } },
    attempts: [],
    subscribers: [],
    certificates: { u_seed_student: ["2"] },
  };
}

function read(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    /* ignore */
  }
  const fresh = seed();
  write(fresh);
  return fresh;
}

function write(db: DB) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* ignore quota */
  }
}

export const db = {
  get: read,
  set: write,
  reset: () => {
    localStorage.removeItem(KEY);
    return read();
  },
};

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function courseCount(): number {
  return COURSES.length;
}
