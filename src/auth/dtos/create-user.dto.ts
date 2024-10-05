import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export  class  CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'Password too weak'})
    password: string;

    @IsString()
    @MinLength(3)
    name: string;
}