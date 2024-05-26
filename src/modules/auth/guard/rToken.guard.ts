import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { UsersService } from 'src/modules/users/service/users.service';
import { AuthService } from '../service/auth.service';

@Injectable()
export class RTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rToken = this.extractTokenFromCookies(request, 'refresh_token');

    if (!rToken) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(rToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findUserById(payload.sub);

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookies(request: Request, name: string) {
    return request.cookies[name];
  }
}
