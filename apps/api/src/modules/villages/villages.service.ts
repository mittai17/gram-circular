import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';

@Injectable()
export class VillagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({ search, district }: { search?: string; district?: string }) {
    const villages = await this.prisma.village.findMany({
      where: {
        isActive: true,
        ...(district && { district }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { district: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        _count: { select: { collectionPoints: true } },
      },
      orderBy: { name: 'asc' },
    });
    return ok(villages);
  }

  async findOne(id: string) {
    const village = await this.prisma.village.findUnique({
      where: { id },
      include: {
        collectionPoints: {
          include: { bins: true },
        },
      },
    });
    if (!village) throw new NotFoundException(`Village ${id} not found`);
    return ok(village);
  }

  async getCollectionPoints(villageId: string) {
    const points = await this.prisma.collectionPoint.findMany({
      where: { villageId, isActive: true },
      include: {
        bins: true,
        _count: { select: { wasteBatches: true } },
      },
      orderBy: { name: 'asc' },
    });
    return ok(points);
  }

  async create(data: Record<string, unknown>) {
    const village = await this.prisma.village.create({
      data: data as Parameters<typeof this.prisma.village.create>[0]['data'],
    });
    return ok(village, 'Village created');
  }

  async update(id: string, data: Record<string, unknown>) {
    const village = await this.prisma.village.update({
      where: { id },
      data: data as Parameters<typeof this.prisma.village.update>[0]['data'],
    });
    return ok(village, 'Village updated');
  }
}
