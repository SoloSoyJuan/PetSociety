import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateServiceDto{
    @IsString()
    @MinLength(3)
    name: string;
    
    @IsString()
    @MinLength(20)
    description: string;

    @IsNumber()
    price: number;
}