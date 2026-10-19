import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';

@Injectable()
export class StorageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllZones(query?: { wasteStream?: string; mrfId?: string }) {
    const where: Record<string, unknown> = { isActive: true };
    if (query?.wasteStream) where.wasteStream = query.wasteStream;
    if (query?.mrfId) where.mrfId = query.mrfId;

    const zones = await this.prisma.storageZone.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const enriched = zones.map((zone) => {
      const cap = Number(zone.capacityKg);
      const stock = Number(zone.currentStockKg);
      const utilizationPercent = cap > 0 ? Math.round((stock / cap) * 100) : 0;
      return {
        ...zone,
        capacityKg: cap,
        currentStockKg: stock,
        utilizationPercent,
      };
    });

    return ok(enriched);
  }

  async findZone(id: string) {
    const zone = await this.prisma.storageZone.findUnique({
      where: { id },
      include: {
        inventoryMoves: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { batch: true },
        },
      },
    });
    if (!zone) throw new NotFoundException(`Storage zone ${id} not found`);
    return ok(zone);
  }

  async createZone(data: {
    mrfId: string;
    name: string;
    wasteStream: string;
    capacityKg: number;
    location: string;
  }) {
    const zone = await this.prisma.storageZone.create({
      data: {
        mrfId: data.mrfId,
        name: data.name,
        wasteStream: data.wasteStream,
        capacityKg: data.capacityKg,
        currentStockKg: 0,
        location: data.location,
      },
    });
    return ok(zone, 'Storage zone created successfully');
  }

  async findAllMovements(query?: { storageZoneId?: string; batchId?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.storageZoneId) where.storageZoneId = query.storageZoneId;
    if (query?.batchId) where.batchId = query.batchId;

    const movements = await this.prisma.inventoryMovement.findMany({
      where,
      include: {
        storageZone: true,
        batch: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return ok(movements);
  }

  async recordMovement(data: {
    storageZoneId: string;
    batchId?: string;
    movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
    weightKg: number;
    notes?: string;
    performedBy: string;
  }) {
    const zone = await this.prisma.storageZone.findUnique({
      where: { id: data.storageZoneId },
    });
    if (!zone) throw new NotFoundException(`Storage zone ${data.storageZoneId} not found`);

    const weight = Number(data.weightKg);
    let delta = 0;
    if (data.movementType === 'IN') delta = weight;
    else if (data.movementType === 'OUT') delta = -weight;
    else if (data.movementType === 'ADJUSTMENT') delta = weight; // adjustment adds or subtracts depending on sign

    const currentStock = Number(zone.currentStockKg);
    const newStock = currentStock + delta;
    if (newStock < 0) {
      throw new BadRequestException(`Insufficient inventory in zone. Current stock: ${currentStock} kg`);
    }

    const [movement] = await this.prisma.$transaction([
      this.prisma.inventoryMovement.create({
        data: {
          storageZoneId: data.storageZoneId,
          batchId: data.batchId,
          movementType: data.movementType,
          weightKg: weight,
          notes: data.notes,
          performedBy: data.performedBy,
        },
      }),
      this.prisma.storageZone.update({
        where: { id: data.storageZoneId },
        data: { currentStockKg: newStock },
      }),
      ...(data.batchId && data.movementType === 'IN'
        ? [
            this.prisma.wasteBatch.update({
              where: { id: data.batchId },
              data: { status: 'IN_STORAGE' },
            }),
            this.prisma.batchEvent.create({
              data: {
                batchId: data.batchId,
                eventType: 'STATUS_IN_STORAGE',
                toStatus: 'IN_STORAGE',
                performedBy: data.performedBy,
                role: 'MRF_OPERATOR',
                notes: `Moved into ${zone.name}`,
              },
            }),
          ]
        : []),
    ]);

    return ok(movement, 'Inventory movement recorded successfully');
  }
}
