import { z } from 'zod';

export const COURSE_CATEGORIES = [
  'WAEC',
  'JAMB',
  'NECO',
  'POST-UTME',
  'PRIMARY',
  'JUNIOR_SECONDARY',
  'SENIOR_SECONDARY',
  'UNIVERSITY',
  'INTERNATIONAL',
  'PROFESSIONAL',
] as const;

export const CreateCourseDto = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  category: z.enum(COURSE_CATEGORIES),
  instructor: z.string().optional(),
});

export type CreateCourseDto = z.infer<typeof CreateCourseDto>;
