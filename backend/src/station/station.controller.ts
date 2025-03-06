import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StationService } from './station.service';
import { Station } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Controller('stations')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Get()
  async findAll(): Promise<Station[]> {
    return this.stationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Station | null> {
    return this.stationService.findById(id);
  }

  @Get('search/name')
  async searchByName(@Query('query') query: string): Promise<Station[]> {
    return this.stationService.searchByName(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createStationDto: CreateStationDto): Promise<Station> {
    return this.stationService.create(createStationDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
  ): Promise<Station | null> {
    return this.stationService.update(id, updateStationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.stationService.delete(id);
  }
} 