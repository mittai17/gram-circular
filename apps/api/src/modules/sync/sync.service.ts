import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async processBatch(operations: Record<string, unknown>[]) {
    const results: Record<string, unknown>[] = [];

    for (const op of operations) {
      const existing = await this.prisma.syncOperation.findUnique({
        where: { clientOperationId: op.clientOperationId as string },
      });

      if (existing && existing.state === 'SYNCED') {
        results.push({
          clientOperationId: op.clientOperationId,
          status: 'ALREADY_SYNCED',
        });
        continue;
      }

      await this.prisma.syncOperation.upsert({
        where: { clientOperationId: op.clientOperationId as string },
        create: {
          clientOperationId: op.clientOperationId as string,
          operationType: op.operationType as string,
          payload: (op.payload ?? {}) as Prisma.InputJsonValue,
          state: 'SYNCED',
          syncedAt: new Date(),
        },
        update: { state: 'SYNCED', syncedAt: new Date() },
      });

      results.push({
        clientOperationId: op.clientOperationId,
        status: 'SYNCED',
      });
    }

    return ok(results, `Processed ${results.length} operations`);
  }
}
