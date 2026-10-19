import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ok } from '../../common/response';

@Injectable()
export class CitizenService {
  constructor(private readonly prisma: PrismaService) {}

  async getReports({
    villageId,
    status,
  }: {
    villageId?: string;
    status?: string;
  }) {
    const reports = await this.prisma.citizenReport.findMany({
      where: {
        ...(villageId && { villageId }),
        ...(status && { status }),
      },
      include: { village: true, collectionPoint: true },
      orderBy: { createdAt: 'desc' },
    });
    return ok(reports);
  }

  async createReport(data: Record<string, unknown>) {
    const report = await this.prisma.citizenReport.create({
      data: data as Parameters<
        typeof this.prisma.citizenReport.create
      >[0]['data'],
      include: { village: true },
    });
    return ok(report, 'Report submitted');
  }

  async updateReportStatus(id: string, data: Record<string, unknown>) {
    const report = await this.prisma.citizenReport.update({
      where: { id },
      data: {
        status: data.status as string,
        resolvedAt: data.status === 'RESOLVED' ? new Date() : undefined,
      },
    });
    return ok(report, 'Report updated');
  }

  async getSchedules(villageId?: string) {
    const schedules = await this.prisma.collectionSchedule.findMany({
      where: { isActive: true, ...(villageId && { villageId }) },
      include: { village: true },
      orderBy: [{ dayOfWeek: 'asc' }],
    });
    return ok(schedules);
  }
}
