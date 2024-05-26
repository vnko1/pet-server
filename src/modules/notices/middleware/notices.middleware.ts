import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AppService } from 'src/common';
import { UsersService } from 'src/modules/users/service/users.service';

@Injectable()
export class NoticesMiddleware extends AppService implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    super();
  }
  async use(req: Request, _: Response, next: NextFunction) {
    try {
      const token = this.extractTokenFromHeader(req);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findUserById(payload.sub);

      req['user'] = user;
      next();
    } catch (e) {
      next();
    }
  }
}
