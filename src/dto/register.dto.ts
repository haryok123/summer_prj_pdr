import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty()
  userLogin: string;

  @IsEmail()
  userEmail: string;

  @MinLength(6)
  password: string;

}
