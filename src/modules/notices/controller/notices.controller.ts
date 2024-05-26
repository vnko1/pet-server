import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { isValidObjectId } from 'mongoose';

import { AuthGuard, MongooseExceptionFilter } from 'src/common';
import { IUserId } from 'src/types';
import { multerStorageConfig } from 'src/utils';

import { CreateNoticeDto, createNoticeSchema } from '../dto/createNotice.dto';
import { NoticesService } from '../service/notices.service';
import { NoticesQueryDto } from '../dto/noticesQueryDto.dto';

@ApiTags('notices')
@Controller('notices')
@UseFilters(MongooseExceptionFilter)
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Get()
  async getAllNotices(
    @Req() req: Partial<IUserId>,
    @Query() query: NoticesQueryDto,
  ) {
    return await this.noticesService.getNotices(req?.user?.id, query);
  }

  @Get('notice/:id')
  async getNotice(@Param('id') id: string) {
    return await this.noticesService.getNotice(id);
  }

  @UseGuards(AuthGuard)
  @Post('favorites/:id')
  async addToFavorites(@Req() req: IUserId, @Param('id') id: string) {
    return await this.noticesService.addToFavorite(id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('favorites')
  async getFavorites(@Req() req: IUserId, @Query() query: NoticesQueryDto) {
    return await this.noticesService.getNotices(req.user.id, {
      ...query,
      category: 'favorites',
    });
  }

  @UseGuards(AuthGuard)
  @Delete('favorites/:id')
  async removeFromFavorites(@Req() req: IUserId, @Param('id') id: string) {
    return await this.noticesService.removeFromFavorite(id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(multerStorageConfig),
    }),
  )
  @HttpCode(201)
  async addNotice(
    @Req() req: IUserId,
    @UploadedFile() file: Express.Multer.File,
    @Body() createNoticeDto: CreateNoticeDto,
  ) {
    const parsedSchema = createNoticeSchema.safeParse({
      ...createNoticeDto,
      file,
    });

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);

    return await this.noticesService.addNotice(req.user.id, parsedSchema.data);
  }

  @UseGuards(AuthGuard)
  @Get('owner')
  async getUserNotices(@Req() req: IUserId, query: NoticesQueryDto) {
    return await this.noticesService.getNotices(req.user.id, {
      ...query,
      category: 'owner',
    });
  }

  @UseGuards(AuthGuard)
  @Delete('notice/:id')
  async deleteNotice(@Param('id') id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException();
    return await this.noticesService.deleteNotice(id);
  }
}
