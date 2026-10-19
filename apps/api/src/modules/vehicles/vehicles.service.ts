import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: { isAvailable?: boolean; type?: string; depotVillageId?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.isAvailable !== undefined) where.isAvailable = query.isAvailable;
    if (query?.type) where.type = query.type;
    if (query?.depotVillageId) where.depotVillageId = query.depotVillageId;

    const vehicles = await this.prisma.vehicle.findMany({
      where,
      orderBy: { registrationNumber: 'asc' },
    });
    return ok(vehicles);
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        routePlans: {
          orderBy: { plannedDate: 'desc' },
          take: 5,
          include: { stops: true },
        },
        dispatches: {
          orderBy: { scheduledDate: 'desc' },
          take: 5,
        },
      },
    });
    if (!vehicle) throw new NotFoundException(`Vehicle ${id} not found`);
    return ok(vehicle);
  }

  async create(data: {
    registrationNumber: string;
    type: string;
    capacityKg: number;
    driverName: string;
    driverPhone: string;
    depotVillageId?: string;
  }) {
    const vehicle = await this.prisma.vehicle.create({
      data: {
        registrationNumber: data.registrationNumber,
        type: data.type,
        capacityKg: data.capacityKg,
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        depotVillageId: data.depotVillageId,
      },
    });
    return ok(vehicle, 'Vehicle created successfully');
  }

  async update(id: string, data: Partial<{
    type: string;
    capacityKg: number;
    currentLoadKg: number;
    driverName: string;
    driverPhone: string;
    isAvailable: boolean;
    depotVillageId: string;
  }>) {
    await this.findOne(id);
    const updated = await this.prisma.vehicle.update({
      where: { id },
      data,
    });
    return ok(updated, 'Vehicle updated successfully');
  }
}
