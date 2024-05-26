import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Article, ArticleSchema } from './schema/articles.schema';
import { ArticlesController } from './controller/articles.controller';
import { ArticlesService } from './service/articles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
