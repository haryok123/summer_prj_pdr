import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.headers.cookie) {
      throw new UnauthorizedException();
    }
    const token = request.headers.cookie.split('=')[1];
    let user;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        // secret: jwtConstants.secret,
        secret: "qwerty123123"
      });
      //console.log(payload.userLogin);
      user = await this.userAccountRepository.findOne({
        where: { user_login: payload.userLogin },
      });
      //console.log(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
    request['user'] = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
