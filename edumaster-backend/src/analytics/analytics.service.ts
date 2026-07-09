import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserStats(userId: string) {
    const attempts = await this.prisma.attempt.findMany({
      where: { userId },
    });

    const totalQuestions = attempts.reduce((sum, a) => sum + (a.total || 0), 0);
    const avgScore = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length : 0;

    const leaderboard = await this.prisma.leaderboardEntry.findUnique({
      where: { userId },
    });

    return {
      totalQuestions,
      avgScore: Math.round(avgScore),
      xp: leaderboard?.xp || 0,
      streak: leaderboard?.streak || 0,
      examCount: attempts.length,
    };
  }

  async getSubjectMastery(userId: string) {
    const subjects = await this.prisma.subject.findMany();
    const progress: { subject: string; mastery: number; predicted: number }[] = [];

    for (const subject of subjects) {
      const questions = await this.prisma.attemptQuestion.findMany({
        where: {
          attempt: { userId },
          question: { subjectId: subject.id },
        },
      });

      if (questions.length > 0) {
        const correct = questions.filter(q => q.isCorrect).length;
        const mastery = Math.round((correct / questions.length) * 100);
        progress.push({
          subject: subject.name,
          mastery,
          predicted: Math.min(100, mastery + 8),
        });
      }
    }
    return progress;
  }

  async getLeaderboard(filters: { limit?: number }) {
    const entries = await this.prisma.leaderboardEntry.findMany({
      orderBy: { xp: 'desc' },
      take: filters.limit || 50,
    });

    const userIds = entries.map(e => e.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, school: { select: { name: true } } },
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    return entries.map((e, index) => {
      const user = userMap.get(e.userId);
      return {
        rank: index + 1,
        id: e.id,
        name: user?.name,
        xp: e.xp,
        school: user?.school?.name,
        streak: e.streak,
      };
    });
  }

  async recordEvent(userId: string | null, event: string, metadata?: any) {
    return this.prisma.analyticsEvent.create({
      data: { userId, event, metadata },
    });
  }
}
