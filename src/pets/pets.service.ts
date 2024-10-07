import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dtos/create-pet.dto';
import { PatientsService } from 'src/patients/patients.service';
import { UpdatePetDto } from './dtos/update-pet.dto';

@Injectable()
export class PetsService {

    constructor(
        @InjectRepository(Pet) private readonly petRepository: Repository<Pet>,
        private readonly patientsService: PatientsService
    ){}

    async createPet(createPetDto: CreatePetDto) {
        try {
            const pacient = await this.patientsService.findPatientById(createPetDto.patient);


            const newPet = Object.assign({ ...createPetDto, pacient });
            return this.petRepository.save(newPet);
        
        } catch (err) {
            this.handleDBErrors(err);
        }          
    }

    async findAllPets() {
        return await this.petRepository.find();
    }

    async findPetById(id: number){
        const pets = await this.petRepository.find({where:{ id }});

        if(!pets){
            throw new NotFoundException(`Pet with ID ${id} not found`)
        }

        return pets;
    }

    async updatePet(id: number, updatePetDto: UpdatePetDto){

        const pet = await this.petRepository.preload({
            id,
            ...updatePetDto,
        });

        if(!pet){
            throw  new NotFoundException(`Pet with ID ${id} not found`);
        }

        try {
            return await this.petRepository.save(pet)
        } catch (err) {
            this.handleDBErrors(err);
        }
    }

    async deletePet(id: number) {
        
        const pet = await this.findPetById(id);
        await this.petRepository.remove(pet);
        return {message: `Pet with ID ${id} successfully deleted`};

    }


    private  handleDBErrors(error: any) {
        if(error.code === '23505') {
            throw new BadRequestException('Pet already exists');
        }

        throw new InternalServerErrorException('Error creating pet');
    }

}
