import {
  Controller,
  Post,
  UseFilters,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Delete,
  Param,
  HttpCode,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { isValidObjectId } from 'mongoose';

import { AuthGuard, MongooseExceptionFilter } from 'src/common';
import { multerStorageConfig } from 'src/utils';
import { IUserId } from 'src/types';

import { PetsService } from '../service/pets.service';
import { CreatePetDto, createPetSchema } from '../dto/createPet.dto';

@ApiTags('pets')
@Controller('pets')
@UseGuards(AuthGuard)
@UseFilters(MongooseExceptionFilter)
export class PetsController {
  constructor(private petService: PetsService) {}

  @Get()
  async getUserPets(@Req() req: IUserId) {
    return await this.petService.getPets(req.user.id);
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(multerStorageConfig),
    }),
  )
  async createPet(
    @Req() req: IUserId,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPetDto: CreatePetDto,
  ) {
    const parsedSchema = createPetSchema.safeParse({
      ...createPetDto,
      file,
    });

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);

    return await this.petService.createPet(req.user.id, parsedSchema.data);
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePet(@Param('id') id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException();
    return await this.petService.deletePet(id);
  }
}
