import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get user analytics stats' })
  getStats(@Request() req) {
    return this.analyticsService.getUserStats(req.user.id);
  }

  @Get('mastery')
  @ApiOperation({ summary: 'Get subject mastery breakdown' })
  getMastery(@Request() req) {
    return this.analyticsService.getSubjectMastery(req.user.id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiQuery({ name: 'limit', required: false })
  getLeaderboard(@Query() query: { limit?: string }) {
    return this.analyticsService.getLeaderboard({
      limit: query.limit ? parseInt(query.limit) : undefined,
    });
  }
}
