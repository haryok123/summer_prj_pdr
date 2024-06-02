import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAccountDto } from './create-user-account.dto';
import { IsOptional, Length, Matches, IsEmail } from 'class-validator';

export class UpdateUserAccountDto extends PartialType(CreateUserAccountDto) {
  @IsOptional()
  @Length(5, 50, { message: 'Incorrect login length.' })
  user_login?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format.' })
  @Length(5, 50, { message: 'Email must be between 5 and 50 characters.' })
  user_email?: string;

  @IsOptional()
  @Length(5, 50, { message: 'Incorrect password length.' })
  user_password?: string;

  @IsOptional()
  user_photo?: number;
}
