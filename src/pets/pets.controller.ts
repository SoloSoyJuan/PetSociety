import { Body, Delete, Get, Param, Patch, Post, Controller, UseGuards } from '@nestjs/common';
import { CreatePetDto } from './dtos/create-pet.dto';
import { PetsService } from './pets.service';
import { UpdatePetDto } from './dtos/update-pet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pets')
export class PetsController {

    constructor(private readonly petsService:PetsService){}

    
    @Post('register')
    @Roles('admin', 'vet', 'owner')
    createUser(@Body() createPetDto: CreatePetDto) {
        return this.petsService.createPet(createPetDto);
    }

    @Get()
    @Roles('admin', 'vet')
    async getAllPets() {
        return await this.petsService.findAllPets();
    }

    @Get(':id')
    @Roles('admin', 'vet', 'owner')
    async getUserById(@Param('id') id: number){
        return await this.petsService.findPetById(id)
    }

    @Patch(':id')
    @Roles('admin', 'vet', 'owner')
    async updatePet(
        @Param('id') id: number,
        @Body() updatePetDto: UpdatePetDto,
    ) {
        return await this.petsService.updatePet(id, updatePetDto);
    }

    @Delete(':id')
    @Roles('admin')
    async deletePet(@Param('id') id: number) {
        return await this.petsService.deletePet(id);
    }
}
