import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class UserAuthDto {
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;

  @IsEmail()
  email: string;
}
