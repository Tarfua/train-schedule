import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Station } from '@prisma/client';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Station[]> {
    return this.prisma.station.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: { id },
    });
  }

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

  async create(createStationDto: CreateStationDto): Promise<Station> {
    return this.prisma.station.create({
      data: createStationDto,
    });
  }

  async update(id: string, updateStationDto: UpdateStationDto): Promise<Station | null> {
    return this.prisma.station.update({
      where: { id },
      data: updateStationDto,
    });
  }

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