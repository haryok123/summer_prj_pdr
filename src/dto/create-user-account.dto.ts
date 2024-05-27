import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserAccountDto {
  @Length(5, 50, { message: 'Incorrect login length.' })
  user_login: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  @Length(5, 50, { message: 'Incorrect email length.' })
  user_email: string;

  @Length(5, 50, { message: 'Incorrect password length.' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'Password must contain at least one number.',
  })
  @Matches(/(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-])/, {
    message: 'Password must contain at least one special character.',
  })
  user_password: string;
}
