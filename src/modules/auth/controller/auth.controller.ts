import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MongooseExceptionFilter, ZodValidationPipe } from 'src/common';
import { IUserId } from 'src/types';
import {
  CreateUserDto,
  createUserSchema,
} from 'src/modules/users/dto/createUser.dto';

import { AuthService } from '../service/auth.service';
import { SignInDto, signInSchema } from '../dto/signIn.dto';
import { RTokenGuard } from '../guard/rToken.guard';

@ApiTags('auth')
@Controller('auth')
@UseFilters(MongooseExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(@Body() signInDto: SignInDto) {
    const { cred, user } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return {
      access_token: cred.access_token,
      refresh_token: cred.refresh_token,
      data: {
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: user.email,
        _id: user._id,
      },
    };
  }

  @UseGuards(RTokenGuard)
  @Post('refresh')
  @HttpCode(200)
  async refreshAToken(@Req() req: IUserId) {
    const cred = await this.authService.createCred({ sub: req.user.id });

    return {
      access_token: cred.access_token,
      refresh_token: cred.refresh_token,
    };
  }
}
