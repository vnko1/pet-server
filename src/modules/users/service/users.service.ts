import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiOptions } from 'cloudinary';

import { AppService, CloudinaryService } from 'src/common';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { User, UserDocument } from '../schema/users.schema';

import { UpdateOptions } from './users.type';

@Injectable()
export class UsersService extends AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
  ) {
    super();
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    { projection = '', newDoc = true }: Partial<UpdateOptions> = {},
  ) {
    const { file, ...userData } = updateUserDto;
    const user: Partial<User> = { ...userData };
    if (file) {
      const res = await this.saveAvatar(file.path, userId);
      user.avatarUrl = res.eager[0].secure_url;
    }
    return this.userModel
      .findByIdAndUpdate(userId, user, {
        new: newDoc,
        projection,
      })
      .select('-password');
  }

  createUser(newUser: CreateUserDto) {
    return this.userModel.create(newUser);
  }

  findUser(query: { [key: string]: string }) {
    return this.userModel.findOne(query).exec();
  }

  findUserById(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  private getUploadOptions(id: string): UploadApiOptions {
    return {
      resource_type: 'image',
      folder: 'pets/avatar',
      public_id: id,
      eager: 'f_auto',
      overwrite: true,
    };
  }
  private async saveAvatar(filePath: string, userId: string) {
    return await this.cloudinaryService.upload(
      filePath,
      this.getUploadOptions(userId),
    );
  }
}
