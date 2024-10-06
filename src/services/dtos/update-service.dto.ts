import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateServiceDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(20)
    description?: string;

    @IsOptional()
    @IsNumber()
    price?: number;
}