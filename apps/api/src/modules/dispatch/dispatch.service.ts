import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';
import { randomBytes } from 'crypto';

function generateDispatchCode(): string {
  const year = new Date().getFullYear();
  const rand = randomBytes(2).toString('hex').toUpperCase();
  return `DSP-${year}-${rand}`;
}

@Injectable()
export class DispatchService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: { status?: string; processorId?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.status) where.status = query.status;
    if (query?.processorId) where.processorId = query.processorId;

    const dispatches = await this.prisma.dispatch.findMany({
      where,
      include: {
        processor: true,
        vehicle: true,
        batches: {
          include: { batch: true },
        },
        receipts: true,
        processingEvidences: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return ok(dispatches);
  }

  async findOne(id: string) {
    const dispatch = await this.prisma.dispatch.findUnique({
      where: { id },
      include: {
        processor: true,
        vehicle: true,
        batches: {
          include: {
            batch: {
              include: { collectionPoint: { include: { village: true } } },
            },
          },
        },
        receipts: true,
        processingEvidences: true,
      },
    });
    if (!dispatch) throw new NotFoundException(`Dispatch ${id} not found`);
    return ok(dispatch);
  }

  async create(data: {
    processorId: string;
    vehicleId?: string;
    scheduledDate: string | Date;
    createdBy: string;
    notes?: string;
    batchIds: string[];
  }) {
    if (!data.batchIds || data.batchIds.length === 0) {
      throw new BadRequestException('At least one batch ID is required to create a dispatch');
    }

    const batches = await this.prisma.wasteBatch.findMany({
      where: { id: { in: data.batchIds } },
    });
    if (batches.length !== data.batchIds.length) {
      throw new NotFoundException('One or more batch IDs could not be found');
    }

    const totalWeightKg = batches.reduce((sum, b) => sum + Number(b.netWeightKg), 0);
    const dispatchCode = generateDispatchCode();

    const dispatch = await this.prisma.$transaction(async (tx) => {
      const createdDispatch = await tx.dispatch.create({
        data: {
          dispatchCode,
          processorId: data.processorId,
          vehicleId: data.vehicleId,
          totalWeightKg,
          scheduledDate: new Date(data.scheduledDate),
          createdBy: data.createdBy,
          notes: data.notes,
          status: 'CONFIRMED',
          batches: {
            create: batches.map((b) => ({
              batchId: b.id,
              weightKg: b.netWeightKg,
            })),
          },
        },
        include: {
          processor: true,
          vehicle: true,
          batches: { include: { batch: true } },
        },
      });

      // Update batches status to DISPATCHED
      for (const b of batches) {
        await tx.wasteBatch.update({
          where: { id: b.id },
          data: { status: 'DISPATCHED' },
        });

        await tx.batchEvent.create({
          data: {
            batchId: b.id,
            eventType: 'STATUS_DISPATCHED',
            fromStatus: b.status,
            toStatus: 'DISPATCHED',
            performedBy: data.createdBy,
            role: 'MRF_OPERATOR',
            notes: `Dispatched in ${dispatchCode}`,
          },
        });
      }

      return createdDispatch;
    });

    return ok(dispatch, 'Dispatch created successfully');
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    const updated = await this.prisma.dispatch.update({
      where: { id },
      data: { status },
      include: {
        processor: true,
        vehicle: true,
        batches: { include: { batch: true } },
      },
    });
    return ok(updated, `Dispatch status updated to ${status}`);
  }

  async createReceipt(
    dispatchId: string,
    data: {
      receivedBy: string;
      receivedWeightKg: number;
      notes?: string;
      evidenceUrl?: string;
    },
  ) {
    const dispatch = await this.prisma.dispatch.findUnique({
      where: { id: dispatchId },
    });
    if (!dispatch) throw new NotFoundException(`Dispatch ${dispatchId} not found`);

    const discrepancyKg = Number(dispatch.totalWeightKg) - Number(data.receivedWeightKg);

    const [receipt] = await this.prisma.$transaction([
      this.prisma.receipt.create({
        data: {
          dispatchId,
          receivedBy: data.receivedBy,
          receivedWeightKg: data.receivedWeightKg,
          discrepancyKg,
          notes: data.notes,
          evidenceUrl: data.evidenceUrl,
        },
      }),
      this.prisma.dispatch.update({
        where: { id: dispatchId },
        data: { status: 'DELIVERED' },
      }),
    ]);

    return ok(receipt, 'Processor receipt recorded successfully');
  }

  async createProcessingEvidence(
    dispatchId: string,
    data: {
      processedWeightKg: number;
      processType: string;
      evidenceUrl?: string;
      verifiedBy?: string;
      notes?: string;
      processedAt?: string | Date;
    },
  ) {
    const dispatch = await this.prisma.dispatch.findUnique({
      where: { id: dispatchId },
    });
    if (!dispatch) throw new NotFoundException(`Dispatch ${dispatchId} not found`);

    const [evidence] = await this.prisma.$transaction([
      this.prisma.processingEvidence.create({
        data: {
          dispatchId,
          processedWeightKg: data.processedWeightKg,
          processType: data.processType,
          evidenceUrl: data.evidenceUrl,
          verifiedBy: data.verifiedBy,
          notes: data.notes,
          processedAt: data.processedAt ? new Date(data.processedAt) : new Date(),
        },
      }),
      this.prisma.dispatch.update({
        where: { id: dispatchId },
        data: { status: 'PROCESSED' },
      }),
    ]);

    return ok(evidence, 'Processing evidence recorded successfully');
  }
}
