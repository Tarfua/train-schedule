import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainScheduleDto } from './dto/create-train-schedule.dto';

@Injectable()
export class TrainScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Отримати всі записи розкладу потягів
   */
  async findAll() {
    return this.prisma.trainSchedule.findMany({
      include: {
        departureStation: true,
        arrivalStation: true,
      },
    });
  }

  /**
   * Отримати один запис розкладу за ID
   */
  async findOne(id: string) {
    return this.prisma.trainSchedule.findUnique({
      where: { id },
      include: {
        departureStation: true,
        arrivalStation: true,
      },
    });
  }

  /**
   * Створити новий запис розкладу потяга
   */
  async create(data: CreateTrainScheduleDto) {
    const { departureTime, arrivalTime, ...restData } = data;
    return this.prisma.trainSchedule.create({
      data: {
        ...restData,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
      },
      include: {
        departureStation: true,
        arrivalStation: true,
      },
    });
  }

  /**
   * Видалити запис розкладу потяга
   */
  async remove(id: string) {
    return this.prisma.trainSchedule.delete({
      where: { id },
    });
  }
} 