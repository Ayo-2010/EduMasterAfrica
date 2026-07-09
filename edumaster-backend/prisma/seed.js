"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Create subjects
    const subjects = await Promise.all([
        prisma.subject.upsert({ where: { name: 'Biology' }, update: {}, create: { name: 'Biology', color: '#0c6438' } }),
        prisma.subject.upsert({ where: { name: 'Chemistry' }, update: {}, create: { name: 'Chemistry', color: '#e84545' } }),
        prisma.subject.upsert({ where: { name: 'Mathematics' }, update: {}, create: { name: 'Mathematics', color: '#f5a623' } }),
        prisma.subject.upsert({ where: { name: 'Physics' }, update: {}, create: { name: 'Physics', color: '#2563eb' } }),
        prisma.subject.upsert({ where: { name: 'English' }, update: {}, create: { name: 'English', color: '#7c3aed' } }),
    ]);
    // Create topics
    for (const subject of subjects) {
        await prisma.topic.upsert({
            where: { subjectId_name: { subjectId: subject.id, name: 'General' } },
            update: {},
            create: { subjectId: subject.id, name: 'General' },
        });
    }
    // Create sample questions
    const biologyQuestions = [
        {
            subject: 'Biology',
            text: 'The process by which plants manufacture their own food using sunlight, water, and carbon dioxide is called:',
            options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Osmosis'],
            correct: 'Photosynthesis',
            explanation: 'Photosynthesis occurs in chloroplasts. Light energy converts CO₂ + H₂O → glucose + O₂.',
        },
        {
            subject: 'Biology',
            text: 'Which organelle is known as the "powerhouse of the cell" and is responsible for ATP production?',
            options: ['Chloroplast', 'Nucleus', 'Mitochondria', 'Ribosome'],
            correct: 'Mitochondria',
            explanation: 'Mitochondria carry out cellular respiration, converting glucose and oxygen into ATP.',
        },
    ];
    for (const q of biologyQuestions) {
        const subject = await prisma.subject.findUnique({ where: { name: q.subject } });
        const topic = await prisma.topic.findFirst({ where: { subjectId: subject.id } });
        const question = await prisma.question.create({
            data: {
                subjectId: subject.id,
                topicId: topic.id,
                text: q.text,
                difficulty: 'MEDIUM',
                explanation: q.explanation,
            },
        });
        const options = [];
        for (let i = 0; i < q.options.length; i++) {
            options.push(await prisma.option.create({
                data: { questionId: question.id, text: q.options[i], order: i },
            }));
        }
        const correctOption = options.find(o => o.text === q.correct);
        if (correctOption) {
            await prisma.answer.create({
                data: { questionId: question.id, optionId: correctOption.id },
            });
        }
    }
    // Create sample courses
    const categories = ['WAEC', 'JAMB', 'NECO', 'POST-UTME', 'PRIMARY', 'INTERNATIONAL'];
    for (let i = 0; i < 12; i++) {
        await prisma.course.create({
            data: {
                title: `Course ${i + 1}`,
                category: categories[i % categories.length],
                instructor: `Instructor ${i + 1}`,
                lessons: 20 + i * 5,
                enrolled: 1000 + i * 100,
                rating: 4.5,
            },
        });
    }
    // Create achievements
    const achievements = [
        { name: 'First Login', description: 'Welcome to EduMaster!', xpReward: 50 },
        { name: 'Streak Master', description: '7-day learning streak', xpReward: 100 },
        { name: 'Quiz Champion', description: 'Score 90%+ on 5 quizzes', xpReward: 200 },
    ];
    for (const a of achievements) {
        await prisma.achievement.upsert({
            where: { name: a.name },
            update: {},
            create: a,
        });
    }
    // Demo users (hashed password) so the app shows real data on first run
    const demoPassword = await bcrypt.hash('Password123', 10);
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@edumaster.africa' },
        update: {},
        create: {
            email: 'demo@edumaster.africa',
            password: demoPassword,
            name: 'Adaeze Okonkwo',
            role: 'STUDENT',
            school: 'Queens College Lagos',
            state: 'Lagos',
            class: 'SS3',
            examTarget: 'WAEC',
            phone: '+2348000000000',
        },
    });
    const otherNames = ['Chidi Okafor', 'Fatima Bello', 'Tunde Adeyemi', 'Ngozi Eze'];
    const otherUsers = [];
    for (const name of otherNames) {
        const email = `${name.toLowerCase().replace(/ /g, '.')}@example.com`;
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: demoPassword,
                name,
                role: 'STUDENT',
                school: 'Lagos State College',
                state: 'Lagos',
                class: 'SS3',
            },
        });
        otherUsers.push(user);
    }
    // Leaderboard entries
    await prisma.leaderboardEntry.upsert({
        where: { userId_period: { userId: demoUser.id, period: 'ALLTIME' } },
        update: { xp: 9880, streak: 14 },
        create: { userId: demoUser.id, xp: 9880, streak: 14, period: 'ALLTIME' },
    });
    let xp = 12000;
    for (const user of otherUsers) {
        const streak = 7 + (xp % 10);
        await prisma.leaderboardEntry.upsert({
            where: { userId_period: { userId: user.id, period: 'ALLTIME' } },
            update: { xp, streak },
            create: { userId: user.id, xp, streak, period: 'ALLTIME' },
        });
        xp -= 1500;
    }
    // Sample attempt for the demo user so dashboard stats / mastery populate
    const bioSubject = await prisma.subject.findUnique({ where: { name: 'Biology' } });
    const bioQuestions = await prisma.question.findMany({
        where: { subjectId: bioSubject.id },
        include: { options: true, answers: true },
    });
    if (bioQuestions.length > 0) {
        await prisma.attempt.create({
            data: {
                userId: demoUser.id,
                mode: 'PRACTICE',
                score: 100,
                total: bioQuestions.length,
                timeSpent: 300,
                completedAt: new Date(),
                questions: {
                    create: bioQuestions.map((q, i) => ({
                        questionId: q.id,
                        selectedOptionId: q.answers[0]?.optionId ?? q.options[0]?.id,
                        isCorrect: i % 2 === 0,
                        timeTaken: 60,
                    })),
                },
            },
        });
    }
    console.log('✅ Database seeded successfully!');
}
main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map