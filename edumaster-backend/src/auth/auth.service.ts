import { Injectable, OnModuleInit, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService implements OnModuleInit {
  private studentRoleId: string | null = null;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    this.studentRoleId = await this.resolveStudentRoleId();
    await this.seedSuperAdmin();
  }

  private async resolveStudentRoleId() {
    const role = await this.prisma.role.findUnique({ where: { name: 'STUDENT' } });
    return role?.id ?? null;
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const role = await this.prisma.role.findUnique({ where: { name: dto.role || 'STUDENT' } });
    if (!role) throw new BadRequestException('Invalid role');

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
        name: dto.name,
        roleId: role.id,
        state: dto.state,
        class: dto.class,
        phone: dto.phone,
        examTarget: dto.examTarget,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        state: true,
        class: true,
        phone: true,
        examTarget: true,
        avatar: true,
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      role: user.role.name,
    });
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const { password, ...userWithoutPassword } = user;
    const token = this.jwtService.sign({
      sub: user.id,
      role: user.role.name,
    });
    return { user: userWithoutPassword, token };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        state: dto.state,
        class: dto.class,
        phone: dto.phone,
        examTarget: dto.examTarget,
        avatar: dto.avatar,
      },
      include: { role: true },
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createSchoolAccount(dto: { name: string; adminName: string; adminEmail: string; password: string }) {
    const role = await this.prisma.role.findUnique({ where: { name: 'SCHOOL_ADMIN' } });
    if (!role) throw new NotFoundException('Role not found');

    const admin = await this.prisma.user.create({
      data: {
        email: dto.adminEmail,
        password: await bcrypt.hash(dto.password, 10),
        name: dto.adminName,
        roleId: role.id,
      },
    });

    const school = await this.prisma.school.create({
      data: {
        name: dto.name,
        code: `SCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        licenseKey: `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      },
    });

    await this.prisma.user.update({
      where: { id: admin.id },
      data: { schoolId: school.id },
    });

    return { school, admin };
  }

  async seedSuperAdmin() {
    const existing = await this.prisma.user.findFirst({
      where: { role: { name: 'SUPER_ADMIN' } },
      include: { role: true },
    });
    if (existing) return existing;

    const role = await this.prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
    if (!role) throw new NotFoundException('SUPER_ADMIN role not seeded');

    const password = await bcrypt.hash('Admin@123', 10);
    return this.prisma.user.create({
      data: {
        email: 'superadmin@edumaster.africa',
        password,
        name: 'Super Admin',
        roleId: role.id,
        isVerified: true,
      },
      include: { role: true },
    });
  }
}
