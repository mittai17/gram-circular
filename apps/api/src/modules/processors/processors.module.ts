import { Module } from '@nestjs/common';
import { ProcessorsController } from './processors.controller';
import { ProcessorsService } from './processors.service';

@Module({
  controllers: [ProcessorsController],
  providers: [ProcessorsService],
})
export class ProcessorsModule {}
