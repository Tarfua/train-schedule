import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для створення станції
 */
export class CreateStationDto {
  /**
   * Назва станції
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * Назва міста
   */
  @IsNotEmpty()
  @IsString()
  city: string;
} 