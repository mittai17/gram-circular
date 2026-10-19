import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InspectionService } from './inspection.service';

@ApiTags('inspections')
@Controller('api/v1/inspections')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Get()
  @ApiOperation({ summary: 'List all quality inspections' })
  findAll(
    @Query('outcome') outcome?: string,
    @Query('grade') grade?: string,
  ) {
    return this.inspectionService.findAll({ outcome, grade });
  }

  @Get(':batchId')
  @ApiOperation({ summary: 'Get inspection for a batch' })
  findByBatchId(@Param('batchId') batchId: string) {
    return this.inspectionService.findByBatchId(batchId);
  }

  @Post()
  @ApiOperation({ summary: 'Submit batch quality inspection' })
  create(
    @Body()
    body: {
      batchId: string;
      inspectorName: string;
      contaminationLevel: string;
      moistureLevel: string;
      packagingCondition: string;
      foreignMaterials: boolean;
      outcome: string;
      grade: string;
      notes?: string;
    },
  ) {
    return this.inspectionService.create(body);
  }
}
