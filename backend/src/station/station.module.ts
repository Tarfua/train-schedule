import { Module } from '@nestjs/common';
import { StationController } from './station.controller';
import { StationService } from './station.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService],
})
export class StationModule {} 