import { createBrowserRouter, Navigate } from 'react-router-dom';
import Shell from '@/components/layout/Shell';
import RoleBasedShell from '@/components/layout/RoleBasedShell';
import Login from '@/routes/Login';
import SuperAdminDashboard from '@/routes/SuperAdmin/Dashboard';
import Placeholder from '@/routes/Placeholder';
import SchoolAdminDashboard from '@/routes/SchoolAdmin/Dashboard';
import TeacherDashboard from '@/routes/Teacher/Dashboard';
import StudentDashboard from '@/routes/Student/Dashboard';
import ParentDashboard from '@/routes/Parent/Dashboard';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/super-admin',
    element: (
      <RoleBasedShell allowedRoles={['SUPER_ADMIN']}>
        <Shell />
      </RoleBasedShell>
    ),
    children: [
      { index: true, element: <SuperAdminDashboard /> },
      { path: 'users/students', element: <Placeholder title="Students" /> },
      { path: 'users/teachers', element: <Placeholder title="Teachers" /> },
      { path: 'users/parents', element: <Placeholder title="Parents" /> },
      { path: 'users/school-admins', element: <Placeholder title="School Admins" /> },
      { path: 'users/moderators', element: <Placeholder title="Moderators" /> },
      { path: 'users/roles', element: <Placeholder title="Roles & Permissions" /> },
      { path: 'education/schools', element: <Placeholder title="Schools" /> },
      { path: 'education/curriculum', element: <Placeholder title="Curriculum" /> },
      { path: 'education/subjects', element: <Placeholder title="Subjects" /> },
      { path: 'education/topics', element: <Placeholder title="Topics" /> },
      { path: 'education/courses', element: <Placeholder title="Courses" /> },
      { path: 'education/lessons', element: <Placeholder title="Lessons" /> },
      { path: 'education/questions', element: <Placeholder title="Question Bank" /> },
      { path: 'education/question-review', element: <Placeholder title="Question Review" /> },
      { path: 'education/exams', element: <Placeholder title="Exams" /> },
      { path: 'education/cbt', element: <Placeholder title="CBT" /> },
      { path: 'education/certificates', element: <Placeholder title="Certificates" /> },
      { path: 'ai/dashboard', element: <Placeholder title="AI Dashboard" /> },
      { path: 'ai/settings', element: <Placeholder title="AI Settings" /> },
      { path: 'ai/templates', element: <Placeholder title="Prompt Templates" /> },
      { path: 'ai/analytics', element: <Placeholder title="AI Analytics" /> },
      { path: 'ai/feedback', element: <Placeholder title="AI Feedback" /> },
      { path: 'content/homepage', element: <Placeholder title="Homepage" /> },
      { path: 'content/blog', element: <Placeholder title="Blog" /> },
      { path: 'content/resources', element: <Placeholder title="Resources" /> },
      { path: 'content/media', element: <Placeholder title="Media Library" /> },
      { path: 'content/announcements', element: <Placeholder title="Announcements" /> },
      { path: 'content/faqs', element: <Placeholder title="FAQs" /> },
      { path: 'content/events', element: <Placeholder title="Events" /> },
      { path: 'business/payments', element: <Placeholder title="Payments" /> },
      { path: 'business/subscriptions', element: <Placeholder title="Subscriptions" /> },
      { path: 'business/coupons', element: <Placeholder title="Coupons" /> },
      { path: 'business/scholarships', element: <Placeholder title="Scholarships" /> },
      { path: 'business/partners', element: <Placeholder title="Partners" /> },
      { path: 'business/sponsors', element: <Placeholder title="Sponsors" /> },
      { path: 'analytics/platform', element: <Placeholder title="Platform" /> },
      { path: 'analytics/schools', element: <Placeholder title="Schools" /> },
      { path: 'analytics/teachers', element: <Placeholder title="Teachers" /> },
      { path: 'analytics/students', element: <Placeholder title="Students" /> },
      { path: 'analytics/revenue', element: <Placeholder title="Revenue" /> },
      { path: 'analytics/reports', element: <Placeholder title="Reports" /> },
      { path: 'system/notifications', element: <Placeholder title="Notifications" /> },
      { path: 'system/support', element: <Placeholder title="Support" /> },
      { path: 'system/security', element: <Placeholder title="Security" /> },
      { path: 'system/audit', element: <Placeholder title="Audit Logs" /> },
      { path: 'system/monitoring', element: <Placeholder title="Monitoring" /> },
      { path: 'system/integrations', element: <Placeholder title="Integrations" /> },
      { path: 'system/settings', element: <Placeholder title="Settings" /> },
      { path: 'system/backups', element: <Placeholder title="Backups" /> },
    ],
  },
  {
    path: '/school-admin',
    element: (
      <RoleBasedShell allowedRoles={['SCHOOL_ADMIN']}>
        <Shell />
      </RoleBasedShell>
    ),
    children: [
      { index: true, element: <SchoolAdminDashboard /> },
      { path: 'school', element: <Placeholder title="School" /> },
      { path: 'teachers', element: <Placeholder title="Teachers" /> },
      { path: 'students', element: <Placeholder title="Students" /> },
      { path: 'parents', element: <Placeholder title="Parents" /> },
      { path: 'classes', element: <Placeholder title="Classes" /> },
      { path: 'departments', element: <Placeholder title="Departments" /> },
      { path: 'subjects', element: <Placeholder title="Subjects" /> },
      { path: 'calendar', element: <Placeholder title="Academic Calendar" /> },
      { path: 'timetable', element: <Placeholder title="Timetable" /> },
      { path: 'attendance', element: <Placeholder title="Attendance" /> },
      { path: 'assignments', element: <Placeholder title="Assignments" /> },
      { path: 'examinations/cbt', element: <Placeholder title="CBT" /> },
      { path: 'examinations/results', element: <Placeholder title="Results" /> },
      { path: 'examinations/report-cards', element: <Placeholder title="Report Cards" /> },
      { path: 'library', element: <Placeholder title="Library" /> },
      { path: 'payments', element: <Placeholder title="Payments" /> },
      { path: 'announcements', element: <Placeholder title="Announcements" /> },
      { path: 'events', element: <Placeholder title="Events" /> },
      { path: 'analytics', element: <Placeholder title="Analytics" /> },
      { path: 'messages', element: <Placeholder title="Messages" /> },
      { path: 'settings', element: <Placeholder title="Settings" /> },
    ],
  },
  {
    path: '/teacher',
    element: (
      <RoleBasedShell allowedRoles={['TEACHER']}>
        <Shell />
      </RoleBasedShell>
    ),
    children: [
      { index: true, element: <TeacherDashboard /> },
      { path: 'classes', element: <Placeholder title="My Classes" /> },
      { path: 'subjects', element: <Placeholder title="My Subjects" /> },
      { path: 'lesson-plans', element: <Placeholder title="Lesson Plans" /> },
      { path: 'courses', element: <Placeholder title="Courses" /> },
      { path: 'lessons', element: <Placeholder title="Lessons" /> },
      { path: 'assignments', element: <Placeholder title="Assignments" /> },
      { path: 'questions', element: <Placeholder title="Question Bank" /> },
      { path: 'cbt', element: <Placeholder title="CBT" /> },
      { path: 'attendance', element: <Placeholder title="Attendance" /> },
      { path: 'gradebook', element: <Placeholder title="Gradebook" /> },
      { path: 'performance', element: <Placeholder title="Student Performance" /> },
      { path: 'resources', element: <Placeholder title="Resources" /> },
      { path: 'live-classes', element: <Placeholder title="Live Classes" /> },
      { path: 'messages', element: <Placeholder title="Messages" /> },
      { path: 'ai', element: <Placeholder title="AI Assistant" /> },
      { path: 'calendar', element: <Placeholder title="Calendar" /> },
      { path: 'profile', element: <Placeholder title="Profile" /> },
      { path: 'settings', element: <Placeholder title="Settings" /> },
    ],
  },
  {
    path: '/student',
    element: (
      <RoleBasedShell allowedRoles={['STUDENT']}>
        <Shell />
      </RoleBasedShell>
    ),
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: 'continue', element: <Placeholder title="Continue Learning" /> },
      { path: 'courses', element: <Placeholder title="My Courses" /> },
      { path: 'subjects', element: <Placeholder title="My Subjects" /> },
      { path: 'practice', element: <Placeholder title="Practice" /> },
      { path: 'mock-exams', element: <Placeholder title="Mock Exams" /> },
      { path: 'cbt', element: <Placeholder title="CBT" /> },
      { path: 'assignments', element: <Placeholder title="Assignments" /> },
      { path: 'flashcards', element: <Placeholder title="Flashcards" /> },
      { path: 'downloads', element: <Placeholder title="Downloads" /> },
      { path: 'certificates', element: <Placeholder title="Certificates" /> },
      { path: 'achievements', element: <Placeholder title="Achievements" /> },
      { path: 'leaderboard', element: <Placeholder title="Leaderboard" /> },
      { path: 'study-planner', element: <Placeholder title="Study Planner" /> },
      { path: 'ai', element: <Placeholder title="AI Tutor" /> },
      { path: 'notes', element: <Placeholder title="Notes" /> },
      { path: 'bookmarks', element: <Placeholder title="Bookmarks" /> },
      { path: 'messages', element: <Placeholder title="Messages" /> },
      { path: 'calendar', element: <Placeholder title="Calendar" /> },
      { path: 'profile', element: <Placeholder title="Profile" /> },
      { path: 'settings', element: <Placeholder title="Settings" /> },
    ],
  },
  {
    path: '/parent',
    element: (
      <RoleBasedShell allowedRoles={['PARENT']}>
        <Shell />
      </RoleBasedShell>
    ),
    children: [
      { index: true, element: <ParentDashboard /> },
      { path: 'children', element: <Placeholder title="My Children" /> },
      { path: 'progress', element: <Placeholder title="Progress" /> },
      { path: 'attendance', element: <Placeholder title="Attendance" /> },
      { path: 'homework', element: <Placeholder title="Homework" /> },
      { path: 'assignments', element: <Placeholder title="Assignments" /> },
      { path: 'exams', element: <Placeholder title="Exam Results" /> },
      { path: 'fees', element: <Placeholder title="Fees" /> },
      { path: 'messages', element: <Placeholder title="Messages" /> },
      { path: 'calendar', element: <Placeholder title="School Calendar" /> },
      { path: 'notifications', element: <Placeholder title="Notifications" /> },
      { path: 'ai', element: <Placeholder title="AI Parent Assistant" /> },
      { path: 'profile', element: <Placeholder title="Profile" /> },
      { path: 'settings', element: <Placeholder title="Settings" /> },
    ],
  },
  {
    path: '*',
    element: <Placeholder title="404 Not Found" />,
  },
]);

export default router;
