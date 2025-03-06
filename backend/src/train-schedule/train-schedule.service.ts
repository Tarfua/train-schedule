import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainScheduleDto } from './dto/create-train-schedule.dto';
import { UpdateTrainScheduleDto } from './dto/update-train-schedule.dto';

@Injectable()
export class TrainScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.trainSchedule.findMany({
      include: {
        departureStation: true,
        arrivalStation: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.trainSchedule.findUnique({
      where: { id },
      include: {
        departureStation: true,
        arrivalStation: true,
      },
    });
  }

  private validateDateTime(departureTime: Date, arrivalTime: Date): void {
    if (departureTime >= arrivalTime) {
      throw new BadRequestException('Час відправлення має бути раніше часу прибуття');
    }
  }

  async create(data: CreateTrainScheduleDto) {
    // Перевірка, що станція відправлення та прибуття різні
    if (data.departureStationId === data.arrivalStationId) {
      throw new BadRequestException('Станція відправлення та прибуття не можуть бути однаковими');
    }

    const { departureTime, arrivalTime, ...restData } = data;
    const departureDateObj = new Date(departureTime);
    const arrivalDateObj = new Date(arrivalTime);

    // Перевірка, що час відправлення раніше часу прибуття
    this.validateDateTime(departureDateObj, arrivalDateObj);

    return this.prisma.trainSchedule.create({
      data: {
        ...restData,
        departureTime: departureDateObj,
        arrivalTime: arrivalDateObj,
      },
      include: {
        departureStation: true,
        arrivalStation: true,
      },
    });
  }

  async update(id: string, data: UpdateTrainScheduleDto) {
    // Якщо оновлюємо станції, перевіряємо чи вони різні
    if (data.departureStationId && data.arrivalStationId && 
        data.departureStationId === data.arrivalStationId) {
      throw new BadRequestException('Станція відправлення та прибуття не можуть бути однаковими');
    }
    
    // Якщо змінюємо тільки одну станцію, треба перевірити з існуючою
    if (data.departureStationId || data.arrivalStationId) {
      const existingSchedule = await this.prisma.trainSchedule.findUnique({
        where: { id },
        select: { departureStationId: true, arrivalStationId: true }
      });
      
      if (existingSchedule) {
        const newDepartureId = data.departureStationId || existingSchedule.departureStationId;
        const newArrivalId = data.arrivalStationId || existingSchedule.arrivalStationId;
        
        if (newDepartureId === newArrivalId) {
          throw new BadRequestException('Станція відправлення та прибуття не можуть бути однаковими');
        }
      }
    }

    // Перевірка часу відправлення та прибуття
    if (data.departureTime || data.arrivalTime) {
      const existingSchedule = await this.prisma.trainSchedule.findUnique({
        where: { id },
        select: { departureTime: true, arrivalTime: true }
      });
      
      if (existingSchedule) {
        const newDepartureTime = data.departureTime 
          ? new Date(data.departureTime) 
          : existingSchedule.departureTime;
        
        const newArrivalTime = data.arrivalTime 
          ? new Date(data.arrivalTime) 
          : existingSchedule.arrivalTime;
        
        // Перевірка, що час відправлення раніше часу прибуття
        this.validateDateTime(newDepartureTime, newArrivalTime);
      }
    }

    const updateData: any = { ...data };
    
    // Перетворюємо рядки дати/часу в об'єкти Date
    if (data.departureTime) {
      updateData.departureTime = new Date(data.departureTime);
    }
    
    if (data.arrivalTime) {
      updateData.arrivalTime = new Date(data.arrivalTime);
    }
    
    return this.prisma.trainSchedule.update({
      where: { id },
      data: updateData,
      include: {
        departureStation: true,
        arrivalStation: true,
      },
    });
  }
  
  async remove(id: string) {
    return this.prisma.trainSchedule.delete({
      where: { id },
    });
  }
} 