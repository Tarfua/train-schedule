import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Station } from '@prisma/client';

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
} 