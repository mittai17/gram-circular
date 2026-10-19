import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProcessorsService } from './processors.service';

@ApiTags('processors')
@Controller('api/v1/processors')
export class ProcessorsController {
  constructor(private readonly processorsService: ProcessorsService) {}

  @Get()
  @ApiOperation({ summary: 'List processors' })
  findAll(
    @Query('material') material?: string,
    @Query('minKg') minKg?: string,
  ) {
    return this.processorsService.findAll({
      material,
      minKg: minKg ? +minKg : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get processor by ID' })
  findOne(@Param('id') id: string) {
    return this.processorsService.findOne(id);
  }
}
