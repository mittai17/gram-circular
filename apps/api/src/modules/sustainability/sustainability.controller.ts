import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SustainabilityService } from './sustainability.service';

@ApiTags('sustainability')
@Controller('api/v1/sustainability')
export class SustainabilityController {
  constructor(private readonly svc: SustainabilityService) {}

  @Get('expenses')
  @ApiOperation({ summary: 'List operational expenses' })
  findExpenses(@Query('mrfId') mrfId?: string, @Query('category') category?: string) {
    return this.svc.findExpenses({ mrfId, category });
  }

  @Post('expenses')
  @ApiOperation({ summary: 'Record an operational expense' })
  createExpense(@Body() body: {
    mrfId: string;
    category: string;
    description: string;
    amountINR: number;
    quantity?: number;
    unit?: string;
    periodDate: string;
    recordedBy: string;
  }) {
    return this.svc.createExpense(body);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'List revenue entries' })
  findRevenue(@Query('mrfId') mrfId?: string, @Query('source') source?: string) {
    return this.svc.findRevenue({ mrfId, source });
  }

  @Post('revenue')
  @ApiOperation({ summary: 'Record a revenue entry' })
  createRevenue(@Body() body: {
    mrfId: string;
    source: string;
    description: string;
    amountINR: number;
    weightKg?: number;
    referenceId?: string;
    periodDate: string;
    recordedBy: string;
  }) {
    return this.svc.createRevenue(body);
  }

  @Get('ledger')
  @ApiOperation({ summary: 'Get O&M sustainability ledger with break-even ratio' })
  ledger(@Query('mrfId') mrfId: string, @Query('month') month?: string) {
    return this.svc.getLedger(mrfId, month);
  }
}
