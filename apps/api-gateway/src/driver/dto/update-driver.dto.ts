import {
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsString,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleDto } from './create-driver.dto';
import { DriverStatus } from '../schemas/driver.schema';

export class UpdateDriverDto {
  @IsMongoId()
  @IsOptional()
  user?: string;

  @ValidateNested()
  @Type(() => VehicleDto)
  @IsOptional()
  vehicle?: VehicleDto;

  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
