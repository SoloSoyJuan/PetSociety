import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordsService } from './medical_records.service';

describe('MedicalRecordsService', () => {
  let service: MedicalRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MedicalRecordsService,
          useValue: {
            // Mock de métodos si es necesario
          },
        },
      ],
    }).compile();

    service = module.get<MedicalRecordsService>(MedicalRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});