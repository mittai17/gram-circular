import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CitizenService } from './citizen.service';

@ApiTags('citizen')
@Controller('api/v1/citizen')
export class CitizenController {
  constructor(private readonly citizenService: CitizenService) {}

  @Get('reports')
  @ApiOperation({ summary: 'List citizen reports' })
  getReports(
    @Query('villageId') villageId?: string,
    @Query('status') status?: string,
  ) {
    return this.citizenService.getReports({ villageId, status });
  }

  @Post('reports')
  @ApiOperation({ summary: 'Submit a citizen report' })
  createReport(@Body() body: Record<string, unknown>) {
    return this.citizenService.createReport(body);
  }

  @Patch('reports/:id/status')
  @ApiOperation({ summary: 'Update report status' })
  updateReportStatus(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.citizenService.updateReportStatus(id, body);
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get collection schedules' })
  getSchedules(@Query('villageId') villageId?: string) {
    return this.citizenService.getSchedules(villageId);
  }
}
