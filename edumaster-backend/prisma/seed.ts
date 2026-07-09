import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  COURSES,
  QUESTION_BANK,
  SUBJECTS,
  LEADERBOARD_SEED,
  SCHOOLS,
} from './seed-data';

const prisma = new PrismaClient();

const DIFFICULTY_MAP: Record<string, any> = {
  Easy: 'EASY',
  Medium: 'MEDIUM',
  Hard: 'HARD',
};

function emailFromName(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@edumaster.africa`;
}

async function main() {
  // ---------------- Roles ----------------
  const roles = [
    { name: 'SUPER_ADMIN', displayName: 'Super Admin', isSystem: true, level: 100 },
    { name: 'SCHOOL_ADMIN', displayName: 'School Admin', isSystem: true, level: 80 },
    { name: 'TEACHER', displayName: 'Teacher', isSystem: true, level: 60 },
    { name: 'STUDENT', displayName: 'Student', isSystem: true, isDefault: true, level: 10 },
    { name: 'PARENT', displayName: 'Parent', isSystem: true, level: 20 },
    { name: 'CONTENT_MANAGER', displayName: 'Content Manager', isSystem: true, level: 70 },
    { name: 'EXAMINATION_OFFICER', displayName: 'Examination Officer', isSystem: true, level: 65 },
    { name: 'AI_ADMINISTRATOR', displayName: 'AI Administrator', isSystem: true, level: 75 },
    { name: 'QUESTION_REVIEWER', displayName: 'Question Reviewer', isSystem: true, level: 55 },
    { name: 'MODERATOR', displayName: 'Moderator', isSystem: true, level: 50 },
    { name: 'FINANCE_ADMIN', displayName: 'Finance Admin', isSystem: true, level: 70 },
    { name: 'CUSTOMER_SUPPORT', displayName: 'Customer Support', isSystem: true, level: 40 },
    { name: 'MARKETING_ADMIN', displayName: 'Marketing Admin', isSystem: true, level: 70 },
    { name: 'LIBRARIAN', displayName: 'Librarian', isSystem: true, level: 50 },
    { name: 'DEVELOPER', displayName: 'Developer', isSystem: true, level: 90 },
  ];

  const seededRoles: Record<string, string> = {};
  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
    seededRoles[r.name] = role.id;
  }

  const studentRoleId = seededRoles.STUDENT;
  const superAdminRoleId = seededRoles.SUPER_ADMIN;
  const schoolAdminRoleId = seededRoles.SCHOOL_ADMIN;

  // ---------------- Subjects & Topics ----------------
  const subjectColor: Record<string, string> = {
    Mathematics: '#f5a623',
    Biology: '#0c6438',
    Chemistry: '#e84545',
    Physics: '#2563eb',
    English: '#7c3aed',
    Literature: '#0891b2',
  };

  const subjectIds: Record<string, string> = {};
  const topicIds: Record<string, Record<string, string>> = {};
  for (const subjectName of SUBJECTS) {
    const subject = await prisma.subject.upsert({
      where: { name: subjectName },
      update: { color: subjectColor[subjectName] || '#0c6438' },
      create: { name: subjectName, color: subjectColor[subjectName] || '#0c6438' },
    });
    subjectIds[subjectName] = subject.id;
    topicIds[subjectName] = {};
  }

  for (const q of QUESTION_BANK) {
    const subjectId = subjectIds[q.subject];
    if (!subjectId) continue;
    const topic = await prisma.topic.upsert({
      where: { subjectId_name: { subjectId, name: q.topic } },
      update: {},
      create: { subjectId, name: q.topic },
    });
    topicIds[q.subject][q.topic] = topic.id;
  }

  // ---------------- Questions ----------------
  let questionCount = 0;
  for (const q of QUESTION_BANK) {
    const subjectId = subjectIds[q.subject];
    const topicId = topicIds[q.subject]?.[q.topic];
    if (!subjectId || !topicId) continue;

    const existing = await prisma.question.findFirst({
      where: { text: q.text, subjectId },
    });
    if (existing) continue;

    const created = await prisma.question.create({
      data: {
        subjectId,
        topicId,
        text: q.text,
        difficulty: DIFFICULTY_MAP[q.difficulty] || 'MEDIUM',
        status: 'APPROVED',
        explanation: q.explanation,
      },
    });

    const options = await Promise.all(
      q.options.map((o, i) =>
        prisma.option.create({
          data: { questionId: created.id, text: o.text, order: i },
        }),
      ),
    );

    const correctIndex = q.options.findIndex((o) => o.id === q.correct);
    const correctOption = options[correctIndex] || options[0];
    if (correctOption) {
      await prisma.answer.create({
        data: { questionId: created.id, optionId: correctOption.id },
      });
    }
    questionCount++;
  }

  // ---------------- Clean placeholder courses ----------------
  try {
    await prisma.courseEnrollment.deleteMany({
      where: { course: { title: { startsWith: 'Course ' } } },
    });
    await prisma.course.deleteMany({ where: { title: { startsWith: 'Course ' } } });
  } catch (e) {
    console.warn('⚠️ Could not remove placeholder courses:', (e as Error).message);
  }

  // ---------------- Courses & Lessons ----------------
  let courseCount = 0;
  for (const c of COURSES) {
    const courseData = {
      title: c.title,
      category: c.category,
      instructor: c.instructor,
      lessons: c.lessons,
      enrolled: c.enrolled,
      rating: c.rating,
      badge: c.badge,
      color: c.color,
      price: c.price,
      description: c.description,
    };
    const existing = await prisma.course.findFirst({ where: { title: c.title } });
    const course = existing
      ? await prisma.course.update({ where: { id: existing.id }, data: courseData })
      : await prisma.course.create({ data: courseData });

    // Refresh lessons deterministically
    await prisma.lesson.deleteMany({ where: { courseId: course.id } });
    await prisma.lesson.createMany({
      data: c.lessonList.map((lesson, i) => ({
        courseId: course.id,
        title: lesson.title,
        order: i + 1,
        summary: lesson.summary,
        duration: lesson.minutes,
      })),
    });
    courseCount++;
  }

  // ---------------- Achievements ----------------
  const achievements = [
    { name: 'First Login', description: 'Welcome to EduMaster!', xpReward: 50 },
    { name: 'Streak Master', description: '7-day learning streak', xpReward: 100 },
    { name: 'Quiz Champion', description: 'Score 90%+ on 5 quizzes', xpReward: 200 },
  ];
  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { name: a.name }, update: {}, create: a });
  }

  // ---------------- Schools (for leaderboard) ----------------
  const schoolIds: Record<string, string> = {};
  for (const s of SCHOOLS) {
    const school = await prisma.school.upsert({
      where: { licenseKey: s.licenseKey },
      update: {},
      create: {
        name: s.name,
        code: s.licenseKey,
        state: s.state,
        licenseKey: s.licenseKey,
        plan: 'SCHOOL',
      },
    });
    schoolIds[s.name] = school.id;
  }

  // ---------------- Users (leaderboard + demo) ----------------
  const demoPassword = await bcrypt.hash('Student@123', 10);
  const leaderboardUserIds: string[] = [];

  for (const entry of LEADERBOARD_SEED) {
    const email = emailFromName(entry.name);
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: entry.name, state: entry.state, class: 'SS3', schoolId: schoolIds[entry.school] ?? null },
      create: {
        email,
        password: demoPassword,
        name: entry.name,
        roleId: studentRoleId,
        state: entry.state,
        class: 'SS3',
        schoolId: schoolIds[entry.school] ?? null,
        isVerified: true,
      },
    });
    leaderboardUserIds.push(user.id);

    await prisma.leaderboardEntry.upsert({
      where: { userId: user.id },
      update: { xp: entry.xp, streak: entry.streak },
      create: { userId: user.id, xp: entry.xp, streak: entry.streak },
    });
  }

  // Demo student (matches frontend mock) enrollments + progress + certificate
  const demoStudent = await prisma.user.upsert({
    where: { email: 'student@edumaster.africa' },
    update: {},
    create: {
      email: 'student@edumaster.africa',
      password: demoPassword,
      name: 'Demo Student',
      roleId: studentRoleId,
      state: 'Lagos',
      class: 'SS3',
      examTarget: 'JAMB',
      isVerified: true,
    },
  });

  await prisma.leaderboardEntry.upsert({
    where: { userId: demoStudent.id },
    update: { xp: 9880, streak: 14 },
    create: { userId: demoStudent.id, xp: 9880, streak: 14 },
  });

  {
    const firstThree = await prisma.course.findMany({ take: 3, orderBy: { enrolled: 'desc' } });
    const progressMap: Record<number, number> = { 0: 31, 1: 36, 2: 18 };
    for (let i = 0; i < firstThree.length; i++) {
      const course = firstThree[i];
      await prisma.courseEnrollment.upsert({
        where: { userId_courseId: { userId: demoStudent.id, courseId: course.id } },
        update: { progress: progressMap[i] || 0, completed: (progressMap[i] || 0) >= course.lessons },
        create: {
          userId: demoStudent.id,
          courseId: course.id,
          progress: progressMap[i] || 0,
          completed: (progressMap[i] || 0) >= course.lessons,
        },
      });
    }
    if (firstThree[1]) {
      const existingCert = await prisma.certificate.findFirst({
        where: { userId: demoStudent.id, courseId: firstThree[1].id },
      });
      if (!existingCert) {
        await prisma.certificate.create({
          data: {
            userId: demoStudent.id,
            courseId: firstThree[1].id,
            title: firstThree[1].title,
            recipientName: demoStudent.name,
          },
        });
      }
    }
  }

  // ---------------- Admin & Schools ----------------
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: 'superadmin@edumaster.africa' },
    update: {},
    create: {
      email: 'superadmin@edumaster.africa',
      password: adminPassword,
      name: 'Super Admin',
      roleId: superAdminRoleId,
      isVerified: true,
    },
  });

  const school1 = await prisma.school.upsert({
    where: { licenseKey: 'LIC-ABC-123' },
    update: {},
    create: {
      name: "King's College Lagos",
      code: 'KCL-001',
      city: 'Lagos',
      state: 'Lagos',
      email: 'admin@kingscollege.edu.ng',
      phone: '+2348010000001',
      licenseKey: 'LIC-ABC-123',
      plan: 'SCHOOL',
    },
  });

  await prisma.user.upsert({
    where: { email: 'schooladmin@kingscollege.edu.ng' },
    update: {},
    create: {
      email: 'schooladmin@kingscollege.edu.ng',
      password: adminPassword,
      name: 'Mrs. Adeyemi',
      roleId: schoolAdminRoleId,
      schoolId: school1.id,
      state: 'Lagos',
      isVerified: true,
    },
  });

  const school2 = await prisma.school.upsert({
    where: { licenseKey: 'LIC-XYZ-789' },
    update: {},
    create: {
      name: 'FGGC Bwari',
      code: 'FGG-001',
      city: 'Bwari',
      state: 'FCT',
      email: 'admin@fggcbwari.edu.ng',
      phone: '+2348010000002',
      licenseKey: 'LIC-XYZ-789',
      plan: 'SCHOOL',
    },
  });

  await prisma.user.upsert({
    where: { email: 'schooladmin@fggcbwari.edu.ng' },
    update: {},
    create: {
      email: 'schooladmin@fggcbwari.edu.ng',
      password: adminPassword,
      name: 'Mr. Garba',
      roleId: schoolAdminRoleId,
      schoolId: school2.id,
      state: 'FCT',
      isVerified: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`   Courses: ${courseCount}, Questions added: ${questionCount}, Subjects: ${SUBJECTS.length}, Leaderboard users: ${leaderboardUserIds.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
