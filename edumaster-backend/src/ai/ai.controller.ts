import { Controller, Post, Get, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI tutor' })
  chat(@Request() req, @Body() dto: { message: string }) {
    return this.aiService.chat(req.user.id, dto.message);
  }

  @Post('questions')
  @ApiOperation({ summary: 'Generate AI questions' })
  generateQuestions(@Body() dto: { subject: string; topic: string; count?: number }) {
    return this.aiService.generateQuestions(dto.subject, dto.topic, dto.count);
  }

  @Post('math')
  @ApiOperation({ summary: 'Solve math problem' })
  solveMath(@Body() dto: { problem: string }) {
    return this.aiService.solveMath(dto.problem);
  }

  @Post('essay')
  @ApiOperation({ summary: 'Grade essay' })
  gradeEssay(@Body() dto: { text: string }) {
    return this.aiService.gradeEssay(dto.text);
  }
}