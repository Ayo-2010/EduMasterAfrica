import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [users, courses, questions, attempts, schools] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count(),
      this.prisma.question.count(),
      this.prisma.attempt.count(),
      this.prisma.school.count(),
    ]);

    const byRole = await this.prisma.user.groupBy({
      by: ['roleId'],
      _count: { roleId: true },
    });

    const roleMap = await this.prisma.role.findMany({
      select: { id: true, name: true },
    });
    const roleNameMap = new Map(roleMap.map(r => [r.id, r.name]));

    return {
      users,
      courses,
      questions,
      attempts,
      schools,
      byRole: byRole.map(r => ({
        role: roleNameMap.get(r.roleId) || r.roleId,
        count: r._count.roleId,
      })),
    };
  }

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: { role: true, school: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role.name,
        school: u.school?.name,
        state: u.state,
        class: u.class,
        isVerified: u.isVerified,
        createdAt: u.createdAt,
      })),
      total,
      page,
      limit,
    };
  }

  async updateUserRole(id: string, roleName: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) throw new BadRequestException('Invalid role');

    return this.prisma.user.update({
      where: { id },
      data: { roleId: role.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        school: true,
        state: true,
        class: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id } });
    return { success: true, message: 'User deleted' };
  }

  async getSchools() {
    return this.prisma.school.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
        state: true,
        email: true,
        phone: true,
        licenseKey: true,
        plan: true,
        createdAt: true,
        _count: { select: { payments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
