import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    // Por defecto es 'owner'
    return this.authService.createUser({ ...createUserDto, role: 'owner' });
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create-admin')
  @Roles('admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser({ ...createUserDto});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('admin')
  async getAllUsers() {
    return await this.authService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles('admin')
  async getUserById(@Param('id') id: number) {
    return await this.authService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('role/:role')
  @Roles('admin')
  async getUsersByRole(@Param('role') role: string) {
    return await this.authService.findUsersByRole(role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles('admin')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.authService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: number) {
    return await this.authService.deleteUser(id);
  }
}
