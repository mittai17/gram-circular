import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DynamicRoutingService } from './dynamic-routing.service';

@ApiTags('dynamic-routing')
@Controller('api/v1/routing')
export class DynamicRoutingController {
  constructor(private readonly svc: DynamicRoutingService) {}

  @Get('pickup-requests')
  @ApiOperation({ summary: 'List pending pickup requests' })
  findRequests(@Query('status') status?: string, @Query('urgency') urgency?: string) {
    return this.svc.findRequests({ status, urgency });
  }

  @Post('pickup-requests')
  @ApiOperation({ summary: 'Raise an on-demand or overflow pickup request' })
  createRequest(@Body() body: {
    collectionPointId: string;
    requestedBy: string;
    requestType: string;
    estimatedWeightKg?: number;
    fillLevelPercent?: number;
    urgency?: string;
    notes?: string;
  }) {
    return this.svc.createRequest(body);
  }

  @Patch('pickup-requests/:id/status')
  @ApiOperation({ summary: 'Update pickup request status' })
  updateRequestStatus(
    @Param('id') id: string,
    @Body() body: { status: string; routePlanId?: string },
  ) {
    return this.svc.updateRequestStatus(id, body);
  }

  @Get('optimization-logs')
  @ApiOperation({ summary: 'List route optimization savings logs' })
  findOptimizationLogs() {
    return this.svc.findOptimizationLogs();
  }

  @Post('optimize')
  @ApiOperation({ summary: 'Trigger demand-based dynamic route optimization' })
  optimize(@Body() body: {
    triggeredBy: string;
    vehicleId?: string;
    routePlanId?: string;
    baselineDistanceKm: number;
    optimizedDistanceKm: number;
    stopsCount: number;
    fuelPricePerLitre?: number;
    solverDurationMs?: number;
  }) {
    return this.svc.logOptimization(body);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dynamic routing dashboard summary' })
  dashboard() {
    return this.svc.dashboard();
  }
}
