import { Body, Delete, Get, Param, Patch, Post, Controller, UseGuards } from '@nestjs/common';
import { CreatePetDto } from './dtos/create-pet.dto';
import { PetsService } from './pets.service';
import { UpdatePetDto } from './dtos/update-pet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pets')
export class PetsController {

    constructor(private readonly petsService:PetsService){}

    
    @Post('register')
    createUser(@Body() createPetDto: CreatePetDto) {
        return this.petsService.createPet(createPetDto);
    }

    @Get()
    async getAllPets() {
        return await this.petsService.findAllPets();
    }

    @Get(':id')
    async getUserById(@Param('id') id: number){
        return await this.petsService.findPetById(id)
    }

    @Patch(':id')
    async updatePet(
        @Param('id') id: number,
        @Body() updatePetDto: UpdatePetDto,
    ) {
        return await this.petsService.updatePet(id, updatePetDto);
    }

    @Delete(':id')
    async deletePet(@Param('id') id: number) {
        return await this.petsService.deletePet(id);
    }
}
