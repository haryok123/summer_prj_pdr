import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  userEmail: string;
  @IsNotEmpty()
  password: string;

  remember_me: boolean;
}
