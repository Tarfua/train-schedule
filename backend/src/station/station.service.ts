import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Station } from '@prisma/client';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Отримує всі станції
   */
  async findAll(): Promise<Station[]> {
    return this.prisma.station.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Отримує станцію за ID
   */
  async findById(id: string): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: { id },
    });
  }

  /**
   * Пошук станцій за назвою
   */
  async searchByName(name: string): Promise<Station[]> {
    return this.prisma.station.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
      take: 10,
    });
  }

  /**
   * Створює нову станцію
   */
  async create(createStationDto: CreateStationDto): Promise<Station> {
    return this.prisma.station.create({
      data: createStationDto,
    });
  }

  /**
   * Оновлює існуючу станцію
   */
  async update(id: string, updateStationDto: UpdateStationDto): Promise<Station | null> {
    return this.prisma.station.update({
      where: { id },
      data: updateStationDto,
    });
  }

  /**
   * Видаляє станцію
   */
  async delete(id: string): Promise<void> {
    // Перевіряємо, чи використовується станція в розкладі потягів
    const trainSchedulesWithStation = await this.prisma.trainSchedule.count({
      where: {
        OR: [
          { departureStationId: id },
          { arrivalStationId: id }
        ]
      }
    });

    if (trainSchedulesWithStation > 0) {
      throw new BadRequestException('Неможливо видалити станцію, яка використовується в розкладі потягів. Спочатку видаліть пов\'язані розклади.');
    }

    await this.prisma.station.delete({
      where: { id },
    });
  }
} 