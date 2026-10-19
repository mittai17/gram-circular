import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BatchesService } from './batches.service';

@ApiTags('batches')
@Controller('api/v1/batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get()
  @ApiOperation({ summary: 'List waste batches' })
  findAll(
    @Query('status') status?: string,
    @Query('wasteStream') wasteStream?: string,
    @Query('collectionPointId') collectionPointId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.batchesService.findAll({
      status,
      wasteStream,
      collectionPointId,
      page: +page,
      limit: +limit,
    });
  }

  @Get('qr/:token')
  @ApiOperation({ summary: 'Lookup batch by QR token' })
  findByQr(@Param('token') token: string) {
    return this.batchesService.findByQrToken(token);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get batch by ID' })
  findOne(@Param('id') id: string) {
    return this.batchesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new waste batch' })
  create(@Body() body: Record<string, unknown>) {
    return this.batchesService.create(body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update batch status' })
  updateStatus(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.batchesService.updateStatus(id, body);
  }
}
