import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { UserAccount } from '../../entities/user-account.entity';
import { CreateUserAccountDto } from '../../dto/create-user-account.dto';
import { UpdateUserAccountDto } from '../../dto/update-user-account.dto';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('create')
  async create(
    @Body() createUserAccountDto: CreateUserAccountDto,
  ): Promise<UserAccount> {
    return this.userService.create(createUserAccountDto);
  }

  @Put('update/:user_login')
  async update(
    @Param('user_login') user_login: string,
    @Body() updateUserAccountDto: UpdateUserAccountDto,
  ): Promise<UserAccount> {
    return this.userService.update(user_login, updateUserAccountDto);
  }

  @Delete('delete/:user_login')
  async delete(@Param('user_login') user_login: string): Promise<void> {
    return this.userService.deleteUser(user_login);
  }

  @Get()
  async findAll(): Promise<UserAccount[]> {
    return this.userService.findAll();
  }

  @Get(':user_login')
  async findOne(@Param('user_login') user_login: string): Promise<UserAccount> {
    return this.userService.findOne(user_login);
  }
}
