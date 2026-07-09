import { Controller, Get, Post, Query, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../guards';

@ApiTags('questions')
@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get('subjects')
  @ApiOperation({ summary: 'Get all subjects' })
  getSubjects() {
    return this.questionsService.getSubjects();
  }

  @Get()
  @ApiOperation({ summary: 'Get questions with filters' })
  @ApiQuery({ name: 'subject', required: false })
  @ApiQuery({ name: 'topic', required: false })
  @ApiQuery({ name: 'year', required: false })
  getQuestions(@Query() query: any) {
    return this.questionsService.getQuestions(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search questions' })
  search(@Query('q') q: string) {
    return this.questionsService.searchQuestions(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single question' })
  getQuestion(@Param('id') id: string) {
    return this.questionsService.getQuestion(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new question (teacher/school only)' })
  create(@Body() dto: any) {
    return this.questionsService.createQuestion(dto);
  }
}