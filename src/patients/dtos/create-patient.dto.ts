import { IsNotEmpty, IsNumber, IsString, IsPhoneNumber } from "class-validator";

export class CreatePatientDto{
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsPhoneNumber(null)
    @IsNotEmpty()
    phone_number: string;
}