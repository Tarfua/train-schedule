import { IsDateString, IsInt, IsOptional, IsString, IsUUID, MaxLength, Max } from 'class-validator';

export class UpdateTrainScheduleDto {
  @IsString()
  @IsOptional()
  @MaxLength(10, { message: 'Номер потяга не може перевищувати 10 символів' })
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
  @Max(30, { message: 'Номер колії не може перевищувати 30' })
  readonly departurePlatform?: number;

  @IsOptional()
  @IsInt()
  @Max(30, { message: 'Номер колії не може перевищувати 30' })
  readonly arrivalPlatform?: number;
} 