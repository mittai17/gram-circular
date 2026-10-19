import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VillagesService } from './villages.service';

@ApiTags('villages')
@Controller('api/v1/villages')
export class VillagesController {
  constructor(private readonly villagesService: VillagesService) {}

  @Get()
  @ApiOperation({ summary: 'List all villages' })
  findAll(
    @Query('search') search?: string,
    @Query('district') district?: string,
  ) {
    return this.villagesService.findAll({ search, district });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get village by ID' })
  findOne(@Param('id') id: string) {
    return this.villagesService.findOne(id);
  }

  @Get(':id/collection-points')
  @ApiOperation({ summary: 'Get collection points for a village' })
  getCollectionPoints(@Param('id') id: string) {
    return this.villagesService.getCollectionPoints(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a village' })
  create(@Body() body: Record<string, unknown>) {
    return this.villagesService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a village' })
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.villagesService.update(id, body);
  }
}
