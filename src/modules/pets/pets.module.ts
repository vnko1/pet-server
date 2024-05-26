import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { CloudinaryService } from 'src/common';

import { UsersModule } from '../users/users.module';

import { Pet, PetSchema } from './schema/pets.schema';
import { PetsService } from './service/pets.service';
import { PetsController } from './controller/pets.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
    UsersModule,
  ],
  providers: [JwtService, CloudinaryService, PetsService],
  controllers: [PetsController],
})
export class PetsModule {}
