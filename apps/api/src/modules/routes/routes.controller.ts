import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoutesService } from './routes.service';

@ApiTags('routes')
@Controller('api/v1/routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiOperation({ summary: 'List all route plans' })
  findAll(
    @Query('status') status?: string,
    @Query('vehicleId') vehicleId?: string,
  ) {
    return this.routesService.findAll({ status, vehicleId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route plan by ID' })
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new route plan' })
  create(
    @Body()
    body: {
      vehicleId: string;
      plannedDate: string;
      estimatedDistanceKm?: number;
      estimatedDurationMin?: number;
      stops?: Array<{
        collectionPointId: string;
        sequence: number;
        estimatedArrival?: string;
      }>;
    },
  ) {
    return this.routesService.create(body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update route plan status' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.routesService.updateStatus(id, body.status);
  }

  @Patch('stops/:stopId')
  @ApiOperation({ summary: 'Update route stop status and weight' })
  updateStop(
    @Param('stopId') stopId: string,
    @Body()
    body: {
      status?: string;
      actualArrival?: string;
      collectedWeightKg?: number;
    },
  ) {
    return this.routesService.updateStop(stopId, body);
  }

  @Post(':id/optimize')
  @ApiOperation({ summary: 'Run TSP route optimization on a route plan' })
  optimize(@Param('id') id: string) {
    return this.routesService.optimize(id);
  }
}
