import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticlesDocument = HydratedDocument<Article>;

@Schema({ versionKey: false, timestamps: false })
export class Article {
  @Prop()
  imgUrl: string;

  @Prop()
  title: string;

  @Prop()
  text: string;

  @Prop()
  date: Date;

  @Prop()
  url: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
