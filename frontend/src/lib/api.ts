import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { mockRequest } from "./mock/server";

const API_BASE = import.meta.env.VITE_API_BASE || "";
const USE_MOCK = !API_BASE; // No backend configured -> run fully client-side

function getAuthToken(): string | null {
  return localStorage.getItem("token") || localStorage.getItem("edumaster_token");
}

export async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : undefined;

  if (USE_MOCK) {
    // Split path and query string
    const [path, query] = endpoint.split("?");
    const search = query ? Object.fromEntries(new URLSearchParams(query)) : {};
    const data = await mockRequest({ method, path, body: body ? { ...body, ...search } : search, token: getAuthToken() });
    return data as T;
  }

  const token = getAuthToken();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    let message = `API Error: ${response.statusText}`;
    try {
      const err = await response.json();
      if (err && err.message) message = Array.isArray(err.message) ? err.message[0] : err.message;
    } catch {
      /* keep default */
    }
    throw new Error(message);
  }
  return response.json();
}

// Auth hooks
export interface ProfileUpdate {
  name?: string;
  school?: string;
  state?: string;
  class?: string;
  phone?: string;
  examTarget?: string;
  avatar?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileUpdate) => api<Record<string, unknown>>("/auth/me", { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api<{ user: any; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (data: any) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(["user"], data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api<{ user: any; token: string }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (data: any) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(["user"], data.user);
    },
  });
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  class?: string;
  school?: string;
  state?: string;
  phone?: string;
  examTarget?: string;
  avatar?: string;
  xp?: number;
  streak?: number;
}

export function useMe() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: () => api("/auth/me"),
    enabled: !!getAuthToken(),
  });
}

// Courses hooks
export function useCourses(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ["courses", filters],
    queryFn: () => api(`/courses${filters?.category ? `?category=${filters.category}` : ""}`),
  });
}

export function useCourse(id: string | number | null) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => api(`/courses/${id}`),
    enabled: !!id,
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => api(`/courses/${courseId}/enroll`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { courseId: string; lessonId: number }) =>
      api(`/courses/${vars.courseId}/lessons/${vars.lessonId}/complete`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}

// Questions hooks
export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => api("/questions/subjects"),
  });
}

export function useQuestions(filters?: { subject?: string; topic?: string }) {
  return useQuery({
    queryKey: ["questions", filters],
    queryFn: () => api(`/questions${filters?.subject ? `?subject=${filters.subject}` : ""}`),
  });
}

// CBT hooks
export function useStartAttempt() {
  return useMutation({
    mutationFn: (data: { subject: string; mode?: string; questionCount?: number }) =>
      api("/cbt/attempts", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useSubmitAttempt() {
  return useMutation({
    mutationFn: (data: { attemptId: string; answers: { questionId: string; optionId: string }[] }) =>
      api(`/cbt/attempts/${data.attemptId}/submit`, { method: "POST", body: JSON.stringify({ answers: data.answers }) }),
  });
}

export interface Attempt {
  id: string;
  attemptId: string;
  subject: string;
  mode: string;
  score?: number;
  completedAt?: string;
  startedAt: string;
}

export function useAttempts() {
  return useQuery<Attempt[]>({
    queryKey: ["attempts"],
    queryFn: () => api("/cbt/attempts"),
    enabled: !!getAuthToken(),
  });
}

// AI hooks
export function useAiChat() {
  return useMutation({
    mutationFn: (message: string) => api("/ai/chat", { method: "POST", body: JSON.stringify({ message }) }),
  });
}

export function useGenerateQuestions() {
  return useMutation({
    mutationFn: (data: { subject: string; topic: string; count?: number }) =>
      api("/ai/questions", { method: "POST", body: JSON.stringify(data) }),
  });
}

// Analytics hooks
export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => api("/analytics/stats"),
    enabled: !!getAuthToken(),
  });
}

export interface MasteryEntry {
  subject: string;
  score: number;
  mastery: number;
  predicted: number;
}

export function useMastery() {
  return useQuery<MasteryEntry[]>({
    queryKey: ["mastery"],
    queryFn: () => api("/analytics/mastery"),
    enabled: !!getAuthToken(),
  });
}

export interface LeaderboardEntry {
  id?: string;
  rank: number;
  name: string;
  xp: number;
  school: string;
  state: string;
  streak: number;
  avatar?: string;
}

export function useLeaderboard() {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: () => api("/analytics/leaderboard"),
  });
}

// Certificates
export function useCertificates() {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: () => api("/certificates"),
    enabled: !!getAuthToken(),
  });
}

// Newsletter
export function useSubscribe() {
  return useMutation({
    mutationFn: async (data: { email: string; name?: string; source?: string }) => {
      const url = import.meta.env.VITE_SUBSCRIBE_URL as string | undefined;
      if (url) {
        const res = await fetch(`${url.replace(/\/$/, "")}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Subscription failed");
        return res.json();
      }
      return api("/subscribe", { method: "POST", body: JSON.stringify(data) });
    },
  });
}

// Payments hooks
export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => api("/payments/plans"),
  });
}

export function useInitializePayment() {
  return useMutation({
    mutationFn: (data: { amount: number; plan?: string; provider: "paystack" | "flutterwave" }) =>
      api(`/payments/${data.provider}`, { method: "POST", body: JSON.stringify({ amount: data.amount, plan: data.plan }) }),
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (reference: string) => api(`/payments/verify?reference=${reference}`),
  });
}
