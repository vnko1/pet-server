import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AppService } from 'src/common';
import { Sponsor, SponsorsDocument } from '../schema/sponsor.schema';

@Injectable()
export class SponsorsService extends AppService {
  constructor(
    @InjectModel(Sponsor.name) private sponsorModel: Model<SponsorsDocument>,
  ) {
    super();
  }

  getAll() {
    return this.sponsorModel.find().exec();
  }
}
