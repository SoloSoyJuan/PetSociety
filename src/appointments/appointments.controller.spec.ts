import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

describe('AuthController', () => {
  let appointmentsController: AppointmentsController;
  let appointmentsService: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            createAppointment: jest.fn(),
            findAllAppointment: jest.fn(),
            findAppointmentById: jest.fn(),
            findAppointmentsByStatus: jest.fn(),
            updateAppointment: jest.fn(),
            deleteAppointment: jest.fn(),
          },
        },
      ],
    }).compile();

    appointmentsController = module.get<AppointmentsController>(AppointmentsController);
    appointmentsService = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(appointmentsController).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should call appointmentService.createAppointment with correct parameters', async () => {
      const createAppointmentDto: CreateAppointmentDto = { petId: 1, veterinarianId: 1, appointment_date: new Date("10/10/2024"), reason: 'general check', status: 'scheduled' };
      await appointmentsController.createAppointment(createAppointmentDto);
      expect(appointmentsService.createAppointment).toHaveBeenCalledWith(createAppointmentDto);
    });
  });

  describe('getAllAppointments', () => {
    it('should call appointmentService.findAllAppointments', async () => {
      await appointmentsController.getAllAppointment();
      expect(appointmentsService.findAllAppointment).toHaveBeenCalled();
    });
  });

  describe('getAppointmentById', () => {
    it('should call appointmentService.findAppointmentById with correct id', async () => {
      const id = 1;
      await appointmentsController.getAppointmentById(id);
      expect(appointmentsService.findAppointmentById).toHaveBeenCalledWith(id);
    });
  });

  describe('getAppointmentsByStatus', () => {
    it('should call appointmentsService.findAppointmentsByStatus with correct status', async () => {
      const status = 'scheduled';
      await appointmentsController.getAppointmentsByStatus(status);
      expect(appointmentsService.findAppointmentsByStatus).toHaveBeenCalledWith(status);
    });
  });

  describe('updateAppointment', () => {
    it('should call appointmentsService.updateAppointment with correct id and parameters', async () => {
      const id = 1;
      const updateAppointmentDto: UpdateAppointmentDto = { reason: 'check especifico' };
      await appointmentsController.updateAppointment(id, updateAppointmentDto);
      expect(appointmentsService.updateAppointment).toHaveBeenCalledWith(id, updateAppointmentDto);
    });
  });

  describe('deleteAppointment', () => {
    it('should call appointmentService.deleteAppointment with correct id', async () => {
      const id = 1;
      await appointmentsController.deleteAppointment(id);
      expect(appointmentsService.deleteAppointment).toHaveBeenCalledWith(id);
    });
  });
});
