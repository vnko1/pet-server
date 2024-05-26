import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { CloudinaryService } from 'src/common';

import { User, UserSchema } from './schema/users.schema';
import { UsersService } from './service/users.service';
import { UserController } from './controller/users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, JwtService, CloudinaryService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
