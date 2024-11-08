import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointments.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { AuthService } from 'src/auth/auth.service';
import { PetsService } from 'src/pets/pets.service';

@Injectable()
export class AppointmentsService {

    constructor(
        @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
        private readonly authService: AuthService,
        private readonly petService: PetsService){}

        async createAppointment(createAppointmentDto: CreateAppointmentDto) {
            try {
                // Espera a que se resuelvan ambas promesas
                const veterinarian = await this.authService.findUserById(createAppointmentDto.veterinarianId);
                const thepet = await this.petService.findPetById(createAppointmentDto.petId);
                const pet = thepet[0];
        
                // Crea la cita combinando los datos
                const appointmentData = { ...createAppointmentDto, veterinarian, pet };
                const appointment = this.appointmentRepository.create(appointmentData);
        
                // Guarda y retorna la cita
                return await this.appointmentRepository.save(appointment);
            } catch (e) {
                this.handleDBErrors(e);
            }
        }

    async findAllAppointment() {
        return await this.appointmentRepository.find({relations: ['veterinarian', 'pet']});
    }

    async findAppointmentById(appointment_id: number) {
        const appointment = await this.appointmentRepository.findOne({ where: { appointment_id }, relations: ['veterinarian', 'pet'] });
        if (!appointment) {
            throw new NotFoundException(`Service with ID ${appointment_id} not found`);
        }
        return appointment;
    }

    async findAppointmentsByStatus(status: string) {
        const appointments = await this.appointmentRepository.find({ where: { status }, relations: ['veterinarian', 'pet'] });
    
        if (!appointments.length) {
          throw new NotFoundException(`No appointments found with the status '${status}'`);
        }
    
        return appointments;
    }

    async updateAppointment(appointment_id: number, updateAppointmentDto: UpdateAppointmentDto) {
        const appointment = await this.appointmentRepository.findOne({ where: { appointment_id } });
     
        if (!appointment) {
           throw new NotFoundException(`Appointment with ID ${appointment_id} not found`);
        }
     
        const updatedAppointment = this.appointmentRepository.merge(appointment, updateAppointmentDto);
     
        try {
           return await this.appointmentRepository.save(updatedAppointment);
        } catch (error) {
           this.handleDBErrors(error);
        }
     }

    async deleteAppointment(appointment_id: number) {
        const appointment = await this.findAppointmentById(appointment_id);
        await this.appointmentRepository.remove(appointment);
        return { message: `Appointment with ID ${appointment_id} successfully deleted` };
    }

    private  handleDBErrors(error: any) {
        if(error.code === '23505') {
            throw new BadRequestException('Appointment already exists');
        }

        throw new InternalServerErrorException('Error creating appointment');
    }
}
