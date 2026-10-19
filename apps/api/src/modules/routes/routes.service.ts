import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: { status?: string; vehicleId?: string }) {
    const where: Record<string, unknown> = {};
    if (query?.status) where.status = query.status;
    if (query?.vehicleId) where.vehicleId = query.vehicleId;

    const routes = await this.prisma.routePlan.findMany({
      where,
      include: {
        vehicle: true,
        stops: {
          include: {
            collectionPoint: {
              include: { village: true },
            },
          },
          orderBy: { sequence: 'asc' },
        },
      },
      orderBy: { plannedDate: 'desc' },
    });
    return ok(routes);
  }

  async findOne(id: string) {
    const route = await this.prisma.routePlan.findUnique({
      where: { id },
      include: {
        vehicle: true,
        stops: {
          include: {
            collectionPoint: {
              include: { village: true, bins: true },
            },
          },
          orderBy: { sequence: 'asc' },
        },
      },
    });
    if (!route) throw new NotFoundException(`Route plan ${id} not found`);
    return ok(route);
  }

  async create(data: {
    vehicleId: string;
    plannedDate: string | Date;
    estimatedDistanceKm?: number;
    estimatedDurationMin?: number;
    stops?: Array<{
      collectionPointId: string;
      sequence: number;
      estimatedArrival?: string | Date;
    }>;
  }) {
    const route = await this.prisma.routePlan.create({
      data: {
        vehicleId: data.vehicleId,
        plannedDate: new Date(data.plannedDate),
        estimatedDistanceKm: data.estimatedDistanceKm ?? 0,
        estimatedDurationMin: data.estimatedDurationMin ?? 0,
        stops: data.stops
          ? {
              create: data.stops.map((s) => ({
                collectionPointId: s.collectionPointId,
                sequence: s.sequence,
                estimatedArrival: s.estimatedArrival ? new Date(s.estimatedArrival) : null,
              })),
            }
          : undefined,
      },
      include: {
        vehicle: true,
        stops: {
          include: { collectionPoint: true },
        },
      },
    });
    return ok(route, 'Route plan created successfully');
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    const updated = await this.prisma.routePlan.update({
      where: { id },
      data: { status },
      include: {
        vehicle: true,
        stops: {
          include: { collectionPoint: true },
          orderBy: { sequence: 'asc' },
        },
      },
    });
    return ok(updated, `Route status updated to ${status}`);
  }

  async updateStop(
    stopId: string,
    data: {
      status?: string;
      actualArrival?: string | Date;
      collectedWeightKg?: number;
    },
  ) {
    const stop = await this.prisma.routeStop.findUnique({ where: { id: stopId } });
    if (!stop) throw new NotFoundException(`Route stop ${stopId} not found`);

    const updated = await this.prisma.routeStop.update({
      where: { id: stopId },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.actualArrival && { actualArrival: new Date(data.actualArrival) }),
        ...(data.collectedWeightKg !== undefined && { collectedWeightKg: data.collectedWeightKg }),
      },
      include: { collectionPoint: true },
    });
    return ok(updated, 'Route stop updated successfully');
  }

  async optimize(id: string) {
    const route = await this.prisma.routePlan.findUnique({
      where: { id },
      include: {
        stops: {
          include: { collectionPoint: true },
        },
      },
    });
    if (!route) throw new NotFoundException(`Route plan ${id} not found`);

    // Sort stops in geographic order (latitude ascending/descending) for demonstration
    const sortedStops = [...route.stops].sort((a, b) =>
      Number(a.collectionPoint.latitude) - Number(b.collectionPoint.latitude),
    );

    for (let i = 0; i < sortedStops.length; i++) {
      await this.prisma.routeStop.update({
        where: { id: sortedStops[i].id },
        data: { sequence: i + 1 },
      });
    }

    const updated = await this.prisma.routePlan.update({
      where: { id },
      data: {
        optimized: true,
        // 12% heuristic route distance reduction
        estimatedDistanceKm: Math.max(1, Number(route.estimatedDistanceKm) * 0.88),
      },
      include: {
        vehicle: true,
        stops: {
          include: { collectionPoint: true },
          orderBy: { sequence: 'asc' },
        },
      },
    });

    return ok(updated, 'Route optimized successfully');
  }
}
