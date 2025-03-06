import { Controller, Get, Param, Query } from '@nestjs/common';
import { StationService } from './station.service';
import { Station } from '@prisma/client';

@Controller('stations')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  /**
   * Отримує всі станції
   */
  @Get()
  async findAll(): Promise<Station[]> {
    return this.stationService.findAll();
  }

  /**
   * Отримує станцію за ID
   */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Station | null> {
    return this.stationService.findById(id);
  }

  /**
   * Пошук станцій за назвою
   */
  @Get('search/name')
  async searchByName(@Query('query') query: string): Promise<Station[]> {
    return this.stationService.searchByName(query);
  }
} 