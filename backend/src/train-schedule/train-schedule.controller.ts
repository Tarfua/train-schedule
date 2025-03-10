import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, UseGuards } from '@nestjs/common';
import { TrainScheduleService } from './train-schedule.service';
import { CreateTrainScheduleDto } from './dto/create-train-schedule.dto';
import { UpdateTrainScheduleDto } from './dto/update-train-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('train-schedules')
export class TrainScheduleController {
  constructor(private readonly trainScheduleService: TrainScheduleService) {}

  @Get()
  findAll() {
    return this.trainScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainScheduleService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTrainScheduleDto: CreateTrainScheduleDto) {
    return this.trainScheduleService.create(createTrainScheduleDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTrainScheduleDto: UpdateTrainScheduleDto) {
    return this.trainScheduleService.update(id, updateTrainScheduleDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.trainScheduleService.remove(id);
  }
} 