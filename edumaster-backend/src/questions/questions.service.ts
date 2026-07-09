import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async getSubjects() {
    return this.prisma.subject.findMany({ include: { topics: true } });
  }

  async getQuestions(filters: {
    subject?: string;
    topic?: string;
    year?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (filters.subject) where.subject = { name: filters.subject };
    if (filters.topic) where.topic = { name: filters.topic };

    return this.prisma.question.findMany({
      where,
      include: { options: true, answers: true },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });
  }

  async getQuestion(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async createQuestion(data: any) {
    return this.prisma.question.create({
      data: {
        ...data,
        options: { create: data.options },
      },
      include: { options: true },
    });
  }

  async searchQuestions(query: string) {
    return this.prisma.question.findMany({
      where: {
        OR: [
          { text: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: query.split(' ') } },
        ],
      },
      take: 20,
    });
  }
}