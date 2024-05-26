import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SponsorsService } from '../service/sponsors.service';

@ApiTags('sponsors')
@Controller('sponsors')
export class SponsorsController {
  constructor(private friendService: SponsorsService) {}

  @Get()
  getSponsors() {
    return this.friendService.getAll();
  }
}
