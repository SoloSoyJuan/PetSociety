import { IsOptional, IsString, MinLength } from "class-validator";
import { Patient } from "src/patients/entities/patients.entity";

export  class  UpdatePetDto {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    species: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    breed: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    bith_date: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    gender: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    weight: number;

    @IsOptional()
    @IsString()
    @MinLength(3)
    patient: number;
}