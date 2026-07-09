import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Platform stats', type: Object })
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Paginated users list', type: Object })
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getUsers(
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'User role updated', type: Object })
  async updateUserRole(
    @Param('id') id: string,
    @Query('role') role: string,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'User deleted', type: Object })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('schools')
  @ApiOperation({ summary: 'List all schools (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Schools list', type: Object })
  async getSchools() {
    return this.adminService.getSchools();
  }
}
