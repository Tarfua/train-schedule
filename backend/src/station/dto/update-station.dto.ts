import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO для оновлення станції
 */
export class UpdateStationDto {
  /**
   * Назва станції
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  /**
   * Назва міста
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city?: string;
} 