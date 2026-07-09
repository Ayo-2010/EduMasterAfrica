export type RoleName =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'TEACHER'
  | 'STUDENT'
  | 'PARENT'
  | 'CONTENT_MANAGER'
  | 'EXAMINATION_OFFICER'
  | 'AI_ADMINISTRATOR'
  | 'QUESTION_REVIEWER'
  | 'MODERATOR'
  | 'FINANCE_ADMIN'
  | 'CUSTOMER_SUPPORT'
  | 'MARKETING_ADMIN'
  | 'LIBRARIAN'
  | 'DEVELOPER';

export interface Role {
  id: string;
  name: RoleName;
  displayName?: string;
  description?: string;
  isSystem: boolean;
  isDefault: boolean;
  level: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  schoolId?: string;
  school?: { id: string; name: string } | null;
  state?: string;
  class?: string;
  examTarget?: string;
  phone?: string;
  isVerified: boolean;
  twoFactor: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role?: RoleName;
  school?: string;
  state?: string;
  class?: string;
  phone?: string;
  examTarget?: string;
}

export interface JwtPayload {
  sub: string;
  role: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
