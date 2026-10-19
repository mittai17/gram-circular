import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DispatchService } from './dispatch.service';

@ApiTags('dispatch')
@Controller('api/v1/dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get()
  @ApiOperation({ summary: 'List all dispatches' })
  findAll(
    @Query('status') status?: string,
    @Query('processorId') processorId?: string,
  ) {
    return this.dispatchService.findAll({ status, processorId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dispatch details by ID' })
  findOne(@Param('id') id: string) {
    return this.dispatchService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new dispatch batch order' })
  create(
    @Body()
    body: {
      processorId: string;
      vehicleId?: string;
      scheduledDate: string;
      createdBy: string;
      notes?: string;
      batchIds: string[];
    },
  ) {
    return this.dispatchService.create(body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update dispatch status' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.dispatchService.updateStatus(id, body.status);
  }

  @Post(':id/receipt')
  @ApiOperation({ summary: 'Record processor delivery receipt & discrepancy' })
  createReceipt(
    @Param('id') id: string,
    @Body()
    body: {
      receivedBy: string;
      receivedWeightKg: number;
      notes?: string;
      evidenceUrl?: string;
    },
  ) {
    return this.dispatchService.createReceipt(id, body);
  }

  @Post(':id/evidence')
  @ApiOperation({ summary: 'Record recycling / processing evidence' })
  createProcessingEvidence(
    @Param('id') id: string,
    @Body()
    body: {
      processedWeightKg: number;
      processType: string;
      evidenceUrl?: string;
      verifiedBy?: string;
      notes?: string;
      processedAt?: string;
    },
  ) {
    return this.dispatchService.createProcessingEvidence(id, body);
  }
}
