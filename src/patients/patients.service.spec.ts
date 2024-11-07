import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  let service: PatientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PatientsService,
          useValue: {
            // Mock de métodos si es necesario
          },
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});