import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { CreateUserAccountDto } from '../../dto/create-user-account.dto';
import { UpdateUserAccountDto } from '../../dto/update-user-account.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly repository: Repository<UserAccount>,
  ) {}

  async create(
    createUserAccountDto: CreateUserAccountDto,
  ): Promise<UserAccount> {
    const newUser = this.repository.create(createUserAccountDto);
    return this.repository.save(newUser);
  }

  async update(
    user_login: string,
    updateUserAccountDto: UpdateUserAccountDto,
  ): Promise<UserAccount> {
    await this.repository.update({ user_login }, updateUserAccountDto);
    return this.repository.findOne({ where: { user_login } });
  }

  async findAll(): Promise<UserAccount[]> {
    return this.repository.find();
  }

  async findOne(user_login: string): Promise<UserAccount> {
    return this.repository.findOne({ where: { user_login } });
  }

  async deleteUser(user_login: string): Promise<void> {
    await this.repository.delete(user_login);
  }
}
