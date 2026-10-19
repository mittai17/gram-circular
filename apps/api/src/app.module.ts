import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { VillagesModule } from './modules/villages/villages.module';
import { BatchesModule } from './modules/batches/batches.module';
import { BinsModule } from './modules/bins/bins.module';
import { ProcessorsModule } from './modules/processors/processors.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CitizenModule } from './modules/citizen/citizen.module';
import { SyncModule } from './modules/sync/sync.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { RoutesModule } from './modules/routes/routes.module';
import { StorageModule } from './modules/storage/storage.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { InspectionModule } from './modules/inspection/inspection.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    VillagesModule,
    BatchesModule,
    BinsModule,
    ProcessorsModule,
    AnalyticsModule,
    CitizenModule,
    SyncModule,
    VehiclesModule,
    RoutesModule,
    StorageModule,
    DispatchModule,
    InspectionModule,
  ],
})
export class AppModule {}
