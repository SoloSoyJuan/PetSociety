import { Body, Delete, Get, Param, Patch, Post, Controller, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {

    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Post('register')
    @Roles('admin', 'vet', 'owner')
    createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.createAppointment(createAppointmentDto);
    }

    @Get()
    @Roles('admin', 'vet')
    async getAllAppointment() {
        return await this.appointmentsService.findAllAppointment();
    }

    @Get(':appointment_id')
    @Roles('admin', 'vet', 'owner')
    async getAppointmentById(@Param('appointment_id') appointment_id: number){
        return await this.appointmentsService.findAppointmentById(appointment_id)
    }

    @Get('status/:status')
    @Roles('admin', 'vet', 'owner')
    async getAppointmentsByStatus(@Param('status') status: string) {
        return await this.appointmentsService.findAppointmentsByStatus(status);
    }

    @Patch(':appointment_id')
    @Roles('admin', 'vet')
    async updateAppointment(
        @Param('appointment_id') appointment_id: number,
        @Body() updateAppointmentDto: UpdateAppointmentDto,
    ) {
        return await this.appointmentsService.updateAppointment(appointment_id, updateAppointmentDto);
    }

    @Delete(':appointment_id')
    @Roles('admin')
    async deleteAppointment(@Param('appointment_id') appointment_id: number) {
        return await this.appointmentsService.deleteAppointment(appointment_id);
    }

}
