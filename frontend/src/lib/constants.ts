export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

export const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 15,
  SCHOOL_ADMIN: 10,
  CONTENT_MANAGER: 8,
  EXAMINATION_OFFICER: 8,
  AI_ADMINISTRATOR: 8,
  QUESTION_REVIEWER: 7,
  MODERATOR: 7,
  FINANCE_ADMIN: 8,
  CUSTOMER_SUPPORT: 5,
  MARKETING_ADMIN: 6,
  LIBRARIAN: 6,
  DEVELOPER: 7,
  TEACHER: 4,
  PARENT: 3,
  STUDENT: 1,
};

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SCHOOL_ADMIN: 'School Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
  CONTENT_MANAGER: 'Content Manager',
  EXAMINATION_OFFICER: 'Examination Officer',
  AI_ADMINISTRATOR: 'AI Administrator',
  QUESTION_REVIEWER: 'Question Reviewer',
  MODERATOR: 'Moderator',
  FINANCE_ADMIN: 'Finance',
  CUSTOMER_SUPPORT: 'Customer Support',
  MARKETING_ADMIN: 'Marketing',
  LIBRARIAN: 'Librarian',
  DEVELOPER: 'Developer',
};

export const PHASE_1_ROLES: string[] = [
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'TEACHER',
  'STUDENT',
  'PARENT',
];

export const PHASE_2_ROLES: string[] = [
  'EXAMINATION_OFFICER',
  'CONTENT_MANAGER',
  'QUESTION_REVIEWER',
  'CUSTOMER_SUPPORT',
];

export const PHASE_3_ROLES: string[] = [
  'AI_ADMINISTRATOR',
  'FINANCE_ADMIN',
  'MODERATOR',
  'MARKETING_ADMIN',
  'LIBRARIAN',
  'DEVELOPER',
];
