import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StorageService } from './storage.service';

@ApiTags('storage')
@Controller('api/v1/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('zones')
  @ApiOperation({ summary: 'List all storage zones with stock and utilization' })
  findAllZones(
    @Query('wasteStream') wasteStream?: string,
    @Query('mrfId') mrfId?: string,
  ) {
    return this.storageService.findAllZones({ wasteStream, mrfId });
  }

  @Get('zones/:id')
  @ApiOperation({ summary: 'Get storage zone by ID' })
  findZone(@Param('id') id: string) {
    return this.storageService.findZone(id);
  }

  @Post('zones')
  @ApiOperation({ summary: 'Create a storage zone' })
  createZone(
    @Body()
    body: {
      mrfId: string;
      name: string;
      wasteStream: string;
      capacityKg: number;
      location: string;
    },
  ) {
    return this.storageService.createZone(body);
  }

  @Get('movements')
  @ApiOperation({ summary: 'List recent inventory movements' })
  findAllMovements(
    @Query('storageZoneId') storageZoneId?: string,
    @Query('batchId') batchId?: string,
  ) {
    return this.storageService.findAllMovements({ storageZoneId, batchId });
  }

  @Post('movements')
  @ApiOperation({ summary: 'Record an inventory movement (IN/OUT/ADJUSTMENT)' })
  recordMovement(
    @Body()
    body: {
      storageZoneId: string;
      batchId?: string;
      movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
      weightKg: number;
      notes?: string;
      performedBy: string;
    },
  ) {
    return this.storageService.recordMovement(body);
  }
}
