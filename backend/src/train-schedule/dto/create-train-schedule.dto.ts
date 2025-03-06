import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO для створення нового запису розкладу потяга
 */
export class CreateTrainScheduleDto {
  @IsString()
  @IsNotEmpty()
  readonly trainNumber: string;

  @IsUUID()
  @IsNotEmpty()
  readonly departureStationId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly arrivalStationId: string;

  @IsDateString()
  @IsNotEmpty()
  readonly departureTime: string;

  @IsDateString()
  @IsNotEmpty()
  readonly arrivalTime: string;

  @IsOptional()
  @IsInt()
  readonly departurePlatform?: number;

  @IsOptional()
  @IsInt()
  readonly arrivalPlatform?: number;
} 