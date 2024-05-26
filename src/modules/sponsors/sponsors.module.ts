import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SponsorsService } from './service/sponsors.service';
import { Sponsor, SponsorSchema } from './schema/sponsor.schema';
import { SponsorsController } from './controller/sponsors.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sponsor.name, schema: SponsorSchema }]),
  ],
  controllers: [SponsorsController],
  providers: [SponsorsService],
})
export class SponsorsModule {}
