import { Module } from '@nestjs/common';
import { TrainScheduleController } from './train-schedule.controller';
import { TrainScheduleService } from './train-schedule.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrainScheduleController],
  providers: [TrainScheduleService],
  exports: [TrainScheduleService],
})
export class TrainScheduleModule {} 