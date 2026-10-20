import { Module } from '@nestjs/common';
import { DynamicRoutingController } from './dynamic-routing.controller';
import { DynamicRoutingService } from './dynamic-routing.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DynamicRoutingController],
  providers: [DynamicRoutingService],
})
export class DynamicRoutingModule {}
