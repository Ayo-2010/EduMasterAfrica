import type { RoleName } from '@/lib/types';
import { useAuth } from './useAuth';

export function usePermissions() {
  const { role, user } = useAuth();

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isSchoolAdmin = role === 'SCHOOL_ADMIN';
  const isTeacher = role === 'TEACHER';
  const isStudent = role === 'STUDENT';
  const isParent = role === 'PARENT';
  const isContentManager = role === 'CONTENT_MANAGER';
  const isExaminationOfficer = role === 'EXAMINATION_OFFICER';
  const isAiAdmin = role === 'AI_ADMINISTRATOR';
  const isQuestionReviewer = role === 'QUESTION_REVIEWER';
  const isModerator = role === 'MODERATOR';
  const isFinanceAdmin = role === 'FINANCE_ADMIN';
  const isCustomerSupport = role === 'CUSTOMER_SUPPORT';
  const isMarketingAdmin = role === 'MARKETING_ADMIN';
  const isLibrarian = role === 'LIBRARIAN';
  const isDeveloper = role === 'DEVELOPER';

  const hasAccess = (roles: RoleName | RoleName[]): boolean => {
    if (!role) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(role);
  };

  const hasMinLevel = (minLevel: number): boolean => {
    if (!user?.role) return false;
    return user.role.level >= minLevel;
  };

  return {
    role,
    isSuperAdmin,
    isSchoolAdmin,
    isTeacher,
    isStudent,
    isParent,
    isContentManager,
    isExaminationOfficer,
    isAiAdmin,
    isQuestionReviewer,
    isModerator,
    isFinanceAdmin,
    isCustomerSupport,
    isMarketingAdmin,
    isLibrarian,
    isDeveloper,
    hasAccess,
    hasMinLevel,
  };
}
