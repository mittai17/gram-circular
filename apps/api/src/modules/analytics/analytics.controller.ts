import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('api/v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  getDashboard() {
    return this.analyticsService.getDashboardMetrics();
  }

  @Get('mass-balance')
  @ApiOperation({ summary: 'Get mass balance ledger' })
  getMassBalance() {
    return this.analyticsService.getMassBalance();
  }
}
