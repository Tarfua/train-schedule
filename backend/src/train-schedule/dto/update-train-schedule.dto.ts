import { IsDateString, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO для оновлення запису розкладу потяга
 */
export class UpdateTrainScheduleDto {
  @IsString()
  @IsOptional()
  readonly trainNumber?: string;

  @IsUUID()
  @IsOptional()
  readonly departureStationId?: string;

  @IsUUID()
  @IsOptional()
  readonly arrivalStationId?: string;

  @IsDateString()
  @IsOptional()
  readonly departureTime?: string;

  @IsDateString()
  @IsOptional()
  readonly arrivalTime?: string;

  @IsOptional()
  @IsInt()
  readonly departurePlatform?: number;

  @IsOptional()
  @IsInt()
  readonly arrivalPlatform?: number;
} 