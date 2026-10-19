import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SyncService } from './sync.service';

@ApiTags('sync')
@Controller('api/v1/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('batch')
  @ApiOperation({ summary: 'Sync a batch of offline operations' })
  syncBatch(@Body() body: { operations: Record<string, unknown>[] }) {
    return this.syncService.processBatch(body.operations);
  }
}
