import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ArticlesQueryDto } from '../dto/articles-query.dto';
import { ArticlesService } from '../service/articles.service';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}
  @Get()
  getArticles(@Query() query: ArticlesQueryDto) {
    return this.articlesService.findAll(query);
  }
}
