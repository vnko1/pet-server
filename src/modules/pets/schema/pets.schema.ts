import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from 'src/modules/users/schema/users.schema';

export type PetsDocument = mongoose.HydratedDocument<Pet>;

@Schema({ versionKey: false, timestamps: false })
export class Pet {
  @Prop({ minlength: 2, maxlength: 15, required: true })
  name: string;

  @Prop({ min: new Date('2000-01-01'), max: new Date() })
  date: Date;

  @Prop({ minlength: 2, maxlength: 16, required: true })
  type: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ maxlength: 120, default: '' })
  comments: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
