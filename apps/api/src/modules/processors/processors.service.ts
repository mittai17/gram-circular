import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';

@Injectable()
export class ProcessorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({ material, minKg }: { material?: string; minKg?: number }) {
    const processors = await this.prisma.processor.findMany({
      where: {
        isActive: true,
        ...(material && { acceptedMaterials: { has: material } }),
        ...(minKg !== undefined && { maxQuantityKg: { gte: minKg } }),
      },
      orderBy: { name: 'asc' },
    });
    return ok(processors);
  }

  async findOne(id: string) {
    const processor = await this.prisma.processor.findUnique({
      where: { id },
    });
    if (!processor) throw new NotFoundException(`Processor ${id} not found`);
    return ok(processor);
  }
}
