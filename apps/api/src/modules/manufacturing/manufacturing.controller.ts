import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ManufacturingService } from './manufacturing.service';

@ApiTags('manufacturing')
@Controller('api/v1/manufacturing')
export class ManufacturingController {
  constructor(private readonly svc: ManufacturingService) {}

  @Get('runs')
  @ApiOperation({ summary: 'List all production runs' })
  findAll(@Query('status') status?: string, @Query('productType') productType?: string) {
    return this.svc.findAll({ status, productType });
  }

  @Get('runs/:id')
  @ApiOperation({ summary: 'Get a production run by ID' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post('runs')
  @ApiOperation({ summary: 'Start a new MLP production run' })
  create(@Body() body: {
    mrfId: string;
    productType: string;
    mlpInputKg: number;
    sandInputKg?: number;
    binderInputKg?: number;
    otherInputKg?: number;
    outputUnit: string;
    operatorName: string;
    machineId?: string;
    notes?: string;
    batchIds?: string[];
  }) {
    return this.svc.create(body);
  }

  @Patch('runs/:id/complete')
  @ApiOperation({ summary: 'Complete a production run and record outputs' })
  complete(@Param('id') id: string, @Body() body: {
    outputQuantity: number;
    outputWeightKg?: number;
    grade?: string;
    compressiveStrengthMpa?: number;
    waterAbsorptionPercent?: number;
    energyKwh?: number;
    wasteLossKg?: number;
    qualityNotes?: string;
  }) {
    return this.svc.complete(id, body);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get manufacturing statistics and yield summary' })
  stats() {
    return this.svc.stats();
  }
}
