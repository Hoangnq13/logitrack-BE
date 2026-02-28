import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class VehicleDto {
    @IsString()
    @IsNotEmpty()
    plateNumber: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsOptional()
    color?: string;

    @IsString()
    @IsOptional()
    type?: string;
}

export class CreateDriverDto {
    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @ValidateNested()
    @Type(() => VehicleDto)
    @IsNotEmpty()
    vehicle: VehicleDto;
}
