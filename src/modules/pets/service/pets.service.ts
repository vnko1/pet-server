import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiOptions } from 'cloudinary';
import { randomUUID } from 'crypto';

import { AppService, CloudinaryService } from 'src/common';

import { Pet, PetsDocument } from '../schema/pets.schema';
import { CreatePetDto } from '../dto/createPet.dto';

@Injectable()
export class PetsService extends AppService {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<PetsDocument>,
    private cloudinaryService: CloudinaryService,
  ) {
    super();
  }

  private getCloudinaryConfig(id: string): UploadApiOptions {
    return {
      overwrite: false,
      resource_type: 'image',
      folder: `pets/pets/${id}`,
      public_id: randomUUID(),
      eager: 'f_auto',
    };
  }

  async getPets(owner: string) {
    return this.petModel.find({ owner });
  }

  async createPet(userId: string, createPetDto: CreatePetDto) {
    const { file, ...petData } = createPetDto;
    const pet: any = { ...petData, owner: userId };

    if (file) {
      const res = await this.cloudinaryService.upload(
        file.path,
        this.getCloudinaryConfig(userId),
      );

      pet.imageUrl = res.eager[0].secure_url;
    }
    return this.petModel.create(pet);
  }

  async deletePet(id: string) {
    const res: Pet = await this.petModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException(`Pet with id: ${id} not exists`);
    this.cloudinaryService.delete(res.imageUrl);
  }
}
