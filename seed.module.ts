import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './src/auth/entities/user.entity';
import { SeedService } from './src/seed/seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeedService],
})
export class SeedModule implements OnApplicationBootstrap {
  constructor(private seedService: SeedService) {}

  async onApplicationBootstrap() {
    await this.seedService.seed();
  }
}