import { Controller, Get, Post, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { TrainScheduleService } from './train-schedule.service';
import { CreateTrainScheduleDto } from './dto/create-train-schedule.dto';

@Controller('train-schedules')
export class TrainScheduleController {
  constructor(private readonly trainScheduleService: TrainScheduleService) {}

  /**
   * Отримати всі записи розкладу потягів
   */
  @Get()
  findAll() {
    return this.trainScheduleService.findAll();
  }

  /**
   * Отримати запис розкладу за ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainScheduleService.findOne(id);
  }

  /**
   * Створити новий запис розкладу
   */
  @Post()
  create(@Body() createTrainScheduleDto: CreateTrainScheduleDto) {
    return this.trainScheduleService.create(createTrainScheduleDto);
  }

  /**
   * Видалити запис розкладу
   */
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.trainScheduleService.remove(id);
  }

  /**
   * Тестовий метод для перевірки роботи API
   */
  @Get('admin/test')
  test() {
    return { status: 'OK', message: 'Модуль розкладу потягів працює' };
  }
} 