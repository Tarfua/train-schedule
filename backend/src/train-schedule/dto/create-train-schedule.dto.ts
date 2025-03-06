import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Max } from 'class-validator';

/**
 * DTO для створення нового запису розкладу потяга
 */
export class CreateTrainScheduleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10, { message: 'Номер потяга не може перевищувати 10 символів' })
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
  @Max(30, { message: 'Номер колії не може перевищувати 30' })
  readonly departurePlatform?: number;

  @IsOptional()
  @IsInt()
  @Max(30, { message: 'Номер колії не може перевищувати 30' })
  readonly arrivalPlatform?: number;
} 