import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            // Mock de métodos si es necesario
          },
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});