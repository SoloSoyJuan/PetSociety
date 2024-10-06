import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {

    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Post('register')
    createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.createAppointment(createAppointmentDto);
    }

    @Get()
    async getAllAppointment() {
        return await this.appointmentsService.findAllAppointment();
    }

    @Get(':appointment_id')
    async getAppointmentById(@Param('appointment_id') appointment_id: number){
        return await this.appointmentsService.findAppointmentById(appointment_id)
    }

    @Get('status/:status')
    async getAppointmentsByStatus(@Param('status') status: string) {
        return await this.appointmentsService.findAppointmentsByStatus(status);
    }

    @Patch(':appointment_id')
    async updateAppointment(
        @Param('appointment_id') appointment_id: number,
        @Body() updateAppointmentDto: UpdateAppointmentDto,
    ) {
        return await this.appointmentsService.updateAppointment(appointment_id, updateAppointmentDto);
    }

    @Delete(':appointment_id')
    async deleteAppointment(@Param('appointment_id') appointment_id: number) {
        return await this.appointmentsService.deleteAppointment(appointment_id);
    }

}
