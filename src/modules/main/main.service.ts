import { Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../auth/constants';
import { UserAccount } from '../../entities/user-account.entity';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async renderHome(@Req() req: Request) {
    const token = req.headers.cookie ? req.headers.cookie.split('=')[1] : null;

    let user_email: string | null = null;
    let user: any = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, jwtConstants.secret);
        //console.log('Decoded Token:', decoded);

        user_email = decoded.sub.toString();
        user = await this.userAccountRepository.findOne({
          where: { user_email },
        });
      } catch (error) {
        //console.error('JWT Verification Error:', error.message);
      }
    }

    return {
      style: 'home',
      script: 'home',
      title: 'Головна сторінка',
      currentUser: user,
    };
  }
}
