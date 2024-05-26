import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { AppService } from 'src/common';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';
import { UsersService } from 'src/modules/users/service/users.service';

type Payload = { sub: string; tokenId?: string };

@Injectable()
export class AuthService extends AppService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    super();
  }

  async signUp(payload: CreateUserDto) {
    const hashPass = await this.hashPassword(payload.password);
    return await this.usersService.createUser({
      ...payload,
      password: hashPass,
    });
  }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findUser({ email });

    const isValidPass = await this.checkPassword(pass, user?.password || '');

    if (!isValidPass) throw new UnauthorizedException();

    const payload = {
      sub: user.id,
    };
    return { cred: await this.createCred(payload), user };
  }

  async createCred(payload: Payload) {
    const access_token = await this.generateToken(
      payload,
      process.env.JWT_ACCESS_EXPIRES,
    );
    const refresh_token = await this.generateToken(
      {
        ...payload,
        tokenId: randomUUID(),
      },
      process.env.JWT_REFRESH_EXPIRES,
    );

    return {
      access_token,
      refresh_token,
    };
  }

  private async generateToken(payload: Payload, expiresIn: string | number) {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }
}
