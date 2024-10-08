import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointments.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

const mockAppointmentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
  merge: jest.fn(),
};

describe('AppointmensService', () => {
  let service: AppointmentsService;
  let appointmentRepository: Repository<Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepository = module.get<Repository<Appointment>>(getRepositoryToken(Appointment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should create and return an appointment', async () => {
      const createAppointmentDto = { petId: 1, veterinarianId: 1, appointment_date: new Date("10/10/2024"), reason: 'general check', status: 'scheduled' };
      const savedAppointment = { ...createAppointmentDto, appointment_id: 1 };

      mockAppointmentRepository.create.mockReturnValue(savedAppointment as any); // se asegura de que el tipo coincide
      mockAppointmentRepository.save.mockResolvedValue(savedAppointment);

      const result = await service.createAppointment(createAppointmentDto);
      expect(result).toEqual(savedAppointment);
      expect(mockAppointmentRepository.create).toHaveBeenCalledWith(createAppointmentDto);
      expect(mockAppointmentRepository.save).toHaveBeenCalledWith(savedAppointment);
    });

    it('should handle database errors', async () => {
      const createAppointmentDto: CreateAppointmentDto = { petId: 1, veterinarianId: 1, appointment_date: new Date("10/10/2024"), reason: 'general check', status: 'scheduled' };
      mockAppointmentRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.createAppointment(createAppointmentDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllAppointment', () => {
    it('should return all appointments', async () => {
      const appointments = [{ appointment_id: 1 }, { appointment_id: 2 }];
      mockAppointmentRepository.find.mockResolvedValue(appointments as any);

      const result = await service.findAllAppointment();
      expect(result).toEqual(appointments);
      expect(mockAppointmentRepository.find).toHaveBeenCalled();
    });
  });

  describe('findAppointmentById', () => {
    it('should return an appointment by id', async () => {
      const appointment = { appointment_id: 1, status: 'pending' };
      mockAppointmentRepository.findOne.mockResolvedValue(appointment as any);

      const result = await service.findAppointmentById(1);
      expect(result).toEqual(appointment);
      expect(mockAppointmentRepository.findOne).toHaveBeenCalledWith({ where: { appointment_id: 1 } });
    });

    it('should throw a NotFoundException if appointment not found', async () => {
      mockAppointmentRepository.findOne.mockResolvedValue(null);

      await expect(service.findAppointmentById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAppointmentsByStatus', () => {
    it('should return appointments by status', async () => {
      const appointments = [{ appointment_id: 1, status: 'pending' }];
      mockAppointmentRepository.find.mockResolvedValue(appointments as any);

      const result = await service.findAppointmentsByStatus('pending');
      expect(result).toEqual(appointments);
      expect(mockAppointmentRepository.find).toHaveBeenCalledWith({ where: { status: 'pending' } });
    });

    it('should throw a NotFoundException if no appointments found by status', async () => {
      mockAppointmentRepository.find.mockResolvedValue([]);

      await expect(service.findAppointmentsByStatus('pending')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAppointment', () => {
    it('should update and return the updated appointment', async () => {
      const appointment = { appointment_id: 1, status: 'pending' };
      const updateAppointmentDto: UpdateAppointmentDto = { status: 'completed' };
      const updatedAppointment = { ...appointment, ...updateAppointmentDto };

      mockAppointmentRepository.findOne.mockResolvedValue(appointment as any);
      mockAppointmentRepository.merge.mockReturnValue(updatedAppointment as any);
      mockAppointmentRepository.save.mockResolvedValue(updatedAppointment);

      const result = await service.updateAppointment(1, updateAppointmentDto);
      expect(result).toEqual(updatedAppointment);
      expect(mockAppointmentRepository.merge).toHaveBeenCalledWith(appointment, updateAppointmentDto);
      expect(mockAppointmentRepository.save).toHaveBeenCalledWith(updatedAppointment);
    });

    it('should throw a NotFoundException if appointment not found', async () => {
      mockAppointmentRepository.findOne.mockResolvedValue(null);

      await expect(service.updateAppointment(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAppointment', () => {
    it('should delete an appointment', async () => {
      const appointment = { appointment_id: 1 };
      mockAppointmentRepository.findOne.mockResolvedValue(appointment as any);
      mockAppointmentRepository.remove.mockResolvedValue(appointment as any);

      const result = await service.deleteAppointment(1);
      expect(result).toEqual({ message: `Appointment with ID 1 successfully deleted` });
      expect(mockAppointmentRepository.remove).toHaveBeenCalledWith(appointment);
    });

    it('should throw a NotFoundException if appointment not found', async () => {
      mockAppointmentRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteAppointment(1)).rejects.toThrow(NotFoundException);
    });
  });

});
