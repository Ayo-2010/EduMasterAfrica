import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards';
import { CbtService } from './cbt.service';

@ApiTags('cbt')
@Controller('cbt')
@UseGuards(JwtAuthGuard)
export class CbtController {
  constructor(private cbtService: CbtService) {}

  @Post('attempts')
  @ApiOperation({ summary: 'Start new exam attempt' })
  startAttempt(@Request() req, @Body() dto: { subject: string; year?: string; mode?: string; questionCount?: number }) {
    return this.cbtService.startAttempt(req.user.id, dto);
  }

  @Post('attempts/:id/submit')
  @ApiOperation({ summary: 'Submit exam attempt' })
  submitAttempt(@Request() req, @Param('id') id: string, @Body() dto: { answers: { questionId: string; optionId: string }[] }) {
    return this.cbtService.submitAttempt(req.user.id, id, dto.answers);
  }

  @Get('attempts')
  @ApiOperation({ summary: 'Get user attempts' })
  getAttempts(@Request() req) {
    return this.cbtService.getUserAttempts(req.user.id);
  }

  @Get('attempts/:id')
  @ApiOperation({ summary: 'Get specific attempt' })
  getAttempt(@Request() req, @Param('id') id: string) {
    return this.cbtService.getAttempt(req.user.id, id);
  }
}