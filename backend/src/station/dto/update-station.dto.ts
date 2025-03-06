import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateStationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city?: string;
} 