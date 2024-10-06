import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.createUser(createUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.loginUser(loginUserDto);
    }

    @Get()
    async getAllUsers() {
        return await this.authService.findAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: number){
        return await this.authService.findUserById(id)
    }

    @Get('role/:role')
    async getUsersByRole(@Param('role') role: string) {
        return await this.authService.findUsersByRole(role);
    }

    @Patch(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.authService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return await this.authService.deleteUser(id);
    }

}
