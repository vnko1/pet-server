import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schema/users.schema';

export type NoticeDocument = mongoose.HydratedDocument<Notice>;

@Schema({ versionKey: false, timestamps: false })
export class Notice {
  @Prop({ minlength: 2, maxlength: 16, required: true })
  name: string;

  @Prop({ required: true, enum: ['sell', 'lost-found', 'in-good-hands'] })
  category: string;

  @Prop({ min: '2000-01-01', max: new Date() })
  date: Date;

  @Prop({ required: true, minlength: 2, maxlength: 16 })
  type: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ maxlength: 120, default: '' })
  comments: string;

  @Prop({ minlength: 3, maxlength: 30 })
  title: string;

  @Prop({ required: true, enum: ['male', 'female'] })
  sex: string;

  @Prop({ minlength: 2 })
  location: string;

  @Prop({ min: 1 })
  price: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  favorites: [User];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
