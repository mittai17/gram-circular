import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BinsService } from './bins.service';

@ApiTags('bins')
@Controller('api/v1/bins')
export class BinsController {
  constructor(private readonly binsService: BinsService) {}

  @Get()
  @ApiOperation({ summary: 'List all bins' })
  findAll(
    @Query('collectionPointId') collectionPointId?: string,
    @Query('fillLevel') fillLevel?: string,
  ) {
    return this.binsService.findAll({ collectionPointId, fillLevel });
  }

  @Patch(':id/reading')
  @ApiOperation({ summary: 'Update bin fill level reading' })
  updateReading(
    @Param('id') id: string,
    @Body() body: { fillPercent: number; fillLevel: string },
  ) {
    return this.binsService.updateReading(id, body);
  }
}
