import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ArticlesModule,
  AuthModule,
  NoticesModule,
  PetsModule,
  SponsorsModule,
  UsersModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_ACCESS_URI),
    ArticlesModule,
    SponsorsModule,
    UsersModule,
    PetsModule,
    NoticesModule,
    AuthModule,
  ],
})
export class AppModule {}
