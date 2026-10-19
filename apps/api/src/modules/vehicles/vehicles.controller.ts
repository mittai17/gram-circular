import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';

@ApiTags('vehicles')
@Controller('api/v1/vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List all vehicles' })
  findAll(
    @Query('isAvailable') isAvailable?: string,
    @Query('type') type?: string,
    @Query('depotVillageId') depotVillageId?: string,
  ) {
    return this.vehiclesService.findAll({
      isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
      type,
      depotVillageId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  create(
    @Body()
    body: {
      registrationNumber: string;
      type: string;
      capacityKg: number;
      driverName: string;
      driverPhone: string;
      depotVillageId?: string;
    },
  ) {
    return this.vehiclesService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vehicle status or details' })
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      type: string;
      capacityKg: number;
      currentLoadKg: number;
      driverName: string;
      driverPhone: string;
      isAvailable: boolean;
      depotVillageId: string;
    }>,
  ) {
    return this.vehiclesService.update(id, body);
  }
}
