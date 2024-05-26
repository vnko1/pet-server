import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { CloudinaryService } from 'src/common';

import { UsersModule } from '../users/users.module';

import { Notice, NoticeSchema } from './schema/notices.schema';
import { NoticesService } from './service/notices.service';
import { NoticesController } from './controller/notices.controller';
import { NoticesMiddleware } from './middleware/notices.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notice.name, schema: NoticeSchema }]),
    UsersModule,
  ],
  providers: [JwtService, CloudinaryService, NoticesService],
  controllers: [NoticesController],
})
export class NoticesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NoticesMiddleware)
      .forRoutes({ path: 'notices', method: RequestMethod.GET });
  }
}
