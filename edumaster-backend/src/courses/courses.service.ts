import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateCourseDto } from './dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async getAll(filters: { category?: string; search?: string; limit?: number; offset?: number }) {
    const where: any = {};
    if (filters.category) where.category = filters.category as any;
    if (filters.search) where.title = { contains: filters.search, mode: 'insensitive' };

    return this.prisma.course.findMany({
      where,
      take: filters.limit || 50,
      skip: filters.offset || 0,
      orderBy: { enrolled: 'desc' },
    });
  }

  async getOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { lessonsList: true },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async enroll(userId: string, courseId: string) {
    const existing = await this.prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) throw new ConflictException('Already enrolled');

    const enrollment = await this.prisma.courseEnrollment.create({
      data: { userId, courseId },
    });

    await this.prisma.course.update({
      where: { id: courseId },
      data: { enrolled: { increment: 1 } },
    });

    return enrollment;
  }

  async getUserCourses(userId: string) {
    return this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: { course: true },
    });
  }

  async create(userId: string, dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        instructor: dto.instructor || 'EduMaster Tutor',
      },
    });
  }
}