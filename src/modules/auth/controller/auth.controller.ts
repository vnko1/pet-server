import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

import {
  AuthGuard,
  MongooseExceptionFilter,
  ZodValidationPipe,
} from 'src/common';
import { IUserId } from 'src/types';
import {
  CreateUserDto,
  createUserSchema,
} from 'src/modules/users/dto/createUser.dto';

import { AuthService } from '../service/auth.service';
import { SignInDto, signInSchema } from '../dto/signIn.dto';
import { RTokenGuard } from '../guard/rToken.guard';

type Cred = { access_token: string; refresh_token: string };

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
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { cred, user } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return this.genCookieResponse(
      res,
      cred,
      +process.env.REFRESH_TOKEN_AGE,
    ).send({
      access_token: cred.access_token,
      data: {
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: user.email,
        _id: user._id,
      },
    });
  }

  @UseGuards(RTokenGuard)
  @Post('refresh')
  @HttpCode(200)
  async refreshAToken(@Req() req: IUserId, @Res() res: Response) {
    const cred = await this.authService.createCred({ sub: req.user.id });

    return this.genCookieResponse(
      res,
      cred,
      +process.env.REFRESH_TOKEN_AGE,
    ).send({ access_token: cred.access_token });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Res() res: Response) {
    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: true,
      maxAge: -1,
      sameSite: 'none',
    });
    return res.send();
  }

  private genCookieResponse(res: Response, cred: Cred, maxAge: number) {
    res.cookie('refresh_token', cred.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge,
    });
    return res;
  }
}
