import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SponsorsDocument = HydratedDocument<Sponsor>;

@Schema({ versionKey: false, timestamps: false })
export class Sponsor {
  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  addressUrl: string;

  @Prop()
  imageUrl: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  workDays: [{ isOpen: boolean; from: string; to: string }];
}

export const SponsorSchema = SchemaFactory.createForClass(Sponsor);
