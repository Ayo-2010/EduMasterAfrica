import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'SCHOOL_ADMIN']),
  school: z.string().optional(),
  class: z.string().optional(),
  state: z.string().optional(),
});

// Auth schemas
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'SCHOOL_ADMIN']).default('STUDENT'),
  school: z.string().optional(),
  class: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Course schemas
export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  instructor: z.string(),
  lessons: z.number(),
  enrolled: z.number(),
  rating: z.number(),
  price: z.string().optional(),
  badge: z.string().optional(),
  color: z.string(),
});

// Question schemas
export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  subject: z.string(),
  options: z.array(z.object({ id: z.string(), text: z.string() })),
  correct: z.string().optional(),
  explanation: z.string().optional(),
});

// Attempt schemas
export const AttemptSchema = z.object({
  id: z.string(),
  score: z.number(),
  total: z.number(),
  mode: z.string(),
  completedAt: z.string().optional(),
  createdAt: z.string(),
});

// Analytics schemas
export const StatsSchema = z.object({
  totalQuestions: z.number(),
  avgScore: z.number(),
  xp: z.number(),
  streak: z.number(),
  examCount: z.number(),
});

// Payment schemas
export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.string(),
  provider: z.string(),
  reference: z.string(),
});