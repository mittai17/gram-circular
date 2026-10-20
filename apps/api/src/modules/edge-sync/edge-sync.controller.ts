import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EdgeSyncService } from './edge-sync.service';

@ApiTags('edge-sync')
@Controller('api/v1/edge-sync')
export class EdgeSyncController {
  constructor(private readonly svc: EdgeSyncService) {}

  @Post('ingest')
  @ApiOperation({ summary: 'Ingest a compressed payload from a field device' })
  ingest(@Body() body: {
    deviceId: string;
    payloadType: string;
    payload: Record<string, unknown>;
    signalStrengthDbm?: number;
    networkType?: string;
    rawSizeBytes?: number;
  }) {
    return this.svc.ingest(body);
  }

  @Get('payloads')
  @ApiOperation({ summary: 'List ingested edge payloads' })
  findPayloads(@Query('status') status?: string, @Query('deviceId') deviceId?: string) {
    return this.svc.findPayloads({ status, deviceId });
  }

  @Post('payloads/:id/process')
  @ApiOperation({ summary: 'Mark a payload as processed' })
  process(@Param('id') id: string) {
    return this.svc.processPayload(id);
  }

  @Post('queue')
  @ApiOperation({ summary: 'Queue an offline operation from a client device' })
  enqueue(@Body() body: {
    clientDeviceId: string;
    operationType: string;
    clientOperationId: string;
    payload: Record<string, unknown>;
    networkType?: string;
  }) {
    return this.svc.enqueue(body);
  }

  @Post('queue/flush')
  @ApiOperation({ summary: 'Flush (sync) pending queue items for a device' })
  flush(@Body() body: { clientDeviceId: string }) {
    return this.svc.flushQueue(body.clientDeviceId);
  }

  @Get('queue')
  @ApiOperation({ summary: 'List offline sync queue items' })
  findQueue(@Query('clientDeviceId') clientDeviceId?: string, @Query('status') status?: string) {
    return this.svc.findQueue({ clientDeviceId, status });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Edge sync statistics dashboard' })
  stats() {
    return this.svc.stats();
  }
}
