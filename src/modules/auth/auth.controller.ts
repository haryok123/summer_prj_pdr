import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Get,
  Delete,
  Render,
  Req,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserAccount } from '../../entities/user-account.entity';
import { CreateUserAccountDto } from '../../dto/create-user-account.dto';
import { UpdateUserAccountDto } from '../../dto/update-user-account.dto';
import { AuthService } from './auth.service';
import { SignInDTO } from '../../dto/sign-in.dto';
import { CookieOptions, Response } from 'express';
import { RegisterDTO } from '../../dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('login')
  async login() {
    return {
      title: 'Login',
    };
  }

  @Get('registration')
  @Render('registration')
  async registration() {
    return {
      title: 'Register',
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDTO, @Res() res: Response) {
    try {
      const result = await this.authService.register(registerDto);

      if (result.result === 'error') {
        return res.status(HttpStatus.UNAUTHORIZED).json(result);
      }

      return res.redirect('/');
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('signIn')
  async signIn(
    @Body() signInDto: SignInDTO,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.authService.signIn(
      signInDto.userEmail,
      signInDto.password,
    );

    if (result.result === 'error') {
      return res.status(HttpStatus.UNAUTHORIZED).json(result);
    }

    const cookieOptions: CookieOptions = {
      sameSite: 'strict',
      httpOnly: true,
      secure: false,
    };

    res.cookie('access_token', result.access_token, cookieOptions);
    return res.redirect('/');
  }

  @Post('logout')
  async signOut(@Res() res) {
    const cookieOptions: CookieOptions = {
      sameSite: 'strict',
      httpOnly: true,
    };

    res.clearCookie('access_token', cookieOptions);
    return res.redirect('/');
  }

  @Post('create')
  async create(
    @Body() createUserAccountDto: CreateUserAccountDto,
  ): Promise<UserAccount> {
    return this.authService.create(createUserAccountDto);
  }

  @Put('update/:user_login')
  async update(
    @Param('user_login') user_login: string,
    @Body() updateUserAccountDto: UpdateUserAccountDto,
  ): Promise<UserAccount> {
    return this.authService.update(user_login, updateUserAccountDto);
  }

  @Delete('delete/:user_login')
  async delete(@Param('user_login') user_login: string): Promise<void> {
    return this.authService.deleteUser(user_login);
  }

  @Get()
  async findAll(): Promise<UserAccount[]> {
    return this.authService.findAll();
  }

  @Get(':user_login')
  async findOne(@Param('user_login') user_login: string): Promise<UserAccount> {
    return this.authService.findOne(user_login);
  }
}
