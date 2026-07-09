import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CbtService {
  constructor(private prisma: PrismaService) {}

  async startAttempt(userId: string, dto: { subject: string; year?: string; mode?: string; questionCount?: number }) {
    const questions = await this.prisma.question.findMany({
      where: { subject: { name: dto.subject } },
      take: dto.questionCount || 5,
      include: { options: true },
    });

    if (questions.length === 0) throw new NotFoundException('No questions found for subject');

    const attempt = await this.prisma.attempt.create({
      data: {
        userId,
        mode: dto.mode as any || 'PRACTICE',
        score: 0,
        total: questions.length,
        timeSpent: 0,
      },
    });

    const questionIds = questions.map(q => q.id);
    await this.prisma.attemptQuestion.createMany({
      data: questionIds.map(id => ({ attemptId: attempt.id, questionId: id, timeTaken: 0, isCorrect: false })),
    });

    return { attemptId: attempt.id, questions: questions.map(q => ({ id: q.id, text: q.text, options: q.options })) };
  }

  async submitAttempt(userId: string, attemptId: string, answers: { questionId: string; optionId: string }[]) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: { questions: true },
    });

    if (!attempt) throw new NotFoundException('Attempt not found');

    let correct = 0;
    const results: { questionId: string; correct: boolean }[] = [];

    for (const answer of answers) {
      const question = await this.prisma.question.findUnique({
        where: { id: answer.questionId },
        include: { answers: true },
      });

      if (question) {
        const isCorrect = question.answers.some(a => a.optionId === answer.optionId);
        correct += isCorrect ? 1 : 0;
        results.push({ questionId: answer.questionId, correct: isCorrect });

        await this.prisma.attemptQuestion.updateMany({
          where: { attemptId, questionId: answer.questionId },
          data: { selectedOptionId: answer.optionId, isCorrect },
        });
      }
    }

    const score = Math.round((correct / attempt.total) * 100);
    const xpEarned = Math.round(score * 0.5);

    await this.prisma.attempt.update({
      where: { id: attemptId },
      data: { score, completedAt: new Date() },
    });

    await this.prisma.leaderboardEntry.upsert({
      where: { userId },
      update: { xp: { increment: xpEarned } },
      create: { userId, xp: xpEarned, streak: 1 },
    });

    return { score, xpEarned, results };
  }

  async getAttempt(userId: string, attemptId: string) {
    return this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: { questions: { include: { question: { include: { options: true } } } } },
    });
  }

  async getUserAttempts(userId: string) {
    return this.prisma.attempt.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
  }
}