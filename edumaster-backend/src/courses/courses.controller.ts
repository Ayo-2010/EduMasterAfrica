import { Controller, Get, Post, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { Roles } from '../common/roles.decorator';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiQuery({ name: 'category', required: false })
  getAll(@Query() query: any) {
    return this.coursesService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single course' })
  getOne(@Param('id') id: string) {
    return this.coursesService.getOne(id);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Enroll in course' })
  enroll(@Request() req, @Param('id') id: string) {
    return this.coursesService.enroll(req.user.id, id);
  }

  @Get('my/courses')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user enrolled courses' })
  getMyCourses(@Request() req) {
    return this.coursesService.getUserCourses(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  @ApiOperation({ summary: 'Create new course (teacher/school)' })
  create(@Request() req, @Body() body: unknown) {
    const dto = CreateCourseDto.parse(body);
    return this.coursesService.create(req.user.id, dto);
  }
}