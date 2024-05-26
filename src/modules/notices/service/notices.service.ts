import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { UploadApiOptions } from 'cloudinary';

import { AppService, CloudinaryService, QueryDto } from 'src/common';

import { Notice, NoticeDocument } from '../schema/notices.schema';
import { CreateNoticeDto } from '../dto/createNotice.dto';
import { NoticesQueryDto } from '../dto/noticesQueryDto.dto';

@Injectable()
export class NoticesService extends AppService {
  private limit = 6;

  constructor(
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
    private cloudinaryService: CloudinaryService,
  ) {
    super();
  }

  private getCloudinaryConfig(id: string): UploadApiOptions {
    return {
      overwrite: false,
      resource_type: 'image',
      folder: `pets/notices/${id}`,
      public_id: randomUUID(),
      eager: 'f_auto',
    };
  }

  private getNoticesSearchPattern(
    { query, sex, category }: NoticesQueryDto,
    userId?: string,
  ) {
    const queryParams: QueryDto = this.getSearchQueryPattern(query);

    if (sex) queryParams.sex = sex.split(',');

    if (category === 'owner' || category === 'favorites') {
      if (category === 'favorites' && userId) {
        queryParams[category] = { $elemMatch: { $eq: userId } };
      } else if (userId) {
        queryParams.owner = userId;
      }
    } else queryParams.category = category;

    return queryParams;
  }

  async getNotices(userId: string, query: NoticesQueryDto) {
    const queryPattern = this.getNoticesSearchPattern(query, userId);
    const sortPattern = this.getSortingPattern('date');
    const perPage = this.getSkipPattern(query.page, this.limit);

    const data = await this.noticeModel
      .find(queryPattern)
      .skip(perPage)
      .limit(this.limit)
      .sort(sortPattern)
      .exec();

    const total = await this.noticeModel.countDocuments(queryPattern);
    return { data, total };
  }

  async addNotice(userId: string, createNoticeDto: CreateNoticeDto) {
    const { file, ...noticeData } = createNoticeDto;

    const notice: any = { ...noticeData, owner: userId };

    if (file) {
      const res = await this.cloudinaryService.upload(
        file.path,
        this.getCloudinaryConfig(userId),
      );

      notice.imageUrl = res.eager[0].secure_url;
    }
    return this.noticeModel.create(notice);
  }

  async addToFavorite(noticeId: string, userId: string) {
    return this.noticeModel.findByIdAndUpdate(
      noticeId,
      {
        $addToSet: { favorites: userId },
      },
      { new: true },
    );
  }

  async removeFromFavorite(noticeId: string, userId: string) {
    return this.noticeModel.findByIdAndUpdate(
      noticeId,
      {
        $pull: { favorites: userId },
      },
      { new: true },
    );
  }

  async getNotice(id: string) {
    const res = await this.noticeModel.findById(id);
    if (!res) throw new NotFoundException(`Notice with id: ${id} not exists`);
    return res;
  }

  async deleteNotice(id: string) {
    const res: Notice = await this.noticeModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException(`Notice with id: ${id} not exists`);
    this.cloudinaryService.delete(res.imageUrl);
  }
}
