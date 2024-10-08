import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dtos/create-pet.dto';
import { UpdatePetDto } from './dtos/update-pet.dto';
import { NotFoundException } from '@nestjs/common';

const mockPetsService = {
    createPet: jest.fn(),
    findAllPets: jest.fn(),
    findPetById: jest.fn(),
    updatePet: jest.fn(),
    deletePet: jest.fn(),
};

describe('PetsController', () => {
    let controller: PetsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PetsController],
            providers: [
                {
                    provide: PetsService,
                    useValue: mockPetsService,
                },
            ],
        }).compile();

        controller = module.get<PetsController>(PetsController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPet', () => {
        it('should create a pet', async () => {
            const createPetDto: CreatePetDto = {
                name: 'Fido',
                species: 'Dog',
                breed: 'Labrador',
                bith_date: '2020-01-01',
                gender: 'Male',
                weight: 30,
                patient: 1,
            };

            mockPetsService.createPet.mockResolvedValue(createPetDto);

            expect(await controller.createUser(createPetDto)).toEqual(createPetDto);
        });
    });

    describe('getAllPets', () => {
        it('should return an array of pets', async () => {
            const result = [{ id: 1, name: 'Fido' }];
            mockPetsService.findAllPets.mockResolvedValue(result);

            expect(await controller.getAllPets()).toBe(result);
        });
    });

    describe('getPetById', () => {
        it('should return a pet by ID', async () => {
            const result = { id: 1, name: 'Fido' };
            mockPetsService.findPetById.mockResolvedValue(result);

            expect(await controller.getUserById(1)).toBe(result);
        });

        it('should throw NotFoundException if pet not found', async () => {
            mockPetsService.findPetById.mockRejectedValue(new NotFoundException('Pet not found'));

            await expect(controller.getUserById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updatePet', () => {
        it('should update a pet', async () => {
            const updatePetDto: UpdatePetDto = { name: 'Fido' };
            const updatedPet = { id: 1, name: 'Fido' };
            mockPetsService.updatePet.mockResolvedValue(updatedPet);

            expect(await controller.updatePet(1, updatePetDto)).toEqual(updatedPet);
        });
    });

    describe('deletePet', () => {
        it('should delete a pet', async () => {
            const result = { message: 'Pet with ID 1 successfully deleted' };
            mockPetsService.deletePet.mockResolvedValue(result);

            expect(await controller.deletePet(1)).toEqual(result);
        });
    });
});
