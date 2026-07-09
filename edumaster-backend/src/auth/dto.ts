import { z } from 'zod';

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'EXAMINATION_OFFICER', 'AI_ADMINISTRATOR', 'QUESTION_REVIEWER', 'MODERATOR', 'FINANCE_ADMIN', 'CUSTOMER_SUPPORT', 'MARKETING_ADMIN', 'LIBRARIAN', 'DEVELOPER']).default('STUDENT'),
  school: z.string().optional(),
  state: z.string().optional(),
  class: z.string().optional(),
  phone: z.string().optional(),
  examTarget: z.string().optional(),
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const VerifyEmailDto = z.object({
  token: z.string(),
});

export const ForgotPasswordDto = z.object({
  email: z.string().email(),
});

export const ResetPasswordDto = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export const UpdateProfileDto = z.object({
  name: z.string().min(2).optional(),
  school: z.string().optional(),
  state: z.string().optional(),
  class: z.string().optional(),
  phone: z.string().optional(),
  examTarget: z.string().optional(),
  avatar: z.string().optional(),
});

export type RegisterDto = z.infer<typeof RegisterDto>;
export type LoginDto = z.infer<typeof LoginDto>;
export type VerifyEmailDto = z.infer<typeof VerifyEmailDto>;
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDto>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordDto>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileDto>;