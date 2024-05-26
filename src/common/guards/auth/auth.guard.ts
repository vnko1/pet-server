import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppService } from 'src/common';
import { UsersService } from 'src/modules/users/service/users.service';

@Injectable()
export class AuthGuard extends AppService implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findUserById(payload.sub);

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
