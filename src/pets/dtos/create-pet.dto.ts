import { IsEmail, IsOptional, IsString, Matches, MinLength, IsNotEmpty } from "class-validator";
import { Patient } from "src/patients/entities/patients.entity";

export  class  CreatePetDto {
    @IsString()
    name: string;

    @IsString()
    @MinLength(3)
    species: string;

    @IsString()
    @MinLength(3)
    breed: string;

    @IsString()
    @MinLength(3)
    bith_date: string;

    @IsString()
    @MinLength(3)
    gender: string;

    @IsString()
    @MinLength(3)
    weight: number;

    @IsNotEmpty()
    patient: number;
}