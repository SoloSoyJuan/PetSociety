import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';

describe('PetsService', () => {
  let service: PetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PetsService,
          useValue: {
            // Mock de métodos si es necesario
          },
        },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});