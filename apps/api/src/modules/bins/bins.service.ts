import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';

@Injectable()
export class BinsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    collectionPointId,
    fillLevel,
  }: {
    collectionPointId?: string;
    fillLevel?: string;
  }) {
    const bins = await this.prisma.bin.findMany({
      where: {
        isActive: true,
        ...(collectionPointId && { collectionPointId }),
        ...(fillLevel && { fillLevel }),
      },
      include: { collectionPoint: { include: { village: true } } },
      orderBy: { fillPercent: 'desc' },
    });
    return ok(bins);
  }

  async updateReading(
    id: string,
    data: { fillPercent: number; fillLevel: string },
  ) {
    const bin = await this.prisma.bin.update({
      where: { id },
      data: {
        fillPercent: data.fillPercent,
        fillLevel: data.fillLevel,
        lastReadingAt: new Date(),
      },
    });
    return ok(bin, 'Reading updated');
  }
}
