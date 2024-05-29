import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserAccount } from '../../entities/user-account.entity';
import { CreateUserAccountDto } from '../../dto/create-user-account.dto';
import { UpdateUserAccountDto } from '../../dto/update-user-account.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from '../../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private jwtService: JwtService
  ) {}

  async signIn(user_email: string, password: string): Promise<any> {
    const user: UserAccount = await this.userAccountRepository.findOne({ where: { user_email: user_email } });

    console.log("user: ",user);

    const error_message: any = {
      result: 'error',
      error_title: 'Invalid credentials!',
      error: 'The user login or password is incorrect. Please try again.',
    };

    if (!user) {
      return error_message;
    }
    bcrypt.hash(password, 10).then(function(res) {
      console.log("db password", user.user_password.toString());
      console.log("hashed qwerty123 password", res);
    })

    const isMatch: boolean = await bcrypt.compare(password, user.user_password.toString());
    console.log("user password compare password",isMatch);

    if (!isMatch) {
      console.log('Password mismatch for user:', user_email);
      return error_message;
    }

    const payload = { sub: user.user_email };
    const accessToken = await this.jwtService.signAsync(payload);
    console.log('Generated access token for user:', accessToken);

    return {
      result: 'success',
      access_token: accessToken,
    };
  }
  async register(registerDto: RegisterDTO): Promise<any> {
    const { userLogin, userEmail, password } = registerDto;

    const existingUser = await this.userAccountRepository.findOne({ where: { user_email: userEmail } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userAccountRepository.create({
      user_login: userLogin,
      user_email: userEmail,
      user_password: hashedPassword,
    });

    return await this.userAccountRepository.save(newUser);
  }

  async create(
    createUserAccountDto: CreateUserAccountDto,
  ): Promise<UserAccount> {
    const hashedPassword = await bcrypt.hash(createUserAccountDto.user_password, 10);
    const newUser = this.userAccountRepository.create({ ...createUserAccountDto, user_password: hashedPassword });
    return this.userAccountRepository.save(newUser);
  }

  async update(
    user_login: string,
    updateUserAccountDto: UpdateUserAccountDto,
  ): Promise<UserAccount> {
    await this.userAccountRepository.update({ user_login }, updateUserAccountDto);
    return this.userAccountRepository.findOne({ where: { user_login } });
  }

  async findAll(): Promise<UserAccount[]> {
    return this.userAccountRepository.find();
  }

  async findOne(user_login: string): Promise<UserAccount> {
    return this.userAccountRepository.findOne({ where: { user_login } });
  }

  async deleteUser(user_login: string): Promise<void> {
    await this.userAccountRepository.delete(user_login);
  }
}
