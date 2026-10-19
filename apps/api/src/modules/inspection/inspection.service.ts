import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';

@Injectable()
export class InspectionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: { outcome?: string; grade?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.outcome) where.outcome = query.outcome;
    if (query?.grade) where.grade = query.grade;

    const inspections = await this.prisma.qualityInspection.findMany({
      where,
      include: {
        batch: {
          include: { collectionPoint: { include: { village: true } } },
        },
      },
      orderBy: { inspectedAt: 'desc' },
    });
    return ok(inspections);
  }

  async findByBatchId(batchId: string) {
    const inspection = await this.prisma.qualityInspection.findUnique({
      where: { batchId },
      include: {
        batch: {
          include: { collectionPoint: { include: { village: true } } },
        },
      },
    });
    if (!inspection) throw new NotFoundException(`Inspection for batch ${batchId} not found`);
    return ok(inspection);
  }

  async create(data: {
    batchId: string;
    inspectorName: string;
    contaminationLevel: string;
    moistureLevel: string;
    packagingCondition: string;
    foreignMaterials: boolean;
    outcome: string;
    grade: string;
    notes?: string;
  }) {
    const batch = await this.prisma.wasteBatch.findUnique({
      where: { id: data.batchId },
    });
    if (!batch) throw new NotFoundException(`Batch ${data.batchId} not found`);

    const existing = await this.prisma.qualityInspection.findUnique({
      where: { batchId: data.batchId },
    });
    if (existing) {
      throw new ConflictException(`Batch ${data.batchId} has already been inspected`);
    }

    const nextBatchStatus = data.outcome === 'REJECTED' ? 'REJECTED' : 'INSPECTED';

    const [inspection] = await this.prisma.$transaction([
      this.prisma.qualityInspection.create({
        data: {
          batchId: data.batchId,
          inspectorName: data.inspectorName,
          contaminationLevel: data.contaminationLevel,
          moistureLevel: data.moistureLevel,
          packagingCondition: data.packagingCondition,
          foreignMaterials: data.foreignMaterials,
          outcome: data.outcome,
          grade: data.grade,
          notes: data.notes,
        },
        include: { batch: true },
      }),
      this.prisma.wasteBatch.update({
        where: { id: data.batchId },
        data: { status: nextBatchStatus },
      }),
      this.prisma.batchEvent.create({
        data: {
          batchId: data.batchId,
          eventType: 'STATUS_INSPECTED',
          fromStatus: batch.status,
          toStatus: nextBatchStatus,
          performedBy: data.inspectorName,
          role: 'MRF_OPERATOR',
          notes: `Inspection outcome: ${data.outcome}, Grade: ${data.grade}`,
        },
      }),
    ]);

    return ok(inspection, 'Quality inspection recorded successfully');
  }
}
