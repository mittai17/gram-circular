import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok, paginated } from '../../common/response';
import { randomBytes } from 'crypto';

function generateBatchCode(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const rand = randomBytes(3).toString('hex').toUpperCase();
  return `MLP-${year}-${month}-${rand}`;
}

function generateQrToken(): string {
  return randomBytes(16).toString('hex');
}

@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    status,
    wasteStream,
    collectionPointId,
    page,
    limit,
  }: {
    status?: string;
    wasteStream?: string;
    collectionPointId?: string;
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;
    const where = {
      ...(status && { status }),
      ...(wasteStream && { wasteStream }),
      ...(collectionPointId && { collectionPointId }),
    };

    const [items, total] = await Promise.all([
      this.prisma.wasteBatch.findMany({
        where,
        include: {
          collectionPoint: { include: { village: true } },
          inspection: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.wasteBatch.count({ where }),
    ]);

    return paginated(items, total, page, limit);
  }

  async findByQrToken(token: string) {
    const batch = await this.prisma.wasteBatch.findUnique({
      where: { qrToken: token },
      include: {
        collectionPoint: { include: { village: true } },
        events: { orderBy: { createdAt: 'asc' } },
        inspection: true,
        dispatchBatches: {
          include: { dispatch: { include: { processor: true } } },
        },
      },
    });
    if (!batch) throw new NotFoundException(`Batch not found for QR token`);
    return ok(batch);
  }

  async findOne(id: string) {
    const batch = await this.prisma.wasteBatch.findUnique({
      where: { id },
      include: {
        collectionPoint: { include: { village: true } },
        events: { orderBy: { createdAt: 'asc' } },
        inspection: true,
        dispatchBatches: {
          include: { dispatch: { include: { processor: true } } },
        },
      },
    });
    if (!batch) throw new NotFoundException(`Batch ${id} not found`);
    return ok(batch);
  }

  async create(data: Record<string, unknown>) {
    // Idempotency check
    if (data.clientOperationId) {
      const existing = await this.prisma.wasteBatch.findUnique({
        where: { clientOperationId: data.clientOperationId as string },
      });
      if (existing) return ok(existing, 'Batch already exists (idempotent)');
    }

    const netWeightKg = Number(data.grossWeightKg) - Number(data.tareWeightKg ?? 0);
    if (netWeightKg <= 0) throw new ConflictException('Net weight must be positive');

    const batch = await this.prisma.wasteBatch.create({
      data: {
        batchCode: generateBatchCode(),
        qrToken: generateQrToken(),
        collectionPointId: data.collectionPointId as string,
        wasteStream: data.wasteStream as string,
        materialSubtype: data.materialSubtype as string | undefined,
        grossWeightKg: data.grossWeightKg as number,
        tareWeightKg: (data.tareWeightKg as number) ?? 0,
        netWeightKg,
        weightSource: data.weightSource as string,
        workerName: data.workerName as string,
        collectedAt: new Date(),
        notes: data.notes as string | undefined,
        photoUrl: data.photoUrl as string | undefined,
        deviceId: data.deviceId as string | undefined,
        clientOperationId: data.clientOperationId as string | undefined,
        status: 'CREATED',
        events: {
          create: {
            eventType: 'BATCH_CREATED',
            toStatus: 'CREATED',
            performedBy: data.workerName as string,
            role: 'WORKER',
            notes: 'Batch created at collection point',
          },
        },
      },
      include: {
        collectionPoint: { include: { village: true } },
        events: true,
      },
    });

    // Update collection point last collected timestamp
    await this.prisma.collectionPoint.update({
      where: { id: data.collectionPointId as string },
      data: { lastCollectedAt: new Date() },
    });

    return ok(batch, 'Batch created successfully');
  }

  async updateStatus(id: string, data: Record<string, unknown>) {
    const batch = await this.prisma.wasteBatch.findUnique({ where: { id } });
    if (!batch) throw new NotFoundException(`Batch ${id} not found`);

    const updated = await this.prisma.wasteBatch.update({
      where: { id },
      data: {
        status: data.status as string,
        events: {
          create: {
            eventType: `STATUS_${(data.status as string).toUpperCase()}`,
            fromStatus: batch.status,
            toStatus: data.status as string,
            performedBy: data.performedBy as string,
            role: (data.role as string) ?? 'MRF_OPERATOR',
            notes: data.notes as string | undefined,
          },
        },
      },
      include: { events: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    return ok(updated, 'Batch status updated');
  }
}
