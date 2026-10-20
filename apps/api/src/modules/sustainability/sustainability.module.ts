import { Module } from '@nestjs/common';
import { SustainabilityController } from './sustainability.controller';
import { SustainabilityService } from './sustainability.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SustainabilityController],
  providers: [SustainabilityService],
})
export class SustainabilityModule {}
