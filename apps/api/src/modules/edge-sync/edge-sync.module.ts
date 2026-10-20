import { Module } from '@nestjs/common';
import { EdgeSyncController } from './edge-sync.controller';
import { EdgeSyncService } from './edge-sync.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EdgeSyncController],
  providers: [EdgeSyncService],
})
export class EdgeSyncModule {}
